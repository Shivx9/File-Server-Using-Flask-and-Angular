import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent {
  errorOccured = false
  requestSentBool = false
  passResetBool = false
  passResetRequest:FormGroup
  resetPass:FormGroup
  hasKey = false
  key=''

  constructor(private builder:FormBuilder, private api:MyApiEndpointService, private route:ActivatedRoute){
    this.passResetRequest = builder.group({
      'email':['',[Validators.required, Validators.email]]
    })

    this.resetPass = builder.group({
      'password':['',[Validators.required, Validators.minLength(3)]],
      'confPass':['',[Validators.required]]
    })

    route.queryParams.subscribe((params)=>{
      console.log("Params are - ", params)
      if (params['key']){
        this.hasKey = true
        this.key = params['key']
      }
      else{
        this.hasKey = false
        this.key=''
      }
    })

  }

  sendReq(){
    this.api.requestPassResetLink(this.passResetRequest.value.email)
    .subscribe((res)=>{
      this.errorOccured = !res.success
      this.requestSentBool = res.success
    })
  }


  reset(){
    this.api.passReset(this.resetPass.value.password, this.key)
    .subscribe((res)=>{
      this.errorOccured = !res.success
      this.passResetBool = res.success
    })
  }



}
