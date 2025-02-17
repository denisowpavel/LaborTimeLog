import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'secToTime',
})
export class SecToTimePipe implements PipeTransform {
  transform(seconds: number, ...args: unknown[]): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let result: string[] = [];
    result.push(`${hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`);
    result.push(`${minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`);
    result.push(`${remainingSeconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`);

    return result.join(':');
  }
}
