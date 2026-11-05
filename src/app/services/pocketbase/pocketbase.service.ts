import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import {
  Categoria,
  CategoriaConProdotti,
  Evento,
  OrarioApertura,
  Prodotto,
} from '../../interfaces/pocketbase';

export const POCKETBASE_URL = 'https://api.lincontrobar.it';

/**
 * Unico punto di accesso al database PocketBase.
 * I componenti non devono creare istanze proprie di PocketBase.
 */
@Injectable({
  providedIn: 'root',
})
export class PocketbaseService {
  readonly pb = new PocketBase(POCKETBASE_URL);

  constructor() {
    // Più componenti possono interrogare la stessa collezione in parallelo:
    // senza questo l'SDK annullerebbe le richieste duplicate.
    this.pb.autoCancellation(false);
  }

  /** Orari di apertura, dal lunedì alla domenica. */
  getOrari(): Promise<OrarioApertura[]> {
    return this.pb.collection('opening_hours').getFullList<OrarioApertura>({
      sort: 'legacy_id',
    });
  }

  /** Categorie attive del menu, in ordine di visualizzazione. */
  getCategorie(): Promise<Categoria[]> {
    return this.pb.collection('categories').getFullList<Categoria>({
      filter: 'active = true',
      sort: 'sort_order',
    });
  }

  /** Prodotti attivi; se `slugCategoria` è indicato filtra per quella categoria. */
  getProdotti(slugCategoria?: string): Promise<Prodotto[]> {
    const filtri = ['active = true'];
    if (slugCategoria) {
      filtri.push(this.pb.filter('category.slug = {:slug}', { slug: slugCategoria }));
    }
    return this.pb.collection('products').getFullList<Prodotto>({
      filter: filtri.join(' && '),
      sort: 'sort_order,name',
    });
  }

  /** Menu completo: categorie attive con i rispettivi prodotti attivi. */
  async getMenu(): Promise<CategoriaConProdotti[]> {
    const [categorie, prodotti] = await Promise.all([this.getCategorie(), this.getProdotti()]);
    return categorie.map((categoria) => ({
      categoria,
      prodotti: prodotti.filter((p) => p.category === categoria.id),
    }));
  }

  /** Eventi attivi non ancora terminati, dal più vicino. */
  getEventiInProgramma(): Promise<Evento[]> {
    return this.pb.collection('events').getFullList<Evento>({
      filter: 'active = true && end_at >= @now',
      sort: 'start_at,sort_order',
    });
  }
}
