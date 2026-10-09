import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { SummaryCards } from './summary-cards';

describe('SummaryCards', () => {
  let component: SummaryCards;
  let fixture: ComponentFixture<SummaryCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCards],
      providers: [
        {
          provide: EventsService,
          useValue: {
            getSummary: () =>
              of({
                total: 12,
                last24h: 3,
                severity: [{ severity: 'high', count: 2 }],
                eventType: [],
                environment: [],
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display summary data', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(component.loading).toBe(false);
    expect(component.summary.total).toBe(12);
    expect(element.textContent).toContain('12');
    expect(element.textContent).toContain('3');
    expect(element.textContent).toContain('high');
  });
});
