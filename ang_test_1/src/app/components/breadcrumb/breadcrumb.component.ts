import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { endWith } from 'rxjs';
import { parseSafePath } from 'src/app/Globals';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit{
  @Input() currDomain!:string

  // currDomain=1
  

  crumbs:string[]=[]

  constructor(private route:ActivatedRoute, private detect:ChangeDetectorRef){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      
      this.crumbs = parseSafePath(params['dir'])
      this.detect.detectChanges()
      
    })
  }

  generateLink(index:number):string{
    let combined=this.crumbs[0]
    for(let i=1; i<=index;i++){
      combined+="#" + this.crumbs[i]
    }
    return combined
  }

  // getLink(someParam:string){
  //   sep_params
  // }

}
