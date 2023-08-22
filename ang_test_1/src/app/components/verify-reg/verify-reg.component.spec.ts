import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRegComponent } from './verify-reg.component';

describe('VerifyRegComponent', () => {
  let component: VerifyRegComponent;
  let fixture: ComponentFixture<VerifyRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyRegComponent]
    });
    fixture = TestBed.createComponent(VerifyRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
