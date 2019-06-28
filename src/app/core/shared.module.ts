import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LoadingComponent} from './_loaders/common.loader';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RatingReviewComponent } from './components/rating-review/rating-review.component';
import { FormValidationErrorsComponent } from './components/form-validation-errors/form-validation-errors.component';
import { RoundPipe } from './_pipes/round.pipe';


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
        LoadingComponent,
        FormValidationErrorsComponent,
        RoundPipe,
    ],
    exports: [
        BreadcrumbsComponent,
        RatingReviewComponent,
        FormValidationErrorsComponent,
        RoundPipe,
        LoadingComponent
    ]
})
export class SharedModule { }