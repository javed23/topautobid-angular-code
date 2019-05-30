import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importing components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


//dealerships management components
import { ListComponent as DealershipsListComponent } from './dealerships/table-view/list.component';

//cars management components
import { ListingComponent as CarsGridListComponent } from './cars/grid-list-view/listing.component';
import { CarDetailPageComponent } from './cars/car-detail-page/car-detail-page.component';

//bids management components
import { ListingComponent as BidsListingComponent} from './bids/listing/listing.component';



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
    path: 'dealership-listing', 
    component: DealershipsListComponent, 
    data: { title: 'Dealerships listing' }
  },
  { 
    path: 'car-listing', 
    component: CarsGridListComponent, 
    data: { title: "Dealer's Cars listing" },
    /*canActivate: [DealerAuthGuardService]*/
  }, 
  { 
    path: 'car-detail/:_id', 
    component: CarDetailPageComponent, 
    data: { title: "Car Details" },
    /*canActivate: [DealerAuthGuardService]*/
  },
  { 
    path: 'bid-listing', 
    component: BidsListingComponent, 
    data: { title: "Cars Bids Listing" },
    /*canActivate: [DealerAuthGuardService]*/
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class DealerRoutingModule { }

