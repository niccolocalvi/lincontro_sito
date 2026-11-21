import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { registerLocaleData, ViewportScroller } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

// Date degli eventi in italiano (es. "sabato 30 maggio")
registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Link tipo "/#menu" dalle altre pagine: scorre alla sezione dopo il caricamento
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Stesso spazio di `scroll-padding-top: 5rem` (styles.css): l'header sticky non copre la sezione
    provideAppInitializer(() => inject(ViewportScroller).setOffset([0, 80])),
    { provide: LOCALE_ID, useValue: 'it' },
  ],
};
