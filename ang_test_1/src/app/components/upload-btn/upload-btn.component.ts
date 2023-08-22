import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-upload-btn',
  templateUrl: './upload-btn.component.html',
  styleUrls: ['./upload-btn.component.css']
})
export class UploadBtnComponent {
  
  activated=false
  fileUpload:FormGroup
  dirCreate:FormGroup
  fileArr:File[]=[]
  currMode=''
  @Input() params:any
  @Output() reloadView = new EventEmitter
  invalidInput=false

  constructor(private formBuild:FormBuilder, private api:MyApiEndpointService){

    this.fileUpload = formBuild.group({
      'file':['', [Validators.required]]
    })

    this.dirCreate = formBuild.group({
      'name':['',[Validators.required]]
    })
  }

  uploadChange(event:any){
    for(let file of event.target.files){
      console.log("checking - ", file)
      if(file){
        console.log("OK")
        this.fileArr.push(file)
        
      }
    }
  }

  createDir(event:any){
    this.api.addToDirectory(this.params['domain'], this.params['dir'], 'create', this.dirCreate.value.name)
    .subscribe((res)=>{
      console.log("Returned - ", res.success)
      this.invalidInput = !res.success
      if(!this.invalidInput){
        this.close()
        this.reloadView.emit()
      }
      
    })
  }


  uploadFile(event:any){  

    this.api.addToDirectory(this.params['domain'], this.params['dir'], 'upload', this.fileArr)
    .subscribe((res)=>{
      console.log("Completed - ", res)
      this.close()
      this.reloadView.emit()
    })
  }

  open(arg:string){
    this.currMode = arg
    this.activated = true
    this.invalidInput = false
    if(arg=='upload'){
      this.fileArr = []
    }
    else if(arg=='file'){
      
    }

  }

  close(){
    if(this.activated)this.activated = false
    this.dirCreate.reset()
  }

  clickOff(event:any){
    if(event.target==event.currentTarget)this.close()
  }
}
