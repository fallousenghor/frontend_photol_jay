import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cfa',
  standalone: true
})
export class CfaPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null || isNaN(value)) {
      return '0 FCFA';
    }
    return `${value.toLocaleString('fr-FR')} FCFA`;
  }
}
