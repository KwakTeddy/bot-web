/**
 * Created by Phebe on 2016. 6. 15..
 */
'use strict';

angular.module('core').controller('SideMenuController', ['$rootScope', '$scope', '$state', '$window', 'Authentication', '$ionicModal', '$ionicSideMenuDelegate', '$ionicHistory', '$ionicLoading', '$ionicScrollDelegate', '$ionicNavBarDelegate',
  function ($rootScope, $scope, $state, $window, Authentication, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $ionicScrollDelegate, $ionicNavBarDelegate) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    console.log('side-menu 0 ');

    $scope.onMenu = function (state, params) {
      // $ionicHistory.clearHistory();
      // $ionicHistory.nextViewOptions({
      //   disableBack: true,
      //   historyRoot: true
      // });

      console.log('onMenu from : ' + $ionicHistory.currentStateName() + ' to : ' + state);
      var backView = $ionicHistory.backView();
      var backTitle = $ionicHistory.backTitle();
      var history = $ionicHistory.viewHistory();

      $state.go(state, params);
      $ionicSideMenuDelegate.toggleLeft(false);
      //
      // if($ionicHistory.currentStateName() == 'mobile.companies.list') {
      //   $state.go(state, params);
      // } else {
      //   $rootScope.mobileHome(function () {
      //     $state.go(state, params);
      //   });
      // }
    };

    $scope.logout = function () {
      $window.location.href = '/api/auth/signout';
    };

    /** Loading **/
    $rootScope.lockScreen = function (show, callback) {
      if (show) {
        if (callback) {
          $ionicLoading.show({
            noBackdrop: true,
            duration: 10000
          }).then(callback);
        } else {
          $ionicLoading.show({
            noBackdrop: true,
            duration: 10000
          });
        }
      } else {
        if (callback) {
          $ionicLoading.hide().then(callback);
        } else {
          $ionicLoading.hide();
        }
      }
    };

    /** Get $ionicScrollDelegate **/
    $rootScope.getIonicScrollDelegate = function (handleName) {
      return $ionicScrollDelegate.$getByHandle(handleName);
    };

    /** Change Nav Bar Title **/
    $rootScope.changeNavBarTitle = function (title) {
      // console.log('changeNavBarTitle: ' + title);
      $ionicNavBarDelegate.title(title);
      // console.log('changeNavBarTitle: ' + title);
    };

    /** Make Login Modal **/
    $rootScope.signinModal = undefined;
    $ionicModal.fromTemplateUrl('modules/users/client/views/authentication/signin.mobile.view.html', {
      // scope: $scope
    }).then(function (modal) {
      $rootScope.signinModal = modal;
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
      // $ionicHistory.nextViewOptions({
      //   disableBack: disableBack ? true : false,
      //   historyRoot: disableBack ? true : false
      // });
      // $state.go(state, params, disableBack ? {location: 'replace'} : null).then(function () {
      //   if (removeBack) {
      //     $ionicHistory.removeBackView();
      //     // $ionicConfigProvider.backButton.text($ionicHistory.backTitle());
      //   }
      // });

      $state.go(state, params).then(function () {
        if (removeBack) {
          $ionicHistory.removeBackView();
          // $ionicConfigProvider.backButton.text($ionicHistory.backTitle());
        }
      });
    };
  }
]);
