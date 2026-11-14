import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly text = input('Clicca qui');
  readonly href = input('#');
  /** Classi aggiuntive; il default è pensato per la hero. */
  readonly customClass = input('text-2xl px-6 py-3');
}
