import { NgModule } from "@angular/core";
import {Routes, RouterModule, Router} from '@angular/router'
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DomainSessionsComponent } from "./components/domain-sessions/domain-sessions.component";
import { VerifyRegComponent } from "./components/verify-reg/verify-reg.component";
import { DirExplorerComponent } from "./components/dir-explorer/dir-explorer.component";
import { ResetPassComponent } from "./components/reset-pass/reset-pass.component";






let routes:Routes=[
    {path:'', component:DomainSessionsComponent},
    {path:'explore', component:DirExplorerComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'verifyreg',component:VerifyRegComponent},
    {path:"resetpass", component:ResetPassComponent}

]


@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule{
    constructor(private router:Router){}



    redirectTo(path:string){
        this.router.navigate(['/'+path])

    }
}