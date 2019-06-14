// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://54.245.128.14:3000',
  //API_ENDPOINT: 'http://localhost:3000',
  WEB_ENDPOINT: 'http://localhost:4200',
  //WEB_ENDPOINT: 'http://54.245.128.14',
  ADDRESS_API: {
    ENDPOINT: 'https://us-zipcode.api.smartystreets.com',
    KEY: '17135396007595614',
    TOKEN: '8tPPY9pdSJuGSksk4aYQ',
  },
  VEHICLE_STATS_API: {
    ENDPOINT: 'https://www.carqueryapi.com/api/0.3',
  },

  FILE_UPLOAD_API: "http://54.245.128.14:3000/api/common/imageUploadtoBucket",
  APP_NAME: 'CarsGoat',
  DEFAULT_PROFILE: 'assets/images/default-user.png',
  DEFAULT_COUNTRY_CODE: '+1',
  DEFAULT_RECORDS_LIMIT: 6,
  DEFAULT_PAGES_PAGINATION: 5, //Defines the maximum number of page links to display
  DEFAULT_PAGE_LIMIT_OPTIONS: [
    { value: 6 },
    { value: 12 },
    { value: 24 },
    { value: 48 },
    { value: 96 },
  ],

  //rating & review settings 
  MAX_RATE_STARS: 5,

  //aws 
  AWS: {
    ACCESS_KEY: '',
    SECRET_KEY: '',
    REGION: 'us-west-2',
    BUCEKT_NAME: 'topautobid-dev',
    COGNITO: {
      UserPoolId: 'us-west-2_psnR8GZRX',
      ClientId: '7c90u8uf8ulr5pu8m2blkgp5m'
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
    LOGIN_SUCCESS: 'Authorised & Loggedin successfully.',
    LOGOUT_SUCCESS: 'Logout successfully.',
    FORGOT_PASSWORD_SUCCESS: 'Forget password instruction has been sent to your email',
    RESEND_VERIFICATION_SUCCESS: 'The verification link has been resent to your email successfully. Please Check your email.',
    VERIFICATION_PENDING: 'Verification Code has been sent to your mobile number. Please verify your account.',
    SIGNUP_SUCCESS: 'Congratulations!! Your account has been verified successfully and is ready to use.',
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
    SYSTEM_ERROR: 'System got failure for some unknown reason. Please try again later.',
    CHECKING_INFO_LOADER_TEXT: 'Checking info, Please wait...',
    PLS_WAIT_TEXT: 'Please wait...',
    VERIFICATION_FORGOT_PASSWORD: 'Verification Code has been sent to your registered mobile number. Please verify your account.',
    PASSWORD_RESET_SUCCESS: 'Your password has been updated successfully.',
    FETCHING_RECORDS: 'Fetching Data...',
    RECORD_DELETED: 'Record has been deleted successfully.',
    DEALERSHIP_ADDED: 'Dealership has been added successfully.',
    DEALERSHIP_UPDATED: 'Dealership has been updated successfully.',
    DELETING_RECORD: 'Deleting Record...',//new
    CONTACT_ADDED: 'Legal Contact has been added successfully.',
    NO_RECORDS_FOUND: 'No Records Found.',
    CONTACT_REQUEST_SEND: 'Thanks! Email has been send successfully and our support team will contact you soon.',
    PROFILE_UPDATE: 'Profile has been updated successfully.',
    ATLEAST_ONE_DEALERSHIP: 'Please add atleast one dealership.',
    ATLEAST_ONE_CONTACT: 'Please add atleast one legal contact',
    SELECT_PRIMARY: 'Please select primary contact.',
    MAXIMUM_PRIMARY_CONTACT: 'Primary contact can not be more than one.',
    CAR_STATUS_CHANGED: 'Status has been changed successfully.'
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
