'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$uibModal',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $uibModal) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    //routing
    var stingParser = $state.current.name;
    var parsedString = stingParser.split('.');
    // if (parsedString[0] == 'user-bots-web') {
    //   $scope.passwordForgot = 'user-bots-web.password.forgot';
    //   $scope.authenticationSignup = 'user-bots-web.authentication.signup';
    //   $scope.authenticationSignin = 'user-bots-web.authentication.signin';
    //
    // } else {
      $scope.passwordForgot = 'password.forgot';
      $scope.authenticationSignup = 'authentication.signup';
      $scope.authenticationSignin = 'authentication.signin';
    // }

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
          $state.go('home');
    }

    $scope.signup = function (isValid) {
      if ($scope.authentication.user) {
          $state.go('home');
      }
      $scope.error = {};
      $scope.submitted = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        console.log(response);
        var modalInstance = $uibModal.open({
            templateUrl: 'modules/users/client/views/authentication/email.confirm.modal.html',
            scope: $scope
        });
        $scope.close = function () {
            modalInstance.dismiss();
            $state.go('home');
        };
        modalInstance.result.then(function (response) {
            console.log(response);
        });

      }).error(function (response) {
        console.log(response);
        if(response.message.match('E-mail')){
            $scope.error.email = response.message;
        } else if(response.message.match('SNS')) {
            $scope.error.email = response.message;
        } else if(response.message.match('Failure sending email')) {
          $scope.error.email = 'E-mail 보내기에 실패했어요. 관리자에게 문의해주세요.'
        }
      });
    };

    var stingParser = $state.current.name;
    var parsedString = stingParser.split('.');

    $scope.privacy = function () {
      var modalInstance = $uibModal.open({
          templateUrl: 'modules/users/client/views/authentication/signup.client.privacy.view.html',
          scope: $scope
      });
      modalInstance.result.then(function (response) {
          console.log(response);
      });
      $scope.close = function () {
        modalInstance.dismiss();
      }
    };

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
        console.log(url);
      $window.location.href = url;
    };
  }
]);
