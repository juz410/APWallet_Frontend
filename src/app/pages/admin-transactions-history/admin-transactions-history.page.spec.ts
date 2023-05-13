import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTransactionsHistoryPage } from './admin-transactions-history.page';

describe('AdminTransactionsHistoryPage', () => {
  let component: AdminTransactionsHistoryPage;
  let fixture: ComponentFixture<AdminTransactionsHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminTransactionsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
