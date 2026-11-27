import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PilaScroll } from '../../directives/pila-scroll';
import { Combo, MenuSitoCompleto } from '../../interfaces/pocketbase';
import { PrezzoPipe } from '../../pipes/prezzo.pipe';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { MenuCard } from '../menu-card/menu-card';

@Component({
  selector: 'app-menu',
  imports: [MenuCard, PrezzoPipe, PilaScroll],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);

  protected readonly menu = signal<MenuSitoCompleto[]>([]);
  protected readonly combo = signal<Combo[]>([]);
  protected readonly caricamento = signal(true);
  protected readonly errore = signal(false);

  protected readonly passCombo = computed(() => this.combo().map((combo) => ({ combo })));

  async ngOnInit(): Promise<void> {
    try {
      const [menu, combo] = await Promise.all([
        this.pocketbase.getMenuSito(),
        this.pocketbase.getCombo(),
      ]);
      this.menu.set(menu);
      this.combo.set(combo);
    } catch (error) {
      console.error('Errore nel caricamento del menu da PocketBase:', error);
      this.errore.set(true);
    } finally {
      this.caricamento.set(false);
    }
  }
}
