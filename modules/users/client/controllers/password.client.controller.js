'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator', '$state',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, $state) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //routing
    var stingParser = $state.current.name;
    var parsedString = stingParser.split('.');
    if (parsedString[0] == 'user-bots-web') {
        $scope.transition = 'home';
        $scope.passwordForgot = 'user-bots-web.password.forgot';

    } else {
        $scope.passwordForgot = 'password.forgot';
    }

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
            $state.go('home');
    }


      // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;
      $scope.submitted = true;
      console.log($scope.forgotPasswordForm);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }
      var stingParser = $state.current.name;
      var parsedString = stingParser.split('.');
      $scope.credentials['from'] = parsedString[0];
      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;
      $scope.submitted = true;
        if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        var stingParser = $state.current.name;
        var parsedString = stingParser.split('.');
        if (parsedString[0] == 'user-bots-web'){
          $state.go('user-bots-web.password.reset.success');
        } else {
          $state.go('password.reset.success')
        }
      }).error(function (response) {
        console.log(response);
        $scope.error = response.message;
      });
    };
  }
]);
