import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  imports: [HeaderComponent]
})
export class HeroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
