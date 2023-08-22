import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormSecondComponent } from './test-form-second.component';

describe('TestFormSecondComponent', () => {
  let component: TestFormSecondComponent;
  let fixture: ComponentFixture<TestFormSecondComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFormSecondComponent]
    });
    fixture = TestBed.createComponent(TestFormSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
