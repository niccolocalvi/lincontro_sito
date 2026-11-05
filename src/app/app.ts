import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { About } from './components/about/about';
import { Contatti } from './components/contatti/contatti';
import { Eventi } from './components/eventi/eventi';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Menu } from './components/menu/menu';
import { Posizione } from './components/posizione/posizione';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, About, Menu, Eventi, Posizione, Contatti, Footer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
