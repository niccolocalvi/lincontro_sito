import { Pipe, PipeTransform } from '@angular/core';
import { formattaOra } from '../utils/orari';

/** Formatta un orario PocketBase: "05:30:00+02" -> "05:30". */
@Pipe({ name: 'ora' })
export class OraPipe implements PipeTransform {
  transform(ora: string | null | undefined): string {
    return formattaOra(ora ?? '');
  }
}
