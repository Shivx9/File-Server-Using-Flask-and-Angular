import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, numberAttribute } from '@angular/core';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalWebName, live_separator, safe_separator } from 'src/app/Globals';
import { Item, contextMenuItem } from 'src/app/interfaces/interfaces';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';


@Component({
  selector: 'app-dir-explorer',
  templateUrl: './dir-explorer.component.html',
  styleUrls: ['./dir-explorer.component.css']
})

export class DirExplorerComponent implements OnInit, AfterViewInit{
  
  @ViewChild(ContextMenuComponent) ctxtMenu!:ContextMenuComponent
  @ViewChild('contextMenuContent', {read:ElementRef}) contextMenuContent!:ElementRef
  @Input() root!:string

  activeTasks:{'name':string, 'id':string}[]=[

  ]

  directories:Item[]=[]
  rootAsText:string=""
  isEmpty = false
  hasLoaded = false
  errorWhileLoading= false

  displayContentURL!:string
  rawContent!:SafeHtml
  previewMode: 'none' | 'file' | 'img'= 'none'

  multi_targets : {item:Item, root:number}[] = []

  params!:any

  constructor(
    private apiService:MyApiEndpointService, 
    private title:Title, 
    private paramService:ActivatedRoute, 
    private change:ChangeDetectorRef,
    private sanitizer:DomSanitizer){
    title.setTitle('Directories | ' + GlobalWebName )


  }



  rtItemMenu(event:MouseEvent, item:Item, root:any){
    event.preventDefault()
    
    let menuItems:contextMenuItem[]
    
    if(this.multi_targets.length == 0){
      switch(item.type){
        case 'domain':
          menuItems = [
            {name:'open'}
          ]
  
          break
  
        case 'file':
          menuItems=[
            {name:'open'},
            {name:'copy'},
            {name:'cut'},
            {name:'paste'},
            {name:'rename'},
            {name:'delete'},
            {name:'download'}
          ]
  
          break
  
        case 'folder':
            menuItems=[
              {name:'open'},
              {name:'copy'},
              {name:'cut'},
              {name:'paste'},
              {name:'rename'},
              {name:'delete'},
              {name:'download'}
            ]
    
            break
      }
      this.ctxtMenu.targetInfo = [{"item" : item, "root":root}]
    }
    else{
      menuItems = [
        {name:'copy'},
        {name:'cut'},
        {name:'paste'},
        {name:'delete'},
        {name:'download'}
      ]
      this.ctxtMenu.targetInfo = this.multi_targets
    }
      
    


    this.ctxtMenu.activateMenu(menuItems, event.clientX, event.clientY)
  }

    

  launch(obj:any){
    this.directories=[]

    this.rootAsText = obj.root

    let prefix = ''

    if (this.rootAsText!=''){
      prefix = this.rootAsText + safe_separator
    }

    
    for(let i of obj.folders){
      let f:Item={
        type:"folder",
        name:prefix + i,
        id:this.root
      }
      this.directories.push(f)
    }


    for(let i of obj.files)
    {
      let f:Item={
        type:"file",
        name: prefix + i,
        id:this.root
      }
      this.directories.push(f)
    }

    

    this.isEmpty = (this.directories.length<1)
    this.multi_targets = []
    this.change.detectChanges()


  }

  displayContent(val:string){
    console.log("val recd - " ,val)
    this.displayContentURL = val.split('ob:')[1]
    this.rawContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.displayContentURL)
    this.previewMode='file'
    console.log("processed - ", this.rawContent)
  }

  ngOnInit(): void {
    
    this.paramService.queryParams.subscribe((p)=>{
      this.params =p  
      this.root = p['domain']
      this.make_api_call()
    })
  }

  


  ngAfterViewInit(): void {

  }


  make_api_call(){
    this.apiService.explore(this.paramService.snapshot.queryParamMap.get('domain'), String(this.paramService.snapshot.queryParamMap.get('dir')))
      .subscribe((obj)=>{
        this.launch(obj)
        this.hasLoaded = true
      })
  }


  sendCancelReq(id:string){
    for(let i=0; i<this.activeTasks.length; i++){
      if (this.activeTasks[i].id==id){
        this.apiService.cancelAction(this.params['domain'], this.params['dir'], id)
        .subscribe(res=>{
          if(res.success){
            this.activeTasks.splice(i,1)
          }
        })
        break
      }
    }
  }

  completedReq(id:string){
    for(let i=0; i<this.activeTasks.length; i++){
      if (this.activeTasks[i].id==id){
        this.activeTasks.splice(i,1)
        break
      }
    }
  }



}
