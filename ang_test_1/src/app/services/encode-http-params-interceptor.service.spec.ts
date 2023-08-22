import { TestBed } from '@angular/core/testing';

import { EncodeHttpParamsInterceptorService } from './encode-http-params-interceptor.service';

describe('EncodeHttpParamsInterceptorService', () => {
  let service: EncodeHttpParamsInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncodeHttpParamsInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
