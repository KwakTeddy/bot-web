'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
  .config(['$locationProvider', '$httpProvider',
    function ($locationProvider, $httpProvider) {
      if (_platform == "web")
        $locationProvider.html5Mode(true).hashPrefix('!');

      $httpProvider.interceptors.push('authInterceptor');

      $httpProvider.defaults.cache = false;
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }
      // disable IE ajax request caching
      $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
      $httpProvider.defaults.headers.get['Cache-Control'] = 'max-age=0';
      $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }
  ]);

if (_platform == 'mobile') {
  angular.module(ApplicationConfiguration.applicationModuleName)
    .config(['$ionicConfigProvider',
      function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('뒤로');
      }]);
}

if (_platform == "mobile") {
  angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, Authentication, $ionicPlatform, $ionicLoading, $ionicHistory) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      var allowed = true;
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        allowed = false;
        toState.data.roles.forEach(function (role) {
          if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
            allowed = true;
          }
        });
      }
      if (allowed && toState.name != 'mobile.companies.view'
        && toState.name != 'mobile.companies.list') {
        // $ionicLoading.show({
        //   // template: 'Loading...'
        //   noBackdrop: true
        // });
      }
    });
    $rootScope.$on('$stateChangeSuccess', function () {

        // $ionicLoading.hide();
    });

    appRun($rootScope, $state, Authentication);

    $ionicPlatform.ready(function () {
      if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
        _os = 'ios';
      } else if (ionic.Platform.isAndroid()) {
        _os = 'android';
      } else {
        _os = 'web';
      }

      console.log('Platform Ready : ' + _platform + '(' + _os + ')');
      // $ionicPlatform.onHardwareBackButton(function () {
      //   console.log('onadfadfasfsdf');
      // });
      // $ionicPlatform.registerBackButtonAction(function (event) {
      //   console.log('onHardwareBack');
      //   console.log('backView :' + $ionicHistory.backView());
      //   if ($ionicHistory.backView()) {
      //     $ionicHistory.goBack();
      //   } else {
      //     if ($ionicHistory.currentStateName() == 'mobile.companies.list') {
      //       ionic.Platform.exitApp();
      //     } else {
      //       $ionicHistory.clearHistory();
      //       $ionicHistory.nextViewOptions({
      //         disableBack: true,
      //         historyRoot: true
      //       });
      //       $state.go("mobile.companies.list", {}, {location: 'replace'});
      //     }
      //   }
      // }, 1000);
      // $ionicPlatform.registerBackButtonAction(function (event) {
      //   console.log('onHardwareBack 0');
      // }, 0);
      // $ionicPlatform.registerBackButtonAction(function (event) {
      //   console.log('onHardwareBack 501');
      // }, 501);
      // console.log('Backbutton');

      // PUSH SETTING
      if (_os == 'ios' || _os == 'android') {
        if (typeof PushNotification === 'defined') {
          var push = PushNotification.init({
            android: {
              senderID: "930230456352"
            },
            ios: {
              alert: "true",
              badge: "true",
              sound: "true"
            },
            windows: {}
          });

          push.on('registration', function (data) {
            console.log('PUSH registered : ' + data.registrationId);

          });

          push.on('notification', function (data) {
            console.log('PUSH : ' + data.message);
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
          });

          push.on('error', function (e) {
            console.log('PUSH error : ' + e.message);
            // e.message
          });
        }
      }


      // Ionic.io();
      // var push = new Ionic.Push({
      //   "debug": true
      // });
      //
      // push.register(function(token) {
      //   console.log("Device token:",token.token);
      //   push.saveToken(token);  // persist the token in the Ionic Platform
      // });
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // if (window.cordova && window.cordova.plugins.Keyboard) {
      //   console.log('cordova Keyboard Setting');
      //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //   cordova.plugins.Keyboard.disableScroll(true);
      //
      // }
      // if (window.StatusBar) {
      //   // org.apache.cordova.statusbar required
      //   StatusBar.styleDefault();
      // }
    });

  });


} else {
  angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, Authentication, BotsService, $cookies) {
    appRun($rootScope, $state, Authentication, BotsService, $cookies);
  });
}


function appRun($rootScope, $state, Authentication, BotsService, $cookies) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // if (($cookies.get("login")) && (toState.name == "authentication.signin" || toState.name == "authentication.signup" || toState.name == "authentication.signin" || toState.name == "password.forgot")){
    //   return $state.go('developer-home');
    // }

    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {

      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1 && $cookies.get('login')) {
          allowed = true;
          return true;
        }
      });

      if (toState.name === "user-bots-web.view" || toState.name === "user-bots-web.graph") {
        allowed = true;
        return true;
      }

      if (!allowed) {
        event.preventDefault();
        var stingParser = $state.current.name;
        var parsedString = stingParser.split('.');

        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          if(!$cookies.get('login')) window.location.reload();

          if (parsedString[0] == 'user-bots-web') {
            $state.go('user-bots-web.forbidden');
          } else {
            $state.go('forbidden');
          }
        } else {
          if(window.location.href.indexOf('developer') == -1){
            $state.go('user-bots-web.authentication.signin').then(function () {
              storePreviousState(toState, toParams);
            });
          }else {
            $state.go('authentication.signin').then(function () {
              storePreviousState(toState, toParams);
            });
          }
        }
      }
    }

    if(toState.name.indexOf('authentication') != -1 || toState.name.indexOf('password') != -1) { // when login or password change, chat UI display none
      var userbotHeader = document.getElementById('mainHeader');
      var userbotChat = document.getElementById('container-chat');
      if (userbotHeader && userbotChat) {
        document.getElementById('mainHeader').style.display = 'none';
        document.getElementById('container-chat').style.display = 'none';
      }
    } else if (toState.name === 'user-bots-web.create' || toState.name === 'user-bots-web.edit' || toState.name === 'user-bots-web.view' ||
    toState.name === 'user-bots-web.graph') {
      var userbotHeader = document.getElementById('mainHeader');
      var userbotChat = document.getElementById('container-chat');
      if (userbotHeader) {
        userbotHeader.style.backgroundPosition = 'bottom';
        userbotHeader.getElementsByClassName('intro-text')[0].style.paddingBottom = 0 +'px';
        userbotHeader.getElementsByClassName('intro-text-wrapper')[0].style.display = 'none';
      }
      if (fromState.name.indexOf('authentication') != -1) {
        if (userbotHeader)
          userbotHeader.style.display = 'block';
        if (userbotChat)
          userbotChat.style.display = 'block';
      }
    } else {
      var userbotHeader =  document.getElementById('mainHeader');
      var userbotChat =  document.getElementById('container-chat');
      if(userbotHeader && userbotChat) {
          userbotHeader.style.display = 'block';
          userbotHeader.style.backgroundPosition = 'center';
          userbotHeader.getElementsByClassName('intro-text')[0].style.paddingBottom = 70 +'px';
          userbotHeader.getElementsByClassName('intro-text-wrapper')[0].style.display = 'block';
          document.getElementById('container-chat').style.display = 'block';
      }
    }

  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {

    // only store this state if it shouldn't be ignored
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
};


//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      if (_platform == 'mobile') {
        window.history.pushState('', document.title, window.location.pathname + '?_p=m');
      } else {
        window.history.pushState('', document.title, window.location.pathname);
      }
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
