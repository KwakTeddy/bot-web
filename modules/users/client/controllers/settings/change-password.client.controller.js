'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator', '$ionicModal', '$ionicPopup', '$state',
  function ($scope, $http, Authentication, PasswordValidator, $ionicModal, $ionicPopup, $state) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.passwordDetails = {};

      // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;
      $scope.submitted = true;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }
      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
          console.log(response);
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        if(_platform == 'mobile'){
          var alertPopup = $ionicPopup.alert({
            title: '비밀번호 변경',
            template: '비밀번호가 성공적으로 변경되었어요'
          });
          alertPopup.then(function(res) {
            console.log(res);
            $scope.passwordDetails = {};
            $state.go('homeMobile');
          });
        }else if(confirm('비밀번호가 성공적으로 변경되었습니다')){
          $state.go('home')
        }
      }).error(function (response) {
          console.log(response);
        $scope.error = response.message;
      });
    };
  }
]);
