import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsHistoryPage } from './transactions-history.page';

describe('TransactionsHistoryPage', () => {
  let component: TransactionsHistoryPage;
  let fixture: ComponentFixture<TransactionsHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TransactionsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
