'use strict';

// UserBots controller
angular.module('user-bots').controller('AnalyticsController', ['$scope', '$rootScope', '$state', '$window','$timeout', '$stateParams', '$resource',
  'Authentication',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userId = $rootScope.userId;

    // if(vm.userBot && vm.userBot._id)
    //   $rootScope.$broadcast('setUserBot', vm.userBot);

    vm.type = '';
    if($state.is('user-bots-web.create')) {vm.state = 'create'; vm.type = 'edit';}
    else if($state.is('user-bots-web.edit')) {vm.state = 'edit'; vm.type = 'edit';}
    else if($state.is('user-bots-web.view')) {vm.state = 'view'; vm.type = 'view';}

    vm.changeType = function(type) {
      vm.type= type;
    };


    // $scope.$on('keyinput', function(event, arg0) {
    //   var input = arg0;
    //   $resource('/api/user-bots-analytics/context', {}).get({input: input}, function(res) {
    //     vm.dialogs = res.result;
    //     if(res.result.length > 0) vm.best = res.result[0];
    //     else vm.best = undefined;
    //
    //     console.log(res.result);
    //   })
    // });

    // var nodes = [];
    // nodes['나이'] = {name: '나이', isMain: true, isHighlighted: true};
    // nodes['20살'] = {name: '20살', isMain: false, isHighlighted: true};
    // nodes['취미'] = {name: '취미', isMain: false, isHighlighted: false};
    // nodes['농구'] = {name: '농구', isMain: false, isHighlighted: false};
    //
    // var links = [
    //   {source: nodes['나이'], target: nodes['20살'], type:'child', kind:'이다'},
    //   {source: nodes['취미'], target: nodes['농구'], type:'child', kind:'이다'},
    // ];

    var nodes = {};
    var links = [];

    var addLink = function(r) {
      if(nodes[r.node1] == undefined) nodes[r.node1] = {name: r.node1, isMain: false, isHighlighted: false};
      if(nodes[r.node2] == undefined) nodes[r.node2] = {name: r.node2, isMain: false, isHighlighted: false};

      links.push({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link});

      console.log(JSON.stringify({source: nodes[r.node1], target: nodes[r.node2], type:'child', kind: r.link}));
    };

    $resource('/api/factLinks/find/:factUserID', {}).query({factUserID: vm.userId}, function(res) {
      for(var i = 0; i < res.length; i++) {
        addLink(res[i]);
      }
    });

    $scope.$on('updateLog', function(event, arg0) {
      var index = $rootScope.logUpdated.indexOf('[FACT_ADD]');

      if(index != -1) {
        var json = $rootScope.logUpdated.substring('[FACT_ADD]'.length);

        try {
          addLink(JSON.parse(json));
        } catch(e) {
          console.log(e);
        }
      }
    });

    $scope.$on('keyinput', function(event, arg0) {
      var input = arg0;
      $resource('/api/user-bots-analytics/context', {}).get({input: input}, function(res) {
        vm.best;
        if(res.result && res.result.length > 0) vm.best = res.result[0];
        else vm.best = undefined;

        // console.log(res.result);
        if(vm.best != undefined) {
          var highLightedNodes = vm.best.split(' ');
          // 이 노드 값들을 반짝이게 함
        }
      })
    });

    $scope.$on('onmsg', function(event, arg0) {
      var input = arg0.message;
      $resource('/api/user-bots-analytics/nlp', {}).get({input: input}, function(res) {
        if(res.result) {
          var centeredNodes = res.result.split(' ');
          // 이 노드 값들 가운데로 이동함
        }
      })
    });

  }
]);

