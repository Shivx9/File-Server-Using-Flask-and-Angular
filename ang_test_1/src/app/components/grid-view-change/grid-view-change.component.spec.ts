import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridViewChangeComponent } from './grid-view-change.component';

describe('GridViewChangeComponent', () => {
  let component: GridViewChangeComponent;
  let fixture: ComponentFixture<GridViewChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridViewChangeComponent]
    });
    fixture = TestBed.createComponent(GridViewChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
