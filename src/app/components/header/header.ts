import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((aperto) => !aperto);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
