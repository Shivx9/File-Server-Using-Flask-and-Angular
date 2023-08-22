import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpUrlEncodingCodec, HttpParameterCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}



@Injectable()
export class EncodeHttpParamsInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = new HttpParams({encoder: new CustomEncoder(), fromString: req.params.toString()});
    const httpUrlEncoding = new HttpUrlEncodingCodec();
    return next.handle(req.clone({
      params,
      url: httpUrlEncoding.encodeValue(req.url),
    }));
  }
}