import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, HostListener } from '@angular/core';


export type CustomSelectOption = {
  value: string;
  label: string;
};

@Component({
  standalone: true,
  selector: 'app-custom-select',
  imports: [CommonModule],
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
})
export class CustomSelectComponent {
  @Input() value = '';

  // Support usage with reactive forms:
  // <app-custom-select formControlName="severity" ...>
  // Angular binds the current FormControl value to this `value` input.

  @Input({ required: true }) options: CustomSelectOption[] = [];
  @Input() placeholder = 'Select';
  @Input() width: string = '220px';

  styleVars(): Record<string, string> {
    return { '--cs-width': this.width };
  }


  @Output() valueChange = new EventEmitter<string>();



  @ViewChild('trigger', { static: true }) trigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('panel', { static: true }) panel!: ElementRef<HTMLDivElement>;

  open = false;

  get selectedLabel(): string {
    const found = this.options.find((o) => o.value === this.value);
    if (found) return found.label;

    // When used with reactive forms, the FormControl can start as `null`/`undefined`.
    // Ensure placeholder is visible immediately.
    if (this.value === null || this.value === undefined || this.value === '') return this.placeholder;

    return this.placeholder;
  }


  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  selectOption(option: CustomSelectOption) {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    if (!this.open) return;

    const target = e.target as Node | null;
    if (!target) return;

    const inTrigger = this.trigger.nativeElement.contains(target);
    const inPanel = this.panel.nativeElement.contains(target);

    if (!inTrigger && !inPanel) this.close();
  }

}

