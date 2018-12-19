import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

//importing guards
import { AuthGuardService } from '../../core/guards/auth-guard.service'

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  /*{
    path:'home',
    component:HomeComponent,
    canActivate: [AuthGuardService]
  }*/
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class DealerRoutingModule { }

