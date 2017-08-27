'use strict';

function gogo(filename) {
  angular.element(document.getElementById('control')).scope().changeTabName(filename);
}

angular.module('bots').directive('myUiSelect', function() {
  return {
    require: 'uiSelect',
    link: function($scope, $element, attrs, $select) {
      var searchInput = $element.querySelectorAll('input.ui-select-search');
      if(searchInput.length !== 1) throw Error("bla");

      searchInput.on('keyup', function(e) {
        $scope.$parent.taskInput = $select.search;
      });

      // searchInput.on('blur', function() {
      //   $scope.$apply(function() {
      //     // $scope.$parent.taskInput = $select.search;
      //   });
      // });

      // don't forget to .off(..) on $scope.$destroy
    }
  }
});

angular.module('bots').filter('taskFilter', ['$filter', function($filter) {
  return function(items, text){
    var results = [];
    var itemMatch = new RegExp(text, 'i');
    for (var i = 0; items && i < items.length; i++) {
      var item = items[i];
      if ( itemMatch.test(item.name) || item.name === '새로만들기') {
        results.push(item);
      }
    }
    return results;
  }
}]);

// Bots controller
angular.module('bots').controller('DialogGraphController', ['$scope', '$rootScope', '$state', '$window','$timeout',
  '$stateParams', '$resource', 'Dialogs', 'DialogSaveService', 'OpenTasksService', 'FileUploader','$document',
  'fileResolve', 'BotFilesService', 'CoreUtils', 'botFilesResolve', 'Socket', '$uibModal', '$compile', '$cookies', '$http','IntentsService', 'EntitysService', 'EntityContentsService',
  'notificationService', 'Authentication', 'botResolve',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Dialogs, DialogSaveService,
            OpenTasksService, FileUploader, $document, file, BotFilesService, CoreUtils, files, Socket,
            $uibModal, $compile, $cookies, $http, IntentsService, EntitysService, EntityContentsService, notificationService, Authentication, botResolve
  ) {
    (function($) {
      'use strict';

      // deprecated
      $('.modal-with-move-anim').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,
        preloader: false,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom',
        modal: true
      });

      // deprecated
      /*
       Modal Dismiss
       */
      $(document).on('click', '.modal-dismiss', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
      });

      // deprecated
      /*
       Modal Confirm
       */
      $(document).on('click', '.modal-confirm', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
      });

      /*
       Form
       */
      $('.modal-with-help').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#help_input',
        modal: true,
      });


      $('.modal-with-intent').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
        modal: true,
        callbacks: {
          beforeOpen: function() {
            this.st.focus = '#name';
          }
        }
      });

      $('.modal-with-entity').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
        modal: true,

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
          beforeOpen: function() {
            if($(window).width() < 700) {
              this.st.focus = false;
            } else {
              this.st.focus = '#name';
            }
          }
        }
      });

      $('.modal-with-alert').magnificPopup({
        type: 'inline',
        preloader: false,
        // focus: '#help_input',
        modal: true,
      });

      $(document).on('click', '#filetree_open', function (e) {
        e.preventDefault();

        $('#filetree').css('width', '230px');
        $('#content').css('padding-left', '235px');
        $('#filetree > div.panel-body').show();
        $('#filelabel0').show();
        $('#filelabel1').hide();
        $('#filetree_open').hide();
        $('#filetree_close').show();

        viewerWidth = document.getElementById('content').clientWidth;
        baseSvg.attr("width", viewerWidth);
        angular.element(document.getElementById('control')).scope().updateEditor();
        $('#treeBasic').focus();
      });

      $(document).on('click', '#filetree_close', function (e) {
        e.preventDefault();
        $('#filetree > div.panel-body').hide();
        $('#filelabel0').hide();
        $('#filelabel1').show();
        $('#filetree').css('width', '42px');
        $('#content').css('padding-left', '45px');
        $('#filetree_close').hide();
        $('#filetree_open').show();

        viewerWidth = document.getElementById('content').clientWidth;
        baseSvg.attr("width", viewerWidth);
        angular.element(document.getElementById('control')).scope().updateEditor();
      });

    }).apply(this, [jQuery]);

    var vm = this;
    vm.authentication = Authentication;
    vm.bot = botResolve;
    vm.auth = $cookies.getObject("auth");
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
    if(!vm.checkAuth("BotFile", $stateParams.fileId ? $stateParams.fileId : file._id)){
      alert("보기 권한이 없습니다");
      return $state.go($rootScope.previousState || "developer-home")
    };

    $scope.$state = $state;

    // sateChange가 있을 때 불림
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (vm.isChanged) {
        event.preventDefault();
        $scope.message = "저장하지 않은 항목이 있습니다. 이동하겠습니까?";
        $scope.choice = true;
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-bots.html',
          scope: $scope
        });
        $scope.yes = function () {
          if(!rightPanelClosed) {
            var main = document.getElementById('main');
            var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
            main.style.marginRight = (mr - 450) + 'px';
            main.style.overflow = '';
          }

          vm.isChanged = false;
          modalInstance.dismiss();
          $state.go(toState.name);
        };
        $scope.no = function () {
          modalInstance.dismiss();
        };
      }
    });

    //$scope.$apply를 exception-safe 하게 해주는 함수
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
    $scope.removeProcessedInput = function () {
      $scope.processedInput = '';
    };

    $scope.processInput = function () {
      // $resource('/api/nluprocess/:input', {}).get({input: vm.curI.str}, function (res) {
      //   console.log(res)
      //   $scope.processedInput = res.input;
      // }, function (err) {
      //   console.log(err);
      // });
      if (vm.curI.str.length){
        $http.get('/api/nluprocess/'+vm.curI.str).then(function (res) {
          $scope.processedInput = res.data;
        }, function (err) {
          console.log(err);
        })
      }
    };

    $scope.$watch('vm.curI.str', function() {
      if (vm.curI && (vm.curI.str.indexOf('@') != 0) && (vm.curI.str.indexOf('#') != 0) && (vm.curI.str.indexOf('$') != 0) && (vm.curI.str.indexOf('/') != 0) && (vm.curI.str.indexOf('if') != 0)){
        $scope.processInput();
      }
    });

    var editor;

    // 새로운 task 추가시 사용되는 template
    var newTask_template = "\n\nvar _taskName_ = {\n  action: function (task,context,callback) {" +
      "\n    \n    callback(task,context);\n\t}\n};\n\n" +
      "bot.setTask('_taskName_', _taskName_);";

    // list item 저장
    $scope.saveListContent = function(output) {
      if (!vm.listTitle || vm.listTitle === '') {
        return;
      }

      if (output.list) {
        for(var i = 0; i < output.list.length; ++i){
          if (output.list[i].title == vm.listTitle){
            vm.contentError = '동일한 항목이 존재합니다';
            return false
          }
        }
      }
      vm.contentError = '';

      var item = {title:vm.listTitle};
      if (vm.listContent)
        item.content = vm.listContent;

      if (vm.listImage.image) {
        item.displayname = vm.listImage.image.displayname;
        item.filename = vm.listImage.image.url;
      }

      (output.list = output.list || []).push(item);
      delete vm.listImage.image;
      vm.listTitle = '';
      vm.listContent = '';
    };

    // list item 지우기
    $scope.itemRemoveBeforeSave = function(list, target) {
      var index = list.indexOf(target);
      if(index > -1){
        list.splice(index, 1)
      }
    };

    $scope.saveIntent = function (isValid) {
      if (!$scope.intent.name) {
        $scope.intentError = '인텐트 이름을 입력해주세요';
        return false;
      }
      // console.log($scope.intent.content)
      if (!$scope.intent.content || $scope.intent.content.length == 0){
        $scope.contentListError = '적어도 하나의 내용을 목록에 추가해주세요';
        return false
      }

      $scope.intent.botName = $rootScope.botId;

      $scope.intent.$save({botName: $rootScope.botId},successCallback, errorCallback);

      function successCallback(res) {
        IntentsService.query({botName: $rootScope.botId}).$promise.then(function (result) {
          vm.intents = result.map(function(i) { return i.name; });
          $scope.backToEditIntent(true);
        }, function (err) {
          console.log(err);
        });
      }

      function errorCallback(res) {
        // console.log(res);
        $scope.intentError = res.data.message;
        if (res.data.message.code == 11000){
          $scope.intentError = '\'' + res.data.message.op.name + '\'' +' 이름의 인텐트가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    };

    $scope.saveIntentContent = function (isValid) {
      if(!$scope.intent.content){
        $scope.intent['content'] = [];
      }
      if ($scope.intentContent && $scope.intentContent != ''){
        for(var i = 0; i < $scope.intent.content.length; i++){
          if ($scope.intent.content[i].name == $scope.intentContent){
            $scope.contentError = '동일한 내용이 존재합니다';
            return false
          }
        }
        $scope.intent.content.unshift({name: $scope.intentContent});
        $scope.intentContent = '';
        $scope.contentError = ''
      }else {
        // $scope.contentError = '내용을 입력해주세요'
      }
    };

    $scope.contentRemoveBeforeSave = function (target) {
      // console.log($scope.intent.content.indexOf(target))
      var index = $scope.intent.content.indexOf(target);
      if(index > -1){
        $scope.intent.content.splice(index, 1)
      }
    };



    //ENTITY
    $scope.saveEntity = function (isValid) {
      if (!$scope.entity.name) {
        $scope.entityError = '엔터티 이름을 입력해주세요';
        return false;
      }
      if (!$scope.entity.content || $scope.entity.content.length == 0){
        $scope.contentListError = '적어도 하나의 내용을 목록에 추가해주세요';
        return false
      }

      $scope.entity.botName = $rootScope.botId;

      $scope.entity.$save({botName: $rootScope.botId},successCallback, errorCallback);

      function successCallback(res) {
        EntityContentsService.query({botName: $cookies.get('default_bot')}).$promise.then(function (result) {
          vm.entities = result.map(function (i) {
            return i.name
          });
          $scope.backToEditEntity(true);
        }, function (err) {
          console.log(err)
        });
      }

      function errorCallback(res) {
        // console.log(res);
        $scope.entityError = res.data.message;
        if (res.data.message.code == 11000){
          $scope.entityError = '\'' + res.data.message.op.name + '\'' +' 이름의 엔터티가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    };

    $scope.saveEntityContent = function (isValid) {
      if(!$scope.entity.content){
        $scope.entity['content'] = [];
      }
      if ($scope.entityContent && $scope.entityContent != ''){
        for(var i = 0; i < $scope.entity.content.length; i++){
          if ($scope.entity.content[i].name == $scope.entityContent){
            $scope.contentError = '동일한 내용이 존재합니다';
            return false
          }
        }
        $scope.entity.content.unshift({name: $scope.entityContent, syn:[{name: $scope.entityContent}]});

        $scope.entityContent = '';
        $scope.contentError = '';
        $scope.contentListError = null;
      }else {
        // $scope.contentError = '내용을 입력해주세요'
      }
    };

    $scope.contentRemoveBeforeSave = function (target) {
      // console.log($scope.entity.content.indexOf(target))
      var index = $scope.entity.content.indexOf(target);
      if(index > -1){
        $scope.entity.content.splice(index, 1)
      }
    };

    $scope.contentSynSave = function (target) {

      if(vm.entityContentSyn){
        if(!target.syn){
          target['syn'] = [];
        }
        if(target.syn.length){
          // console.log('fff')
          for(var i = 0; i < target.syn.length; i++){
            if (target.syn[i].name == vm.entityContentSyn){
              var border = angular.copy(document.getElementById('synWrapper_' + target.name + '_' + vm.entityContentSyn).style.border);
              var syn = angular.copy(vm.entityContentSyn);
              document.getElementById('synWrapper_' + target.name + '_' + syn).style.border = 'pink solid 1px';
              $timeout(function () {
                document.getElementById('synWrapper_' + target.name + '_' + syn).style.border = border;
              }, 3000);
              return
            }
          }
        }
        target.syn.push({name: vm.entityContentSyn});
        vm.entityContentSyn = '';
      }
    };

    $scope.contentSynRemoveBeforeSave = function (content, syn) {
      var index = content.syn.indexOf(syn);
      content.syn.splice(index, 1);
    };

    $scope.synInputKeyDown = function (event, target) {
      if (event.keyCode == 13){ //enter
        $scope.contentSynSave(target);
        event.preventDefault();
      }
    };

    $scope.entityContentInputKeyDown = function (event, target) {
      if (event.keyCode == 13){ //enter
        $scope.saveEntityContent(target);
        event.preventDefault();
      }
    };



    // 새로운 task 추가
    $scope.addTask = function(taskName) {
      vm.fromTask = true;
      vm.changeTab(vm.tabs[1]);

      vm.currentTab.data += newTask_template.replace(new RegExp('_taskName_', 'g'), taskName);

      $scope.refreshCodemirror = true;
      vm.editor.focus();
      $timeout(function () {
        vm.editor.setCursor({line:vm.editor.lastLine() - 5,ch: 4});
        $scope.refreshCodemirror = false;
      }, 100);
    };


    // editor의 위치 설정 (task이름으로 검색)
    $scope.setPosition = function(task) {
      var lines = vm.currentTab.data.split("\n");
      for (var where=0; where < lines.length; ++where) {
        if (lines[where].search(task) != -1)
          break;
      }
      $scope.refreshCodemirror = true;
      vm.editor.focus();
      vm.editor.setCursor({line:where,ch:0});
      $timeout(function () {
        vm.editor.focus();
        vm.editor.setCursor({line:where,ch:0});
        vm.editor.refresh();
        $scope.refreshCodemirror = false;
      }, 100);
    };

    $scope.closePopup = function() {
      $.magnificPopup.close();
      $scope.closeEditor();
    };

    $scope.gotoTree = function() {
      vm.fromTask = false;
      vm.edit = false;
      vm.changeTab(vm.tabs[0]);
      $timeout(function() {
        $scope.openEditor();
      })
    };

    var newType_template = "\n\nvar _typeName_ = {\n  typeCheck: function (text, type, task, context, callback) {" +
      "\n    var matched = true;\n    \n    callback(text, task, matched);\n\t}\n};\n\n" +
      "bot.setType('_typeName_', _typeName_);";

    // 새로운 task 추가
    $scope.addNewType = function(typeName) {
      vm.fromTask = true;
      vm.changeTab(vm.tabs[1]);

      vm.currentTab.data += newType_template.replace(new RegExp('_typeName_', 'g'), typeName);

      $scope.refreshCodemirror = true;
      vm.editor.focus();
      $timeout(function () {
        vm.editor.setCursor({line:vm.editor.lastLine() - 5,ch:4});
        $scope.refreshCodemirror = false;
      }, 100);
    };

    $scope.openType = function(type) {
      $.magnificPopup.close();
      vm.fromTask = true;
      vm.changeTab(vm.tabs[1]);
      $scope.setPosition(type);
    };

    $scope.closeEdit = function() {
      vm.edit = false;
      if(vm.curI) vm.curI.str = '';
      $scope.processedInput = '';
      $scope.closeEditor();
      vm.newDialog = null;
    };

    vm.showTree = true;
    vm.userId = $rootScope.userId;
    vm.bot_id = $stateParams.botId ? $stateParams.botId : $cookies.get('botObjectId');
    vm.file_id = $stateParams.fileId ? $stateParams.fileId : file._id;

    // 새로운 dialog 추가시 next id
    vm.maxId = 0;

    // undo를 위한 data
    vm.isChanged = false;
    vm.changeHistory = [];


    // tab handling
    vm.botName = file.botName;
    vm.name = file.name.substring(0, file.name.length-3);
    vm.data = file.data;
    vm.files = files;

    vm.smallDialog = true;

    // filetree 초기화여부
    vm.initialized = false;

    // output-list에서 이미지 저장용
    vm.listImage = {};

    // initialize file tree
    vm.initTree = function() {
      if (vm.initialized)
        return;
      vm.initialized = true;

      vm.files.forEach(function(f) {
        var item = "<li data-jstree='{\"type\":\"file\"";
        if (f.name.endsWith('graph.js'))
          f.name = f.name.substring(0, f.name.length-3);
        if (f.name === vm.currentTab.name) {
          item += ",\"selected\":true";
        }
        var included = false;
        vm.tabs.forEach(function(t) {
          if (t.name === f.name)
            included = true;
        });
        // if (!included)
        //   item += ",\"disabled\":true";

        item = item + "}'><a href='#' onClick='gogo(\""+f.name+"\")'>"+ f.name + "</a></li>";
        document.getElementById('ul_list').insertAdjacentHTML('beforeEnd', item);
      });

      //$compile(document.getElementById('filetree'))($scope);

      $('#treeBasic').jstree({
        'core' : {
          'themes' : {
            'responsive': false
          }
        },
        'types' : {
          'default' : {
            'icon' : 'fa fa-folder'
          },
          'file' : {
            'icon' : 'fa fa-file'
          }
        },
        'plugins': ['types']
      });
    };

    // tab 초기화
    vm.initTabs = function() {
      vm.tabs.forEach(function(t) {
        t.active = false;
      });
    };

    // tab 추가
    vm.addTab = function(name, action) {
      files.forEach(function(f) {
        if (f.name === name) {
          vm.taskFile = f;
        }
      });
      if (vm.taskFile) {
        BotFilesService.get({botId: vm.bot_id, fileId: vm.taskFile._id}, function(result) {
          vm.taskFile.data = result.data;
          vm.tabs.push({name:name, data:vm.taskFile.data, file_id:vm.taskFile._id,  active:false});
          if (action)
            action();
        });
      }
    };

    // 탭 바꾸기
    $scope.changeTabName  = function (name) {
      var tab = null;
      vm.tabs.forEach(function(t) {
        if (t.name === name)
          tab = t;
      });

      if (tab != null) {
        vm.initTabs();
        vm.currentTab = tab;
        tab.active = true;

        if (vm.currentTab.name.endsWith('js')) {
          vm.file = vm.currentTab.name;

          $scope.safeApply();
          $scope.refreshCodemirror = true;
          $timeout(function () {
            vm.editor.focus();
            vm.editor.refresh();
            $scope.refreshCodemirror = false;
          }, 100);
        } else {
          $scope.safeApply();
        }
      } else {
        vm.addTab(name, function() {
          vm.currentTab = vm.tabs[vm.tabs.length-1];
          vm.initTabs();
          vm.currentTab.active = true;

          if (vm.currentTab.name.endsWith('js')) {
            vm.file = vm.currentTab.name;

            $scope.safeApply();
            $scope.refreshCodemirror = true;
            $timeout(function () {
              vm.editor.focus();
              vm.editor.refresh();
              $scope.refreshCodemirror = false;
            }, 100);
          } else {
            $scope.safeApply();
          }
        });
      }

    };
    vm.changeTab = function (tab) {
      vm.initTabs();
      vm.currentTab = tab;
      tab.active = true;
      if (tab.name.endsWith('js'))
        vm.file = tab.name;

      if (vm.currentTab != vm.tabs[0]) {
        vm.edit = 'task';
        $scope.refreshCodemirror = true;
        $timeout(function () {
          vm.editor.focus();
          vm.editor.refresh();
          $scope.refreshCodemirror = false;
        }, 100);
      } else {
        vm.edit = false;
      }
    };
    vm.closeTab = function (idx) {
      vm.tabs.splice(idx,1);
      vm.changeTab(vm.tabs[idx-1]);
    };
    vm.tabs = [{name:vm.name, data:vm.data, file_id:vm.file_id, active:true}];
    vm.currentTab = vm.tabs[0];
    vm.addTab(vm.name.split('.')[0]+'.js');

    // ide
    vm.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'javascript',
    };

    $scope.codeLoaded = function(_editor) {
      vm.editor = _editor;
      vm.editor.setSize(viewerWidth,viewerHeight);
    };

    $scope.updateEditor = function() {
      vm.editor.setSize(viewerWidth,viewerHeight);
      $scope.safeApply();
      $scope.refreshCodemirror = true;
      $timeout(function () {
        $scope.refreshCodemirror = false;
      }, 100);
    };

    // editor 파일 저장
    vm.saveFile = function () {
      new BotFilesService({botId: vm.bot_id, _id: vm.currentTab.file_id, fileData: vm.currentTab.data}).$save(function (botFile) {
        $resource('/api/loadBot/:bot_id/:fileName', {}).get({bot_id: vm.botId, fileName: vm.fileName}, function(res) {

          if(res.error) {
            showLogPanel();

            var logUpdated = ''; var errorLine;
            for(var i = 0; i < res.error.length; i++) {
              logUpdated += res.error[i];
            }

            logUpdated = logUpdated.replace(/\s*at .*/g, '');
            logUpdated = logUpdated.replace(/\/.*\/([^\/\.]+\.js):(\d+)/g, function(match, p1, p2) {
              try {errorLine = parseInt(p2);} catch(error) {};
              return 'Error at ' + p1 + ', line ' + p2;
            });
            $rootScope.logUpdated = logUpdated;
            $rootScope.$broadcast('updateLog');

            notificationService.success('Javascript Error: line ' + errorLine);

            if(errorLine) {
              vm.editor.focus();
              $timeout(function () {
                vm.editor.setCursor({line: errorLine - 1, ch: 0});
              })
            }
          } else {
            notificationService.success('저장되었습니다');
          }
        });
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      });
    };

    // graph edit
    vm.setChanged = function(c, updateScope, isReplace) {
      if (c == true) {
        vm.changeHistory.push({source:angular.copy(selectedNode),  dialogs:angular.copy(dialogs), updateScope: updateScope, isReplace: isReplace});
      }
      vm.isChanged = c;

      if (updateScope) {
        $scope.safeApply();
      }
    };

    // undo, changeHistoryd에 정보가 있으면 pop해서 복원
    // $scope.undo = function() {
    //   if (vm.changeHistory.length > 0) {
    //     var history = vm.changeHistory.pop();
    //     if (!history.isReplace) {
    //       dialogs = angular.copy(history.dialogs);
    //       vm.initTreeData();
    //       init(history.source);
    //       var svg = baseSvg.selectAll(".node").filter(function(d) {
    //         if (d.id === history.source.id)
    //           return true;
    //       });
    //       svg.remove();
    //       initSelect();
    //       update(history.source);
    //     } else {
    //       d3.selectAll('path').remove();
    //       d3.selectAll('.node').remove();
    //       dialogs = angular.copy(history.dialogs);
    //       vm.initTreeData();
    //       selectedSVG =null;
    //       init(treeData);
    //       if (selectedNode) {
    //         selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
    //           if (d.id === selectedNode.id)
    //             return true;
    //         });
    //         update(selectedNode);
    //       }
    //     }
    //     vm.isChanged = true;
    //   }
    //   // if (vm.changeHistory.length == 0) {
    //   //   vm.setChanged(false);
    //   // }
    // };

    // console.log('Tree Controller');


    // internal data represented by tree
    var nodes = [];
    var treeData;

    // dialogs
    var dialogs;
    // common dialogs
    var common_dialogs;

    // call, callChild등의 path를 그리기 위함
    var links_internal = [];

    // highlight된 노드
    var currentNode;

    // 현재 선택된 노드와 svg
    var selectedNode;
    var selectedSVG;

    // collapse/expand용 current depth
    vm.depth = 1;

    // chatting 창에서 선택된 dialog 하이라이트를 위해 사용
    $scope.$on('updateLog', function(event, arg0) {
      var index = $rootScope.logUpdated.indexOf('[DIALOG_SEL]');

      if(index != -1) {
        var json = $rootScope.logUpdated.substring('[DIALOG_SEL]'.length);

        if(vm.edit != undefined &&  vm.edit != false) return;

        // console.log(json);
        currentNode = null;
        try {
          var dialog = JSON.parse(json);
          for(var i in nodes) {
            if(dialog.name == "시작") {
              currentNode = treeData;
              break;
            } else if(nodes[i].id == dialog.id) {
              currentNode = nodes[i];
              break;
            }
          }

          if(currentNode) {
            // update(currentNode);

            updateSelected(currentNode);
          }
        } catch(e) {
          console.log(e);
        }
      }
    });

    // 선택된 node 업데이트
    // var updateSelected = function(newd) {
    //   selectedNode = newd;
    //   selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
    //     if (d.id === newd.id)
    //       return true;
    //   });
    //   update(selectedNode);
    //   centerNode(selectedNode);
    //
    //   if (vm.edit === 'dialog')
    //     edit(selectedNode);
    // };

    // file tree toggle
    var toggleFileTree = function(event) {
      event.preventDefault();
      if (document.getElementById('filetree_close').style.display == 'none') {
        vm.initTree();
        $timeout(function() {
          $('#filetree_open').click();
          $('#filetree > div.panel-body').focus();
        });
      } else {
        $timeout(function() {
          $('#filetree_close').click();
          $('#filetree > div.panel-body').blur();
          document.getElementById('mainpage').focus();
        });
      }
    };

    var keydown = function(event) {
      console.log(event.keyCode);

      // search 인풋필드나 filetree에 포커스 있는 경우 스킵
      if (document.activeElement == document.getElementById('inputbox') ||
        document.activeElement == document.getElementById('treeBasic')) {
        return false;
      }

      if (event.altKey && event.keyCode == 37) { // alt+left
        event.preventDefault();
        if (vm.fromTask) {
          $scope.gotoTree();
        } else if (vm.edit === 'dialog') {
          document.getElementById('mainpage').focus();
        }
        return false;
      }

      if (event.keyCode == 27) { // esc
        if(vm.curInputMention == true) return false;

        if (vm.edit === 'dialog') {
          event.preventDefault();
          $scope.closeEdit();
          return false;
        } else if (vm.edit === 'task') {
          event.preventDefault();
          $scope.backToEdit(false);
        } else {
          document.getElementById('search').blur();
          document.getElementById('replace').blur();
          document.getElementById('mainpage').focus();
          return false;
        }
      }

      if (vm.edit === 'dialog') {
        if (event.ctrlKey && event.keyCode == 13) { // ctrl+enter
          event.preventDefault();
          $scope.update(true);
          $scope.closeEdit();
          return false;
        }
      }

      if (event.ctrlKey && event.keyCode == 82) { // ctrl+r
        event.preventDefault();
        vm.isReplace = !vm.isReplace;
        if (vm.isReplace)
          document.getElementById('search').focus();
        $scope.safeApply();
        return;
      }

      if(event.keyCode == 13) {
        if(document.activeElement == document.getElementById('intentContent')) {
          event.preventDefault();
          $timeout(function() {
            $scope.saveIntentContent();
          })
          return false;
        } else if(document.activeElement == document.getElementById('entityContent')) {
          event.preventDefault();
          $timeout(function() {
            $scope.saveEntityContent();
          });
          return false;
        }
      }

      if (document.activeElement == document.getElementById('search') ||
        document.activeElement == document.getElementById('replace') ||
        document.activeElement.type == 'text') {
        return false;
      }

      if (event.ctrlKey && event.keyCode == 90) { // ctrl+z
        event.preventDefault();
        if (vm.changeHistory.length != 0) {
          $scope.undo();
          $scope.safeApply();
        }
        return;
      } else if (event.ctrlKey && event.keyCode == 83) { // ctrl+s
        event.preventDefault();
        if (vm.isChanged) {
          $scope.save();
          $scope.safeApply();
        }
        return;
      } else if (event.ctrlKey && event.keyCode == 80) { // ctrl+p
        toggleFileTree(event);
        return;
      }

      // to prevent keydown event from filetree
      if (document.activeElement != document.getElementById('mainpage'))
        return;

      if (event.keyCode == 191) { //  /
        if (event.shiftKey) {
          event.preventDefault();
          // shortcut help
          if ($.magnificPopup.instance.isOpen) {
            $.magnificPopup.close();
          } else {
            $('.modal-with-help').click();
          }
        } else {
          event.preventDefault();
          document.getElementById('search').focus();
        }
        return;
      }

      if (!selectedNode)
        return false;

      if ([45,46,32,13, 37,38,39,40, 187].indexOf(event.keyCode) == -1 || event.metaKey)
        return false;

      event.preventDefault();

      if (event.keyCode == 45 || (!event.metaKey && event.shiftKey && event.keyCode == 187)) { // insert, +
          addChild(selectedNode);
      } else if (event.keyCode == 46) { // del
        deleteNode(selectedNode);
      } else if (event.keyCode == 32) { // space
        toggleAndCenter(selectedNode);
      } else if (event.keyCode == 13) { //enter
        edit(selectedNode);
      } else if (event.keyCode == 37) { //left
        if (selectedNode.parent) {
          if(!rightPanelClosed) {
            edit(selectedNode.parent);
            document.getElementById('mainpage').focus();
          }
          updateSelected(selectedNode.parent);
        }
      } else if (event.keyCode == 38) { //up
        if (selectedNode.parent && selectedNode.parent.children) {
          if (selectedNode.parent.children.indexOf(selectedNode) > 0) {
            if (event.ctrlKey) { // ctrl+up
              goUp(selectedNode);
            } else {
              if(!rightPanelClosed) {
                edit(selectedNode.parent.children[selectedNode.parent.children.indexOf(selectedNode)-1]);
                document.getElementById('mainpage').focus();
              }
              updateSelected(selectedNode.parent.children[selectedNode.parent.children.indexOf(selectedNode)-1]);
            }
          } else {
            var findUpNear = function(d, depth) {
              var _parent = d;
              for(var i = 0; i < depth; i++) _parent = d.parent;
              if(!_parent) return null;

              if(_parent.parent) {
                for(var i = 0; i < _parent.parent.children.length; i++) {
                  if(_parent.parent.children[i] == _parent && i > 0) {
                    if(_parent.parent.children[i-1].children)
                      return _parent.parent.children[i-1].children[_parent.parent.children[i-1].children.length -1];
                  }
                }
                return null;
              } else {
                return null;
              }
            }

            var nearDialog = findUpNear(selectedNode, 1);
            if(nearDialog) {
              if(!rightPanelClosed) {
                edit(nearDialog);
                document.getElementById('mainpage').focus();
              }
              updateSelected(nearDialog);
            }

            // var nearUp = {x:0};
            // visit(treeData, function(d) {
            //   if (d.y == selectedNode.y && d.x < selectedNode.x && d.x > nearUp.x)
            //     nearUp = d;
            // }, function (d) {
            //   return d.children && d.children.length > 0 ? d.children : null;
            // });
            //
            // if (nearUp.x != 0) {
            //   updateSelected(nearUp);
            // }
          }
        } else if (selectedNode.parent && Array.isArray(selectedNode.parent.output) && selectedNode.parent.output.length && selectedNode.parent.output[0].if) {
          if (selectedNode.parent.output.indexOf(selectedNode) > 0) {
            if(!rightPanelClosed) {
              edit(selectedNode.parent.output[selectedNode.parent.output.indexOf(selectedNode)-1]);
              document.getElementById('mainpage').focus();
            }
            updateSelected(selectedNode.parent.output[selectedNode.parent.output.indexOf(selectedNode)-1]);
          } else {
            var findUpNear = function(d, depth) {
              var _parent = d;
              for(var i = 0; i < depth; i++) _parent = d.parent;
              if(!_parent) return null;

              if(_parent.parent) {
                for(var i = 0; i < _parent.parent.children.length; i++) {
                  if(_parent.parent.children[i] == _parent && i > 0) {
                    if(_parent.parent.children[i-1].children)
                      return _parent.parent.children[i-1].children[_parent.parent.children[i-1].children.length -1];
                  }
                }
                return null;
              } else {
                return null;
              }
            }

            var nearDialog = findUpNear(selectedNode, 1);
            if(nearDialog) {
              if(!rightPanelClosed) {
                edit(nearDialog);
                document.getElementById('mainpage').focus();
              }
              updateSelected(nearDialog);
            }

            // var nearUp = {x:0};
            // visit(treeData, function(d) {
            //   if (d.y == selectedNode.y && d.x < selectedNode.x && d.x > nearUp.x)
            //     nearUp = d;
            // }, function (d) {
            //   return d.children && d.children.length > 0 ? d.children : null;
            // });
            //
            // if (nearUp.x != 0) {
            //   updateSelected(nearUp);
            // }
          }
        }

      } else if (event.keyCode == 39) { //right
        if (selectedNode.children && selectedNode.children.length > 0) {
          if(!rightPanelClosed) {
            edit(selectedNode.children[0]);
            document.getElementById('mainpage').focus();
          }
          updateSelected(selectedNode.children[0]);
        } else if (Array.isArray(selectedNode.output) && selectedNode.output.length > 0 && selectedNode.output[0].if) {
          if(!rightPanelClosed) {
            edit(selectedNode.output[0]);
            document.getElementById('mainpage').focus();
          }
          updateSelected(selectedNode.output[0]);
        }
      } else if (event.keyCode == 40) { //down
        if (selectedNode.parent && selectedNode.parent.children) {
          if (selectedNode.parent.children.indexOf(selectedNode) < selectedNode.parent.children.length-1) {
            if (event.ctrlKey) { // ctrl+down
              goDown(selectedNode);
            } else {
              if(!rightPanelClosed) {
                edit(selectedNode.parent.children[selectedNode.parent.children.indexOf(selectedNode) + 1]);
                document.getElementById('mainpage').focus();
              }
              updateSelected(selectedNode.parent.children[selectedNode.parent.children.indexOf(selectedNode) + 1]);
            }
          } else {
            
            var findDownNear = function(d, depth) {
              var _parent = d;
              for(var i = 0; i < depth; i++) _parent = d.parent;
              if(!_parent) return null;

              if(_parent.parent) {
                for(var i = 0; i < _parent.parent.children.length; i++) {
                  if(_parent.parent.children[i] == _parent && i < _parent.parent.children.length - 1) {
                    if(_parent.parent.children[i+1].children)
                      return _parent.parent.children[i+1].children[0];
                  }
                }
                return null;
              } else {
                return null;
              }
            }

            var nearDialog = findDownNear(selectedNode, 1);
            if(nearDialog) {
              if(!rightPanelClosed) {
                edit(nearDialog);
                document.getElementById('mainpage').focus();
              }
              updateSelected(nearDialog);
            }
          }
        } else if (selectedNode.parent && Array.isArray(selectedNode.parent.output) && selectedNode.parent.output.length > 0 && selectedNode.parent.output[0].if) {
          if (selectedNode.parent.output.indexOf(selectedNode) < selectedNode.parent.output.length-1) {
            if(!rightPanelClosed) {
              edit(selectedNode.parent.output[selectedNode.parent.output.indexOf(selectedNode) + 1]);
              document.getElementById('mainpage').focus();
            }
            updateSelected(selectedNode.parent.output[selectedNode.parent.output.indexOf(selectedNode) + 1]);
          } else {

            var findDownNear = function(d, depth) {
              var _parent = d;
              for(var i = 0; i < depth; i++) _parent = d.parent;
              if(!_parent) return null;

              if(_parent.parent) {
                for(var i = 0; i < _parent.parent.children.length; i++) {
                  if(_parent.parent.children[i] == _parent && i < _parent.parent.children.length - 1) {
                    if(_parent.parent.children[i+1].children)
                      return _parent.parent.children[i+1].children[0];
                  }
                }
                return null;
              } else {
                return null;
              }
            }

            var nearDialog = findDownNear(selectedNode, 1);
            if(nearDialog) {
              if(!rightPanelClosed) {
                edit(nearDialog);
                document.getElementById('mainpage').focus();
              }
              updateSelected(nearDialog);
            }
          }
        }

      }
    };

    // 화면 크기 변경시 내부 그래프나 editor창 크기 자동 변경
    var element = document.getElementById('tree-container');
    var element2 = document.getElementById('editor-container');
    new ResizeSensor(element, function() {
      // console.log('Graph Changed to ' + element.clientWidth);
      viewerWidth = document.getElementById('tree-container').clientWidth;
      viewerHeight = document.getElementById('sidebar-left').clientHeight*0.80;

      baseSvg
        .attr("width", viewerWidth)
        .attr("height", viewerHeight);

      if (selectedNode)
        centerNode(selectedNode);

    });

    new ResizeSensor(element2, function() {
      if (element2.clientWidth == 0)
        return;
      // console.log('Editor Changed to ' + element2.clientWidth);
      viewerWidth = document.getElementById('editor-container').clientWidth;
      viewerHeight = document.getElementById('sidebar-left').clientHeight*0.80;

      if (vm.editor) {
        vm.editor.setSize(viewerWidth,viewerHeight);
      }
    });

    document.getElementById('mainpage').addEventListener("keydown", keydown);
    document.getElementById('modalForm').addEventListener("keydown", keydown);
    document.getElementById('modalTaskForm').addEventListener("keydown", keydown);
    document.getElementById('modalHelpForm').addEventListener("keydown", keydown);
    document.getElementById('modalIntentForm').addEventListener("keydown", keydown);
    document.getElementById('modalEntityForm').addEventListener("keydown", keydown);
    document.getElementById('mainpage').focus();

    // dialog editing

    $scope.addI = function(input) {
      var init = {};
      init.type = $scope.getInputTypes(input)[0];
      init.str = '';
      $scope.openEdit(init, input);
    };

    $scope.removeI = function(i, input) {
      input.splice(input.indexOf(i),1);
    };

    $scope.openEdit = function(i, inlineInputs) {
      // console.log(i)
      // console.log(inlineInputs)
      if ($scope.getInputType(i.type) === 'button')
        return;

      if(i.type == 'Keyword'){
        vm.curI = angular.copy(i);
        inlineInputs.splice(inlineInputs.indexOf(i), 1);
      }
      if(i.type == 'RegExp'){
        vm.curI = angular.copy(i);
        vm.curI.str = '/' + vm.curI.str
        inlineInputs.splice(inlineInputs.indexOf(i), 1);
      }
      if(i.type == 'If'){
        vm.curI = angular.copy(i);
        vm.curI.str = 'if (' + vm.curI.str;
        inlineInputs.splice(inlineInputs.indexOf(i), 1);
      }
      if(i.type == 'Entity'){
        vm.curI = angular.copy(i);
        vm.curI.str = vm.curI.str;
        inlineInputs.splice(inlineInputs.indexOf(i), 1);
      }
      if(i.type == 'Intent'){
        vm.curI = angular.copy(i);
        vm.curI.str = '#' + vm.curI.str;
        inlineInputs.splice(inlineInputs.indexOf(i), 1);
      }
      // $scope.processedInput = '';
      // vm.curInput = input;
      // vm.targetI = i;
      // vm.curI = angular.copy(i);
      //
      // vm.inputMode = true;
      // setTimeout(function () {
      //   if (document.getElementById('input'))
      //     document.getElementById('input').focus();
      // }, 300);
    };

    $scope.addO = function(output, first) {
      var init = {};
      init.kind = 'Text';
      output.push(init);

      //$scope.openEditO(init, input, first);
    };

    $scope.printInput = function(o) {
      if (vm.typeClass[o.type].input === 'button')
        return 'false';
      else
        return o.str.substring(0,10);
    };

    // deprecated
    $scope.printOutput= function(o) {
      return 'deprecated';
      if (vm.typeClass[o.type].input === 'button')
        return '';
      else
        return o.str.substring(0,10);
    };

    // deprecated
    $scope.openEditO = function(o, output, first) {
      if ($scope.getInputType(o.type) === 'button')
        return;
      vm.curOutput = output;
      vm.targetO = o;
      vm.curO = angular.copy(o);

      if ($scope.getInputType(o.type) === 'list') {
        $scope.openList();
        return;
      }

      vm.inputModeO = true;
      if (!first) {
        setTimeout(function () {
          if (document.getElementById('output'))
            document.getElementById('output').focus();
        }, 300);
      }
    };

    $scope.saveI = function() {
      // check regexp
      if (vm.curI.type == 'RegExp') {
        try {
          var reg = new RegExp(vm.curI.str);
        } catch (e) {
          $scope.inputError = "regular expression 형식에 맞게 입력해주세요";
          return;
        }
      }
      if ($scope.getInputType(vm.curI.type) != 'text' && vm.curI.str === "") {
        $scope.resetI();
        return;
      }
      vm.targetI.type = vm.curI.type;
      if (vm.curI.type == 'Keyword') {
        if (vm.curI.type === 'Keyword' && vm.curI.str.length){
          $http.get('/api/nluprocess/'+vm.curI.str).then(function (res) {
            $scope.processedInput = res.data;
            vm.targetI.str = $scope.processedInput;

            if (vm.curInput.indexOf(vm.targetI) == -1)
              vm.curInput.push(vm.targetI);
            $scope.resetI();
          }, function (err) {
            console.log(err);
          })
        }
      } else {
        vm.targetI.str = vm.curI.str;
        if (vm.curInput.indexOf(vm.targetI) == -1)
          vm.curInput.push(vm.targetI);
        $scope.resetI();
      }
    };

    // deprecated
    $scope.saveO = function() {
      if ($scope.getInputType(vm.curO.type) != 'text' && vm.curO.str === "") {
        $scope.resetO();
        return;
      }
      vm.targetO.type = vm.curO.type;
      vm.targetO.str = vm.curO.str;
      vm.targetO.url = vm.curO.url;
      vm.targetO.filename = vm.curO.filename;

      if (vm.curO.type === 'List') {
        vm.targetO.str = vm.curO.str;
        vm.targetO.list = vm.curO.list;
      }

      if (vm.curOutput.indexOf(vm.targetO) == -1)
        vm.curOutput.push(vm.targetO);

      $scope.resetO();
    };

    $scope.resetI= function() {
      $scope.inputError = '';
      $scope.processedInput = null;
      vm.inputMode = false;
    };

    // deprecated
    $scope.resetO= function() {
      vm.inputModeO = false;
    };

    // action 타입 데이터 초기화
    $scope.resetActions = function(i) {
      delete i.call;
      delete i.callChild;
      delete i.returnCall;
      delete i.returnDialog;
      delete i.return;
      delete i.repeat;
      delete i.up;
    };

    $scope.setType = function(i, type) {
      i.type = type;
      $scope.resetActions(i);

      if ($scope.getInputType(type) === 'button') {
        i[type.toLowerCase()] = '1';
      }
    };

    // deprecated
    $scope.getPlaceHolder = function(type, isOut) {
      if (type === 'Keyword') {
        if (isOut) return "답변을 입력해주세요";
        return "질문을 입력해주세요";
      }
      if (type === 'RegExp') return "정규식을 입력해주세요";
      if (type === 'Type') return "타입을 입력해주세요";
      if (type === 'Button') return "버튼 이름을 입력해주세요";
      if (type === 'If') return "조건을 입력해주세요";
      if (type === 'Options') return 'Option을 입력해주세요';
    };

    // input/ouput types
    vm.inputTypes = ["Keyword","Intent","Entity","RegExp","Type","If","매칭없음"];
    vm.outputTypes = ["Text","List","Call","ReturnCall","CallChild","Up", "Repeat", "Return"];

    vm.typeClass = [];
    vm.typeClass['Keyword'] = {btn:'btn-primary',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf', icon:'fa-commenting', iconColor: 'rgba(243, 243, 243, 0.65)', input:'text'};
    vm.typeClass['RegExp'] = {btn:'btn-danger',btnColor:'#fdf7f7', btnBorderColor: '#ffb9cc', icon:'fa-registered', iconColor: 'rgb(234, 67, 53)', input:'text'};
    vm.typeClass['Intent'] = {btn:'btn-success',btnColor:'#f8f8ff', btnBorderColor: '#aeb0ff',icon:'fa-quote-right', iconColor: 'rgb(66, 133, 244)', input:'intent'};
    vm.typeClass['Entity'] = {btn:'btn-success',btnColor:'rgba(239, 255, 242, 0.46)', btnBorderColor: 'rgba(2, 125, 24, 0.44)',icon:'fa-at', iconColor: 'rgb(52, 168, 83)', input:'entity'};
    vm.typeClass['Type'] = {btn:'btn-warning',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-gear', iconColor: 'red', input:'type'};
    vm.typeClass['List'] = {btn:'btn-info', btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-list', iconColor: 'red', input:'list'};
    vm.typeClass['매칭없음'] = {btn:'btn-danger',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-ban', iconColor: 'red', input:'button'};

    vm.typeClass['Text'] = {btn:'btn-primary',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-commenting', iconColor: 'red', input:'text'};
    vm.typeClass['Call'] = {btn:'btn-danger',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-bolt', iconColor: 'red', input:'dialog'};
    vm.typeClass['CallChild'] = {btn:'btn-danger',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-mail-forward', iconColor: 'red', input:'dialog'};
    vm.typeClass['ReturnCall'] = {btn:'btn-danger',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-mail-reply', iconColor: 'red', input:'dialog'};
    vm.typeClass['If'] = {btn:'btn-info',btnColor:'#fffbee', btnBorderColor: '#ffbe3e',icon:'fa-question', iconColor: 'rgb(251, 188, 5)', input:'text'};
    vm.typeClass['Up'] = {btn:'btn-info',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-arrow-up', iconColor: 'red', input:'button'};
    vm.typeClass['Repeat'] = {btn:'btn-info',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-repeat', iconColor: 'red', input:'button'};
    vm.typeClass['Options'] = {btn:'btn-warning',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-cog', iconColor: 'red', input:'text'};
    vm.typeClass['Return'] = {btn:'btn-info',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-level-up', iconColor: 'red', input:'button'};
    vm.typeClass['Image'] = {btn:'btn-warning',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-image', iconColor: 'red', input:'image'};
    vm.typeClass['Button'] = {btn:'btn-success',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-play-circle', iconColor: 'red', input:'text'};
    vm.typeClass['URLButton'] = {btn:'btn-success',btnColor:'rgba(243, 243, 243, 0.65)', btnBorderColor: '#bfbfbf',icon:'fa-play-circle', iconColor: 'red', input:'text_for_button'};

    // deprecated
    var findType = function(input, typeName) {
      for (var i=0; i < input.length; ++i) {
        if (input[i].type === typeName) {
          return true;
        }
      }
      return false;
    };

    // deprecated
    var addType = function(types, type) {
      if (types.indexOf(type) == -1) {
        types.push(type);
      }
    };

    // deprecated
    var removeType = function(types, type) {
      if (types.indexOf(type) != -1) {
        types.splice(types.indexOf(type), 1);
      }
    };

    $scope.getInputTypes = function(input, i) {
      var types = [];
      if (!input) return types;
      vm.inputTypes.forEach(function(t) {
        if (t === 'Type' || t === 'Entity' || (i != undefined && t === i.type) || !findType(input,t))
          types.push(t);
      });
      return types;
    };

    // deprecated
    $scope.getOutputTypes = function(input, i) {
      var types = [];
      if (!input) return types;
      var isDone = false;
      vm.outputTypes.forEach(function(t) {
        if (findType(input,t)) {
          isDone = true;
        }
      });
      if (findType(input, 'Repeat') || findType(input, 'Call')) {
        addType(types,'Options');
        return types;
      }
      if ((!isDone || (i != undefined && vm.outputTypes.indexOf(i.type) != -1))) {
        if (!findType(input, 'Button') && !findType(input, 'URLButton') && !findType(input,'Image')) {
          types = angular.copy(vm.outputTypes);
          if ($scope.dialog.depth <= 1) {
            removeType(types, "Up");
            removeType(types, "Repeat");
          }
        }
        else
          addType(types,'Text');
      }
      if (findType(input,'Return')) {
        if (!findType(input,'Text'))
          addType(types,'Text');
        return types;
      }
      if (!findType(input,"If") || (i != undefined && i.type == "If"))
        addType(types,"If");
      if (!isDone || (isDone && findType(input,'Text'))) {
        if (!findType(input,'Image'))
          addType(types,'Image');
        addType(types,'Button');
        addType(types,'URLButton');
      }

      return types;
    };

    $scope.initButton = function() {
      $timeout(function() {
        $('.pull-down').each(function() {
          var $this = $(this);
          $this.css('margin-top', $this.prev().height() - $this.height())
        });
      });
    };

    $scope.addInput = function() {
      //["","",{types:[{name:'', typeCheck:'', raw:true},..,regexp:'',intent:''}]]
      var input = [];
      $scope.dialog.input.push(input);
      // $scope.addI(input);

      $scope.initButton();
    };

    $scope.removeInput = function(input) {
      // $scope.dialog.input.splice($scope.dialog.input.indexOf(input),1);
      console.log('length 0:' + $scope.dialog.input.length);
      $scope.dialog.input.splice(input,1);
      console.log('length 1:' + $scope.dialog.input.length);

      $scope.initButton();
    };

    $scope.addOutput= function(first) {
      $scope.addO($scope.dialog.output, first);
      //$scope.initButton();
    };

    $scope.removeOutput = function(output) {
      $scope.dialog.output.splice($scope.dialog.output.indexOf(output),1);
      $scope.initButton();
    };

    // 키워드 검색용
    var currentKeyword = "";
    var currentKind = "";
    var currentSearchIdx = 0;

    vm.searchKind = 'name';
    vm.isReplace = false;
    // $scope.searchNode = function(event) {
    //   //find the node
    //   var selectedVal = document.getElementById('search').value;
    //   var node = baseSvg.selectAll(".node");
    //   if (selectedVal != "") {
    //     var selected = node.filter(function (d, i) {
    //       if (vm.searchKind == 'name') {
    //         return d.name.search(selectedVal) != -1;
    //       }
    //       if (vm.searchKind == 'input') {
    //         for (var i=0; i < d.input.length; ++i) {
    //           return d.input[i].text && d.input[i].text.search(selectedVal) != -1;
    //         }
    //       }
    //       if (vm.searchKind == 'output') {
    //         if (typeof d.output === 'string') {
    //           return d.output.search(selectedVal) != -1;
    //         } else if (d.output.output) {
    //           return d.output.output.search(selectedVal) != -1;
    //         } else if (Array.isArray(d.output)) {
    //           for (var i = 0; i < d.output.length; ++i) {
    //             return d.output[i].text && d.output[i].text.search(selectedVal) != -1;
    //           }
    //         }
    //       }
    //     });
    //     if (currentKeyword !== selectedVal || currentKind !== vm.searchKind) {
    //       currentKeyword = selectedVal;
    //       currentKind = vm.searchKind;
    //       currentSearchIdx = 0;
    //     }
    //
    //     if (selected && selected.length == 1 && selected[0].length >= 1) {
    //       selectedNode = selected[0][currentSearchIdx].__data__;
    //       selectedSVG = d3.select(selected[0][currentSearchIdx]);
    //       update(selectedNode);
    //       centerNode(selectedNode);
    //
    //       currentSearchIdx = (++currentSearchIdx) % selected[0].length;
    //     }
    //   }
    // };
    //
    // // 키워드 replace
    // $scope.replaceNode = function(event) {
    //   var selectedVal = document.getElementById('search').value;
    //   var replacedVal = document.getElementById('replace').value;
    //   if (selectedVal == '' || replacedVal == '')
    //     return;
    //
    //   vm.setChanged(true, false, true);
    //
    //   var re = new RegExp(selectedVal, "g");
    //   for (var idx=0; idx < dialogs.length; ++idx) {
    //     var d = dialogs[idx];
    //     if (vm.searchKind == 'name') {
    //       d.name = d.name.replace(re, replacedVal);
    //     }
    //     if (vm.searchKind == 'input') {
    //       for (var i=0; i < d.input.length; ++i) {
    //         if (d.input[i].text)
    //           d.input[i].text = d.input[i].text.replace(re, replacedVal);
    //       }
    //     }
    //     if (vm.searchKind == 'output') {
    //       if (typeof d.output === 'string') {
    //         d.output = d.output.replace(re, replacedVal);
    //       } else if (Array.isArray(d.output)) {
    //         for (var i = 0; i < d.output.length; ++i) {
    //           if (d.output[i].text)
    //             d.output[i].text = d.output[i].text.replace(re, replacedVal);
    //         }
    //       }
    //     }
    //   }
    //
    //   d3.selectAll('.node').remove();
    //   d3.selectAll('path').remove();
    //   selectedSVG =null;
    //   update(treeData);
    //   if (selectedNode) {
    //     selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
    //       if (d.id === selectedNode.id)
    //         return true;
    //     });
    //     update(selectedNode);
    //   }
    // };

    vm.getButtonClass = function(type) {
      if (!type) return '';
      return vm.typeClass[type].btn;
    };

    vm.getIconClass = function(type) {
      if (!type) return '';
      return vm.typeClass[type].icon;
    };

    vm.getIcon = function(type) {
      if (!type || type == 'Keyword') return '';
      if (type == 'Entity') return '';
      if (type == 'Intent') return '#';
      if (type == 'RegExp') return '/';
      if (type == 'Type') return '$';
      if (type == 'If') return 'if (';
      return null;
    };

    vm.getBtnColor = function(type) {
      if (!type) return '';
      return vm.typeClass[type].btnColor;
    };

    vm.getBtnBorderColor = function(type) {
      if (!type) return '';
      return vm.typeClass[type].btnBorderColor;
    };

    vm.getIconColor = function(type) {
      if (!type) return '';
      return vm.typeClass[type].iconColor;
    };

    $scope.getInputType = function(type) {
      return vm.typeClass[type].input;
    };

    $scope.getInputType2 = function(str) {
      if(str) {
        if(str.indexOf('#') ===0) return 'Intent';
        else if(str.indexOf('@') === 0) return 'Entity';
        else if(str.indexOf('/') === 0) return 'RegExp';
        else if(str.indexOf('$') === 0) return 'Type';
        else if(str.indexOf('if (') === 0) return 'If';
        else if(str.length > 0) return 'Keyword';
      } else return null;
    };

    var initInput = function(input) {
      var res = [];

      if (input === 'false') {
        res.push([{type:'매칭없음', str:'false'}]);
      } else {
        input.forEach(function(d) {
          var r = [];
          if (d.text) {
            r.push({type: 'Keyword', str: d.text});
          }
          if (d.types) {
            d.types.forEach(function (t) {
              r.push({type: 'Type', str: t});
            });
          }
          if (d.regexp) {
            r.push({type: 'RegExp', str: d.regexp});
          }
          if (d.intent) {
            r.push({type: 'Intent', str: d.intent});
          }
          if (d.entities) {
            d.entities.forEach(function(t) {
              r.push({type: 'Entity', str: t});
            });
          }
          if (d.if) {
            r.push({type:'If', str:d.if});
          }

          res.push(r);
        });
      }
      return res;
    };

    var restoreInput = function(result) {
      var input = [];
      if (result.length == 1 && result[0].length == 1 && result[0][0].type ==='매칭없음') {
        input = 'false';
      } else {
        result.forEach(function(res) {
          var obj = {};
          res.forEach(function(r) {
            if (r.type === 'Keyword') {
              obj.text = r.str;
            } else if (r.type === 'Type') {
              (obj.types || (obj.types = [])).push(r.str);
            } else if (r.type === 'Entity') {
              (obj.entities || (obj.entities = [])).push(r.str);
            } else if (r.type === 'RegExp') {
              obj.regexp = r.str;
            } else if (r.type === 'Intent') {
              obj.intent= r.str;
            } else if (r.type === 'If') {
              obj.if = r.str;
            }
          });
          if (Object.keys(obj).length !== 0)
            input.push(obj);
        });
      }
      return input;
    };

    // dialog output -> 편집용 output 으로 변환
    var procOutput = function(d) {
      // if (d.list) {
      //   r.push({type:'List', str:''+d.list.map(function(item) { return item.title; }), list:d.list});
      // }
      if (d.output) {
        d.text = d.output;
        delete d.output;
      }
      if (!d.kind) {
        if (d.buttons || d.images) {
          d.kind = 'Content';
        } else if (d.call || d.callChild || d.returnDialog || d.returnCall || d.up || d.repeat) {
          d.kind = 'Action';
        } else if (d.list) {
          d.kind = 'List';
        } else {
          d.kind = 'Text';
        }
      }

      if (d.kind === 'Action') {
        if (d.call)
          d.type = 'Call';
        else if (d.callChild)
          d.type = 'CallChild';
        else if (d.returnCall)
          d.type = 'ReturnCall';
        else if (d.return)
          d.type = 'Return';
        else if (d.up)
          d.type = 'Up';
        else if (d.repeat)
          d.type = 'Repeat';
      }
    };

    var initOutput = function(output) {
      var res = [];
      if (Array.isArray(output)) {
        output.forEach(function(d) {
          procOutput(d);
          res.push(d)
        });
      } else {
        if (typeof output === 'string') {
          res.push({kind:'Text', text: output});
        }
        else {
          procOutput(output);
          res.push(output);
        }
      }
      return res;
    };

    // 편집용 output -> dialog output 으로 변환
    var restoreOutput = function(result) {
      var output = [];

      result.forEach(function(res) {
        var o = {};
        switch(res.kind) {
          case 'Text':
            o.if = res.if;
            o.text = res.text;
            break;
          case 'Content':
            o.if = res.if;
            o.text = res.text;
            o.image = res.image;
            o.buttons = res.buttons;
            break;
          case 'List':
            o.list = res.list;
            break;
          case 'Action':
            o = angular.copy(res);
            delete o.text;
            delete o.image;
            delete o.buttons;
            delete o.type;
            break;
          default:
            o = res;
            break;
        }
        o.kind = res.kind;
        output.push(o);
      });
      return output;
    };

    // output tab handling
    vm.outputKind = [
      {name:"Text",  active:true},
      {name:"Content",  active:false},
      {name:"List",  active:false},
      {name:"Action",  active:false},
    ];

    vm.changeOutputKind = function(output, kind) {
      var change = function() {
        vm.outputKind.forEach(function(k) {k.active = false});
        kind.active = true;

        output.kind = kind.name;
        output.if = undefined;
        output.action = undefined;
        output.text = '';
        output.buttons = undefined;
      }


      if(output.text) {
        $('.modal-with-alert').click();
        $('#changeConfirm').on('click', function (e) {
          e.preventDefault();
          $('#changeConfirm').off('click');
          $.magnificPopup.close();
          $timeout(function() {
            change();
          });
        });
      } else {
        change();
      }
    };

    vm.getOutputKind = function(output) {
      if (typeof output === 'string') return 'Text';
      if (output.kind) return output.kind;
      return 'Text';
    };

    // action 타입에 사용되는 select list
    vm.actionList = ['Call','CallChild','ReturnCall','Up', 'Repeat', 'Return'];

    vm.getActionType = function(output) {
      if (vm.getOutputKind(output) != 'Action')
        return;
      if (!output.type || !vm.actionList.indexOf(output.type))
        output.type = "Call";
      return output.type;
    };

    // button handlings
    vm.removeButton = function(output, idx) {
      output.buttons.splice(idx,1);
    };

    vm.addButton = function(output) {
      (output.buttons = output.buttons || []).push({text:''});
    };

    // 수정 열기
    $scope.findOne = function (dialog, isStartNode) {
      if (isStartNode)
        vm.isStartNode = true;
      else
        vm.isStartNode = false;
      vm.edit = 'dialog';
      $scope.dialog = {};
      $scope.dialog.depth = dialog.depth;
      $scope.dialog.name = dialog.name;
      $scope.dialog.input = initInput(dialog.input);
      if (dialog.task && (dialog.task.name || dialog.task.template))
        $scope.dialog.task = dialog.task;
      else if (typeof dialog.task == 'string')
        $scope.dialog.task = {name: dialog.task};

      $scope.dialog.output = angular.copy(initOutput(dialog.output));

      if (dialog.output.length == 0) {
        $scope.addOutput(dialog.input.length == 0);
      } else if (dialog.output.length == 1 && Object.keys(dialog.output[0]).length == 0) {
        $scope.addO($scope.dialog.output[0], dialog.input.length == 0);
      }

      if (dialog.input.length == 0) {
        $scope.addInput();
      }

      vm.selectedContent = 0;

      $resource('/api/dialoginfos/:bot_id/:file_id', {}).get({bot_id: vm.bot_id, file_id: vm.file_id}, function (res) {
        vm.tasks = res.tasks.map(function (t) {
          return {name: t, type: 'User Tasks'}
        });
        vm.types = res.types.map(function (t) {
          return t.name
        });
        vm.type_dic = res.type_dic;

        vm.commonTypes = res.commonTypes;
        if(vm.commonTypes) vm.types = vm.types.concat(vm.commonTypes);

        OpenTasksService.query({botId: $cookies.get('default_bot')}).$promise.then(function (result) {
          vm.commonTasks = result;
          vm.entity = [];
          vm.commonTasks.forEach(function (d) {
            vm.entity[d.name] = d.entity;
          });
          vm.commonTasks = vm.commonTasks.map(function (t) {
            return {name: t.name, displayName: t.displayName, paramSchema: t.paramSchema, type: 'Common Tasks'};
          });
          vm.tasks = vm.tasks.concat(vm.commonTasks);
          vm.tasks.unshift({name: '새로만들기'})
        });
      });

      IntentsService.query({botName: $rootScope.botId}).$promise.then(function (result) {
        vm.intents = result.map(function(i) { return i.name; });
        // console.log(vm.intents)
      }, function (err) {
        console.log(err);
      });

      EntityContentsService.query({botName: $cookies.get('default_bot')}).$promise.then(function (result) {
        // console.log(result);
        vm.entities = result.map(function (i) {
          return i.name
        })
      }, function (err) {
        console.log(err)
      });

      $scope.safeApply();
      $timeout(function() {
        $scope.dialogError = null;
        $scope.openEditor();
        $scope.initButton();
        document.getElementById('name').focus();
      });

    };

    var rightPanelClosed = true;
    // deprecated
    $scope.openEditorTask  = function() {

      if(rightPanelClosed) {
        var main = document.getElementById('main');
        var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
        main.style.marginRight = (mr + 450) + 'px';
        main.style.overflow = 'visible';
      }

      $('#rightPanel').css('width', '450px');
      // $('#content').css('padding-right', '450px');
      $('#modalTaskForm').show();

      rightPanelClosed = false;
    };

    // deprecated
    $scope.closeEditorTask= function() {
      // if(!rightPanelClosed) {
      //   var main = document.getElementById('main');
      //   var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
      //   main.style.marginRight = (mr + 450) + 'px';
      //   main.style.overflow = 'visible';
      // }

      $('#rightPanel').css('width', '0px');
      $('#modalTaskForm').hide();
      // $('#content').css('padding-right', '0px');
      // rightPanelClosed = true;
    };

    // deprecated
    $scope.openEditor = function() {
      if(rightPanelClosed) {
        var main = document.getElementById('main');
        var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
        main.style.marginRight = (mr + 450) + 'px';
        main.style.overflow = 'visible';
      }

      $('#rightPanel').css('width', '450px');
      // $('#content').css('padding-right', '450px');
      $('#modalForm').show();
      rightPanelClosed = false;
    };

    // deprecated
    $scope.closeEditor = function() {
      if(!rightPanelClosed) {
        var main = document.getElementById('main');
        var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
        main.style.marginRight = (mr - 450) + 'px';
        main.style.overflow = '';
      }

      $('#rightPanel').css('width', '0px');
      $('#modalForm').hide();
      // $('#content').css('padding-right', '0px');
      document.getElementById('mainpage').focus();
      rightPanelClosed = true;
    };

    $scope.openEditorIntent  = function() {
      if(rightPanelClosed) {
        var main = document.getElementById('main');
        var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
        main.style.marginRight = (mr + 450) + 'px';
        main.style.overflow = 'visible';
      }

      $('#rightPanel').css('width', '450px');
      // $('#content').css('padding-right', '450px');
      $('#modalIntentForm').show();
      rightPanelClosed = false;
      document.getElementById('intentName').focus();
    };

    // deprecated
    $scope.closeEditorIntent= function() {
      // if(!rightPanelClosed) {
      //   var main = document.getElementById('main');
      //   var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
      //   main.style.marginRight = (mr + 450) + 'px';
      //   main.style.overflow = 'visible';
      // }

      $('#rightPanel').css('width', '0px');
      $('#modalIntentForm').hide();
      // $('#content').css('padding-right', '0px');
      // rightPanelClosed = true;
    };

    $scope.openEditorEntity = function() {
      if(rightPanelClosed) {
        var main = document.getElementById('main');
        var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
        main.style.marginRight = (mr + 450) + 'px';
        main.style.overflow = 'visible';
      }

      $('#rightPanel').css('width', '450px');
      // $('#content').css('padding-right', '450px');
      $('#modalEntityForm').show();
      rightPanelClosed = false;
      document.getElementById('entityName').focus();
    };

    // deprecated
    $scope.closeEditorEntity = function() {
      // if(!rightPanelClosed) {
      //   var main = document.getElementById('main');
      //   var mr = parseInt((main.currentStyle || window.getComputedStyle(main)).marginRight)
      //   main.style.marginRight = (mr + 450) + 'px';
      //   main.style.overflow = 'visible';
      // }

      $('#rightPanel').css('width', '0px');
      $('#modalEntityForm').hide();
      // $('#content').css('padding-right', '0px');
      // rightPanelClosed = true;
    };

    $scope.InputKeyDown = function (event, func) {
      if (event.keyCode == 13) { // enter
        event.preventDefault();
        event.stopPropagation();
        func();
      }
      //$scope.processInput();
    };

    $scope.saveEnter = function(event,func) {
      if (event.keyCode == 13) {
        event.preventDefault();
        event.stopPropagation();

        func();
      }
    };

    // 수정한 node dialog에 저장
    $scope.update = function (isValid) {
      if($scope.dialog.input && $scope.dialog.input.length == 1 && $scope.dialog.input[0].length == 0) {
        $scope.dialog.input[0].push({type: 'Keyword', str: ($scope.processedInput || '')});
        if(vm.curI) vm.curI.str = '';
        $scope.processedInput = '';
      }

      $scope.error = null;
      if (/*$scope.dialog.input[0].length == 0 && */
        ($scope.dialog.output[0].kind == 'Text' || $scope.dialog.output[0].kind == 'Content') &&
        ($scope.dialog.output[0].text == undefined || $scope.dialog.output[0].text == '') /*!isValid*/) {
        // $event.stopPropagation();
        // $scope.$broadcast('show-errors-check-validity', 'dialogForm');
        $scope.dialogError = '필수항목을 입력해 주세요.';
        return false;
      }

      vm.edit = false;
      vm.setChanged(true);

      if(vm.newDialog) {
        if(vm.newDialog.parent) {
          (vm.newDialog.parent.children || (vm.newDialog.parent.children = [])).push(vm.newDialog);

          if (vm.newDialog.parent && vm.newDialog.parent.parent == undefined /*d.depth === 0*/) {
            if (vm.dialog) {
              dialogs.push(vm.newDialog);
            } else {
              common_dialogs.push(vm.newDialog);
            }
          }
        }

        selectedNode = vm.newDialog;
      }

      selectedNode.name = $scope.dialog.name;
      selectedNode.input = restoreInput($scope.dialog.input);
      if ($scope.dialog.task && Object.keys($scope.dialog.task).length == 1)
        selectedNode.task = $scope.dialog.task.name || $scope.dialog.task.template;
      else
        selectedNode.task = $scope.dialog.task;
      selectedNode.output = restoreOutput($scope.dialog.output);
      //selectedNode.output = $scope.dialog.output;

      // selectedSVG.remove();
      selectedSVG = null;

      if(vm.newDialog) _update(selectedNode.parent);
      else _update(selectedNode);

      updateSelected(selectedNode);

      $scope.closeEditor();
      vm.newDialog = null;
      //Dialogs.update(dialog);
    };

    // 전체 dialog 저장
    $scope.save = function(func) {
      vm.changeHistory = [];
      vm.setChanged(false);
      var clear = function(node)
      {
        delete node.parent;
        delete node.x;
        delete node.x0;
        delete node.y;
        delete node.y0;
        delete node.input_text;
        delete node.output_text;
        delete node.image_text;
        delete node.inRaw;
        delete node.inNLP;
        // delete node.buttons;
        delete node.depth;

        if (node.task) {
          delete node.task.type;
          delete node.task.paramSchema;
        }

        if (node._children != null) {
          node.children = node._children;
          node._children = null;
        }

        delete node._children;

        if (node._output != null) {
          node.output = node._output;
          node._output = null;
        }

        delete node._output;

        for(var i = 0; node.input && i < node.input.length; i++) {
          if(node.input[i].regexp) {
            node.input[i].regexp = node.input[i].regexp.replace(/\\/g, '\\\\');
          }
        }

        if (node.children)
          node.children.forEach(clear);
        else if(node.output && Array.isArray(node.output))
          node.output.forEach(clear);
      };

      function clone(obj) {
        var copy;
        if (null == obj || "object" != typeof obj) return obj;

        if (obj instanceof Array) {
          copy = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
          }
          return copy;
        }

        if (obj instanceof Object) {
          copy = {};
          for (var attr in obj) {
            if(attr.indexOf('parent') === 0 || attr.indexOf('top') === 0) copy[attr] = obj[attr];
            else if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
          }
          return copy;
        }
      }

      var sDialogs = clone(dialogs);
      sDialogs.forEach(clear);
      // dialogs.forEach(clear);

      var common = angular.copy(treeData);
      delete common.children;
      common_dialogs[0] = common;
      var sCommons = clone(common_dialogs);
      sCommons.forEach(clear);
      // common_dialogs.forEach(clear);

      return DialogSaveService.update({botId: vm.botId, fileName: vm.fileName, dialogs:sDialogs, commons:sCommons},
        function() {
          $scope.emitMsg(':reset user');
          // $scope.emitMsg(':init');

          notificationService.success('저장되었습니다');

          // console.log("saved");
        }, function(err) {
          console.log(err);
        });
    };

    // call, callChild 등에서 자기 자신 제외한 현재 호출 가능한 dialog 리스트를 가져오는 함수
    vm.dialogList = function() {
      var names = [];

      var findNames = function(d) {
        if (!selectedNode || (selectedNode && d !== selectedNode.name && d !== '시작')) {
          names.push(d.name);
        }
        if (d.children) {
          d.children.forEach(findNames);
        }
        if (d._children) {
          d._children.forEach(findNames);
        }
      };

      dialogs.forEach(findNames);
      vm.otherDialogs.forEach(findNames);
      return names;
    };

    // make nodes and links_internal from dialogs
    var handleInput = function(input) {
      if (Array.isArray(input)) {
        var text = [];
        input.forEach(function(i) {
          if (i.text)
            text.push(/*'[단어] '+ */i.text);
          if (i.types) {
            var types = [];
            i.types.forEach(function (t) {
              types.push(t);
            });
            text.push('[타입] ' + types);
          }
          if (i.entities) {
            var entities = [];
            i.entities.forEach(function (t) {
              entities.push(t);
            });
            text.push('[엔터티] ' + entities);
          }
          if (i.regexp)
            text.push('[정규식] ' + i.regexp);
          if (i.intent)
            text.push('[인텐트] ' + i.intent);
          if (i.if)
            text.push('[조건] ' + i.if);
        });
        return text + "";
      } else {
        // for dialogs from dlg
        if(input == 'string') return input;
        else if(input.types && input.types[0].name) {
          return '[타입] ' + input.types[0].name;
        } else if(input.if) {
          return '[조건] ' + input.if;
        } else {
          return input;
        }
      }
    };

    var handlePrintOutput = function(dialog, output) {
      if (typeof output == 'string') return output.replace(/\n/g,'\\n');
      else if(Array.isArray(output)) {
        var _output = '';
        for (var i = 0; i < output.length; i++) {
          if (i !== 0) _output += ', ';
          _output += handlePrintOutput(dialog, output[i]);
        }
        return _output;
      } else if(output != undefined) {
        var text = [];
        if (typeof output.output === 'string') {
          text.push(/*'[문장] ' + */output.output.replace(/\n/g, '\\n'));
        } else if(typeof output.text === 'string') {
          text.push(/*'[문장] ' + */output.text.replace(/\n/g, '\\n'));
        }

        if (output.if) {
          text.push('[조건] ' + output.if);
        }
        if (output.call) {
          text.push('[Call] ' + output.call);
        }
        if (output.returnCall) {
          text.push('[ReturnCall] ' + output.returnCall);
        }
        if (output.callChild) {
          text.push('[callChild] ' + output.callChild);
        }
        if (output.up) {
          text.push('[up] ' + output.up);
        }
        if (output.repeat) {
          text.push('[repeat] ' + output.repeat);
        }
        if (output.return) {
          text.push('[return] ' + output.return);
        }
        if (output.image) {
          dialog.image_text = output.image.url;
        }
        if (output.buttons) {
          dialog.buttons = output.buttons;
        }
        if (output.list)
          text.push('[리스트] ' + output.list.map(function(item) { return item.title; }));

        return text + "";
      } else {
        return "";
      }
    };

    var initPrintOutput = function(dialog) {
      delete dialog.image_text;
      delete dialog.buttons;
    };

    // dialog traverse 하며 빠진 내용 채워주고 graph 에 보여줄 내용 채움
    var handleDialog = function(dialog)
    {
      dialog.name = dialog.name || (dialog.name = "dialog" + "_" + dialog.id);
      nodes[dialog.name] = nodes[dialog.name] || (nodes[dialog.name] = dialog);
      if (dialog.input === 'false')
        dialog.input = 'false';
      else if (!Array.isArray(dialog.input))
        dialog.input = [{text:dialog.input}];
      nodes[dialog.name].input_text  = handleInput(dialog.input);
      initPrintOutput(dialog);
      nodes[dialog.name].output_text = handlePrintOutput(dialog, dialog.output);

      if (dialog.id)
      {
        var cur = parseInt(dialog.id.substring(vm.fileName.length, dialog.id.length));
        if (isNaN(cur) == false)
          vm.maxId = Math.max(vm.maxId,cur);
      }

      if (dialog.children) {
        dialog.children.forEach(function(child) {
          child.parent = dialog;
          handleDialog(child);
        });
      } else {
        if (Array.isArray(dialog.output) && dialog.output.length > 0 && dialog.output[0].if) {
          dialog.output.forEach(function(_output) {
            _output.parent = dialog;
            if(_output.if && _output.children) {
              _output.children.forEach(function(child) {
                child.parent = dialog;
                handleDialog(child);
              })
            }
          })
        }
      }
    };

    var handleOutput = function(dialog, output) {
      if (Array.isArray(output)) {
        for (var i=0; i < output.length; ++i)
          handleOutput(dialog,output[i]);
      }
      if (output.output) {
        handleOutput(dialog, output.output);
      }

      if (output.options) {
        if (output.options.returnDialog) {
          if (nodes[output.options.returnDialog]) {
            output.options.returnDialog = undefined;
          } else {
            links_internal.push({source: nodes[dialog.name], target: nodes[output.options.returnDialog], type: "returnDialog"});
          }
        }
      }

      if (output.call) {
        if (nodes[output.call]) {
          links_internal.push({source: nodes[dialog.name], target: nodes[output.call], type: "call"});
        } else {
          output.call = undefined;
        }
      }
      if (output.callChild) {
        if (nodes[output.callChild]) {
          links_internal.push({source: nodes[dialog.name], target: nodes[output.callChild], type: "callChild"});
        } else {
          output.callChild = undefined;
        }
      }
      if (output.returnCall) {
        if (nodes[output.returnCall]) {
          links_internal.push({source: nodes[dialog.name], target: nodes[output.returnCall], type: "returnCall"});
        } else {
          output.returnCall = undefined;
        }
      }
    };

    var handleLink = function(dialog)
    {
      if (dialog.children) {
        dialog.children.forEach(function(child) {
          handleLink(child);
          if (nodes[child.name] ) {
            // child relationship is already included in links created by tree
            //links_internal.push({source: nodes[dialog.name], target: nodes[child.name], type: "child"});
          } else {
            console.log("undefined=" + dialog.name + ".child=" + child.name);
          }
        });
      }
      if (Array.isArray(dialog.output)) {
        for (var i=0; i < dialog.output.length; ++i) {
          handleOutput(dialog, dialog.output[i]);
        }
      } else {
        handleOutput(dialog, dialog.output);
      }
    };

    // tree graph 데이터 초기화
    vm.initTreeData = function() {
      handleDialog(common_dialogs[0]);
      treeData = angular.copy(common_dialogs[0]);
      treeData.name = '시작';
      //treeData.id = 'dummystart';
      treeData.children = [];

      for (var i = 0; i < dialogs.length; i++) {
        var d = dialogs[i];
        d.name = d.name || (d.name = "dialog_" + d.id);
      }

      for (var i = 1; i < common_dialogs.length; i++) {
        var d = common_dialogs[i];
        d.name = d.name || (d.name = "common_" + d.id);
      }

      if (vm.dialog) {
        for (var i = 0; i < dialogs.length; i++) {
          var d = dialogs[i];
          d.parent = treeData;
          treeData.children.push(d);
        }
        dialogs.forEach(handleDialog); // for-loop is 10 times faster
        if (vm.show_link) {
          dialogs.forEach(handleLink);
        }
        vm.otherDialogs = common_dialogs;
      } else {
        for (var i = 1; i < common_dialogs.length; i++) {
          var d = common_dialogs[i];
          d.parent = treeData;
          treeData.children.push(d);
        }
        common_dialogs.forEach(handleDialog); // for-loop is 10 times faster
        vm.otherDialogs = dialogs;
      }
      // console.log(nodes);
      // console.log(links_internal);
    };

    // tree reload
    vm.reloadTree = function() {
      $resource('/api/dialogs/:bot_id/:file_id', {}).get({bot_id: vm.bot_id, file_id: vm.file_id}, function(res) {
        vm.botId = res.botId;
        vm.fileName = res.fileName;
        dialogs = res.data;
        common_dialogs = res.common;

        vm.initTreeData();
        // init();
        _init();

      }, function (err) {
        console.log(err)
      });
    };
    vm.reloadTree();

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;

    // Misc. variables
    var i = 0;
    var root;

    // size of the diagram
    var viewerWidth = document.getElementById('tree-container').clientWidth;
    var viewerHeight = document.getElementById('sidebar-left').clientHeight*0.80;

    // size of rect
    var rectW = 250, rectH = 130;
    // height for one node
    var itemHeight = rectH+200;
    // width for one depth
    var labelWidth = 350;

    // transition animation speed
    var duration = 500;

    // icon size of selected node
    var iconSize= 20;

    var tree = d3.layout.tree()
      .size([viewerHeight, viewerWidth]);

    // A recursive helper function for performing some setup by walking through all nodes
    function visit(parent, visitFn, childrenFn) {
      if (!parent) return;

      visitFn(parent);

      var children = childrenFn(parent);
      if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
          visit(children[i], visitFn, childrenFn);
        }
      }
    }

    // Define the zoom function for the zoomable tree
    function zoom() {
      svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree-container").append("svg")
      .attr("width", viewerWidth)
      .attr("height", viewerHeight)
      .attr("id", "basesvg")
      .attr("class", "overlay graph-svg-component")
      .call(zoomListener)
      .on('dblclick.zoom', null);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<image src='" + d.image_text + "' height='150px'>";
      });
    baseSvg.call(tip);

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // d3 graph 초기화
    var init = function(source) {

      // Define the root
      root = treeData;
      root.x0 = viewerHeight / 2;
      root.y0 = 0;

      // Call visit function to establish maxLabelLength
      visit(treeData, function (d) {
        totalNodes++;
        if (d.name != undefined)
          maxLabelLength = Math.max(d.name.length, maxLabelLength);

      }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
      });


      // Layout the tree initially and center on the root node.
      if (source) {
        update(source);
        centerNode(source);
      } else {
        update(root);
        updateSelected(root);
        vm.collapseDepth();
        update(root, true);
        centerNode(root, 'start');
      }
    };

    var links_SVG, links_internal_SVG;

    // 실제 d3 graph를 그리는 함수
    function update(source, collapseAll) {
      if(vm.smallDialog) {
        rectW = 200;
        rectH = 58;
        itemHeight = rectH+30;
        labelWidth = 350;
      }

      if (vm.oneline) {
        rectW = 150;
        rectH = 23;
        itemHeight = rectH+30;
        labelWidth = 250;
      } else {
        rectW = 200;
        rectH = 58;
        itemHeight = rectH+30;
        labelWidth = 350;
      }

      tip.hide();
      // Compute the new height, function counts total children of root node and sets tree height accordingly.
      // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
      // This makes the layout more consistent.
      var levelWidth = [1];
      vm.maxDepth = 0;
      var calcDepth = function(d) {
        vm.maxDepth = Math.max(vm.maxDepth, d.depth);
        if (d.children) {
          d.children.forEach(calcDepth);
        } else if (d._children) {
          d._children.forEach(calcDepth);
        }
      };
      calcDepth(root);

      var childCount = function (level, n) {

        if (n.children && n.children.length > 0) {
          if (levelWidth.length <= level + 1) levelWidth.push(0);

          levelWidth[level + 1] += n.children.length;
          n.children.forEach(function (d) {
            childCount(level + 1, d);
          });
        }
      };

      childCount(0, root);

      var newHeight = d3.max(levelWidth) * itemHeight;
      tree = tree.size([newHeight, viewerWidth]);

      // Compute the new tree layout.
      var nodes_tree = tree.nodes(root).reverse();
      var links = tree.links(nodes_tree);

      // TODO: need to update source and target in other links
      nodes = [];
      links_internal = [];
      //dialogs.forEach(handleDialog);
      handleDialog(treeData);
      if (vm.show_link)
        dialogs.forEach(handleLink);

      // Set widths between levels based on maxLabelLength.
      nodes_tree.forEach(function (d) {
        d.y = (d.depth * labelWidth); //maxLabelLength * 10px
      });

      d3.selectAll('node').remove();

      // Update the nodes…
      var node = svgGroup.selectAll("g.node")
        .data(nodes_tree, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click)
        .on('dblclick', dblclick);


      nodeEnter.append("rect")
        .attr('class', 'nodeRect')
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("rx", 5)
        .attr("ry", 5)
        .style('fill', 'white');    //#DADAEB  //eee

      // add the text
      nodeEnter.append("text")
        .attr("id", "name")
        .attr("class","nodetext nodetitle")
        .style("pointer-events", "none")
        .attr("x", "1em")
        .attr("dy", "1.30em")
        .text(function(d) { return d.name; });

      if (!vm.oneline) {
        nodeEnter.append("line")
          .style("pointer-events", "none")
          .attr("x1", 0)
          .attr("y1", "18")
          .attr("x2", rectW)
          .attr("y2", "18")
          // .attr("stroke-width", 1.2)
          .style("stroke", function(d) { return d3.rgb("#d4d4d4").darker(); });   //7CA4C0

        nodeEnter.append("text")
          .attr("id", "input")
          .attr("class","nodetext")
          .style("pointer-events", "none")
          .attr("x", 7)
          .attr("dy", "3em")
          .text(function(d) { return "< " + (d.input_text ? d.input_text: ""); })
          .call(wrap, rectW-30, 1);

        nodeEnter.append("line")
          .style("pointer-events", "none")
          .attr("x1", 0)
          .attr("y1", "2.8em")
          .attr("x2", rectW)
          .attr("y2", "2.8em")
          .attr("stroke-width", 1)
          // .attr("stroke-dasharray", "0,2 1")
          .attr("stroke", "#d4d4d4");  //gray

        if(vm.smallDialog == false) {
          nodeEnter.append("text")
            .attr("id", "task")
            .attr("class", "nodetext")
            .style("pointer-events", "none")
            .attr("x", 7)
            .attr("dy", "5em")
            .text(function (d) {
              if (d.task && d.task.name)
                return "Task: " + d.task.name;
              else if (d.task)
                return "Task: " + d.task;
              return "";
            })
            .call(wrap, rectW - 25, 2);

          nodeEnter.append("line")
            .style("pointer-events", "none")
            .attr("x1", 0)
            .attr("y1", "4.3em")
            .attr("x2", rectW)
            .attr("y2", "4.3em")
            .attr("stroke-width", 1)
            // .attr("stroke-dasharray", "0,2 1")
            .attr("stroke", "#d4d4d4");  //gray
        }

        nodeEnter.append("text")
          .attr("id", "output")
          .attr("class","nodetext")
          .style("pointer-events", "none")
          .attr("x", 7)
          .attr("dy", vm.smallDialog? "5em":"7em")
          .text(function(d) { return "> " + (d.output_text ? d.output_text : ""); })
          .call(wrap, rectW-25, vm.smallDialog?1:2);

        var isRepeat = function(d) {
          var ret = null;
          if (d.output) {
            if (Array.isArray(d.output)) {
              d.output.forEach(function(o) {
                if (o.repeat && typeof o.repeat === 'string')
                  ret = o.repeat;
              });
            } else {
              if (d.output.repeat && typeof d.output.repeat === 'string')
                ret = d.output.repeat;
            }
          }
          return ret;
        };

        nodeEnter.append('text')
          .attr("class", "icon2")
          .style("pointer-events", "none")
          .attr("x", rectW-20)
          .attr("dy", vm.smallDialog? "4em":"6em")
          .text(function(d) {
            if (isRepeat(d) != null)
              return '\uf01e';
            else
              return '';
          } );

        if(vm.smallDialog == false) {
          nodeEnter.append("line")
            .style("pointer-events", "none")
            .attr("x1", 0)
            .attr("y1", "6.7em")
            .attr("x2", rectW)
            .attr("y2", "6.7em")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "0,2 1")
            .attr("stroke", "gray");

          var showTip = function (d) {
            if (d.image_text)
              tip.show(d);
          };

          nodeEnter.append("text")
            .attr("id", "image")
            .attr("class", "nodetext")
            .attr("x", 7)
            .attr("dy", "10em")
            //.style("text-decoration", "underline")
            .text(function (d) {
              return (d.image_text ? "Image: " + d.image_text : "");
            })
            .on('mouseover', showTip)
            .on('mouseout', tip.hide)
            .call(wrap, rectW - 25, 1);

          nodeEnter.append("text")
            .attr("id", "button")
            .attr("class", "nodetext")
            .style("pointer-events", "none")
            .attr("x", 7)
            .attr("dy", "12em")
            .text(function (d) {
              return (d.buttons ? "Button: " + d.buttons + "" : "");
            })
            .call(wrap, rectW - 25, 1);
        }

      }

      // deprecated
      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
          return collapseAll ?
            "translate(" + source.y + "," + source.x + ")" :
            "translate(" + d.parent.y + "," + d.parent.x + ")" ;

        })
        .remove();

      nodeExit.select("circle")
        .attr("r", 0);

      nodeExit.select("text")
        .style("fill-opacity", 0);

      // Update the links…
      var drawLink = function(link, linkArray, className, diag) {
        link = svgGroup.selectAll("path." + className)
          .data(linkArray, function (d) {
            return d.source.id + d.target.id + d.type;
          });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", function(d) { return className + " " + d.type; })
          .attr("x", rectW /2 )
          .attr("y", rectH /2)
          .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
          .attr("d", function (d) {
            var o = {
              x: source.x0,
              y: source.y0,
            };
            return diag({
              source: o,
              target: o
            });
          });

        // Transition links to their new position.
        link
          .filter(function(d) { return d.source.y !== d.target.y;})
          .transition()
          .duration(duration)
          .attr("d", diag);

        link
          .filter(function(d) { return d.source.y === d.target.y;})
          .transition()
          .duration(duration)
          .attr("d", function(d) {
            var sx = d.source.x + rectH/2;
            var sy = d.source.y + rectW;
            var tx = d.target.x + rectH/2;
            var ty = d.target.y + rectW;
            var cx = (sx+tx) / 2;
            var cy = sy + Math.abs(sx-tx) / itemHeight * 40 + 50;
            return "M" + sy + " " + sx + " Q " + cy + " " + cx +" " + ty + " " + tx;
          });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function (d) {
            var o;
            if (collapseAll) {
              o = {
                x: source.x,
                y: source.y
              };
            } else {
              o = {
                x: d.source.x,
                y: d.source.y
              };
            }
            return diag({
              source: o,
              target: o
            });
          })
          .remove();
      };
      // define a d3 diagonal projection for use by the node paths later on.
      var diagonal = d3.svg.diagonal()
        .source(function(d) {
          var source_y = d.source.y;
          if (d.source.y < d.target.y) {
            source_y += rectW;
          } else if (d.source.y === d.target.y) {
            source_y += rectW;
          }
          return {"x": d.source.x + rectH/2, "y": source_y };
        })
        .target(function(d) {
          var target_y = d.target.y;
          if (d.source.y > d.target.y) {
            target_y += rectW;
          } else if (d.source.y === d.target.y) {
            target_y += rectW;
          }
          return {"x": d.target.x + rectH/2, "y": target_y };
        })
        .projection(function (d) {
          return [d.y, d.x];
        });
      drawLink(links_SVG, links, "link", diagonal);

      // Per-type markers, as they don't inherit styles.
      baseSvg.append("defs").selectAll("marker")
        .data(["call","callChild", "returnCall", "returnDialog", "child"])
        .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

      // define a d3 diagonal projection for use by the node paths later on.
      drawLink(links_internal_SVG, links_internal, "link_internal", diagonal);

      // Stash the old positions for transition.
      nodes_tree.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      if(currentNode) {
        // draw selector
        var nodeId = "current" + currentNode.id;
        svgGroup.append("rect")
          .attr("id", nodeId)
          .attr("x", currentNode.y)
          .attr("y", currentNode.x)
          .attr("width", rectW)
          .attr("height", rectH)
          .attr("rx", 5)
          .attr("ry", 5)
          .style("pointer-events", "none")
          .style('fill', 'black')
          .style('opacity', '0.3');

        setTimeout(function () {
          d3.select("#" + nodeId).remove();
          currentNode = undefined;
        }, 1000);
      }

      if(selectedNode && selectedSVG != null) {
        // draw selector
        d3.selectAll(".selectedRect").remove();
        d3.selectAll(".icon").remove();

        selectedSVG.append("rect")
          .attr("class", "selectedRect")
          .attr("id", "selected")
          .attr("y", -iconSize)
          .attr("width", rectW)
          .attr("height", rectH+iconSize)
          .attr("rx", 5)
          .attr("ry", 5);
        selectedSVG.append("rect")
          .attr("class", "selectedRect")
          .attr("id", "selected")
          .attr("y", -iconSize)
          .attr("width", rectW)
          .attr("height", iconSize)
          .style("pointer-events", "none")
          .style('fill', '#70c8e2')    //lightsteelblue
          .style("opacity", 0.8)
          .attr("rx", 5)
          .attr("ry", 5);

        if (selectedNode.depth == 0) {
          selectedSVG.append('text')
            .on("click", edit)
            .attr("class", "icon")
            .attr("x", rectW-iconSize*2)
            .attr("y", -4)
            .text(function(d) { return '\uf044';} );
          selectedSVG.append('text')
            .on("click", addChild)
            .attr("class", "icon")
            .attr("x", rectW-iconSize)
            .attr("y", -4)
            .text(function(d) { return '\uf067';} );
          return;
        }

        if (selectedNode.parent && selectedNode.parent.children &&
          selectedNode.parent.children.indexOf(selectedNode) > 0) {
          selectedSVG.append('text')
            .on("click", goUp)
            .attr("class", "icon")
            .attr("x", 10)
            .attr("y", -5)
            .text(function(d) { return '\uf062';} );
        }
        if (selectedNode.parent && selectedNode.parent.children &&
          selectedNode.parent.children.indexOf(selectedNode) < selectedNode.parent.children.length-1) {
          selectedSVG.append('text')
            .on("click", goDown)
            .attr("class", "icon")
            .attr("x", 10+iconSize)
            .attr("y", -5)
            .text(function(d) { return '\uf063';} );
        }

        selectedSVG.append('text')
          .on("click", edit)
          .attr("class", "icon")
          .attr("x", rectW-iconSize*4)
          .attr("y", -4)
          .text(function(d) { return '\uf044';} );
        selectedSVG.append('text')
          .on("click", addChild)
          .attr("class", "icon")
          .attr("x", rectW-iconSize*3)
          .attr("y", -4)
          .text(function(d) { return '\uf067';} );
        selectedSVG.append('text')
          .on("click", deleteNode)
          .attr("class", "icon")
          .attr("x", rectW-iconSize*2)
          .attr("y", -5)
          .text(function(d) { return '\uf00d';} );
        selectedSVG.append('text')
          .on("click", toggleAndCenter)
          .attr("class", "icon")
          .attr("x", rectW-iconSize)
          .attr("y", -4)
          .text(function(d) { if (d.children) return '\uf053'; else if (d._children) return '\uf054';} );

        // move selected dialog to the top
        selectedSVG.each(function() {
          this.parentNode.appendChild(this);
        })


      } else {
        d3.selectAll(".selectedRect").remove();
        d3.selectAll(".icon").remove();
      }
    }

    // node interactions
    var dblclick_occured = false; // to distinguish dblclick and click events
    var t = null;
    var tempSVG = null;

    // Toggle children on click.
    function click(d) {
      tempSVG = d3.select(this);
      if (d3.event.defaultPrevented) return; // click suppressed
      if (t) return; // When Timeout already present, ignore this handler
      t = setTimeout(function(){
        if (dblclick_occured){
          dblclick_occured = false;
          t = null;
          return;
        }

        t = null;
        selectedNode = d;
        selectedSVG = tempSVG;
        update(d);
        centerNode(d);
        if (vm.edit === 'dialog')
          edit(d);
      }, 200); // time to doubleclick
    }

    // Toggle children on click.
    function dblclick(d) {
      dblclick_occured = true;
      if (d3.event.defaultPrevented) return; // click suppressed
      selectedNode = d;
      selectedSVG = d3.select(this);
      update(d);
      centerNode(d);
      edit(d);
    }

    // function toggleAndCenter(d) {
    //   d = toggleChildren(d);
    //   update(d);
    //   centerNode(d);
    // }
    //
    // // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
    // function centerNode(source, isStart) {
    //   var svg  = baseSvg.selectAll(".node").filter(function(d) {
    //     if (d.id === source.id)
    //       return true;
    //   })[0];
    //   var offset = svg[0].getBoundingClientRect();
    //   if (offset["left"] == 0 && offset["bottom"] == 0)
    //     return;
    //   //console.log([offset["left"], offset["top"],offset["right"],offset["bottom"]]+"");
    //   if (isStart !=='start' && offset["left"] > 300 && offset["top"] > 200 && offset["top"] < viewerHeight && offset["left"] < viewerWidth)
    //     return;
    //
    //   var scale = zoomListener.scale();
    //   var x = -source.y0;
    //   if (isStart != undefined) {
    //     if (isStart === 'start') {
    //       x -= 300;
    //     } else {
    //       //x -= 400;
    //     }
    //   }
    //   var y = -source.x0 - 100;
    //   x = x * scale + viewerWidth / 2;
    //   y = y * scale + viewerHeight / 2;
    //
    //   d3.select('g').transition()
    //     .duration(duration)
    //     .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    //   zoomListener.scale(scale);
    //   zoomListener.translate([x, y]);
    // }
    //
    // child node 추가
    // function addChild(d) {
    //   var isCallNode = false;
    //   if (d.output) {
    //     if (Array.isArray(d.output)) {
    //       d.output.forEach(function(o) {
    //         if (o.call) {
    //           isCallNode = true;
    //         }
    //       });
    //     } else {
    //       if (d.output.call) {
    //         isCallNode = true;
    //       }
    //     }
    //   }
    //
    //   if (isCallNode) {
    //     $scope.message = "Output이 Call인 노드는 Child노드를 추가할 수 없습니다";
    //     $scope.choice = false;
    //     var modalInstance = $uibModal.open({
    //       templateUrl: 'modules/bots/client/views/modal-bots.html',
    //       scope: $scope
    //     });
    //     modalInstance.result.then(function (response) {
    //       console.log(response);
    //     });
    //     return;
    //   }
    //
    //   vm.setChanged(true, true);
    //   if (d3.event)
    //     d3.event.stopPropagation();
    //   if (d._children) {
    //     toggleChildren(d);
    //   }
    //   var newDialog = {name:"", id:(!vm.dialog ? "common" : "") + vm.fileName + (++vm.maxId),
    //     filename:vm.fileName+(!vm.dialog?"common" : "") , input:[], output:[]};
    //   (d.children || (d.children = [])).push(newDialog);
    //   if (d.depth === 0) {
    //     if (vm.dialog) {
    //       dialogs.push(newDialog);
    //     } else {
    //       common_dialogs.push(newDialog);
    //     }
    //   }
    //
    //   update(d);
    //
    //   updateSelected(newDialog);
    //
    //   edit(selectedNode);
    // }
    //
    function initSelect() {
      selectedNode = null;
      selectedSVG = null;
    }
    //
    // src, target 노드 swap
    // function swapNode(parent,src, target) {
    //   var srcNode = parent.children[src];
    //   var targetNode = parent.children[target];
    //
    //   var temp = srcNode;
    //   parent.children[src] = targetNode;
    //   parent.children[target] = temp;
    //
    //   if (parent.depth == 0) {
    //     var srcDialog, targetDialog;
    //     var srcIdx, targetIdx;
    //     if (vm.dialog) {
    //       for (var i=0; i < dialogs.length; ++i) {
    //         if (dialogs[i].id === srcNode.id) {
    //           srcDialog = dialogs[i];
    //           srcIdx = i;
    //         }
    //         if (dialogs[i].id === targetNode.id) {
    //           targetDialog = dialogs[i];
    //           targetIdx = i;
    //         }
    //       }
    //       var temp = srcDialog;
    //       dialogs[srcIdx] = targetDialog;
    //       dialogs[targetIdx] = temp;
    //     } else {
    //       for (var i=0; i < common_dialogs.length; ++i) {
    //         if (common_dialogs[i].id === srcNode.id) {
    //           srcDialog = common_dialogs[i];
    //           srcIdx = i;
    //         }
    //         if (common_dialogs[i].id === targetNode.id) {
    //           targetDialog = common_dialogs[i];
    //           targetIdx = i;
    //         }
    //       }
    //       var temp = srcDialog;
    //       common_dialogs[srcIdx] = targetDialog;
    //       common_dialogs[targetIdx] = temp;
    //     }
    //   }
    //
    //   updateSelected(srcNode);
    // }
    //
    // assumption: idx is already checked when creating buttons for the following actions
    // 위에 노드와 swap
    // function goUp(d) {
    //   vm.setChanged(true , true);
    //   var idx = d.parent.children.indexOf(d);
    //   swapNode(d.parent, idx, idx-1 );
    // }
    //
    // // 아래 노드와 swap
    // function goDown(d) {
    //   vm.setChanged(true, true);
    //   var idx = d.parent.children.indexOf(d);
    //   swapNode(d.parent, idx, idx+1 );
    // }
    //
    // function deleteNode(d) {
    //   if (d.name === "시작")
    //     return;
    //   vm.setChanged(true, true);
    //   if (d3.event)
    //     d3.event.stopPropagation();
    //   initSelect();
    //
    //   if (d.parent && d.parent.children) {
    //     for (var i=0; i < d.parent.children.length; ++i) {
    //       if (d.parent.children[i].id === d.id) {
    //         d.parent.children.splice(i,1);
    //         break;
    //       }
    //     }
    //   }
    //
    //   if (d.depth == 1) {
    //     for (var i=0; i < dialogs.length; ++i) {
    //       if (dialogs[i].id === d.id) {
    //         dialogs.splice(i,1);
    //         break;
    //       }
    //     }
    //   }
    //
    //   //TODO: need to remove other links such as call...
    //   delete_int(d);
    //   updateSelected(d.parent);
    // }

    function delete_int(d) {
      if (d.children) {
        d.deleted_children = d.children;
        d.deleted_children.forEach(delete_int);
        d.children = null;
      }
    }

    // d3 event와 angular event 연결 (수정 버튼)
    function edit(d) {
      if (d3.event)
        d3.event.stopPropagation();
      if (d.name === "시작") {
        angular.element(document.getElementById('control')).scope().findOne(d, true);
      } else {
        angular.element(document.getElementById('control')).scope().findOne(d);
      }
    }

    // wrapping text in d3 graph
    function wrap(text, width, maxLine) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 5).attr("dy", dy + "em");

        var linenum = 1;
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            if (++linenum > maxLine) {
              line.pop();
              tspan.text(line.join(" ") + "...");
              return;
            }
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 5).attr("dy", lineHeight + "em").text(word);
          }
        }
      });
    }

    /********************* image *********************/
    $scope.imageURL = undefined;
    $scope.error = {};
    $scope.success = {};

    // Create file imageUploader instance
    $scope.imageUploader = new FileUploader({
      url: '/api/user-bots/image-files-replace',
      alias: 'uploadImageFile',
      autoUpload: true
    });

    $scope.imageUploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        if('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1){
          $scope.success.image = null;
          $scope.error['image'] = '이미지 파일이 아니에요'
        }else {
          $scope.error.image = null;
        }
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.imageUploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success['image'] = true;

      vm.current.image = { url: '/files/' + response.filename, displayname: response.displayname };
      // Clear upload buttons
      $scope.cancelImageUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.imageUploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelImageUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadImageFiles = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.imageUploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelImageUpload = function () {
      $scope.imageUploader.clearQueue();
      // $scope.imageURL = $scope.user.profileImageURL;
    };

    // depth handling
    // Helper functions for collapsing and expanding nodes.
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function expand(d) {
      if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
      }
    }

    // Toggle children function
    function toggleChildren(d) {
      if (d3.event)
        d3.event.stopPropagation();

      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      } else if (Array.isArray(d.output) && d.output.length > 0 && d.output[0].if) {
        d._output = d.output;
        d.output = null;
      } else if (d._output) {
        d.output = d._output;
        d._output = null;
      }

      return d;
    }

    vm.handleCurrent = function(d) {
      if (d.depth == vm.depth) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        }
      } else {
        if (d.children) {
          d.children.forEach(vm.handleCurrent);
        }
        if (d._children) {
          d.children = d._children;
          d._children = null;
          d.children.forEach(vm.handleCurrent);
        }
      }
    };

    vm.collapseDepth = function() {
      if (!treeData)
        return;
      if (treeData.children) {
        treeData.children.forEach(vm.handleCurrent);
      }
    };

    vm.addDepth = function() {
      if (vm.depth >= vm.maxDepth)
        return false;
      ++vm.depth;
      vm.collapseDepth();
      update(treeData);
      if (selectedNode) {
        centerNode(selectedNode);
      }
    };

    vm.expandAll = function() {
      vm.depth = vm.maxDepth;
      vm.collapseDepth();
      update(treeData);
      if (selectedNode) {
        centerNode(selectedNode);
      } else {
        centerNode(treeData);
      }
    };

    vm.collapseAll = function() {
      vm.depth = 1;
      vm.collapseDepth();
      update(treeData, true);
      centerNode(treeData);
    };

    vm.minusDepth = function() {
      if (vm.depth > 1) {
        --vm.depth;
        vm.collapseDepth();
        update(treeData);
        if (selectedNode) {
          centerNode(selectedNode);
        }
      }
    };

    // show/hide links
    vm.show_link = false;
    vm.showLink = function() {
      vm.show_link = true;
      update(treeData);
    };
    vm.hideLink = function() {
      vm.show_link = false;
      update(treeData);
    };

    // oneline/detail view
    vm.oneline = false;
    // vm.showOneline = function() {
    //   vm.oneline = true;
    //   d3.selectAll('.node').remove();
    //   d3.selectAll('path').remove();
    //   selectedSVG =null;
    //   update(treeData);
    //   if (selectedNode) {
    //     selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
    //       if (d.id === selectedNode.id)
    //         return true;
    //     });
    //     update(selectedNode);
    //   }
    // };
    // vm.showDetail = function() {
    //   vm.oneline = false;
    //   d3.selectAll('.node').remove();
    //   d3.selectAll('path').remove();
    //   selectedSVG =null;
    //   update(treeData);
    //   if (selectedNode) {
    //     selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
    //       if (d.id === selectedNode.id)
    //         return true;
    //     });
    //     update(selectedNode);
    //   }
    // };

    // show dialogs or common dialogs
    vm.dialog = true;
    vm.showDialog = function() {
      vm.changeHistory = [];
      vm.dialog= true;
      d3.selectAll('.node').remove();
      d3.selectAll('path').remove();
      selectedSVG =null;
      vm.initTreeData();
      _init();
    };
    vm.showCommon = function() {
      vm.changeHistory = [];
      vm.dialog= false;
      d3.selectAll('.node').remove();
      d3.selectAll('path').remove();
      selectedSVG =null;
      vm.initTreeData();
      _init();
    };

    // to send msg to chatting window
    $scope.emitMsg = function(msg) {
      Socket.emit('send_msg', {
        bot: vm.botId,
        user: vm.userId,
        msg: msg
      });
    };

    // for task template (pasted from playchat.ai code) which should be provided as a seperate module to be shared
    var types = {
      "string": {"type":"string"},
      "date" : {"type":"string", "format":"date"},
      "datetime" : {"type":"string", "format":"datetime"},
      "time" : {"type":"string", "format":"time", "options": {"grid_columns":3}},
      "number" : {"type":"string", "format":"number"},
      "image" : {
        "type":"string",
        "format":"image",
        "readonly":"true",
      },
    };

    var jsonEditor;

    // schema parsing
    vm.parseSchema = function(dataSchema) {
      var jsonSchema;
      try {
        jsonSchema = JSON.parse(dataSchema);
      } catch(e) {
        alert("invalid schema" + e.message);
        return;
      }

      // console.log(jsonSchema);

      var schema = {};

      Object.keys(jsonSchema).forEach(function(key) {
        if (jsonSchema[key].hidden) return;
        var type = jsonSchema[key].type.toLowerCase();
        if (!types[type]) {
          switch (type) {
            case "enum":
              schema[key] = {type: "string", options:{grid_columns:3}, enum: jsonSchema[key].data};
              break;
            case "list":
              schema[key] = {
                type: "array",
                format: "table",
                uniqueItems: true,
                options: {grid_columns:12},
                items: {
                  type: "object",
                  title: jsonSchema[key]['item_title'] ? jsonSchema[key]['item_title'] : "항목",
                  /*format:"grid",*/
                  "properties": vm.parseSchema(jsonSchema[key].schema)}
              };
              break;
            default:
              console.log("unknown type: " + type + "in template schema:" + jsonSchema);
              break;
          }
        } else {
          schema[key] = angular.copy(types[type]);
        }
        var keys = Object.keys(jsonSchema[key]);
        for (var i=0; i < keys.length; ++i) {
          if (keys[i] != 'type' && keys[i] != 'enum')
            schema[key][keys[i]] = jsonSchema[key][keys[i]];
          //TODO: move to template definition
          if (key === 'address') {
            schema[key]["options"] = {grid_columns: 12};
            schema[key]["readonly"] = true;
          }
          if (key === 'startTime')
            schema[key]["default"] = '09:00';
          if (key === 'endTime')
            schema[key]["default"] = '18:00';
        }
      });
      return schema;
    };

    vm.handleEditor = function(paramSchema) {
      // console.log(paramSchema);

      // init json editor
      JSONEditor.defaults.options.theme = 'bootstrap3';
      JSONEditor.defaults.options.iconlib= 'fontawesome4';
      JSONEditor.defaults.options.required_by_default = 'true';
      JSONEditor.defaults.options.disable_array_delete_all_rows = 'true';
      JSONEditor.defaults.options.disable_array_delete_last_row = 'true';
      JSONEditor.defaults.language = "kr";
      JSONEditor.defaults.languages.kr = {
        error_uniqueItems: "리스트에 중복된 항목이 있습니다",
        button_add_row_title: "{{0}} 추가",
      };
      //JSONEditor.defaults.options.show_erros = 'change';

      // to validate inputs such as handphone number
      var custom_validator = function(schema, value, path) {
        var errors = [];

        if (path === "root.phone") {
          var regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
          if (!regExp.test(value))
            errors.push({
              path: path,
              property: 'format',
              message: "전화번호를 입력해주세요"
            });
          return errors;
        }

        if (path === "root.mobile") {
          var regExp = /^\d{3}-\d{3,4}-\d{4}$/;
          if (!regExp.test(value))
            errors.push({
              path: path,
              property: 'format',
              message: "휴대폰 번호를 입력해주세요"
            });
          return errors;
        }

        if (path === "root.address") {
          if (value === "") {
            errors.push({
              path: path,
              property: 'format',
              message: schema.title + "를 입력해주세요"
            });
            return errors;
          }
        }

        if (schema.format !== "image" && value === "") {
          // Errors must be an object with `path`, `property`, and `message`
          var msg;
          switch (schema.format) {
            case 'date': msg = "날짜를 입력해주세요"; break;
            case 'time': msg = "시각을 입력해주세요"; break;
            case "image": msg = "이미지 파일을 선택해주세요"; break;
            default: msg = "내용을 입력해주세요"; break;
          }
          errors.push({
            path: path,
            property: 'format',
            message: msg
          });
        }
        return errors;
      };

      if (JSONEditor.defaults.custom_validators.length == 0) {
        JSONEditor.defaults.custom_validators.push(custom_validator);
      }

      $scope.ierror = {};
      $scope.isuccess = {};

      var schema = {
        type: "object",
        title: $scope.dialog.task.name || $scope.dialog.task.template,
        properties: {},
        // format: "grid",
      };

      schema.properties = vm.parseSchema(paramSchema);

      // console.log("schema="+ JSON.stringify(schema));

      if (jsonEditor) {
        jsonEditor.destroy();
      }

      jsonEditor = new JSONEditor(document.getElementById('editor_holder'), {
        schema: schema,
        disable_collapse: true,
        disable_properties: true,
        disable_edit_json: true,
        disable_array_reorder: true,
        grid_columns: 3,
      });

      $compile(document.getElementById('editor_holder'))($scope);
      if ($scope.dialog.task) {
        var temp = angular.copy($scope.dialog.task);
        delete temp.name;
        delete temp.template;
        delete temp.paramSchema;
        delete temp.type;
        delete temp.displayName;

        // console.log("given input=" + JSON.stringify(temp));
        jsonEditor.setValue(temp);
      }

      // editor 내에 list 에 element 추가시 자동으로 $compile 불러주기
      jsonEditor.on('change', function() {
        // console.log('editor.onchange -> $compile editor');
        var inputList = document.getElementsByName("mine");
        var compileList = [];
        for (var idx=0; idx < inputList.length; ++idx) {
          var input = inputList[idx];
          if (input.getAttribute("compiled") && input.getAttribute("compiled") == "false") {
            compileList.push(input);
          }
        }
        $compile(compileList)($scope);
        compileList.forEach(function(obj) {
          obj.setAttribute("compiled", "true");
        });

        jsonEditor.options.show_errors = undefined;
      });
    };

    $scope.taskInput = '';
    $scope.selectTask = function(item, model) {
      if(item.name === '새로만들기') {
        var newItem = {name: $scope.taskInput, type: 'User Tasks'}
        vm.tasks.push(newItem)
        $scope.dialog.task = newItem;
        $scope.addTask(newItem.name);
      }
    }

    // editor에서 task 열어주는 함수
    $scope.openTask = function(task, isCommon) {
      if (!$scope.dialog.task || ($scope.dialog.task.name || $scope.dialog.task.template) !== task.name)
        $scope.dialog.task = task;
      vm.edit = 'task';
      if (isCommon) {
        if (task.paramSchema != undefined) {
          $scope.dialog.task.paramSchema = task.paramSchema;
          vm.handleEditor(task.paramSchema);
        }

        $timeout(function() {
          $scope.closeEditor();
          $scope.openEditorTask();
        });
      } else {
        $scope.closeEditor();
        vm.fromTask = true;
        vm.changeTab(vm.tabs[1]);

        $scope.setPosition(task);
      }
    };

    // output-list에 image upload or content image upload시 사용
    vm.setInput = function(cur) {
      vm.current = cur;
    };

    $scope.openIntent = function(task, isCommon) {
      $scope.intent = new IntentsService({botName: $rootScope.botId});
      $timeout(function() {
        $scope.closeEditor();
        $scope.openEditorIntent();
      });
    };

    // deprecated
    $scope.openList = function(task, isCommon) {
      vm.curO.filename = '';
      $timeout(function() {
        $('.modal-with-list').click();
      });

    };

    $scope.openEntity = function(task, isCommon) {
      $scope.entity = new EntitysService({botName: $rootScope.botId});
      $scope.closeEditor();
      $scope.openEditorEntity();
    };

    // editor에서 graph editor로 돌아가기
    $scope.backToEdit = function(ok) {
      vm.edit = 'dialog';
      if (!ok) {
        if ($scope.dialog.task && $scope.dialog.task.name)
          $scope.dialog.task = {name:$scope.dialog.task.name};
        else
          $scope.dialog.task = undefined;
      } else {
        var temp = jsonEditor.getValue();
        temp.template = $scope.dialog.task.name;
        temp.type = $scope.dialog.task.type;
        temp.paramSchema=  $scope.dialog.task.paramSchema;

        $scope.dialog.task = temp;
      }

      if (vm.curO && vm.curO.type === 'List')
        $scope.resetO();

      $timeout(function() {
        $scope.closeEditorTask();
        $scope.openEditor();
      });
    };

    $scope.backToEditIntent = function(ok) {
      vm.edit = 'dialog';
      if (!ok) {
      } else {
        vm.curInlineInput.push({type: 'Intent', str: $scope.intent.name});
      }

      $timeout(function() {
        $scope.closeEditorIntent();
        $scope.openEditor();
      });
    };

    $scope.backToEditEntity = function(ok) {
      vm.edit = 'dialog';
      if (!ok) {
      } else {
        vm.curInlineInput.push({type: 'Entity', str: '@'+$scope.entity.name});
      }

      $timeout(function() {
        $scope.closeEditorEntity();
        $scope.openEditor();
      });
    };

    IntentsService.query({botName: $cookies.get('default_bot')}).$promise.then(function (result) {
      vm.intents = result.map(function(i) { return i.name; });
    }, function (err) {
      console.log(err);
    });

    EntityContentsService.query({botName: $cookies.get('default_bot')}).$promise.then(function (result) {
      vm.entities = result.map(function (i) {
        return i.name
      })
    }, function (err) {
      console.log(err);
    });

    vm.inlineInputFocus = function (index, focus) {
      $timeout(function () {
        var textareaTarget = document.querySelector('#inlineInput_' + index);
        if(focus == 'focus'){
          textareaTarget.setAttribute("rows", 2);
          document.getElementById('inlineInput_' + index).focus()
        }else {
          textareaTarget.setAttribute("rows", 1);
        }
      })
    };

    vm.curInputMention = false;
    vm.searchTopic = function(topicTerm, target) {
      var topicList = [];
      if(target == 'entity'){
        vm.curInputMention = true;
        topicList.push('새로만들기');
        angular.forEach(vm.entities, function(item) {
          if (item.toUpperCase().indexOf(topicTerm.toUpperCase()) >= 0) {
            topicList.push(item);
          }
        });
        vm.matchedEntities = topicList;
      }else if(target == 'intent' || vm.curI.str.indexOf('#') === 0){
        vm.curInputMention = true;
        topicList.push('새로만들기');
        angular.forEach(vm.intents, function(item) {
          if (item.toUpperCase().indexOf(topicTerm.toUpperCase()) >= 0) {
            topicList.push(item);
          }
        });
        vm.matchedIntents = topicList;
      }else if(target == 'type'){
        vm.curInputMention = true;
        topicList.push('새로만들기');
        angular.forEach(vm.types, function(item) {
          if (item.toUpperCase().indexOf(topicTerm.toUpperCase()) >= 0) {
            topicList.push(item);
          }
        });
        vm.matchedTypes = topicList;
      }
    };

    vm.curInlineInput;
    vm.getTopicTextRaw = function(topic, inlineInput) {
      if(vm.curI.str.indexOf('@') > -1){
        vm.curInputMention = false;
        if(topic == '새로만들기') {
          vm.curInlineInput = inlineInput;
          $scope.openEntity();
        } else inlineInput.push({type: 'Entity', str: topic});
      }else if(vm.curI.str.indexOf('#') > -1){
        vm.curInputMention = false;
        if(topic == '새로만들기') {
          vm.curInlineInput = inlineInput;
          $scope.openIntent();
        } else inlineInput.push({type: 'Intent', str: topic});
      }else if(vm.curI.str.indexOf('/') == 0){
        inlineInput.push({type: 'RegExp', str: topic});
      }else if(vm.curI.str.indexOf('$') == 0){
        vm.curInputMention = false;
        if(topic == '새로만들기') {
          vm.curInlineInput = inlineInput;
          var typeName = vm.curI.str.substring(1);
          inlineInput.push({type: 'Type', str: typeName});
          $scope.addNewType(typeName);
        } else inlineInput.push({type: 'Type', str: topic});
      }
      vm.curI.str = '';
      return '';
    };

    $scope.inlineInputKeyDown = function (event, inlineInput) {
      if(event.keyCode == 13 && (vm.curI.str.indexOf('@') != 0) && (vm.curI.str.indexOf('#') != 0) && (vm.curI.str.indexOf('/') != 0) && (vm.curI.str.indexOf('$') != 0) && (vm.curI.str.indexOf('if') != 0)){
        event.preventDefault();
        event.stopPropagation();
        $http.get('/api/nluprocess/'+vm.curI.str).then(function (res) {
          $scope.processedInput = res.data;
          inlineInput.push({type: 'Keyword', str: $scope.processedInput});
          vm.curI.str = '';
          $scope.processedInput = '';
        }, function (err) {
          console.log(err);
        });
      }
      if((event.keyCode == 13 || event.keyCode == 191) && (vm.curI && vm.curI.str.indexOf('/') == 0)){
        vm.curI.str = vm.curI.str.slice(1);
        inlineInput.push({type: 'RegExp', str: vm.curI.str});
        vm.curI.str = '';
        $scope.processedInput = '';
        event.preventDefault();
        event.stopPropagation();
      }
      if((event.keyCode == 13 || (event.shiftKey && event.keyCode == 48)) && (vm.curI.str.indexOf('if (') == 0)){
        vm.curI.str = vm.curI.str.slice(4);
        inlineInput.push({type: 'If', str: vm.curI.str});
        vm.curI.str = '';
        $scope.processedInput = '';
        event.preventDefault();
        event.stopPropagation();
      }

      if(event.keyCode == 70 && vm.curI && vm.curI.str == 'i') {
        vm.curI.str = 'if ('
        event.preventDefault();
        event.stopPropagation();
      }

      if(event.keyCode == 191) {      // /
        // event.preventDefault();
        event.stopPropagation();
      }

      if(event.keyCode == 27) {      // esc
        // event.preventDefault();
        // event.stopPropagation();
        $timeout(function() {
          vm.curInputMention = false;
        })
      }

    };

    /******************** grid graph **************************/
    function _init(source) {
      root = treeData;
      root.x0 = viewerHeight / 2;
      root.y0 = 0;

      // Call visit function to establish maxLabelLength
      visit(treeData, function (d) {
        totalNodes++;
        if (d.name != undefined)
          maxLabelLength = Math.max(d.name.length, maxLabelLength);

      }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
      });

      // Layout the tree initially and center on the root node.
      if (source) {
        _update(source);
        // centerNode(source);
      } else {
        var dg = document.getElementById('dialog-graph');
        while (dg.firstChild) dg.removeChild(dg.firstChild);

        // _update(root.children, document.getElementById('dialog-graph'), 1);
        _update(root, document.getElementById('dialog-graph'));

        updateSelected(root);
        // vm.collapseDepth();
        // update(root, true);
        // centerNode(root, 'start');
      }
    }

    var _update = function(dialog, parent, collapseAll) {
      var input;
      if(dialog.input) input = handleInput(dialog.input);
      var output = handlePrintOutput(dialog, (dialog.output || dialog._output || dialog.text));

      var dlgGroup, dlg;
      if(document.getElementById(dialog.id)) {
        dlg = document.getElementById(dialog.id);
        dlgGroup = dlg.parentNode;
      } else {
        var dlgGroup = document.createElement('div');
        if(parent == undefined && dialog.parent) parent = document.getElementById(dialog.parent.id);
        if(parent) parent.appendChild(dlgGroup);

        dlgGroup.className = 'dlg-group';
        if(vm.oneline) {
          dlgGroup.innerHTML ='<svg width="10" height="10"><line x1="0" y1="20" x2="10" y2="20" stroke="black"></line></svg>';
        } else {
          dlgGroup.innerHTML ='<svg width="20" height="20"><line x1="0" y1="35" x2="10" y2="35" stroke="black"></line></svg>';
        }

        dlg = document.createElement('div');
        dlgGroup.appendChild(dlg);
      }

      dlg.id = dialog.id;
      if(dialog.children || (Array.isArray(dialog.output) && dialog.output.length > 0 && dialog.output[0].if)) dlg.className = 'dlg with-children';
      else dlg.className = 'dlg';

      dlg.innerHTML = '';
      if(vm.oneline) {
        dlg.classList.add('dlg-oneline');
        if(dialog.id) dlg.innerHTML += '<div>' + dialog.name + ' ('+ dialog.id + ')' + '</div>';
      } else {
        if(dialog.if) dlg.innerHTML += '<div class="dlg-name">' + dialog.if + '</div>';
        else dlg.innerHTML += '<div class="dlg-name">' + dialog.name + ' ('+ dialog.id + ')' + '</div>';
        if(input) dlg.innerHTML += '<div class="dlg-input">' + input + '</div>';
        dlg.innerHTML += '<div class="dlg-output">' + output.replace(/\\n/g, '\n') + '</div>';

        if(dialog.image_text) {
          dlg.innerHTML += '<div><img src="' + dialog.image_text + '" width="100%"/></div>';
        }

        if(dialog.buttons) {
          for(var i in dialog.buttons) {
            if(dialog.buttons[i].url) dlg.innerHTML += '<div class="bubble-button"><a href="' + dialog.buttons[i].url + '" target="_blank">' + dialog.buttons[i].text + '</a></div>';
            else dlg.innerHTML += '<div class="bubble-button"><a ng-click="vm.sendMsg(\'' + dialog.buttons[i].text + '\')">' + dialog.buttons[i].text + '</a></div>';
          }
        }

        var actionGroup = document.createElement('div');
        dlg.appendChild(actionGroup);
        actionGroup.id = dialog.id + 'dlg-action';
        actionGroup.className = 'dlg-action';

        updateDialogAction(dialog, actionGroup);
      }

      dlg.onclick = function (e) {
        updateSelected(realDialog(dialog));
      };

      if(!dialog.if) {
        dlg.addEventListener("dblclick", function (e) {
          edit(realDialog(dialog));
        });
        // dlg.ondblclick = function (e) {
        //   edit(realDialog(dialog));
        // };
      }

      // console.log(dialog.id + ':' + dialog.parent + ',' + dialog.children);

      if(dialog.children) {
        var dlgChildren;
        if((dlgChildren = document.getElementById(dialog.id + '_children')) != undefined) {
          dlgChildren.parentNode.removeChild(dlgChildren);
        }

        dlgChildren = document.createElement('div');
        dlgGroup.appendChild(dlgChildren);
        dlgChildren.id = dialog.id + '_children';
        dlgChildren.className = 'dlg-children';

        addObserver(dlgChildren);
        if (vm.oneline) {
          dlgChildren.innerHTML += '<svg width="10" height="100"></svg>';
        } else {
          dlgChildren.innerHTML += '<svg width="20" height="100"></svg>';
        }


        for (var j = 0; j < dialog.children.length; j++) {
          _update(dialog.children[j], dlgChildren);
        }

        // var inners = [];
        // for(var j = 0; j < dialog.children.length; j++) {
        //   if(j < dialog.children.length -1 && dialog.children[j+1].children == undefined) {
        //     if(inners.length == 0) inners.push(dialog.children[j]);
        //     inners.push(dialog.children[j+1]);
        //     console.log('add inners: ' + dialog.children[j].id);
        //   } else if(inners.length > 1) {
        //     // console.log('update inners: ' + inners);
        //     var str = '';
        //     for(var k = 0; k < inners.length; k++) {
        //       str += inners[k].id + ',';
        //     }
        //     console.log('update inners1: ' + str);
        //
        //     _updateInners(inners[0], dlgChildren, false, inners);
        //     inners = [];
        //
        //   } else {
        //     console.log('update: ' + dialog.children[j].id);
        //     _update(dialog.children[j], dlgChildren);
        //   }
        // }
      } else if(Array.isArray(dialog.output) && dialog.output.length > 0 && dialog.output[0].if && dialog.output[0].kind != 'Action') {
        var dlgChildren = document.createElement('div');
        dlgGroup.appendChild(dlgChildren);
        dlgChildren.id = dialog.id + '_outputs';
        dlgChildren.className = 'dlg-children';

        addObserver(dlgChildren);
        if (vm.oneline) {
          dlgChildren.innerHTML += '<svg width="10" height="100"></svg>';
        } else {
          dlgChildren.innerHTML += '<svg width="20" height="100"></svg>';
        }

        for(var i = 0; i < dialog.output.length; i++) {
          dialog.output[i].id = dialog.id + '_' + i;
          if(dialog.output[i].if) _update(dialog.output[i], dlgChildren);
          // for (var j = 0; dialog.output[i].children && j < dialog.output[i].children.length; j++) {
          //   _update(dialog.output[i].children[j], dlgChildren);
          // }
        }
      } else if(document.getElementById(dialog.id + '_children')) {
        var elem = document.getElementById(dialog.id + '_children');
        elem.parentNode.removeChild(elem);
      } else if(document.getElementById(dialog.id + '_outputs')) {
        var elem = document.getElementById(dialog.id + '_outputs');
        elem.parentNode.removeChild(elem);
      }
    }

    var _updateInners = function(dialog, parent, collapseAll, inners) {

      var dlgGroup, dlgInner;
      // if(document.getElementById(dialog.id)) {
      //   dlg = document.getElementById(dialog.id);
      //   dlgGroup = dlg.parentNode;
      // } else {
        dlgGroup = document.createElement('div');
        parent.appendChild(dlgGroup);

        dlgGroup.className = 'dlg-group';
        if(vm.oneline) {
          dlgGroup.innerHTML ='<svg width="10" height="10"><line x1="0" y1="20" x2="10" y2="20" stroke="black"></line></svg>';
        } else {
          dlgGroup.innerHTML ='<svg width="20" height="20"><line x1="0" y1="35" x2="10" y2="35" stroke="black"></line></svg>';
        }

        dlgInner = document.createElement('div');
        dlgInner.className = 'dlg-inner';
        dlgGroup.appendChild(dlgInner);
      // }

      for(var ii = 0 ; ii < inners.length; ii++) {
        var _dialog = inners[ii];
        addInner(_dialog, dlgInner);
      }

      if(dialog.children) {
        var dlgChildren = document.createElement('div');
        dlgGroup.appendChild(dlgChildren);
        dlgChildren.id = dialog.id + '_children';
        dlgChildren.className = 'dlg-children';

        addObserver(dlgChildren);
        if(vm.oneline) {
          dlgChildren.innerHTML +='<svg width="10" height="100"></svg>';
        } else {
          dlgChildren.innerHTML +='<svg width="20" height="100"></svg>';
        }

        for(var j = 0; j < dialog.children.length; j++) {
          _update(dialog.children[j], dlgChildren);
        }

        // var inners = [];
        // for(var j = 0; j < dialog.children.length; j++) {
        //   if(j < dialog.children.length -1 && dialog.children[j+1].children == undefined) {
        //     if(inners.length == 0) inners.push(dialog.children[j]);
        //     console.log('add inners1: ' + dialog.children[j].id);
        //     inners.push(dialog.children[j+1]);
        //   } else if(inners.length > 1) {
        //     var str = '';
        //     for(var k = 0; k < inners.length; k++) {
        //       str += inners[k].id + ',';
        //     }
        //     console.log('update inners1: ' + str);
        //     _updateInners(inners[0], dlgChildren, false, inners);
        //     inners = [];
        //   } else {
        //     console.log('update1: ' + dialog.children[j].id);
        //     _update(dialog.children[j], dlgChildren);
        //   }
        // }

      } else if(document.getElementById(dialog.id + '_children')) {
        var elem = document.getElementById(dialog.id + '_children');
        elem.parentNode.removeChild(elem);
      }
    };

    function addInner(_dialog, parent) {
      var input = handleInput(_dialog.input);
      var output = handlePrintOutput(_dialog, _dialog.output);

      var dlg = document.createElement('div');
      parent.appendChild(dlg);

      dlg.id = _dialog.id;
      if(_dialog.children) dlg.className = 'dlg with-children';
      else dlg.className = 'dlg';

      if(vm.oneline) {
        dlg.classList.add('dlg-oneline');
        dlg.innerHTML =
          '<div>' + _dialog.name + ' ('+ _dialog.id + ')' + '</div>';
      } else {
        dlg.innerHTML =
          '<div class="dlg-name">' + _dialog.name + ' ('+ _dialog.id + ')' + '</div>' +
          '<div class="dlg-input">' + input + '</div>' +
          '<div class="dlg-output">' + output.replace(/\\n/g, '\n') + '</div>';

        if(_dialog.output.buttons) {
          for(var i in _dialog.output.buttons) {
            if(_dialog.output.buttons[i].url) dlg.innerHTML += '<div class="bubble-button"><a href="' + _dialog.output.buttons[i].url + '" target="_blank">' + _dialog.output.buttons[i].text + '</a></div>';
            else dlg.innerHTML += '<div class="bubble-button"><a ng-click="vm.sendMsg(\'' + _dialog.output.buttons[i].text + '\')">' + _dialog.output.buttons[i].text + '</a></div>';
          }
        }

        var actionGroup = document.createElement('div');
        dlg.appendChild(actionGroup);
        actionGroup.id = _dialog.id + 'dlg-action';
        actionGroup.className = 'dlg-action';

        updateDialogAction(_dialog, actionGroup);
      }

      dlg.onclick = function(e) {
        updateSelected(_dialog);
      };

      dlg.ondblclick = function(e) {
        edit(_dialog);
      };
    }

    function addObserver(target) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // console.log(mutation.type + ', ' + target);
          if(mutation.addedNodes || mutation.removeNodes) {
            drawDialogLines(target);
          }
        });
      });

      var config = { childList: true };
      observer.observe(target, config);
    }


    function updateDialogAction(dialog, actionGroup) {
      while (actionGroup.firstChild) actionGroup.removeChild(actionGroup.firstChild);

      if(dialog.if == undefined && dialog.parent && dialog.parent.children) {
        var idx = dialog.parent.children.indexOf(dialog);
        if(idx > 0) {
          var goUpBtn = document.createElement('div');
          actionGroup.appendChild(goUpBtn);
          goUpBtn.style.cursor = "pointer";
          goUpBtn.innerHTML = '<i class="fa fa-arrow-up"></i>';
          goUpBtn.onclick = function(e) {
            goUp(realDialog(dialog));
          };
        }

        idx = dialog.parent.children.indexOf(dialog);
        if(idx < dialog.parent.children.length - 1) {
          var goDownBtn = document.createElement('div');
          actionGroup.appendChild(goDownBtn);
          goDownBtn.style.cursor = "pointer";
          goDownBtn.innerHTML = '<i class="fa fa-arrow-down"></i>';
          goDownBtn.onclick = function(e) {
            goDown(realDialog(dialog));
          };
        }
      }

      if(dialog.children || dialog._children || (Array.isArray(dialog.output) && dialog.output.length > 0 && dialog.output[0].if) || dialog._output) {
        var toggleBtn = document.createElement('div');
        toggleBtn.style.float = 'right';
        toggleBtn.style.cursor = "pointer";
        actionGroup.appendChild(toggleBtn);
        if (dialog.children || (Array.isArray(dialog.output) && dialog.output.length > 0 && dialog.output[0].if))
          toggleBtn.innerHTML = '<i class="fa fa-chevron-left"></i>';
        else if(dialog._children || dialog._output)
          toggleBtn.innerHTML = '<i class="fa fa-chevron-right"></i>';
        toggleBtn.onclick = function(e) {
          toggleAndCenter(dialog)
        };
      }
      if((vm.authentication.user._id == vm.bot.user._id) || (vm.auth.BotFile && vm.auth.BotFile[vm.currentTab.file_id] && vm.auth.BotFile[vm.currentTab.file_id].edit)){
        if(dialog.if == undefined) {
          var deleteBtn = document.createElement('div');
          deleteBtn.style.float = 'right';
          deleteBtn.style.cursor = "pointer";
          actionGroup.appendChild(deleteBtn);
          deleteBtn.innerHTML = '<i class="fa fa-close"></i>';
          deleteBtn.onclick = function(e) {
            deleteNode(realDialog(dialog));
            e.stopPropagation();
          };
        }

        var addBtn = document.createElement('div');
        addBtn.style.float = 'right';
        addBtn.style.cursor = "pointer";
        actionGroup.appendChild(addBtn);
        addBtn.innerHTML = '<i class="fa fa-plus"></i>';
        addBtn.onclick = function(e) {
          addChild(realDialog(dialog));
          e.stopPropagation();
        };

        if(dialog.if == undefined) {
          var editBtn = document.createElement('div');
          editBtn.style.float = 'right';
          editBtn.style.cursor = "pointer";
          actionGroup.appendChild(editBtn);
          editBtn.innerHTML = '<i class="fa fa-edit"></i>';
          editBtn.onclick = function(e) {
            edit(realDialog(dialog));
          };
        }
      }
    }

    function realDialog(dialog) {
      var _dialog;
      visit(treeData, function(d) {
        if (d.id == dialog.id)
          _dialog = d;
      }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
      });

      return _dialog || dialog;
    }

    function drawDialogLines(target) {
      if(target === undefined) return;
      var svgNode = target.childNodes[0];
      svgNode.innerHTML = '';

      var x1 = 0;
      var y1 = 45;
      if(vm.oneline) y1 = 25;
      else y1 = 45;

      var targetOffset = getOffset(target);
      var last = target.childNodes[target.childNodes.length -1].childNodes[1];

      if(target.childNodes[1].childNodes[1].className == 'dlg-inner') {
        var inner = target.childNodes[1].childNodes[1];

        for(var i = 0; i < inner.childNodes.length; i++) {
          var child = inner.childNodes[i];
          var childOffset = getOffset(child);
          var newdiv = document.createElement("div");
          svgNode.innerHTML += '<line x1="' + 0 + '" y1="' + (childOffset.top - targetOffset.top + (vm.oneline? 15 : 25)) +
            '" x2="' + 10  + '" y2="' + (childOffset.top - targetOffset.top + (vm.oneline? 15 : 25)) + '" stroke="black"/>';
        }

        last = inner.childNodes[inner.childNodes.length -1];
      }

      var off2 = getOffset(last);
      var x2 = 0;
      var y2;
      if(vm.oneline) y2 = off2.top - targetOffset.top + 20;
      else y2 = off2.top - targetOffset.top + 35;

      // var line = document.createElement('line');
      // line.setAttribute('x1', x1);
      // line.setAttribute('y1', y1);
      // line.setAttribute('x2', x2);
      // line.setAttribute('y2', y2);
      // line.setAttribute('stroke', 'black');
      // svgNode.appendChild(line);

      svgNode.innerHTML += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="black"/>';
      if(vm.oneline)
        svgNode.innerHTML += '<line x1="' + (x1 - 10) + '" y1="' + y1 + '" x2="' + x1+ '" y2="' + y1+'" stroke="black"/>';
      else
        svgNode.innerHTML += '<line x1="' + (x1 - 10) + '" y1="' + y1 + '" x2="' + x1+ '" y2="' + y1+'" stroke="black"/>';
      svgNode.style.height = y2;
    }

    function drawSelectDialogLine(node) {
      var cNode = node;
      while(cNode.parent) {
        drawDialogLines(document.getElementById(cNode.parent.id + '_children') || document.getElementById(cNode.parent.id + '_outputs'));
        cNode = cNode.parent;
      }
    }

    function drawChildDialogLine(node) {
      if(node.children) {
        drawDialogLines(document.getElementById(node.id + '_children') || document.getElementById(node.id + '_outputs'));

        for(var i = 0; i < node.children.length; i++) {
          drawChildDialogLine(node.children[i]);
        }
      }
    }

    function getOffset( el ) {
      var rect = el.getBoundingClientRect();
      var offset = {x: 0, y: 0};
      return {
        left: rect.left + window.pageXOffset + offset.x,
        top: rect.top + window.pageYOffset + offset.y,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
      };
    }

    // 선택된 node 업데이트
    var updateSelected = function(newd) {
      var selectedNodes = document.getElementsByClassName('dlg-selected');
      if(selectedNodes) {
        for(var i = 0; i < selectedNodes.length; i++) {
          selectedNodes[i].classList.remove('dlg-selected');
        }
      }

      if(selectedNode) drawSelectDialogLine(selectedNode);

      selectedNode = newd;

      var dlg = document.getElementById(selectedNode.id);
      if(dlg) dlg.classList.add('dlg-selected');
      // dlg.className += ' dlg-selected';

      // _update(selectedNode);
      centerNode(selectedNode);
      drawSelectDialogLine(newd);
    };

    vm.showOneline = function() {
      vm.oneline = true;
      document.getElementById('dialog-graph').innerHTML = '';
      _update(treeData, document.getElementById('dialog-graph'));
      if (selectedNode) {
        updateSelected(selectedNode);
      }
    };

    vm.showDetail = function() {
      vm.oneline = false;
      document.getElementById('dialog-graph').innerHTML = '';
      _update(treeData, document.getElementById('dialog-graph'));
      if (selectedNode) {
        updateSelected(selectedNode);
      }
    };

    vm.zoom = 1.0;
    vm.zoomin = function() {
      if(vm.zoom < 1.5) vm.zoom += 0.1;
      if(vm.zoom > 1.5) vm.zoom = 1.5;
      document.getElementById('dialog-graph').style.zoom = vm.zoom;
      // document.getElementById('main').style.zoom = vm.zoom;

      drawChildDialogLine(treeData);
    }

    vm.zoomout = function() {
      if(vm.zoom > 0.4) vm.zoom -= 0.1;
      if(vm.zoom < 0.3) vm.zoom = 0.3;
      document.getElementById('dialog-graph').style.zoom = vm.zoom;
      // document.getElementById('main').style.zoom = vm.zoom;
      drawChildDialogLine(treeData);
    }

    function toggleAndCenter(d) {
      d = toggleChildren(d);
      _update(d);
      // centerNode(d);
    }

    function goUp(d) {
      vm.setChanged(true , true);
      var idx = d.parent.children.indexOf(d);

      swapNode(d.parent, idx, idx-1 );
    }

    function goDown(d) {
      vm.setChanged(true , true);
      var idx = d.parent.children.indexOf(d);

      swapNode(d.parent, idx, idx+1 );
    }

    function swapNode(parent, src, target) {
      var srcNode = parent.children[src];
      var targetNode = parent.children[target];

      var temp = srcNode;
      parent.children[src] = targetNode;
      parent.children[target] = temp;

      if (parent.parent == undefined /*parent.depth == 0*/) {
        var srcDialog, targetDialog;
        var srcIdx, targetIdx;
        if (vm.dialog) {
          for (var i=0; i < dialogs.length; ++i) {
            if (dialogs[i].id === srcNode.id) {
              srcDialog = dialogs[i];
              srcIdx = i;
            }
            if (dialogs[i].id === targetNode.id) {
              targetDialog = dialogs[i];
              targetIdx = i;
            }
          }
          var temp = srcDialog;
          dialogs[srcIdx] = targetDialog;
          dialogs[targetIdx] = temp;
        } else {
          for (var i=0; i < common_dialogs.length; ++i) {
            if (common_dialogs[i].id === srcNode.id) {
              srcDialog = common_dialogs[i];
              srcIdx = i;
            }
            if (common_dialogs[i].id === targetNode.id) {
              targetDialog = common_dialogs[i];
              targetIdx = i;
            }
          }
          var temp = srcDialog;
          common_dialogs[srcIdx] = targetDialog;
          common_dialogs[targetIdx] = temp;
        }
      }

      var srcElement = document.getElementById(srcNode.id).parentNode;
      var targetElement = document.getElementById(targetNode.id).parentNode;
      var parentElement = targetElement.parentNode;

      // console.log(srcNode.id + ', ' + targetNode.id + ', '+ srcElement + ',' + targetElement + ',' + parentElement);
      // parentElement.insertBefore(srcElement, targetElement);

      if(src > target) parentElement.insertBefore(srcElement, targetElement);
      else if(src < target) parentElement.insertBefore(targetElement, srcElement);
      // updateSelected(srcNode);

      updateDialogAction(srcNode, document.getElementById(srcNode.id + 'dlg-action'));
      updateDialogAction(targetNode, document.getElementById(targetNode.id + 'dlg-action'));
    }

    function deleteNode(d) {
      if (d.name === "시작")
        return;
      vm.setChanged(true, true);
      initSelect();

      if (d.parent && d.parent.children) {
        for (var i=0; i < d.parent.children.length; ++i) {
          if (d.parent.children[i].id === d.id) {
            d.parent.children.splice(i,1);
            break;
          }
        }
        if(d.parent.children.length == 0) delete d.parent.children;
      } else if(d.parent && Array.isArray(d.parent.output)) {
        for (var j=0; j < d.parent.output.length; j++) {
          if(d.parent.output[j].children) {
            for(var i = 0; i < d.parent.output[j].children.length; i++) {
              if (d.parent.output[j].children[i].id === d.id) {
                d.parent.output[j].children.splice(i,1);
                break;
              }
            }
            
            if(d.parent.output[j].children.length == 0) delete d.parent.output[j].children;
          }
        }
      }

      if (d.parent && d.parent.parent == undefined /*d.depth == 1*/) {
        for (var i=0; i < dialogs.length; ++i) {
          if (dialogs[i].id === d.id) {
            dialogs.splice(i,1);
            break;
          }
        }
      }

      //TODO: need to remove other links such as call...
      delete_int(d);

      var srcElement = document.getElementById(d.id).parentNode;
      srcElement.parentNode.removeChild(srcElement);
      updateSelected(d.parent);
    }

    function centerNode(source, isStart) {
      var el = document.getElementById(source.id);
      // var rect = el.getBoundingClientRect();
      var rect = getOffset(el);
      // console.log('centerNode: src ' + source.id + ', offset ' + src.top + ', rect ' + rect.top + ', offsetTop ' + el.offsetTop + ', clientTop ' + el.clientTop + ', scrollTop ' + el.scrollTop);

      var panel = document.getElementById('contentPanel');
      // var panelR = panel.getBoundingClientRect();
      var panelR = getOffset(panel);
      // console.log('centerNode: panel ' + panel.scrollTop + ', ' + panel.scrollLeft + ', ' + panel.scrollHeight + ',' + panel.scrollWidth);

      // panel.scrollTop = panel.scrollTop + rect.top - panelR.top - 230;
      var aimTop = panel.scrollTop + rect.top - panelR.top - 50;
      if(aimTop < panel.scrollTop)
        panel.scrollTop = aimTop;
      else if(aimTop > panel.scrollTop + panel.clientHeight - el.clientHeight)
        panel.scrollTop = aimTop;

      var aimLeft = panel.scrollLeft + rect.left - panelR.left - 50;
      if(aimLeft < panel.scrollLeft)
        panel.scrollLeft = aimLeft;
      else if(aimLeft > panel.scrollLeft + panel.clientWidth - el.clientWidth)
        panel.scrollLeft = aimLeft;
    }

    vm.newDialog;
    function addChild(d) {
      var isCallNode = false;
      if (d.output) {
        if (Array.isArray(d.output)) {
          d.output.forEach(function(o) {
            if (o.call) {
              isCallNode = true;
            }
          });
        } else {
          if (d.output.call) {
            isCallNode = true;
          }
        }
      }

      if (isCallNode) {
        $scope.message = "Output이 Call인 노드는 Child노드를 추가할 수 없습니다";
        $scope.choice = false;
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-bots.html',
          scope: $scope
        });
        modalInstance.result.then(function (response) {
          console.log(response);
        });
        return;
      }

      if ((Array.isArray(d.output) && d.output.length > 0 && d.output[0].if) ||
        (d.if && d.call)) {
        $scope.message = "output에 if를 사용한 Dialog는  Child노드를 추가할 수 없습니다";
        $scope.choice = false;
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/bots/client/views/modal-bots.html',
          scope: $scope
        });
        modalInstance.result.then(function (response) {
          console.log(response);
        });
        return;
      }

      vm.setChanged(true, true);
      if (d3.event)
        d3.event.stopPropagation();
      if (d._children) {
        toggleChildren(d);
      }
      var newDialog = {name:"", id:(!vm.dialog ? "common" : "") + vm.fileName + (++vm.maxId),
        filename:vm.fileName+(!vm.dialog?"common" : "") , input:[], output:[]};
      // (d.children || (d.children = [])).push(newDialog);
      newDialog.parent = (d.if ? d.parent : d);

      // if ((d.if ? d.parent : d).parent == undefined /*d.depth === 0*/) {
      //   if (vm.dialog) {
      //     dialogs.push(newDialog);
      //   } else {
      //     common_dialogs.push(newDialog);
      //   }
      // }

      // if(d.children) {
      //   var dlgChildren = document.getElementById(d.id + '_children');
      //
      //   if(!dlgChildren) {
      //     var dlgGroup = document.getElementById(d.id).parentNode;
      //     dlgChildren = document.createElement('div');
      //     dlgGroup.appendChild(dlgChildren);
      //     dlgChildren.id = d.id + '_children';
      //     dlgChildren.className = 'dlg-children';
      //
      //     if(vm.oneline) {
      //       dlgChildren.innerHTML +='<svg width="10" height="100"></svg>';
      //     } else {
      //       dlgChildren.innerHTML +='<svg width="20" height="100"></svg>';
      //     }
      //   }
      //
      //   // addObserver(dlgChildren);
      //   _update(newDialog, dlgChildren);
      // } else if(document.getElementById(dialog.id + '_children')) {
      //   var elem = document.getElementById(dialog.id + '_children');
      //   elem.parentNode.removeChild(elem);
      // }

      // _update(d);
      //
      // updateSelected(newDialog);
      //
      // edit(selectedNode);
      vm.newDialog = newDialog;
      edit(vm.newDialog);
    }

    // undo, changeHistoryd에 정보가 있으면 pop해서 복원
    $scope.undo = function() {
      if (vm.changeHistory.length > 0) {
        var history = vm.changeHistory.pop();
        if (!history.isReplace) {
          dialogs = angular.copy(history.dialogs);
          vm.initTreeData();
          _init(history.source);
          // var svg = baseSvg.selectAll(".node").filter(function(d) {
          //   if (d.id === history.source.id)
          //     return true;
          // });
          // svg.remove();

          // var srcElement = document.getElementById(history.source.id).parentNode;
          // srcElement.parentNode.removeChild(srcElement);
          initSelect();

          // if(selectedNode) {
          //   if(selectedNode.id == history.source.parent.id) selectedNode = history.source.parent;
          //   else if(selectedNode.id == history.source.id) selectedNode = history.source;
          // }

          if(history.updateScope) {
            _update(history.source.parent);
          } else {
            _update(history.source);
          }
        } else {
          // d3.selectAll('path').remove();
          // d3.selectAll('.node').remove();
          dialogs = angular.copy(history.dialogs);
          vm.initTreeData();
          selectedSVG =null;
          _init(treeData);
          if (selectedNode) {
            // selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
            //   if (d.id === selectedNode.id)
            //     return true;
            // });
            _update(selectedNode);
          }
        }
        vm.isChanged = true;
      }
      // if (vm.changeHistory.length == 0) {
      //   vm.setChanged(false);
      // }
    };

    $scope.searchNode = function(event) {
      //find the node
      var selectedVal = document.getElementById('search').value;

      if(selectedVal != ''){
        var selected = [];
        var matchDialog = function(d) {
          if (vm.searchKind == 'name') {
            return d.name.search(selectedVal) != -1;
          }
          if (vm.searchKind == 'input') {
            for (var i=0; i < d.input.length; ++i) {
              return d.input[i].text && d.input[i].text.search(selectedVal) != -1;
            }
          }
          if (vm.searchKind == 'output') {
            if (typeof d.output === 'string') {
              return d.output.search(selectedVal) != -1;
            } else if (d.output.output) {
              return d.output.output.search(selectedVal) != -1;
            } else if (Array.isArray(d.output)) {
              for (var i = 0; i < d.output.length; ++i) {
                return d.output[i].text && d.output[i].text.search(selectedVal) != -1;
              }
            }
          }
        };

        var findDialog = function(d) {
          if(matchDialog(d)) selected.push(d);

          if(d.children) {
            for(var i = 0; i < d.children.length; i++) {
              findDialog(d.children[i]);
            }
          }
        };

        findDialog(root);

        if (currentKeyword !== selectedVal || currentKind !== vm.searchKind) {
          currentKeyword = selectedVal;
          currentKind = vm.searchKind;
          currentSearchIdx = 0;
        }

        if (selected && selected.length >= 1) {
          selectedNode = selected[currentSearchIdx];
          _update(selectedNode);
          updateSelected(selectedNode);

          currentSearchIdx = (++currentSearchIdx) % selected.length;
        }
      }
    };

    // 키워드 replace
    $scope.replaceNode = function(event) {
      var selectedVal = document.getElementById('search').value;
      var replacedVal = document.getElementById('replace').value;
      if (selectedVal == '' || replacedVal == '')
        return;

      vm.setChanged(true, false, true);

      var re = new RegExp(selectedVal, "g");
      var _replaceDialog = function(d) {
        // for (var idx=0; idx < ds.length; ++idx) {
        //   var d = ds[idx];
          if (vm.searchKind == 'name') {
            d.name = d.name.replace(re, replacedVal);
          }
          if (vm.searchKind == 'input') {
            for (var i=0; i < d.input.length; ++i) {
              if (d.input[i].text)
                d.input[i].text = d.input[i].text.replace(re, replacedVal);
            }
          }
          if (vm.searchKind == 'output') {
            if (typeof d.output === 'string') {
              d.output = d.output.replace(re, replacedVal);
            } else if (Array.isArray(d.output)) {
              for (var i = 0; i < d.output.length; ++i) {
                if (d.output[i].text)
                  d.output[i].text = d.output[i].text.replace(re, replacedVal);
              }
            }
          }

          if(d.children) {
            for(var j = 0; j < d.children.length; j++) {
              _replaceDialog(d.children[j]);
            }
          }
        // }
      }

      _replaceDialog(treeData);

      // d3.selectAll('.node').remove();
      // d3.selectAll('path').remove();
      // selectedSVG =null;
      _update(treeData);
      if (selectedNode) {
        // selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
        //   if (d.id === selectedNode.id)
        //     return true;
        // });
        _update(selectedNode);
      }
    };


    function pointerDown(ev) {
      // ev.preventDefault();

      dialogGraph.addEventListener("pointermove", pointerMove);
      dialogGraph.addEventListener("pointerup", pointerUp);

      dragStartX = ev.pageX; dragStartY = ev.pageY;
      // console.log('pointerDown ' + dragStartX);

      ev.stopPropagation();
    }

    function pointerMove(ev) {
      // console.log('pointerMove ' + dragStartX + ', ' + ev.pageX + ', ' + main.scrollLeft);
      contentPanel.scrollTop = contentPanel.scrollTop - (ev.pageY - dragStartY);
      dragStartY  = ev.pageY;

      contentPanel.scrollLeft = contentPanel.scrollLeft - (ev.pageX - dragStartX);
      dragStartX  = ev.pageX;

      // handle.style.transform = "translate3d(" +
      //   (x + ev.pageX - dragStartX) + "px, " +
      //   (y + ev.pageY - dragStartY) + "px, 0)";

      ev.stopPropagation();
      ev.preventDefault();
    }

    function pointerUp(ev) {
      // console.log('pointerUp');
      dialogGraph.removeEventListener("pointermove", pointerMove);
      dialogGraph.removeEventListener("pointerup", pointerUp);

      // x = x + ev.pageX - dragStartX;
      // y = y + ev.pageY - dragStartY;
      ev.stopPropagation();
      ev.preventDefault();
    }

    var x = 0;
    var y = 0;
    var dragStartX = 0;
    var dragStartY = 0;
    var dialogGraph = document.getElementById('dialog-graph');
    var contentPanel = document.getElementById('contentPanel');
    dialogGraph.addEventListener("pointerdown", pointerDown);
  }]
)
  .directive('autoFocus', [ '$timeout', function ($timeout) {
    return {
      // input filed autofocus에 사용
      restrict: 'A',

      link: function ($scope, $element, $attributes) {
        if ($scope.$eval($attributes.autoFocus) !== false) {
          var element = $element[0];

          $timeout(function() {
            $scope.$emit('focus', element);
            element.focus();
          });
        }
      }
    };
  }]);
