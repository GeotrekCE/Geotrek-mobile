import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lowerRound' })
export class LowerRoundPipe implements PipeTransform {
  transform(value: number): number {
    return Math.floor(value);
  }
}
