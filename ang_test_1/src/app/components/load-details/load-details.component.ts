import { Component } from '@angular/core';

@Component({
  selector: 'app-load-details',
  templateUrl: './load-details.component.html',
  styleUrls: ['./load-details.component.css']
})
export class LoadDetailsComponent {

  opened = false
  loaded = false
  details:any
  
  calcSize(size:number){
    let suffix = ''
    if (size>1000000000){
      size=(size/1000000000) //.toFixed(2)
      suffix = 'GB'
    }
    else if (size>1000000){
      size/=1000000
      suffix = 'MB'
    }
    else if (size>1000){
      size/=1000
      suffix = 'KB'
    }
    else{
      suffix = 'B'
    }
    console.log("Size is ", (size).toFixed(2), suffix)

    return String((size).toFixed(2)) + " " + suffix
  }

  open(){
    this.opened = true  
    this.loaded = false
  }

  loadData(data:any){
    this.details = data
    this.loaded = true
  }

  close(){
    this.opened = false
  }

}
