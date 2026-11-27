import { AfterViewInit, Directive, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Divide il testo dell'elemento in parole (<span class="sd-word">) così che si
 * "accendano" una riga alla volta durante lo scroll (stile Apple).
 * L'effetto vero è in styles.css (.sd-word): senza supporto CSS il testo resta normale.
 * Usarla solo su testo statico, senza binding all'interno.
 */
@Directive({ selector: '[appScrubWords]' })
export class ScrubWords implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.el.nativeElement;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodi: Text[] = [];
    while (walker.nextNode()) nodi.push(walker.currentNode as Text);

    for (const nodo of nodi) {
      const testo = nodo.textContent ?? '';
      if (!testo.trim()) continue;

      const frammento = document.createDocumentFragment();
      for (const pezzo of testo.split(/(\s+)/)) {
        if (!pezzo) continue;
        if (/^\s+$/.test(pezzo)) {
          frammento.append(pezzo);
        } else {
          const span = document.createElement('span');
          span.className = 'sd-word';
          span.textContent = pezzo;
          frammento.append(span);
        }
      }
      nodo.replaceWith(frammento);
    }
  }
}
