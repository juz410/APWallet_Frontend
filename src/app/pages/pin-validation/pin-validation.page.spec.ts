import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PinValidationPage } from './pin-validation.page';

describe('PinValidationPage', () => {
  let component: PinValidationPage;
  let fixture: ComponentFixture<PinValidationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PinValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
