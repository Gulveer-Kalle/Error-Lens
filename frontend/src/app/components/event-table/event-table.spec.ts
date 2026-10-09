import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { EventTable } from './event-table';

describe('EventTable', () => {
  let component: EventTable;
  let fixture: ComponentFixture<EventTable>;
  let requestedFilters: Array<[string | undefined, string | undefined]>;

  beforeEach(async () => {
    requestedFilters = [];
    await TestBed.configureTestingModule({
      imports: [EventTable],
      providers: [
        {
          provide: EventsService,
          useValue: {
            getEvents: (severity?: string, environment?: string) => {
              requestedFilters.push([severity, environment]);
              return of([]);
            },
            deleteEvent: () => of(undefined),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map event types and severities to their display classes', () => {
    expect(component.getSeverityClass('critical')).toBe('severity-critical');
    expect(component.getSeverityClass('unknown')).toBe('');
    expect(component.getEventTypeClass('warning')).toBe('event-type-warning');
    expect(component.getEventTypeClass('unknown')).toBe('');
  });

  it('should request events using the selected filters', () => {
    component.severityFilter = 'critical';
    component.environmentFilter = 'production';
    component.applyFilters();

    expect(requestedFilters.at(-1)).toEqual(['critical', 'production']);
  });
});
