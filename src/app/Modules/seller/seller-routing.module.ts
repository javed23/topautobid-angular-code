import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { SellerAuthGuardService } from '../../core/guards/seller-auth-guard.service';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent,   
  },
  {
    path:'login',
    component:LoginComponent    
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'forgot',
    component:ForgotPasswordComponent
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate:[SellerAuthGuardService]
  },
  {
    path:'profile',
    component:ProfileComponent,
    canActivate:[SellerAuthGuardService]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class SellerRoutingModule { }
