import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GlobalTitlePrefix } from 'src/app/Globals';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements AfterViewInit {

  regForm:FormGroup;


  nameWarn:any;
  emailWarn:any;
  passWarn:any;
  confpassWarn:any;
  validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)+$/;
  matchedPassword=true
  hidePass = true
  

  constructor(private formBuilder:FormBuilder, private api:MyApiEndpointService, private title:Title)
  {

    title.setTitle('Register' + GlobalTitlePrefix)

   

    this.regForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.minLength(3)]],
      email:['',[Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(1)]],
      confPass:['',Validators.required]
    })




    this.regForm.valueChanges.subscribe(
      (changes)=>{

        console.log("matching ", this.regForm.value.confPass, " & ",this.regForm.value.password, " as ", this.regForm.value.confPass == this.regForm.value.password)
        if(this.regForm.value.confPass == this.regForm.value.password) {
          this.matchedPassword = true
        }
        else{
          this.matchedPassword = false
        }
        
        console.log("Matched password -> ", this.matchedPassword)
        // console.log('Status -> ', this.regForm.controls['name'].touched)
      }
    )


  }


  ngAfterViewInit(): void {
    this.nameWarn = document.getElementById('nameWarning')
    this.emailWarn = document.getElementById('emailWarning')
    this.passWarn = document.getElementById('passWordWarning')
    this.confpassWarn = document.getElementById('confPasswordWarning')

  }


  


  submit(){
    if (this.regForm.valid){
  
      if(this.regForm.value.confPass != this.regForm.value.password) {
        this.matchedPassword = false
      }
      else{
        this.api.sendReg(this.regForm.value)
      }
      
    }
  }

}
