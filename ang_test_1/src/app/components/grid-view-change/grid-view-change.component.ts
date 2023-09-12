import { Component,ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { grid_pref_identifier } from 'src/app/Globals';

@Component({
  selector: 'app-grid-view-change',
  templateUrl: './grid-view-change.component.html',
  styleUrls: ['./grid-view-change.component.css']
})
export class GridViewChangeComponent {
  currVal:string // tile | list
  
  @Output() changedVal = new EventEmitter<string>

  constructor(){ //(private changes:ChangeDetectorRef){
    const tVal = localStorage.getItem(grid_pref_identifier)
    this.currVal = tVal ? String(tVal) : 'list'
    console.log("display frfom original - ", this.currVal)
    this.changedVal.emit(this.currVal)
  }

  toggleVal(){
    if (this.currVal=='tile'){
      this.currVal = 'list'
    }
    else{
      this.currVal = 'tile'
    }
    localStorage.setItem(grid_pref_identifier, this.currVal)
    this.changedVal.emit(this.currVal)
    // this.changes.detectChanges()
  }

}
