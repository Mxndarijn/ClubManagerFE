import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackConfigurationPageComponent } from './track-configuration-page.component';

describe('TrackConfigurationPageComponent', () => {
  let component: TrackConfigurationPageComponent;
  let fixture: ComponentFixture<TrackConfigurationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackConfigurationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackConfigurationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
