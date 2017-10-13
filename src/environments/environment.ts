// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  server_url: 'http://localhost:8000',
  client_id: '2',
  client_secret: '1wy9IpFmpdg2BmEdO8pAnzzn7aqfE1yGXlD9g7Wb',
  firebase: {
    apiKey: "AIzaSyBXYJ_rvffh3LLkPTIZICRN1KzDCKQHt_8",
    authDomain: "push-notifications-b6d66.firebaseapp.com",
    databaseURL: "https://push-notifications-b6d66.firebaseio.com",
    projectId: "push-notifications-b6d66",
    storageBucket: "push-notifications-b6d66.appspot.com",
    messagingSenderId: "937071649742"
  }
};
