import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild, asNativeElements } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clipboard_action_identifier, clipboard_identifier, getSafePath, safe_separator } from 'src/app/Globals';
import { contextMenuItem } from 'src/app/interfaces/interfaces';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
})
export class ContextMenuComponent implements AfterViewInit{

  @Input() params:any
  @Output() reloadView = new EventEmitter
  @Output() newCancellableTask = new EventEmitter<{"name":string,"id":string}>
  @Output() completedCancellableTask = new EventEmitter<string>
  @Output() fileDetails = new EventEmitter<any>
  @Output() fileDetailsRequested = new EventEmitter

  // @ViewChild('mainDiv', {static:false, read:ElementRef}) mainDiv!:ElementRef


  //     Pass context from where menu is clicked
  //     Paste to be disabled if nothing is on clipboard  | Or just display an error msg

  renameMenu:FormGroup

  constructor(
    private detectChange:ChangeDetectorRef, 
    private render:Renderer2, 
    private selfRef:ElementRef, 
    private formBuild:FormBuilder,
    private api:MyApiEndpointService
    )
    {
      this.renameMenu = formBuild.group({
        'name':['',[Validators.required]]
      })

  }

  activeMenuItems!:contextMenuItem[]
  icons :any= {
    'copy':'fa-copy',
    'cut':'fa-cut',
    'paste':'fa-paste',
    'delete':'fa-trash',
    'rename':'fa-edit',
    'download':'fa-download',
    'details':'fa-search'
  }

  isActivated=false
  menuOpen = false
  invalidInput= false
  actionType: 'rename' = 'rename'
  targetInfo:any
  
  
  activateMenu(menuItems:contextMenuItem[], pos_x:number, pos_y:number){
    this.activeMenuItems = menuItems
    this.isActivated = true
    this.detectChange.detectChanges()

    const menu_x = this.selfRef.nativeElement.offsetWidth
    const menu_y = this.selfRef.nativeElement.offsetHeight

    let final_x=pos_x
    let final_y = pos_y

    if(pos_x+menu_x> window.innerWidth){
      final_x-=menu_x
    }


    if(pos_y+menu_y> window.innerHeight){
      final_y-=menu_y
    }
    

    
    
    this.render.setStyle(this.selfRef.nativeElement, "left",`${final_x}px`)
    this.render.setStyle(this.selfRef.nativeElement, "top",`${final_y}px`)

    

  }


  @HostListener('document:click')
  closeContext(){
    this.isActivated = false
    
  }

  closeMenu(){
    this.menuOpen = false
  }


  clickOff(event:any){

    if(event.target==event.currentTarget)
    {
      this.closeMenu()
    }

  }

  optionClicked(optionName:contextMenuItem['name']){

    this.invalidInput = false

    switch(optionName){
      case 'copy':
        let paths = []
        for(let i of this.targetInfo){
          paths.push(getSafePath(i.item.name))
        }
        sessionStorage.setItem(clipboard_identifier, JSON.stringify(paths))
        sessionStorage.setItem(clipboard_action_identifier, optionName)
        break

      case 'cut':

        let path = []
        for(let i of this.targetInfo){
          path.push(getSafePath(i.item.name))
        }
        sessionStorage.setItem(clipboard_identifier, JSON.stringify(path))
        sessionStorage.setItem(clipboard_action_identifier, optionName)
        break

      case 'paste':



        let data :string= ''

        // Empty clipboard = inactive option
        if(!sessionStorage.getItem(clipboard_identifier)){
          return
        }

        else{
          data= String(sessionStorage.getItem(clipboard_identifier))
        }

        
        let duplicate=false
        if (sessionStorage.getItem(clipboard_action_identifier)=='copy'){
          duplicate = true
        }

        this.api.modifyInDirectory(
          this.params['domain'], 
          this.params['dir'], 
          'relocate',
          {
            'initPath'  : data, 
            'finalPath' : getSafePath(this.params['dir']),
            'duplicate' : duplicate
          } )
          .subscribe(()=> this.reloadView.emit())

        

        sessionStorage.removeItem(clipboard_identifier)
        sessionStorage.removeItem(clipboard_action_identifier)

        break

      case 'delete':
        
        let path_del = []
        for(let i of this.targetInfo){
          path_del.push(getSafePath(i.item.name))
        }
        this.api.deleteFromDirectory(
          this.params['domain'], 
          this.params['dir'],
          {
            'toDelete' : JSON.stringify(path_del)
          }
          )
          .subscribe(()=> this.reloadView.emit() )

        break
        
      case 'rename':

        this.renameMenu.reset()
        this.actionType='rename'
        this.menuOpen = true
        
        break

      case 'download':
        let downPaths:string[]= []
        for(let i of this.targetInfo){
          downPaths.push(getSafePath(i.item.name))
        }
        
        let t_id = (Math.random() + 1).toString(36).substring(7)
        this.newCancellableTask.emit({name: "Preparing Files", id: t_id})

        this.api.downloadMultiFromDirectory(this.params['domain'], this.params['dir'], downPaths, t_id)
        .subscribe((blob)=>{
          const objectUrl = URL.createObjectURL(blob);
          this.completedCancellableTask.emit(t_id)
          // window.open(objectUrl, '_blank')// ,'noopener')
    
          const a = document.createElement('a');
          a.href = objectUrl;
          if(downPaths.length==1){
            a.download  = String(downPaths[0].split(safe_separator).pop()) // Provide a desired file name
            console.log("download set to ", a.download)
          }
          a.click();
    
          URL.revokeObjectURL(objectUrl);
        })

        break
      
      case 'open':


        break
      
      case 'details':
        this.fileDetailsRequested.emit()
        this.api.getDetails(this.params['domain'], this.params['dir'] , this.targetInfo[0].item.name.split(safe_separator).pop())
        .subscribe(res=>{
          this.fileDetails.emit(res)          

        })
        break

    }
    this.closeContext()
  }


  renameRequest(){
    
    let info = {
      'targetPath': (this.targetInfo[0].item.name), 
      'target':this.renameMenu.value.name
    }
    this.api.modifyInDirectory(this.params['domain'], this.params['dir'] , 'rename' , info).subscribe(res=>
      {
        if (res['success']==false){
          this.invalidInput = true
        }
        else{
          this.closeMenu()
          this.reloadView.emit()
        }
      })
  }


  ngAfterViewInit(): void {
    // const width=document.getElementById('context-menu')//?.style.width
    // console.log("Width = ",width)
  }
  

  


}
