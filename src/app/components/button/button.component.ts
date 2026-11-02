import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() text: string = 'Clicca qui';
  @Input() href: string = '#';
  // Classi di default (perfette per la Hero section)
  @Input() customClass: string = 'text-2xl px-6 py-3';
}