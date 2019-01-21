import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PrivatePolicyComponent } from '../../core/components/private-policy/private-policy.component';
import { TermConditionsComponent } from '../../core/components/term-conditions/term-conditions.component';


import { SharedModule } from '../../core/shared.module';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,data: { title: 'Home' } },
  { path: 'user-agreement', component: TermConditionsComponent, data: { title: 'User Agreement' } },
  { path: 'privacy-policy', component: PrivatePolicyComponent, data: { title: 'Privacy Policy' } }
];



@NgModule({
  declarations: [HomeComponent,TermConditionsComponent,PrivatePolicyComponent ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)    
  ]
})
export class WebsiteFrontModule { }
