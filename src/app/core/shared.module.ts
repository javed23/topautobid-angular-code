import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { FormValidationErrorsComponent } from './components/form-validation-errors/form-validation-errors.component';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,  
        ToastrModule.forRoot()     
    ],
    declarations: [
        BreadcrumbsComponent,
        FormValidationErrorsComponent,
    ],
    exports: [
        BreadcrumbsComponent,
        FormValidationErrorsComponent
    ]
})
export class SharedModule { }