import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ButtonComponent } from '../button/button.component'; // Verifica che il percorso della cartella sia corretto

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  imports: [HeaderComponent, ButtonComponent]
})
export class HeroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}