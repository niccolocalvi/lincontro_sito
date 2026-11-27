import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrubWords } from '../../directives/scrub-words';

@Component({
  selector: 'app-about',
  imports: [ScrubWords],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
