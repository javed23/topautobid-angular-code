import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FormValidationErrorsComponent } from './form-validation-errors/form-validation-errors.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
          })
     ],
    declarations: [
        BreadcrumbsComponent,
        FormValidationErrorsComponent
    ],
    exports: [
        BreadcrumbsComponent,
        FormValidationErrorsComponent
    ]
})
export class SharedModule {}