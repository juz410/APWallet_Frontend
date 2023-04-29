import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstantTransferPage } from './instant-transfer.page';

describe('InstantTransferPage', () => {
  let component: InstantTransferPage;
  let fixture: ComponentFixture<InstantTransferPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InstantTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
