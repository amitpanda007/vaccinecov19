// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyCuR2XWDoo0pm3xmKLedqqpmQk_HYHKSj8",
    authDomain: "cov19vaccine.firebaseapp.com",
    projectId: "cov19vaccine",
    storageBucket: "cov19vaccine.appspot.com",
    messagingSenderId: "288201500902",
    appId: "1:288201500902:web:599462de7289c3a338f327",
    measurementId: "G-6NSYH6W53L"
  },
  cowinApiUrl: "https://cdn-api.co-vin.in/api/v2/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
