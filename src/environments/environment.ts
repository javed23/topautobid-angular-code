// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://18.233.76.36:3000',
  //WEB_ENDPOINT: 'http://localhost:4200',
  WEB_ENDPOINT: 'http://18.233.76.36',
 
  APP_NAME: 'TopAutoBid',
  DEFAULT_PROFILE: 'assets/images/default-user.png',
  DEFAULT_COUNTRY_CODE: '+1',

  //aws 
  AWS: {
    ACCESS_KEY: 'AKIAIXSULK6NXU6H73JA',
    SECRET_KEY: '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',
    REGION: 'us-east-1',
    BUCEKT_NAME: 'topautobiddev',
    COGNITO: {
      UserPoolId: 'us-east-1_0uo9SF8UF',
      ClientId: '4bailkhup83i2e1ppvm98p045v'      
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
    LOGIN_SUCCESS:'Authorised & Loggedin successfully.',
    LOGOUT_SUCCESS:'Logout successfully.',
    VERIFICATION_PENDING:'Verification Code has been sent to your mobile number. Please verify your account.',
    SIGNUP_SUCCESS:'Congratulations!! Your account has been verified successfully and is ready to use.',
    SUCCESS_ADD: 'Has been added successfully.',
    SUCCESS_EDIT: 'Has been updated successfully.',
    SUCCESS_DELETE: 'has been deleted successfully',
    LOGIN_FAILURE: 'Email/password do not match.',
    EMAIL_EXIST: 'Email Already exist! Please try another one.',
    EMAIL_NOT_EXIST: 'Email does not exist.',
    ERROR_TEXT_LOADER: 'Oops got error...',
    UPLOAD_SUCCESS: 'Has been uploaded successfully.',
    UPLOAD_ERROR: 'We got some error in upload.',
    MAIL_SENT: 'Mail has been sent. Please check your inbox.',
    OTP_RESEND: 'Verification Code has been sent to your mobile number.',
    OTP_FAILED_RESEND: 'Failed to send Verification Code to your mobile number. Please try again later.',
    GENERATING_OTP: 'Generating Verification Code...',
    FAILED_TO_REGISTER: 'Registration failed for some unknown reason. Please try again later.',
    SAVING_INFO_LOADER_TEXT: 'Saving info, Please wait...',
    SUCCESS_REGISTER: 'Thank You for Registering!',
    SYSTEM_ERROR:'System got failure for some unknown reason. Please try again later.',
    CHECKING_INFO_LOADER_TEXT: 'Checking info, Please wait...',
    PLS_WAIT_TEXT: 'Please wait...',
    VERIFICATION_FORGOT_PASSWORD:'Verification Code has been sent to your registered mobile number. Please verify your account.',
    PASSWORD_RESET_SUCCESS:'Your password has been updated successfully.',
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
