/**
 * Created by Phebe on 2016. 6. 15..
 */
'use strict';

angular.module('core').controller('SideMenu2Controller', ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$ionicModal', '$ionicSideMenuDelegate', '$ionicHistory', '$ionicLoading', '$ionicScrollDelegate', '$ionicNavBarDelegate',
  function ($rootScope, $scope, $state, $window, Authentication, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $ionicScrollDelegate, $ionicNavBarDelegate) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // console.log('side menu2');

    $scope.onMenu = function (state, params) {
      $state.go(state, params);
      $ionicSideMenuDelegate.toggleLeft(false);
    };

    /** Get $ionicScrollDelegate **/
    $rootScope.getIonicScrollDelegate = function (handleName) {
      return $ionicScrollDelegate.$getByHandle(handleName);
    };

    /** Change Nav Bar Title **/
    $rootScope.changeNavBarTitle = function (title) {
      $ionicNavBarDelegate.title(title);
    };

    $rootScope.mobileHome = function (then) {
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      if (then) {
        $state.go("mobile.messengers.list", {}, {location: 'replace'})
          .then(then);
      } else {
        $state.go("mobile.messengers.list", {}, {location: 'replace'});
      }
    };

    $rootScope.mobileBack = function () {
      $ionicHistory.goBack();
    };

    $rootScope.mobileState = function (state, params, removeBack, disableBack) {
      $state.go(state, params).then(function () {
        if (removeBack) {
          $ionicHistory.removeBackView();
        }
      });
    };

    $scope.list = function (filter) {

    }

    /** Make Login Modal **/
    $rootScope.signinModal = undefined;
    $ionicModal.fromTemplateUrl('modules/users/client/views/authentication/signin.mobile.view.html', {
        // scope: $scope
    }).then(function (modal) {
        $rootScope.signinModal = modal;
    });
    /** Make EmailConfirm Modal **/
    $rootScope.emailConfirmModal = undefined;
    $ionicModal.fromTemplateUrl('modules/users/client/views/authentication/confirm-email.mobile.view.html', {
        // scope: $scope
    }).then(function (modal) {
        $rootScope.emailConfirmModal = modal;
    });

    $rootScope.showSigninModal = function () {
        // $scope.credentials = {};
        // $scope.onSubmit = false;
        // $scope.policyCheck = false;
        // $scope.privacyCheck = false;
        // $scope.error = null;
        // $ionicModal.fromTemplateUrl('modules/users/client/views/authentication/signin.mobile.view.html', {
        //   scope: $scope
        // }).then(function (modal) {
        //   $rootScope.signinModal = modal;
        //   $rootScope.signinModal.show();
        // });
        if ($rootScope.signinModal) {
            $rootScope.signinModal.show();
        }
    };
    $rootScope.closeSigninModal = function () {
        if ($rootScope.signinModal) {
            $rootScope.signinModal.hide().then(function () {
                // if ($rootScope.signinModal) {
                //   $rootScope.signinModal.remove();
                // }
            });
        }
        $ionicSideMenuDelegate.toggleLeft(false);
    };
    $rootScope.closeEmailConfirmModal = function () {
        if ($rootScope.emailConfirmModal) {
            $rootScope.emailConfirmModal.hide().then(function () {
                // if ($rootScope.signinModal) {
                //   $rootScope.signinModal.remove();
                // }
            });
        }
        $ionicSideMenuDelegate.toggleLeft(false);
    };
    $rootScope.showEmailConfirmModal = function () {
        if ($rootScope.emailConfirmModal) {
            $rootScope.emailConfirmModal.show();
        }
    };

  }
]);
