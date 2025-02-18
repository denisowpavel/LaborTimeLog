import { Injectable } from '@angular/core';
import { ILog } from '../types/log';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  morning = new Date();
  clockOut = new Date();
  daySlots = Array.from(Array(90), (_, i) => i + 1);
  daySlotsTimeMap: Map<number, number> = new Map();
  daySlotsLogMap: Map<number, ILog | null> = new Map();
  constructor() {
    this.morning.setHours(8, 0, 0, 0);
    this.clockOut.setHours(18, 0, 0, 0);
    const mSecInSlot =
      (this.clockOut.getTime() - this.morning.getTime()) / this.daySlots.length;
    this.daySlots.forEach((s) => {
      const time = this.morning.getTime() + s * mSecInSlot;
      this.daySlotsTimeMap.set(s, time);
      this.daySlotsLogMap.set(time, null);
    });
  }

  setSlotsMap(log: ILog[]) {
    log.forEach((e) => {
      [...this.daySlotsLogMap.keys()].forEach((slot) => {
        if (slot > e.from.getTime() && slot <= e.to.getTime()) {
          this.daySlotsLogMap.set(slot, e);
        }
      });
    });
  }
  getColor(
    event: ILog | null | undefined,
  ): 'gray' | 'green' | 'yellow' | 'red' {
    if (!event) {
      return 'gray';
    }
    if (
      event.activity.includes('[В] ') ||
      event.activity.includes('[О] ') ||
      event.activity.includes('[Оп] ') ||
      event.activity.includes('[ОБС] ')
    ) {
      return 'green';
    }
    if (
      event.activity.includes('[ПО] ') ||
      event.activity.includes('[Поо] ') ||
      event.activity.includes('[ПЗ] ')
    ) {
      return 'yellow';
    }
    if (
      event.activity.includes('[Л.Н]') ||
      event.activity.includes('[ОТЛ]') ||
      event.activity.includes('[ПН]') ||
      event.activity.includes('[Пон]')
    ) {
      return 'red';
    }
    return 'gray';
  }

  slotColor(slot: number): 'gray' | 'green' | 'yellow' | 'red' {
    return this.getColor(
      this.daySlotsLogMap.get(this.daySlotsTimeMap.get(slot) as number),
    );
  }
}
