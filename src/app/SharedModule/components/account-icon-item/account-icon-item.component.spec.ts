import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountIconItemComponent } from './account-icon-item.component';

describe('AccountIconItemComponent', () => {
  let component: AccountIconItemComponent;
  let fixture: ComponentFixture<AccountIconItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountIconItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountIconItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
