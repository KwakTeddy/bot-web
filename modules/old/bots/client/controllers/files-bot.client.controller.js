/**
 * Created by Phebe on 2016. 7. 11..
 */
'use strict';

// Bots controller
angular.module('bots').controller('BotFilesController', ['$scope', '$stateParams', 'botResolve', 'botFilesResolve', 'BotFilesService', 'CoreUtils', 'DTOptionsBuilder', '$compile', 'Authentication', '$cookies',
  function ($scope, $stateParams, bot, files, BotFilesService, CoreUtils, DTOptionsBuilder, $compile, Authentication, $cookies) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bot = bot;
    vm.auth = $cookies.getObject("auth");
    vm.files = files;
    vm.addFileName = '';

    vm.remove = function (index) {
      CoreUtils.showYesOrNoAlert('정말 지우시겠습니까?', function () {
        vm.files[index].$remove({botId: vm.files[index].bot._id}, function (res) {
          vm.files.splice(index, 1);
        }, function (err) {
          CoreUtils.showConfirmAlert(err.data.message);
        });
      });
    };

    vm.create = function () {
      if(vm.addFileName && vm.addFileName.length > 0) {
        new BotFilesService({botId: vm.bot._id, fileName: vm.addFileName}).$save(function (botFile) {
          vm.files.push(botFile);
        }, function (err) {
          CoreUtils.showConfirmAlert(err.data.message);
        });
      }
    };

    vm.rename = function (index) {
      vm.files[index].$update({botId: vm.files[index].bot._id}, function (file) {
        vm.files.splice(index, 1, file);
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      })
    };

    vm.edit = function (index, edit) {
      vm.files[index].edit = edit;
      if(edit) {
        vm.files[index].renameFileName = vm.files[index].name;
      }
    };

    vm.isIde = function(name) {
      return !name.endsWith('graph.js');
    };

    vm.checkAuth = function (subjectSchema, target, kind, noti) {
      var result = false;
      if(vm.authentication.user._id == vm.bot.user._id) return true;

      if(kind == "edit"){
        if(vm.auth[subjectSchema] && vm.auth[subjectSchema][target] && vm.auth[subjectSchema][target][kind]){
          return true;
        }else{
          if(noti) alert("수정 권한이 없습니다");
          else return false
        }
      }else{
        if(vm.auth[subjectSchema] && vm.auth[subjectSchema][target]){
          return true;
        }
      }
      return result;
    };


    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<input type="text" class="mb-md" ng-model="vm.addFileName" placeholder="파일명"/><button id="addToTable" class="btn btn-primary" ng-if="vm.authentication.user._id == vm.bot.user._id" ng-click="vm.create()"><i class="fa fa-plus"></i> 파일추가</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
          $('input[type="text"].mb-md').addClass('form-control').css('width', '100px').css('float', 'left');
        })
    // // Find a list of Bots
    // vm.find = function () {
    //   vm.bots = BotsService.query();
    // };
    //
    // // Find existing Bot
    // vm.findOne = function () {
    //   vm.bot = BotsService.get({
    //     botId: $stateParams.botId
    //   });
    // };
  }
]);
