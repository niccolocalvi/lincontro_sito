import { ChangeDetectionStrategy, Component } from '@angular/core';
import { About } from '../../components/about/about';
import { Contatti } from '../../components/contatti/contatti';
import { Eventi } from '../../components/eventi/eventi';
import { Hero } from '../../components/hero/hero';
import { Menu } from '../../components/menu/menu';
import { Posizione } from '../../components/posizione/posizione';

/** Pagina principale: tutte le sezioni del sito una sotto l'altra. */
@Component({
  selector: 'app-home',
  imports: [Hero, About, Menu, Eventi, Posizione, Contatti],
  template: `
    <app-hero />
    <app-about />
    <app-menu />
    <app-eventi />
    <app-posizione />
    <app-contatti />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
