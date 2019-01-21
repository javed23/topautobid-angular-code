import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-form-validation-errors',
  templateUrl: './form-validation-errors.component.html',
  styleUrls: ['./form-validation-errors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormValidationErrorsComponent implements OnInit {

  @Input() errorPrefix: string;
  @Input() errors: ValidationErrors;

  constructor() { }

  ngOnInit() { }

}
