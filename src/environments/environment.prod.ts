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
    SUCCESS_ADD: 'has been added successfully',
    SUCCESS_EDIT: 'has been edit successfully',
    SUCCESS_DELETE: 'has been deleted successfully',
    LOGIN_FAILURE: 'Email/password do not match.',
    EMAIL_EXIST: 'Email already exist in our system',
    EMAIL_NOT_EXIST: 'Email do not exist',
    ERROR_TEXT_LOADER: 'Oops got error...',
    UPLOAD_SUCCESS: 'Has been uploaded successfully.',
    UPLOAD_ERROR: 'oops we got some error in upload.',
  }
};