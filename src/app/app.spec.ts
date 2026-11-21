import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { attendiCaricamento, providePocketbaseMock } from './testing/pocketbase.mock';

describe('App', () => {
  it('mostra tutte le sezioni della pagina', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), providePocketbaseMock()] });
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await attendiCaricamento(fixture);

    const el = fixture.nativeElement as HTMLElement;
    for (const id of ['home', 'chi-siamo', 'menu', 'eventi', 'dove-trovarci', 'info-e-contatti']) {
      expect(el.querySelector(`#${id}`), id).toBeTruthy();
    }
  });
});
