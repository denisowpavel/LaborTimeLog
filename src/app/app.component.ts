import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {CommonModule, DatePipe} from '@angular/common';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ListboxDoubleClickEvent, ListboxModule } from 'primeng/listbox';
import { FieldsetModule } from 'primeng/fieldset';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { interval, Observable, Observer, Subject, Subscription } from 'rxjs';
import { ILog } from './types/log';
import { SecToStrPipe } from './pipes/sec-to-str.pipe';
import { SecToTimePipe } from './pipes/sec-to-time.pipe';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { EntryDurationPipe } from './pipes/entry-duration.pipe';
import { DayProgressComponent } from './components/day-progress/day-progress.component';
import { UtilityService } from './services/utility.service';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    AutoComplete,
    FieldsetModule,
    CardModule,
    FluidModule,
    TableModule,
    ButtonModule,
    ContextMenuModule,
    ListboxModule,
    DatePickerModule,
    DatePipe,
    SecToTimePipe,
    EntryDurationPipe,
    DayProgressComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    public utilityService: UtilityService,
  ) {}
  @ViewChild('activityCm') activityCm: ContextMenu;
  @ViewChild('logCm') logCm: ContextMenu;
  autocompleteItems: string[] = [];
  activity: string = '';
  from: Date = new Date();
  to: Date = new Date();
  log: ILog[] = [];
  selectedActivity = '';
  selectedEntry: ILog;
  activityOptions = [
    '[ПЗ] Подготовительно заключительное',
    '[Оп] Оперативное',
    '[О] Основное',
    '[В] Вспомогательное',
    '[ОБС] Время на обслуживание рабочего места',
    '[ОТД] Перерывы на отдых',
    '[Л.Н] Перерывы на личные надобности',
    '[ОТЛ] Перерывы на отдых и личные надобности',
    '[ПН] Перерывы из-за нарушений трудовой деятельности',
    '[ПО] Перерывы по организационно- техническим причинам',
    '[Пон] В т.ч. из за организационных неполадок',
    '[Поо] Обусловленные особенностями технологии и организации производства',
  ];
  activityCmItems = [
    {
      label: 'Добавить с текущим временем',
      icon: 'pi pi-user-plus',
      command: this.add.bind(this),
    },
    {
      label: 'Удалить из этого списка',
      icon: 'pi pi-user-plus',
      command: this.cleanActivityOptions.bind(this),
    },
  ];
  logCmItems = [
    {
      label: 'Удалить из этого списка',
      icon: 'pi pi-user-plus',
      command: this.cleanLogEntry.bind(this),
    },
  ];
  $currentTimeUpdateTick: Subscription;
  passedTimeSec = 0;
  ngOnInit() {
    const morning = this.utilityService.morning
    this.log = [
      {
        date: new Date(),
        activity: '[ОБС] Время на обслуживание рабочего места',
        from: new Date(morning),
        to: new Date(new Date().getTime() - 20 * 60000),
      },
    ];
    this.updateTimeValue();
    this.timeUpdateTick();
    this.updateSlotsMaps();
    this.$currentTimeUpdateTick = interval(1000).subscribe(
      this.timeUpdateTick.bind(this),
    );
  }
  ngOnDestroy() {
    this.$currentTimeUpdateTick.unsubscribe();
  }

  search(event: AutoCompleteCompleteEvent) {
    this.autocompleteItems = [
      ...this.activityOptions.filter((a) => a.includes(event.query)),
    ];
  }
  activityListDblClick(e?: ListboxDoubleClickEvent) {
    if (!e?.option) {
      return;
    }
    this.activity = e.option;
    this.add();
  }
  add() {
    const activity = this.activity || this.selectedActivity;
    this.activity = '';
    this.log.push({
      date: new Date(),
      activity: activity,
      from: this.from,
      to: this.to,
    } as ILog);
    this.updateActivityOptions(activity);
    this.updateTimeValue();
    this.timeUpdateTick();
    this.updateSlotsMaps();
    this.cdr.detectChanges();
  }
  timeUpdateTick() {
    this.to = new Date();
    this.passedTimeSec =
      Math.abs(this.from.getTime() - this.to.getTime()) / 1000;
    this.cdr.detectChanges();
  }
  updateTimeValue() {
    if (!this.autocompleteItems) {
      this.from = new Date();
      return;
    }
    this.from = new Date(this.log[this.log.length - 1]?.to);
    this.cdr.detectChanges();
  }
  updateSlotsMaps() {
    this.utilityService.setSlotsMap(this.log)
  }
  updateActivityOptions(activity: string) {
    if (!this.activityOptions.includes(activity)) {
      this.activityOptions = [...this.activityOptions, activity];
    }
    this.cdr.detectChanges();
  }
  cleanActivityOptions() {
    this.activityOptions = this.activityOptions.filter(
      (a) => a !== this.selectedActivity,
    );
    this.cdr.detectChanges();
  }

  cleanLogEntry() {
    this.log = this.log.filter((a) => a !== this.selectedEntry);
    this.updateTimeValue();
    this.updateSlotsMaps();
    this.cdr.detectChanges();
  }

  onActivityContextMenu(event: any, activity: string) {
    this.selectedActivity = activity;
    this.activityCm.show(event);
  }

  onLogContextMenu(event: any, entry: ILog) {
    this.selectedEntry = entry;
    this.logCm.show(event);
  }
}
