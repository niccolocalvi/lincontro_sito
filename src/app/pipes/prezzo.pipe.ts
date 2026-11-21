import { Pipe, PipeTransform } from '@angular/core';

const formato = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

/** Formatta un prezzo in euro: 1.2 -> "1,20 €". */
@Pipe({ name: 'prezzo' })
export class PrezzoPipe implements PipeTransform {
  transform(prezzo: number | null | undefined): string {
    return formato.format(prezzo ?? 0);
  }
}
