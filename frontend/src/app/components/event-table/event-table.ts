import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService, Event } from '../../services/events.service';
import { CustomSelectComponent, CustomSelectOption } from '../custom-select/custom-select.component';


@Component({
  standalone: true,
  selector: 'app-event-table',
  imports: [CommonModule, FormsModule, CustomSelectComponent],

  templateUrl: './event-table.html',
  styleUrls: ['./event-table.css'],
})
export class EventTable implements OnInit {
  events: Event[] = [];
  loading = true;
  // These are bound to the filter dropdowns in the template.
  // Keep them aligned with the template's default option value="" (All).
  severityFilter: '' | 'low' | 'medium' | 'high' | 'critical' = '';
  environmentFilter: '' | 'development' | 'staging' | 'production' = '';

  severityOptions: CustomSelectOption[] = [
    { value: '', label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  environmentOptions: CustomSelectOption[] = [
    { value: '', label: 'All' },
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
  ];



  constructor(private eventsService: EventsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Ensure initial load uses current filter defaults bound from the template
    this.loadEvents();
  }


  loadEvents() {
    this.loading = true;
    this.eventsService.getEvents(this.severityFilter || undefined, this.environmentFilter || undefined).subscribe({
      next: (data) => {
        console.log('Events loaded:', data);
        this.events = data;
        this.loading = false;
        console.log('Loading state:', this.loading, 'Events count:', this.events.length);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.events = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }


  applyFilters() {
    this.loadEvents();
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  }

  getEventTypeClass(eventType: string): string {
    switch (eventType) {
      case 'error': return 'event-type-error';
      case 'warning': return 'event-type-warning';
      case 'info': return 'event-type-info';
      default: return '';
    }
  }

  onDelete(event: Event) {
    const ok = confirm('Delete this event? This action cannot be undone.');
    if (!ok) return;

    this.eventsService.deleteEvent(event.id).subscribe({
      next: () => {
        this.events = this.events.filter((e) => e.id !== event.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting event:', err);
        alert('Failed to delete event');
      }
    });
  }
}
