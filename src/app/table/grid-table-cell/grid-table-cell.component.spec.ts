import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTableCellComponent } from './grid-table-cell.component';

describe('GridTableCellComponent', () => {
  let component: GridTableCellComponent;
  let fixture: ComponentFixture<GridTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTableCellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
