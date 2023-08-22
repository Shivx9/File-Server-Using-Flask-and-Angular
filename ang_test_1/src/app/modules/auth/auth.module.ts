import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';
import { VerifyRegComponent } from 'src/app/components/verify-reg/verify-reg.component';
import { ResetPassComponent } from 'src/app/components/reset-pass/reset-pass.component';




@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyRegComponent, ResetPassComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[MyApiEndpointService]
})
export class AuthModule { }
