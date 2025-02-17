import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'secToStr',
})
export class SecToStrPipe implements PipeTransform {
  transform(seconds: number, ...args: unknown[]): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let result: string[] = [];
    if (hours > 0) result.push(`${hours} ч`);
    if (minutes > 0) result.push(`${minutes} мин`);
    if (remainingSeconds > 0 || result.length === 0)
      result.push(`${remainingSeconds} сек`);

    return result.join(' ');
  }
}
