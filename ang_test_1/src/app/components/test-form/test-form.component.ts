import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent {

  constructor(private http:HttpClient){}


  test_submit(formdata:any){
    
    console.log("pressed submit button")
    console.log(" sending----> " + (JSON.stringify(formdata)))

    const f = new FormData
    for(let i of ['name', 'email', 'password', 'testFile']){
      f.append(i, formdata[i])
    }

    this.http.post('http://127.0.0.1:5000/test', 
                                (
                                  f

                      
                                
                                )).subscribe(
      (response)=>{
        console.log("result was -> " + JSON.stringify(response))
      },
      (error)=>{
        console.log("Client side error msg - " + error.error + "\n" + JSON.stringify(error))
        if (error.status>=400){
          console.log('4XX status returned')
        }

        else if(error.status>=300){
          console.log('3XX status returned')
          
        }
        }


    )
  }

}
