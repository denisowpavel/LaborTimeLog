import {Component, effect, Injector, input, InputSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-day-progress',
  imports: [CommonModule],
  templateUrl: './day-progress.component.html',
  standalone: true,
  styleUrl: './day-progress.component.scss',
})
export class DayProgressComponent {
  constructor(public utilityService: UtilityService) {
  }
}
