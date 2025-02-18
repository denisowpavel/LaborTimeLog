import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayProgressComponent } from './day-progress.component';

describe('DayProgressComponent', () => {
  let component: DayProgressComponent;
  let fixture: ComponentFixture<DayProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
