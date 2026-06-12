import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { CustomSelectComponent, CustomSelectOption } from '../custom-select/custom-select.component';


@Component({
  standalone: true,
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent],

  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css'],
})
export class EventForm {
  eventForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  @Output() eventCreated = new EventEmitter<void>();

  severityOptions: CustomSelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  environmentOptions: CustomSelectOption[] = [
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
  ];

  eventTypeOptions: CustomSelectOption[] = [
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
  ];

  constructor(private fb: FormBuilder, private eventsService: EventsService) {

    this.eventForm = this.fb.group({
      application: ['', Validators.required],
      message: ['', Validators.required],
      severity: ['low', Validators.required],
      environment: ['development', Validators.required],
      event_type: ['error'],
      source: ['']
    });
  }

  submitEvent() {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const formValue = this.eventForm.value;

    this.eventsService.createEvent({
      application: formValue.application,
      message: formValue.message,
      severity: formValue.severity,
      environment: formValue.environment,
      event_type: formValue.event_type || 'error',
      source: formValue.source || 'unknown',
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Event submitted successfully.';
        this.eventForm.reset({
          application: '',
          message: '',
          severity: 'low',
          environment: 'development',
          event_type: 'error',
          source: 'unknown'
        });
        this.eventCreated.emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.error || 'Failed to submit event.';
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  get application() { return this.eventForm.get('application'); }
  get message() { return this.eventForm.get('message'); }
  get severity() { return this.eventForm.get('severity'); }
  get environment() { return this.eventForm.get('environment'); }
  get event_type() { return this.eventForm.get('event_type'); }
  get source() { return this.eventForm.get('source'); }
}
