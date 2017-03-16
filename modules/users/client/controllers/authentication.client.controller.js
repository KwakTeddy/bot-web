'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    //routing
    var stingParser = $state.current.name;
    var parsedString = stingParser.split('.');
    if (parsedString[0] == 'user-bots-web') {
      $scope.passwordForgot = 'user-bots-web.password.forgot';
      $scope.authenticationSignup = 'user-bots-web.authentication.signup';
      $scope.authenticationSignin = 'user-bots-web.authentication.signin';

    } else {
      $scope.passwordForgot = 'password.forgot';
      $scope.authenticationSignup = 'authentication.signup';
      $scope.authenticationSignin = 'authentication.signin';
    }

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      if (parsedString[0] == 'user-bots-web') {
          $state.go('user-bots-home');
      } else {
          $state.go('home')
      }
    }

    $scope.signup = function (isValid) {
      $scope.error = {};
      $scope.submitted = true;
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        console.log(response);
        if(response.message.match('email')){
            $scope.error.email = 'email already exist';
        } else if(response.message.match('username')) {
            $scope.error.username = 'username already exist';
        }
      });
    };

    // userbot 로그인시 테두리 없애기
    var userbotHeader =  document.getElementById('mainHeader');
    var userbotChat =  document.getElementById('container-chat');
    var stingParser = $state.current.name;
    var parsedString = stingParser.split('.');

    if(userbotHeader && userbotChat) {
      document.getElementById('mainHeader').style.display = 'none';
      document.getElementById('container-chat').style.display = 'none';
    }

    $scope.signin = function (isValid) {
      $scope.error = null;
      $scope.submitted = true;

        if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        if($state.previous && $state.previous.href && !$state.previous.href.lastIndexOf('/userbot')) {
          userbotHeader.style.display = 'block';
          userbotChat.style.display = 'block';
        }

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
