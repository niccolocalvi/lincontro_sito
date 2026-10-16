import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 1. Importa CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // <-- 2. Aggiungilo agli imports del componente
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}