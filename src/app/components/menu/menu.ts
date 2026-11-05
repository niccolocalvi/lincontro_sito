import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalCaffetteria } from '../modal-caffetteria/modal-caffetteria';
import { ModalDrink } from '../modal-drink/modal-drink';

@Component({
  selector: 'app-menu',
  imports: [ModalCaffetteria, ModalDrink],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {}
