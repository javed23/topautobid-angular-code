export const environment = {
  production: true,
  API_ENDPOINT: 'http://54.245.128.14:3000',
  //WEB_ENDPOINT: 'http://localhost:4200',
  WEB_ENDPOINT: 'http://54.245.128.14',
 
  APP_NAME: 'TopAutoBid',
  DEFAULT_PROFILE: 'assets/images/default-user.png',
  DEFAULT_COUNTRY_CODE: '+1',
  DEFAULT_RECORDS_LIMIT: 10,
  DEFAULT_PAGE_LIMIT_OPTIONS: [  
    { value:5   },
    { value:10  },
    { value:25  },
    { value:50  },
    { value:100  },
  ],
  //aws 
  AWS: {
    ACCESS_KEY: 'AKIAJFK6YJMR4P23VEDA',
    SECRET_KEY: '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',
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
    FETCHING_RECORDS: 'Fetching Data...',
    RECORD_DELETED: 'Record has been deleted successfully.',
    DEALERSHIP_ADDED: 'Dealership has been added successfully.',
    DELETING_RECORD: 'Deleting Record...',//new
  }
};