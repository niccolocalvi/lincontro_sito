import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}
