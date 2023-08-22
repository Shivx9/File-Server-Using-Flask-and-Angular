import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalWebName } from 'src/app/Globals';
import { Item } from 'src/app/interfaces/interfaces';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-domain-sessions',
  templateUrl: './domain-sessions.component.html',
  styleUrls: ['./domain-sessions.component.css']
})

export class DomainSessionsComponent implements OnInit{

  domains:Item[]=[]
  isEmpty = false
  hasLoaded = false
  errorWhileLoading= false

  constructor(private apiService:MyApiEndpointService, private title:Title){
    title.setTitle('Domains | ' + GlobalWebName)
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
