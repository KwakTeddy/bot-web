(function () {
  'use strict';

  angular
    .module('bot-users')
    .controller('BotUsersListController', BotUsersListController);

  BotUsersListController.$inject = ['$rootScope', '$scope','DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$cookies', 'BotUsersService', '$http', '$timeout'];

  function BotUsersListController($rootScope, $scope, DTOptionsBuilder, DTColumnBuilder, $compile, $cookies, BotUsersService, $http, $timeout) {
    var vm = this;
    vm.mode = 'default';

    $scope.botId = $cookies.get('default_bot') || 'athena';
    $scope.pageData = {
      total:0
    };
    vm.dtColumns = [
      DTColumnBuilder.newColumn('channel', '채널'),
      DTColumnBuilder.newColumn(null).withTitle('유저 정보')
        .renderWith(function (data, type, full, meta) {
          if(data.facebook && data.facebook.first_name){
            return data.facebookData.first_name || null
          }else {
            return null
          }
        })
        .notVisible()
      ,
      DTColumnBuilder.newColumn('userKey', '유저키'),
      DTColumnBuilder.newColumn('created', '등록일')
        .renderWith(function (data, type, full, meta) {
          var date = data.split("T")[0]
          var time = data.split("T")[1]
          return date
        }),
      DTColumnBuilder.newColumn(null).withTitle('대화내역').notSortable()
        .renderWith(function(data, type, full, meta) {
          return '<button style="width: 100%" class="btn btn-default" data-ui-sref="user-dialogs.list({botId: botId, userKey: \'' + data.userKey+ '\'})">' + '보기' + '</button>'
        })
    ];

    vm.dtColumns2 = [
      DTColumnBuilder.newColumn('_id.channel', '채널'),
      DTColumnBuilder.newColumn(null).withTitle('유저 정보')
        .renderWith(function (data, type, full, meta) {
          if(data.facebook && data.facebook.first_name){
            return data.facebookData.first_name || null
          }else {
            return null
          }
        })
        .notVisible()
      ,
      DTColumnBuilder.newColumn('_id.userKey', '유저키'),
      DTColumnBuilder.newColumn('count', '대화수'),
      DTColumnBuilder.newColumn('maxDate', '최근 대화')
        .renderWith(function (data, type, full, meta) {
        var date = data.split("T")[0]
        var time = data.split("T")[1]
        return date
      }),
      DTColumnBuilder.newColumn(null).withTitle('대화내역').notSortable()
        .renderWith(function(data, type, full, meta) {
          return '<button style="width: 100%" class="btn btn-default" data-ui-sref="user-dialogs.list({botId: botId, userKey: \'' + data._id.userKey+ '\', liveChat: true})">' + '보기' + '</button>'
        })
    ];
    function serverData(sSource, aoData, fnCallback, oSettings) {
      var sortDir = aoData[2].value[0].dir;
      var sortCol = aoData[1].value[aoData[2].value[0].column].data;
      var sort = {target: sortCol, dir: sortDir};
      if(aoData[0].value == 1) {
        sortDir = 'desc';
        sortCol = 'created';
      }
      $http({
        method: 'GET',
        url: '/api/bot-users?botId='+ $scope.botId + '&currentPage=' + aoData[3].value/aoData[4].value + '&sortDir=' + sortDir + '&sortCol=' + sortCol + '&search=' + aoData[5].value.value
      })
        .then(function(result) {
          var records = {
            'draw': aoData[0].value,
            'recordsTotal': result.data[0].recordsTotal,
            "recordsFiltered": result.data[0].recordsTotal,
            'data': result.data[0].data
          };
          $timeout(function () {
            $compile(angular.element('#dt').contents())($scope);
          });
          fnCallback(records);
        });
    }

    function serverDataliveChat(sSource, aoData, fnCallback, oSettings) {
      console.log(aoData)
      var sortDir = aoData[2].value[0].dir;
      var sortCol = aoData[1].value[aoData[2].value[0].column].data;
      var sort = {target: sortCol, dir: sortDir};
      if(aoData[0].value == 1) {
        sortDir = 'asc';
        sortCol = 'created';
      }
      $http({
        method: 'POST',
        url: '/api/user-dialogs/liveChat?currentPage=' + aoData[3].value/aoData[4].value + '&sortDir=' + sortDir + '&sortCol=' + sortCol + '&search=' + aoData[5].value.value,
        data: {botId: $scope.botId}
      })
        .then(function(result) {
          console.log(result)
          var records = {
            'draw': aoData[0].value,
            'recordsTotal': result.data.recordsTotal,
            "recordsFiltered": result.data.recordsTotal,
            'data': result.data.data
          };
          $timeout(function () {
            $compile(angular.element('#dt').contents())($scope);
          });
          fnCallback(records);
        });
    }


    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withFnServerData(serverData)
        .withDataProp("data")
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withDisplayLength(10)
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-default" ng-click="vm.modeChangeLiveChat()"><i class="fa fa-plus"></i> 수동 대화내역 보기</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
          $compile(angular.element('#' + settings.sTableId).contents())($scope);
        });

    vm.dtOptions2 = DTOptionsBuilder.newOptions()
      .withFnServerData(serverDataliveChat)
      .withDataProp("data")
      .withOption('processing', true)
      .withOption('serverSide', true)
      .withOption('bLengthChange', false)
      .withOption('info', false)
      .withOption('dom', 'l<"toolbar">frtip')
      .withOption('initComplete', function(settings, json) {
        $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
        $("div.toolbar").html('<button id="addToTable" class="btn btn-default" ng-click="vm.downloadUserDilaogsLiveChat()">수동 대화내역 다운로드</button> <button id="addToTable" class="btn btn-default" ng-click="vm.modeChange()"><i class="fa fa-plus"></i> 챗봇 대화내역 보기</button>');
        $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        $compile(angular.element('#' + settings.sTableId).contents())($scope);
      });

    vm.downloadUserDilaogsLiveChat = function () {
      $http({method: 'POST', url:'/api/user-dialogs/download',data: {botId: $scope.botId}}).then(function (result) {
        var fileName = $cookies.get("default_bot") + '_' + "수동 대화 내역" + '.xlsx';
        function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }
        saveAs(new Blob([s2ab(result.data)],{type:"application/octet-stream"}), fileName);
      }, function (err) {
        console.log(err)
      })
    };

    vm.modeChange = function () {
      vm.mode = 'default'
    };

    vm.modeChangeLiveChat = function () {
      $http.post('/api/user-dialogs/liveChat', {botId: $scope.botId}).then(function (result) {
        vm.mode = 'liveChat';
        vm.liveChatUsers = result.data
      }, function (err) {
        console.log(err)
      })
    }

  }
})();
