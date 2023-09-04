import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-load-details',
  templateUrl: './load-details.component.html',
  styleUrls: ['./load-details.component.css'],
  animations:[  
    trigger(
      'toggle',
      [
        state(
          'open',
          style(
            {
              boottom:'0px',
              opacity:'0%'
            })),

        state(
          'close',
          style(
            {
              boottom:'-5rem',
              opacity:'0%'
            })),
            



        transition(':enter', [
          style({ opacity: 0}), 
          animate('100ms', style({ opacity: 1, bottom:0 })),
        ]),

        transition(':leave', [
          animate('100ms', style({ opacity: 0 }))
        ])

          ]
      )]
})
export class LoadDetailsComponent {


  state = 'close'

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
    this.state = 'open'
    this.opened = true  
    this.loaded = false
  }

  loadData(data:any){
    this.details = data
    this.loaded = true
  }

  close(){
    // this.state = 'close'
    this.opened = false
  }

}
