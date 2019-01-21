// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://18.233.76.36:3000',
  APP_NAME: 'TopAutoBid',

  //aws 
  AWS: {
    BUCEKT: {
      NAME: 'topautobiddev',
      ACCESS_KEY: 'AKIAIXSULK6NXU6H73JA',
      SECRET_KEY: '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',
      REGION: 'us-east-1'
    }
  },
  //social logins
  SOCIAL_LOGINS: {
    GOOGLE: {
      GOOGLE_0AUTH_CLIENT_ID: '',
    },
    FACEBOOK: {
      FACEBOOK_APP_ID: '276034269759175',
    },
    MICROSOFT: {
      tenant: 'careportfol.io',
      clientId: '14c39115-7cae-4c02-b865-20d7b2d205f8',
      endpoints: {
        'https://graph.microsoft.com': '00000003-0000-0000-c000-000000000000'
      }
    }
  },


  //manage web-product success/error messages 
  MESSAGES: {
    SIGNUP_SUCCESS:'Registered successfully. Please do login',
    SUCCESS_ADD: 'Has been added successfully.',
    SUCCESS_EDIT: 'Has been updated successfully.',
    SUCCESS_DELETE: 'has been deleted successfully',
    LOGIN_FAILURE: 'Email/password do not match.',
    EMAIL_EXIST: 'Email already exist in our system.',
    EMAIL_NOT_EXIST: 'Email does not exist.',
    ERROR_TEXT_LOADER: 'Oops got error...',
    UPLOAD_SUCCESS: 'Has been uploaded successfully.',
    UPLOAD_ERROR: 'oops we got some error in upload.',
    MAIL_SENT: 'Mail has been sent. Please check your inbox.',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
