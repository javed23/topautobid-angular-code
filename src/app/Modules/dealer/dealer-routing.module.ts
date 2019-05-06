import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importing components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

//cars management components
import { ListComponent as CarsListComponent } from './cars/list/list.component';

//dealerships management components
import { ListComponent as DealershipsListComponent } from './dealerships/list/list.component';

//importing guards
import { DealerAuthGuardService } from '../../core/guards/dealer-auth-guard.service'

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Dealer Login' }

  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Dealer Signup' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Dealer Forgot Pasword' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Dealer Dashboard' },
    canActivate: [DealerAuthGuardService]
  },
  {
    path: 'dealer-profile',
    component: ProfileComponent,
    data: { title: 'Dealer Profile' },
    canActivate: [DealerAuthGuardService]
  },
  { 
    path: 'car-list', 
    component: CarsListComponent, 
    data: { title: 'Cars listing' },
    /*canActivate: [DealerAuthGuardService]*/
  },

  { 
    path: 'dealerships-list', 
    component: DealershipsListComponent, 
    data: { title: 'Dealerships listing' },
    canActivate: [DealerAuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class DealerRoutingModule { }

