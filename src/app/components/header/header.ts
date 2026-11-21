import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly isMenuOpen = signal(false);

  /** Voci di navigazione condivise tra menu desktop e mobile: ancore della home, raggiungibili da ogni pagina. */
  protected readonly vociMenu = [
    { label: 'Chi siamo', fragment: 'chi-siamo' },
    { label: 'Menu', fragment: 'menu' },
    { label: 'Eventi', fragment: 'eventi' },
    { label: 'Dove trovarci', fragment: 'dove-trovarci' },
    { label: 'Info e contatti', fragment: 'info-e-contatti' },
  ] as const;

  /** Link WhatsApp con messaggio precompilato per prenotare un tavolo. */
  protected readonly linkPrenota =
    'https://wa.me/393343874529?text=Ciao!%20Vorrei%20prenotare%20un%20tavolo.%0A%0A%2ANome%2A:%20%0A%2AData%2A:%20%0A%2AOra%2A:%20%0A%2ANumero%20persone%2A:%20';

  protected toggleMenu(): void {
    this.isMenuOpen.update((aperto) => !aperto);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
