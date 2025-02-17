import { Pipe, PipeTransform } from '@angular/core';
import { ILog } from '../types/log';

@Pipe({
  name: 'entryDuration',
  standalone: true,
})
export class EntryDurationPipe implements PipeTransform {
  transform(entry: ILog, ...args: unknown[]): number {
    return Math.abs(entry.from.getTime() - entry.to.getTime()) / 1000;
  }
}
