import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-test-form-second',
  templateUrl: './test-form-second.component.html',
  styleUrls: ['./test-form-second.component.css']
})

export class TestFormSecondComponent {

	form;

	constructor(private formBuild:FormBuilder){
		this.form = this.formBuild.group({
			name:['', Validators.required,Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')],
			email:['', Validators.required, Validators.email],
			pass:['', Validators.required, Validators.minLength(6)],
			confPass:['', Validators.required]

		})
	}


	onSubmit(){
		console.log(this.form.value)
	}

	


}
