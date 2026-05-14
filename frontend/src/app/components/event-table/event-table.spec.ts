import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTable } from './event-table';

describe('EventTable', () => {
  let component: EventTable;
  let fixture: ComponentFixture<EventTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTable],
    }).compileComponents();

    fixture = TestBed.createComponent(EventTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
