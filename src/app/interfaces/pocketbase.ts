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

/** Collezione `site_menus`: un menu del sito (card + modale). */
export interface MenuSito extends RecordModel {
  slug: string;
  /** Può contenere "\n" per andare a capo nella card */
  card_title: string;
  card_badge: string;
  card_description: string;
  /** Nome del file immagine (campo file PocketBase) */
  card_image: string;
  card_image_alt: string;
  title: string;
  subtitle: string;
  banner_label: string;
  banner_text: string;
  banner_price: number;
  footnote: string;
  sort_order: number;
  active: boolean;
}

/** Collezione `site_menu_sections` */
export interface SezioneMenu extends RecordModel {
  /** id della relazione verso `site_menus` */
  menu: string;
  name: string;
  sort_order: number;
  active: boolean;
}

/** Collezione `site_menu_items` */
export interface VoceMenu extends RecordModel {
  /** id della relazione verso `site_menu_sections` */
  section: string;
  name: string;
  note: string;
  price: number;
  /** Se valorizzato sostituisce il prezzo, es. "4,00 / 6,00 €" */
  price_label: string;
  starting_from: boolean;
  sort_order: number;
  active: boolean;
}

/** Collezione `site_combos` */
export interface Combo extends RecordModel {
  name: string;
  label: string;
  items: string[];
  price: number;
  /** Card scura a contrasto */
  highlight: boolean;
  sort_order: number;
  active: boolean;
}

/** Sezione con le relative voci già raggruppate */
export interface SezioneConVoci {
  sezione: SezioneMenu;
  voci: VoceMenu[];
}

/** Menu del sito completo di sezioni e voci, con l'URL dell'immagine già risolto */
export interface MenuSitoCompleto {
  menu: MenuSito;
  immagine: string;
  sezioni: SezioneConVoci[];
}
