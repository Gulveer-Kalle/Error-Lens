import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectComponent } from './custom-select.component';

describe('CustomSelectComponent', () => {
  let component: CustomSelectComponent;
  let fixture: ComponentFixture<CustomSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSelectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected label and emit a newly selected value', () => {
    component.options = [
      { value: '', label: 'All' },
      { value: 'critical', label: 'Critical' },
    ];
    component.value = 'critical';
    let emittedValue = '';
    component.valueChange.subscribe((value) => (emittedValue = value));

    expect(component.selectedLabel).toBe('Critical');

    component.selectOption({ value: '', label: 'All' });

    expect(component.value).toBe('');
    expect(emittedValue).toBe('');
    expect(component.open).toBe(false);
  });
});
