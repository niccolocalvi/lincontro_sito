import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDrinkComponent } from '../modal-drink/modal-drink.component';
import { ModalCaffetteriaComponent } from '../modal-caffetteria/modal-caffetteria.component';
import { ModalColazione } from '../../modal-colazione/modal-colazione';
import { ModalPranzo } from '../../modal-pranzo/modal-pranzo';
import { ModalTaglieri } from '../../modal-taglieri/modal-taglieri'; // Modifica il percorso se la cartella si trova altrove

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [
    CommonModule, 
    ModalDrinkComponent, 
    ModalCaffetteriaComponent, 
    ModalColazione,
    ModalPranzo,
    ModalTaglieri
  ]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}