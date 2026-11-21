import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalCaffetteria } from '../modal-caffetteria/modal-caffetteria';
import { ModalDrink } from '../modal-drink/modal-drink';

interface Combo {
  momento: string;
  titolo: string;
  voci: string[];
  prezzo: string;
  /** Card scura messa in evidenza al centro. */
  inEvidenza?: boolean;
}

@Component({
  selector: 'app-menu',
  imports: [ModalCaffetteria, ModalDrink],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  protected readonly combo: Combo[] = [
    {
      momento: 'Mattina',
      titolo: 'Colazione',
      voci: ['Caffè o Cappuccino', 'Cornetto', 'Succo o Spremuta'],
      prezzo: '4,00 €',
    },
    {
      momento: 'Mezzogiorno',
      titolo: 'Pranzo',
      voci: ['Primo o Secondo', 'Bibita', 'Caffè'],
      prezzo: '9,00 €',
      inEvidenza: true,
    },
    {
      momento: 'Sera',
      titolo: 'Aperitivo',
      voci: ['Tagliere per 2 persone', '2 Spritz'],
      prezzo: '22,00 €',
    },
  ];
}
