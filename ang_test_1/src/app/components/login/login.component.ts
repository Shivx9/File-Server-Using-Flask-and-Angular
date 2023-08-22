import { HtmlParser } from '@angular/compiler';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GlobalWebName, token_dentifier } from 'src/app/Globals';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{

  loginForm:FormGroup

  emailWarn:any;
  passWarn:any;
  credWarn:any;
  

  invalidCreds:any = false
  forbidden:any = false

  constructor(private api:MyApiEndpointService, private formBuilder:FormBuilder, private title:Title){
    title.setTitle('Login | '+GlobalWebName)
    this.loginForm =  formBuilder.group({
      'email':['',[Validators.required, Validators.email]],
      'password':['',Validators.required]
    })
  }

  ngAfterViewInit(): void {
    this.emailWarn = document.getElementById('emailWarning')
    this.passWarn = document.getElementById('passWordWarning')
    this.credWarn = document.getElementById('credWarning')

  }

  submit(){
    if(this.loginForm.valid)
    {
      const data = {
        'email' :this.loginForm.value.email,
        'password': this.loginForm.value.password
      }
      console.log('from componenet - \n', data,'\n\n')
      this.api.sendLogin(data)
      .subscribe((result)=>{

        this.forbidden = result.forbidden
        if(this.forbidden){
          return
        }
        this.invalidCreds = !result.success

        localStorage.setItem(token_dentifier, result.token)

        if(!this.invalidCreds){
          this.api.goToDefaultPage()
        }
      })

      
    }
  }

}
