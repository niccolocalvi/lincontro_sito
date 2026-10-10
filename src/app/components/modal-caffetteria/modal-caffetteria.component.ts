import { Component, OnInit } from '@angular/core';
import { PriceTableComponent } from '../price-table/price-table.component';
import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'app-modal-caffetteria',
  templateUrl: './modal-caffetteria.component.html',
  styleUrls: ['./modal-caffetteria.component.css'],
  imports: [PriceTableComponent]
})
export class ModalCaffetteriaComponent implements OnInit {

  constructor() { }

  caffetteriaMenu: Menu[] = [
    { prodotto: 'Caffè', prezzo: 2.5 },
    { prodotto: 'Cappuccino', prezzo: 3.0 },
    { prodotto: 'Latte', prezzo: 3.5 },
    { prodotto: 'Mocha', prezzo: 4.0 },
    { prodotto: 'Te', prezzo: 2.0 }
  ];

  ngOnInit() {
  }

}
