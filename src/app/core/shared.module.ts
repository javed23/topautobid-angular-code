import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RatingReviewComponent } from './components/rating-review/rating-review.component';
import { FormValidationErrorsComponent } from './components/form-validation-errors/form-validation-errors.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,  
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()     
    ],
    declarations: [
        BreadcrumbsComponent,
        RatingReviewComponent,
        FormValidationErrorsComponent,
    ],
    exports: [
        BreadcrumbsComponent,
        RatingReviewComponent,
        FormValidationErrorsComponent
    ]
})
export class SharedModule { }