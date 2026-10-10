import { Component, OnInit } from '@angular/core';
import { PriceTableComponent } from '../price-table/price-table.component';
import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'app-modal-drink',
  templateUrl: './modal-drink.component.html',
  styleUrls: ['./modal-drink.component.css'],
  imports: [PriceTableComponent]
})
export class ModalDrinkComponent implements OnInit {

  drinksMenu: Menu[] = [
    { prodotto: 'Spritz', prezzo: 2.5 },
    { prodotto: 'Vodka lemon', prezzo: 3.0 },
    { prodotto: 'Mojito', prezzo: 3.5 },
    { prodotto: 'Birra', prezzo: 4.0 },
    { prodotto: 'Tropical sunset', prezzo: 2.0 }
  ];


  constructor() { }

  ngOnInit() {
  }

}
