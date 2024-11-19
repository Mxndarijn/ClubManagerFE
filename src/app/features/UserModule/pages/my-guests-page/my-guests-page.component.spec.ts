import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGuestsPageComponent } from './my-guests-page.component';

describe('MyGuestsPageComponent', () => {
  let component: MyGuestsPageComponent;
  let fixture: ComponentFixture<MyGuestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGuestsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyGuestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
