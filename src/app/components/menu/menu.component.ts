import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDrinkComponent } from '../modal-drink/modal-drink.component';
import { ModalCaffetteriaComponent } from '../modal-caffetteria/modal-caffetteria.component';
 // Modifica il percorso se la cartella si trova altrove

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [
    CommonModule,
    ModalDrinkComponent,
    ModalCaffetteriaComponent,
  ]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
