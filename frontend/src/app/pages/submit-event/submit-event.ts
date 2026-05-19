import { Component } from '@angular/core';
import { EventForm } from '../../components/event-form/event-form';

@Component({
  standalone: true,
  selector: 'app-submit-event',
  imports: [EventForm],
  templateUrl: './submit-event.html',
  styleUrls: ['./submit-event.css'],
})
export class SubmitEvent {}
