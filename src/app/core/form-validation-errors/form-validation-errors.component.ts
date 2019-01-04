import { Component, OnInit, Input,ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-validation-errors',
  templateUrl: './form-validation-errors.component.html',
  styleUrls: ['./form-validation-errors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormValidationErrorsComponent implements OnInit {
  @Input() errorPrefix: string;
  @Input() errors: ValidationErrors;
  
  constructor(private translate: TranslateService) { 
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
 
    // the lang to use, if the lang isn't available, it will use the current loader to get them
   this.translate.use('en');
  }

  ngOnInit() {
  }

}
