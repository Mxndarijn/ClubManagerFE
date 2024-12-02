import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiColumnList } from './multi-column-list';

describe('ListTableComponent', () => {
  let component: MultiColumnList;
  let fixture: ComponentFixture<MultiColumnList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiColumnList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiColumnList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
