import { TestBed } from '@angular/core/testing';

import { MyApiEndpointService } from './my-api-endpoint.service';

describe('MyApiEndpointService', () => {
  let service: MyApiEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyApiEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
