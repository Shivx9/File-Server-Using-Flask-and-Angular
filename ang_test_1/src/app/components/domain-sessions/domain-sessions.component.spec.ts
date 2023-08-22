import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainSessionsComponent } from './domain-sessions.component';

describe('DomainSessionsComponent', () => {
  let component: DomainSessionsComponent;
  let fixture: ComponentFixture<DomainSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainSessionsComponent]
    });
    fixture = TestBed.createComponent(DomainSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
