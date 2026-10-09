import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        {
          provide: EventsService,
          useValue: {
            getSummary: () =>
              of({
                total: 0,
                last24h: 0,
                severity: [],
                eventType: [],
                environment: [],
              }),
            getEvents: () => of([]),
            deleteEvent: () => of(undefined),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the summary and event table', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-summary-cards')).toBeTruthy();
    expect(element.querySelector('app-event-table')).toBeTruthy();
  });
});
