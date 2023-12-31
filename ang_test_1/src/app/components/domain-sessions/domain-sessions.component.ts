import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalWebName, grid_pref_identifier } from 'src/app/Globals';
import { Item } from 'src/app/interfaces/interfaces';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';
import { GridViewChangeComponent } from '../grid-view-change/grid-view-change.component';

@Component({
  selector: 'app-domain-sessions',
  templateUrl: './domain-sessions.component.html',
  styleUrls: ['./domain-sessions.component.css']
})

export class DomainSessionsComponent implements OnInit{

  @ViewChild(GridViewChangeComponent) gridMenu!:GridViewChangeComponent
  @Input() displayType!:string

  domains:Item[]=[]
  isEmpty = false
  hasLoaded = false
  errorWhileLoading= false
  itemCols = 0
  itemSizeThresh = 250


  constructor(private apiService:MyApiEndpointService, private title:Title){
    title.setTitle('Domains | ' + GlobalWebName)
    this.itemCols =  Math.round(window.innerWidth/this.itemSizeThresh);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
  this.itemCols =  Math.round(event.target.innerWidth/this.itemSizeThresh);
  console.log(this.itemCols)
}

  getDisplay(){
    if(this.displayType && this.displayType!=''){
      return this.displayType
    }

    else{
      const storedVal = localStorage.getItem(grid_pref_identifier)
      if(storedVal && storedVal!=''){
          return storedVal
        }
      else{
        return 'tile'
      }
    } 
  }

  ngOnInit(): void {

    this.apiService.loadDomainSessionList()
    .subscribe((obj)=>{
      const data = obj['directories']
      console.log(data)

      const len =  data.length
      for(let i=0;i<len;i++){
        data[i].type = 'domain'
      }

      this.domains=data
      
      // console.log('domains recd. ', this.domains)
      if (this.domains.length<1){
        this.isEmpty = true
      }
      this.hasLoaded = true

    })
  }
}
