import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { token_dentifier } from '../Globals';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private router:Router) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const authReq = req.clone({
      setHeaders:{
        Authorization: 'Bearer '+ localStorage.getItem(token_dentifier)
      }
    })

    return next.handle(authReq)
                      .pipe(tap({
                        error:(error)=>{
                          console.log("Error while detecting valid session : ", error)
                          if(error.status==401){
                            this.router.navigate(['/login'])
                          }
                        }
                      }))
  }
}
