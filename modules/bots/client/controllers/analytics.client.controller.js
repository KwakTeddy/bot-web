'use strict';

// UserBots controller
angular.module('user-bots').controller('AnalyticsController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource',
  'Authentication',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userId = $rootScope.userId;

    vm.type = '';
    if($state.is('user-bots-web.create')) {vm.state = 'create'; vm.type = 'edit';}
    else if($state.is('user-bots-web.edit')) {vm.state = 'edit'; vm.type = 'edit';}
    else if($state.is('user-bots-web.view')) {vm.state = 'view'; vm.type = 'view';}

    vm.changeType = function(type) {
      vm.type= type;
    };

    var timer = null;
    $scope.$on('keyinput', function(event, arg0) {
      if(timer == null) {
        timer = setTimeout(function() {
          var input = arg0;

          $resource('/api/user-bots-analytics/context', {}).get({input: input, dialogsets: $rootScope.userBot.dialogsets}, function (res) {
            vm.dialogs = res.result;
            if (res.result && res.result.length > 0) vm.best = res.result[0];
            else vm.best = undefined;

            // console.log(JSON.stringify(res.result));
            timer = null;
          })
        }, 300);
      }
    });
  }
]);

