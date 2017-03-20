'use strict';

// UserBots controller
angular.module('user-bots').controller('AnalyticsController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource',
  'Authentication',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userId = $rootScope.userId;
    vm.context = {botUser: {}};

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

          // if(event.keyCode == 13) {    // enter
          //   vm.context.botUser.analytics = null;
          // } else {
          //   vm.context.botUser.analytics = true;
          // }

          $resource('/api/user-bots-analytics/context', {}).get({input: input, botId: $rootScope.botId, botUser: $rootScope.botId + '_' + $rootScope.userId, dialogsets: $rootScope.userBot.dialogsets}, function (res) {
            if(Array.isArray(res.result)) vm.dialogs = res.result;
            else vm.dialogs = [res.result];

            // console.log(JSON.stringify(vm.dialogs, null, 2));
            vm.context = res.context;

            vm.topic = '';
            if(vm.context.botUser && vm.context.botUser.topic != undefined) {
              for(var i = 0; i < vm.context.botUser.topic.length; i++) {
                vm.topic += vm.context.botUser.topic[i].text + ' ';
              }
            }

            vm.nlp = '';
            if(vm.context.botUser && vm.context.botUser.nlp != undefined) {
              for(var i = 0; i < vm.context.botUser.nlp.length; i++) {
                vm.nlp += vm.context.botUser.nlp[i].text + ' ';
              }
            }

            if(res.result) {
              if(Array.isArray(res.result)) vm.best = res.result[0];
              else vm.best = res.result;
            } else vm.best = undefined;

            // console.log(JSON.stringify(res.result));
            timer = null;
          })
        }, 300);
      }
    });
  }
]);

