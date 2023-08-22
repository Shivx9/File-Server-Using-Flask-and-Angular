import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainSessionsComponent } from 'src/app/components/domain-sessions/domain-sessions.component';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemComponent } from 'src/app/components/item/item.component';
import { DirExplorerComponent } from 'src/app/components/dir-explorer/dir-explorer.component';
import { BreadcrumbComponent } from 'src/app/components/breadcrumb/breadcrumb.component';
import { ContextMenuComponent } from 'src/app/components/context-menu/context-menu.component';
import { UploadBtnComponent } from 'src/app/components/upload-btn/upload-btn.component';



@NgModule({
  declarations: [
    ItemComponent,
    DomainSessionsComponent,
    DirExplorerComponent,
    NavbarComponent,
    BreadcrumbComponent,
    ContextMenuComponent,
    UploadBtnComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[MyApiEndpointService]
})

export class CoreFuncModule { }
