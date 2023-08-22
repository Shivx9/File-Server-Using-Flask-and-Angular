import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirExplorerComponent } from './dir-explorer.component';

describe('DirExplorerComponent', () => {
  let component: DirExplorerComponent;
  let fixture: ComponentFixture<DirExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirExplorerComponent]
    });
    fixture = TestBed.createComponent(DirExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
