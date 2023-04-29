import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopUpPage } from './top-up.page';

describe('TopUpPage', () => {
  let component: TopUpPage;
  let fixture: ComponentFixture<TopUpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TopUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
