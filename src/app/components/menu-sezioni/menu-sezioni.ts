import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SezioneConVoci } from '../../interfaces/pocketbase';
import { PrezzoPipe } from '../../pipes/prezzo.pipe';

/** Griglia delle sezioni di un menu con le relative voci, usata dentro i modali. */
@Component({
  selector: 'app-menu-sezioni',
  imports: [PrezzoPipe],
  templateUrl: './menu-sezioni.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSezioni {
  readonly sezioni = input.required<SezioneConVoci[]>();
}
