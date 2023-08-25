import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


import { AuthModule } from './modules/auth/auth.module';
import { CoreFuncModule } from './modules/core-func/core-func.module';

import { AppComponent } from './app.component';
import { TestFormComponent } from './components/test-form/test-form.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TestFormSecondComponent } from './components/test-form-second/test-form-second.component';
import { EncodeHttpParamsInterceptorService } from './services/encode-http-params-interceptor.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';






@NgModule({
  declarations: [
    AppComponent, 
    TestFormComponent, 
    TestFormSecondComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule,
    CoreFuncModule,
    BrowserAnimationsModule,
  ],  
  exports:[
  ],

  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
