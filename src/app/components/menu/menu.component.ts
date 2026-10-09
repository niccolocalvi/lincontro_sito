import { Component, OnInit } from '@angular/core';
import { ModalDrinkComponent } from '../modal-drink/modal-drink.component';
import { ModalCaffetteriaComponent } from '../modal-caffetteria/modal-caffetteria.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [ModalDrinkComponent, ModalCaffetteriaComponent]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
