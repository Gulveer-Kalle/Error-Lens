import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';

@Component({
  standalone: true,
  selector: 'app-event-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css'],
})
export class EventForm {
  application = '';
  message = '';
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  environment: 'development' | 'staging' | 'production' = 'development';
  loading = false;
  errorMessage = '';
  successMessage = '';

  @Output() eventCreated = new EventEmitter<void>();

  constructor(private eventsService: EventsService) {}

  submitEvent() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.eventsService.createEvent({
      application: this.application,
      message: this.message,
      severity: this.severity,
      environment: this.environment,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Event submitted successfully.';
        this.application = '';
        this.message = '';
        this.severity = 'low';
        this.environment = 'development';
        this.eventCreated.emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.error || 'Failed to submit event.';
      }
    });
  }
}
