import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPresencesPageComponent } from './my-presences-page.component';

describe('MyPresencesPageComponent', () => {
  let component: MyPresencesPageComponent;
  let fixture: ComponentFixture<MyPresencesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPresencesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyPresencesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
