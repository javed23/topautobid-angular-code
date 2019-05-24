import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importing components
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

//cars management components
import { ListComponent as CarsListComponent } from './cars/list/list.component';
import { AddCarComponent } from './cars/addcar/addcar.component';
import { EditCarComponent } from './cars/editcar/editcar.component';
//importing guards
import { SellerAuthGuardService } from '../../core/guards/seller-auth-guard.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Seller Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Seller Signup' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Seller Forgot Pasword' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Seller Dashboard' },
    canActivate: [SellerAuthGuardService]
  },
  {
    path: 'seller-profile',
    component: ProfileComponent,
    data: { title: 'Seller Profile' },
    canActivate: [SellerAuthGuardService]
  },
  { 
    path: 'car-list', 
    component: CarsListComponent, 
    data: { title: "Seller's Cars listing" },
    canActivate: [SellerAuthGuardService]
  },
  {
    path: 'addcar',
    component: AddCarComponent,
    data: { title: 'Seller AddCar' }
  },
  {
    path: 'editcar/:_id',
    component: EditCarComponent,
    data: { title: 'Seller EditCar' }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class SellerRoutingModule { }
