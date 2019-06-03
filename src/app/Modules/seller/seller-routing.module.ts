import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importing components
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

//cars management components
import { ListingComponent as CarsGridListComponent } from './cars/grid-list-view/listing.component';
import { ListComponent as CarsTableComponent } from './cars/table-view/list.component';
import { CarDetailPageComponent } from './cars/car-detail-page/car-detail-page.component';
import { AddCarComponent } from './cars/addcar/addcar.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AccountVerifyComponent } from './account-verify/account-verify.component';
import { EditCarComponent } from './cars/editcar/editcar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
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
    path: 'verify-email/:token',
    component: VerifyEmailComponent,
    data: { title: 'Seller Email Verify' }
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    data: { title: 'Seller Reset Pasword' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Seller Forgot Pasword' }
  },
  {
    path: 'home',
    component: CarsGridListComponent, 
    data: { title: "Seller's Cars listing" },
    canActivate: [SellerAuthGuardService]
  },
  {
    path: 'seller-profile',
    component: ProfileComponent,
    data: { title: 'Seller Profile' },
    canActivate: [SellerAuthGuardService]
  },
  { 
    path: 'car-dashboard', 
    component: CarsTableComponent, 
    data: { title: "Seller's Cars Dashboard" },
    canActivate: [SellerAuthGuardService]
  },
  { 
    path: 'car-listing', 
    component: CarsGridListComponent, 
    data: { title: "Seller's Cars listing" },
    canActivate: [SellerAuthGuardService]
  },
  { 
    path: 'car-detail/:_id/:type', 
    component: CarDetailPageComponent, 
    data: { title: "Car Details" },
    canActivate: [SellerAuthGuardService]
  },
  { 
    path: 'car-detail/:_id', 
    component: CarDetailPageComponent, 
    data: { title: "Car Details" },
    canActivate: [SellerAuthGuardService]
  }, 

  {
    path: 'addcar',
    component: AddCarComponent,
    data: { title: 'Seller AddCar' },
    canActivate: [SellerAuthGuardService]
  },
  {
    path: 'account-verify/:id',
    component: AccountVerifyComponent,
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
