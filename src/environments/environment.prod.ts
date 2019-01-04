export const environment = {
  production: true,  
  APIEndpoint:'http://18.233.76.36:3000',
  GOOGLE_0AUTH_CLIENT_ID:'',
  FACEBOOK_APP_ID:'276034269759175',
  //microsoft authentication credentials
  config: {
    tenant: 'careportfol.io',
    clientId: '14c39115-7cae-4c02-b865-20d7b2d205f8',
    endpoints: {
      'https://graph.microsoft.com': '00000003-0000-0000-c000-000000000000'
    }
  },
  //manage web-product success/error messages 
  messages:{
    SUCCESS_ADD:'has been added successfully',
    SUCCESS_EDIT:'has been edit successfully',
    SUCCESS_DELETE:'has been deleted successfully',
    LOGIN_FAILURE:'Email/password do not match.',
    EMAIL_EXIST:'Email already exist in our system',
    EMAIL_NOT_EXIST:'Email do not exist',
  }
};
