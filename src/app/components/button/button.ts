import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly text = input('Clicca qui');
  readonly href = input('#');
  /** Classi aggiuntive rispetto allo stile base .btn-primary. */
  readonly customClass = input('');
}
