import { Component, Input, OnInit } from '@angular/core';
import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.css']
})
export class PriceTableComponent implements OnInit {

  // menu: Menu[] = ;

  @Input() menu: Menu[] = [];

  constructor() { }

  ngOnInit() {

    console.log('PriceTableComponent initialized with menu:', this.menu);

  }

}
