/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

angular.module('core').controller('AlertController', ['$scope', '$stateParams', '$uibModalInstance', 'resolve',
  function ($scope, $stateParams, $uibModalInstance, resolve) {
    // if($stateParams) {
    //   if($stateParams.message) {
    //     $scope.message = $stateParams.message;
    //   }
    //   if($stateParams.yesText) {
    //     $scope.yesText = $stateParams.yesText;
    //   } else {
    //     $scope.yesText = "확인";
    //   }
    //   if($stateParams.noText) {
    //     $scope.noText = $stateParams.noText;
    //   } else {
    //     $scope.noText = undefined;
    //   }
    // }
    if(resolve.message) {
      $scope.message = resolve.message;
    }
    if(resolve.yesText) {
      $scope.yesText = resolve.yesText;
    } else {
      $scope.yesText = "확인";
    }
    if(resolve.noText) {
      $scope.noText = resolve.noText;
    } else {
      $scope.noText = undefined;
    }

    $scope.yes = function () {
      $uibModalInstance.close();
      if(resolve.callback) {
        resolve.callback();
      }
      // if(callback) {
      //   $scope.close({callback: $stateParams.callback, noReload: true, skip: $stateParams.skip ? $stateParams.skip : false});
      // } else {
      //   $scope.close();
      // }
    };
    $scope.no = function () {
      $uibModalInstance.close();
    }
  }
]);
