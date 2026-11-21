import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MenuSitoCompleto } from '../../interfaces/pocketbase';
import { PrezzoPipe } from '../../pipes/prezzo.pipe';
import { MenuSezioni } from '../menu-sezioni/menu-sezioni';

/** Card di un menu del sito con il relativo modale, dati da PocketBase (site_menus). */
@Component({
  selector: 'app-menu-card',
  imports: [MenuSezioni, PrezzoPipe],
  templateUrl: './menu-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuCard {
  readonly dati = input.required<MenuSitoCompleto>();
}
