import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'Prix sur demande';
    }

    // Format the number with spaces as thousand separators
    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return `${formattedValue} CFA`;
  }

}
