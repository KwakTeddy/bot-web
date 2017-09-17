(function () {
  'use strict';

  //대화셋 개별 대화내용 컨트롤러
  angular
    .module('dialogsets')
    .controller('DialogsetDialogsController', DialogsetDialogsController);

  DialogsetDialogsController.$inject =
    [
      '$scope', '$state', '$stateParams', '$window', 'Authentication', 'dialogsetResolve',
      'dialogsetDialogResolve', 'DialogsetDialogsService', '$timeout', "botResolve", "$cookies"
    ];

  function DialogsetDialogsController(
    $scope, $state, $stateParams, $window, Authentication, dialogset,
    dialogsetDialogs, DialogsetDialogsService, $timeout, botResolve, $cookies) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bot = botResolve;
    vm.auth = $cookies.getObject("auth");
    vm.dialogset = dialogset;
    vm.dialogsetDialogs = dialogsetDialogs;
    vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
    //대화셋의 개별 대화를 ordering 해주는 과정 - 개선 필요
    for(var i = 0; i < vm.dialogsetDialogs.length; i++){
      if(vm.dialogsetDialogs[i].parent){
        for(var j = 0; j < vm.dialogsetDialogs.length; j++){
          if(vm.dialogsetDialogs[j]._id == vm.dialogsetDialogs[i].parent){
            vm.dialogsetDialogs.splice(j+1, 0, vm.dialogsetDialogs[i]);
            vm.dialogsetDialogs.splice(i+1, 1)
          }
        }
      }
    }
    //권한 여부 확인
    vm.checkAuth = function (subjectSchema, target, kind, noti) {
      var result = false;
      if(vm.authentication.user._id == vm.bot.user._id) return true; //봇 주인

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

    vm.error = null;
    vm.currentPage = 1;
    vm.perPage = 50;
    vm.selectedCategory = '전체';

    // vm.highlight = function (text, search) {
    //   console.log(text)
    //   console.log(search)
    //   if (!search) {
    //     return $sce.trustAsHtml(text);
    //   }
    //
    //   return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    // };

    //랜덤 답변 구현 중
    vm.addRandomQuestion = function (dialog, index) {

      if(dialog.parent) vm.dialog['parent'] = dialog.parent;
      vm.dialog['groupId'] = dialog.groupId;
      vm.dialog['randomGroupId'] = dialog.randomGroupId;
      vm.dialog['depth'] = dialog.depth;
      vm.dialog.$save(function (response) {
        vm.dialogsetDialogs.splice(index+1,0, response);

        vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      })

    };
    //랜덤 답변 구현 중
    vm.addRandomAnswer = function (dialog) {
      console.log(dialog)

    };

    vm.ngClass = function (dialog) {
      if(!dialog.category){
        return 'textareaOpacity'
      }
    };

    vm.textareaFocus = function (target, index, focus, input) {
      if(input){
        var textareaTarget = document.querySelector('#' + input);
        if(focus == 'focus'){
          textareaTarget.setAttribute("rows", 14)
        }else {
          textareaTarget.setAttribute("rows", 2)
        }
      }else {
        var textareaTarget = document.querySelector('#textarea_' + target + '_' + index);
        if(focus == 'focus'){
          textareaTarget.setAttribute("rows", 14)
        }else {
          textareaTarget.setAttribute("rows", 2)
        }
      }
    };

    vm.inputKeyDown = function (dialog, target, index) {
      var textareaTarget = document.querySelector('#textarea_' + target + '_' + index);
      var textarea = document.querySelector('#textarea_'+ index);
      console.log(textarea)
      $timeout(function () {
        textarea.style.cssText = 'height:auto; padding:0';
        textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
        textareaTarget.style.cssText = 'height:auto; padding:0';
        textareaTarget.style.cssText = 'height:' + textarea.scrollHeight + 'px';
      });


      console.log(dialog);
      console.log(index);

    };

    vm.nextPage = function () {
      if(vm.dialogsetDialogs.length >= vm.perPage){
        var query = {dialogsetId: $stateParams.dialogsetId};
        query['currentPage'] = vm.currentPage;
        query['perPage'] = vm.perPage;
        if(vm.onSearch){
          if(vm.onSearch.category == '전체') query['all'] = vm.onSearch.searchInput;
          if(vm.onSearch.category == '카테고리') query['category'] = vm.onSearch.searchInput;
          if(vm.onSearch.category == '질문') query['inputRaw'] = vm.onSearch.searchInput;
          if(vm.onSearch.category == '답변') query['output'] = vm.onSearch.searchInput;
        }
        DialogsetDialogsService.query(query).$promise.then(function (result) {
          if(result.length < vm.perPage) vm.pagingEnd = true;
          vm.dialogsetDialogs.push.apply(vm.dialogsetDialogs, result);
          vm.currentPage++;
        });
      }
    };

    vm.searchDialog = function () {
      vm.currentPage = 0;
      vm.pagingEnd = null;
      var query = {
        dialogsetId: $stateParams.dialogsetId,
        currentPage : 0,
        perPage: vm.perPage
      };
      if(vm.selectedCategory == '전체') query['all'] = vm.dialogSearch;
      if(vm.selectedCategory == '카테고리') query['category'] = vm.dialogSearch;
      if(vm.selectedCategory == '질문') query['inputRaw'] = vm.dialogSearch;
      if(vm.selectedCategory == '답변') query['output'] = vm.dialogSearch;
      DialogsetDialogsService.query(query).$promise.then(function (result) {
        vm.dialogsetDialogs = result;
        vm.currentPage++;
        if(result.length < vm.perPage) vm.pagingEnd = true;
        vm.onSearch = {category : angular.copy(vm.selectedCategory), searchInput: angular.copy(vm.dialogSearch)};
      });
    };

    vm.searchDialogKeyup = function () {
      vm.searchDialog();
    };

    vm.initDialog = function () {
      vm.onSearch = null;
      vm.currentPage = 0;
      vm.pagingEnd = null;
      vm.dialogSearch = null;
      var query = {
        dialogsetId: $stateParams.dialogsetId,
        currentPage : 0,
        perPage: vm.perPage
      };
      DialogsetDialogsService.query(query).$promise.then(function (result) {
        vm.dialogsetDialogs = result;
        console.log(result)
      });
    };

    vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id, depth: 0});
    vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});

    vm.createDialog = function() {
      vm.dialog['groupId'] = vm.dialogset._id + Date.now();
      vm.dialog['randomGroupId'] = Date.now() + vm.dialogset._id;
      vm.dialog.$save(function (response) {
        vm.dialogsetDialogs.unshift(response);

        vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        vm.dialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      })
    };

    vm.createDepthDialog = function(parent, index) {
      vm.childDialog['parent'] = parent._id;
      vm.childDialog['depth'] = parent.depth + 1;
      vm.childDialog['groupId'] = parent.groupId;
      vm.childDialog['randomGroupId'] = Date.now() + vm.dialogset._id;

      vm.childDialog.$save(function (response) {
        vm.dialogsetDialogs.splice(index+1, 0, response);
        vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      }, function (err) {
        $scope.error = errorResponse.data.message;
        vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      });
    };

    vm.createRandomDialog = function(parent, index) {
      vm.childDialog['parent'] = parent._id;
      vm.childDialog['depth'] = parent.depth + 1;

      vm.childDialog.$save(function (response) {
        vm.dialogsetDialogs.splice(index+1, 0, response);
        vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      }, function (err) {
        $scope.error = errorResponse.data.message;
        vm.childDialog = new DialogsetDialogsService({user: vm.authentication, dialogset: vm.dialogset._id});
      });
    };

    vm.updateDialog = function (dialog) {
      dialog.$update(function(response) {
        console.log(response);
      });
    };

    vm.removeDialog = function(dialog) {
      if (confirm('삭제하시겠습니까?')) {
        dialog.$remove(function(response) {
          console.log(response);
          dialog.deleted = 'true';
        });
      }
    };
  }
})();
