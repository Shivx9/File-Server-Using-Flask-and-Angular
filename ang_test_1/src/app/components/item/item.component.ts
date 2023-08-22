import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Item } from 'src/app/interfaces/interfaces';
import { safe_separator } from 'src/app/Globals';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';




@Component({  
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

export class ItemComponent{

  @Input() item!:Item
  @Input() root!:any
  @Output() multi_select = new EventEmitter<boolean>
  // @Output() ctxMenuRequest = new EventEmitter<{event:MouseEvent, item:Item, root:any}>  
  
  isHoverTarget = false
  selected = false
  


  constructor(private api:MyApiEndpointService){}


  selectValChanged(val:boolean){
    this.multi_select.emit(val)
  }

  getName():string{
    // console.log("before - ", this.item.name)
    // return this.item.name.replace(new RegExp(safe_separator , 'g'), live_separator)
    let a = this.item.name.split(safe_separator)
    
    return a[a.length-1]
  
  }

  getImg():string{
    let core_src = "./../../../assets/images/"
    switch (this.item.type){
      case 'domain':
        return core_src + 'domain_icon.png'
      case 'file':
        return core_src  + 'file_logo.png'

      case 'folder':
        return core_src + 'folder_icon.png'
    }
  }

  get_url_dir():string{
    if( this.item.type=='domain'){
      return ' '
    }
    else if(this.item.type=='file'){
      return this.item.name.split(safe_separator)[0]
    }
    return this.item.name
  }

  get_core_link():string{
    if(this.item.type=='file'){

      return '/viewFromDirectory'
    }

    return '/explore/'

  }


  get_file(){
    this.api.downloadFromDirectory(this.root, this.item.name).subscribe((blob)=>{
      const objectUrl = URL.createObjectURL(blob);
    
      // window.open(objectUrl, '_blank')// ,'noopener')

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = this.getName() // Provide a desired file name
      a.click();

      URL.revokeObjectURL(objectUrl);
    })
  }
    
    

}


