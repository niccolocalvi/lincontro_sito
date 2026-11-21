import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: "L'Incontro" },
  {
    path: 'note-legali',
    loadComponent: () => import('./pages/note-legali/note-legali').then((m) => m.NoteLegali),
    title: "Note legali · L'Incontro",
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
    title: "Privacy e cookie · L'Incontro",
  },
  { path: '**', redirectTo: '' },
];
