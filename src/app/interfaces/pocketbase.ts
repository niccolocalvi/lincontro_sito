import { RecordModel } from 'pocketbase';

/** Collezione `opening_hours` */
export interface OrarioApertura extends RecordModel {
  legacy_id: number;
  day: string;
  /** Formato "HH:MM:SS+TZ", es. "05:30:00+02" */
  from: string;
  /** Formato "HH:MM:SS+TZ", es. "20:00:00+02" */
  to: string;
}

/** Collezione `categories` */
export interface Categoria extends RecordModel {
  legacy_id: number;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  active: boolean;
  time_slot_weight: Record<string, number>;
}

/** Collezione `products` */
export interface Prodotto extends RecordModel {
  legacy_id: number;
  name: string;
  description: string;
  secondary_note: string;
  base_price: number;
  starting_from: boolean;
  /** id della relazione verso `categories` */
  category: string;
  category_id: number;
  sort_order: number;
  active: boolean;
  is_hero: boolean;
  frozen: boolean;
  home_made: boolean;
}

/** Collezione `events` */
export interface Evento extends RecordModel {
  legacy_id: number;
  title: string;
  /** Può contenere HTML semplice (<b>, <i>) */
  body: string;
  start_at: string;
  end_at: string;
  sort_order: number;
  active: boolean;
}

/** Categoria con i relativi prodotti già raggruppati */
export interface CategoriaConProdotti {
  categoria: Categoria;
  prodotti: Prodotto[];
}
