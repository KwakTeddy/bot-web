'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
  'PasswordValidator', '$state', '$ionicModal', '$ionicPopup', 'Notification',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator, $state, $ionicModal, $ionicPopup, Notification) {
    var vm = this;
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.forgotPasswordForm = {};
    $scope.credentials = {};
    //
    // Notification({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom', delay: 'no' });
    // Notification.primary({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom' , delay: 'no'});
    // Notification.info({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom' , delay: 'no'});
    // Notification.success({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom' , delay: 'no'});
    // Notification.warning({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom' , delay: 'no'});
    // Notification.error({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom' , delay: 'no'});
    // Notification.success({ message: '123', title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!', positionY: 'bottom' , delay: 'no'});
    //
    //


    $scope.itemArray = [
      {id: 1, name: 'first'},
      {id: 2, name: 'second'},
      {id: 3, name: 'third'},
      {id: 4, name: 'fourth'},
      {id: 5, name: 'fifth'}
    ];

    $scope.selectedItem = '';
    $scope.go =function (target) {
      console.log($scope)
    }


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
      if (_platform == 'mobile'){
        $state.go('mobileHome');
      }else {
        $state.go('home');
      }
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
        if (_platform == 'mobile'){
          var alertPopup = $ionicPopup.alert({
              title: '비밀번호 재설정 요청',
              template:'비밀번호 재설정을 위한 메일을 보냈어요<br>' + $scope.credentials.email + '에서 <br>비밀번호 재설정을 위한 절차를 진행해주세요'
          });

          alertPopup.then(function(res) {
              console.log(res);
              $state.go('homeMobile');
          });
        }else {
            // Show user success message and clear form
            $scope.credentials = null;
            $scope.success = response.message;

        }
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
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;
        if (_platform == 'mobile'){
          // An alert dialog
          var alertPopup = $ionicPopup.alert({
              title: '비밀번호 재설정 성공',
              template: '성공적으로 비밀번호를 재설정했어요'
          });

          alertPopup.then(function(res) {
            console.log(res);
            $state.go('homeMobile');
          });
        }else {
          // And redirect to the index page
          var stingParser = $state.current.name;
          var parsedString = stingParser.split('.');
          if (parsedString[0] == 'user-bots-web'){
              $state.go('user-bots-web.password.reset.success');
          } else {
              $state.go('password.reset.success');
          }
        }
      }).error(function (response) {
        console.log(response);
        $scope.error = response.message;
      });
    };
  }
]);
