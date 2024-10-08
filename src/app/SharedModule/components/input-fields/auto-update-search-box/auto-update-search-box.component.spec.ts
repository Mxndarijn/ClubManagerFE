import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoUpdateSearchBoxComponent } from './auto-update-search-box.component';

describe('AutoUpdateSearchBoxComponent', () => {
  let component: AutoUpdateSearchBoxComponent;
  let fixture: ComponentFixture<AutoUpdateSearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoUpdateSearchBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoUpdateSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
