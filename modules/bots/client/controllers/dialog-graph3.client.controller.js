'use strict';

var currentInput;
var currentJSONNode;

var setInput = function(cur) {
  currentInput = cur;
  currentJSONNode = cur.replace(/_/g,'.');
};

function gogo(filename) {
  angular.element(document.getElementById('control')).scope().changeTabName(filename);
}

// Bots controller
angular.module('bots').controller('DialogGraph3Controller', ['$scope', '$rootScope', '$state', '$window','$timeout',
  '$stateParams', '$resource', 'Dialogs', 'DialogSaveService', 'OpenTasksService', 'FileUploader','$document',
  'fileResolve', 'BotFilesService', 'CoreUtils', 'botFilesResolve', 'Socket', '$uibModal', '$compile', '$cookies', '$http','IntentsService', 'EntitysService', 'EntityContentsService',
  'notificationService',
  function ($scope, $rootScope, $state, $window, $timeout, $stateParams, $resource, Dialogs, DialogSaveService,
            OpenTasksService, FileUploader, $document, file, BotFilesService, CoreUtils, files, Socket,
            $uibModal, $compile, $cookies, $http, IntentsService, EntitysService, EntityContentsService, notificationService
  ) {
    (function($) {
      'use strict';

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

      /*
       Modal Dismiss
       */
      $(document).on('click', '.modal-dismiss', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
      });

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

      $('.modal-with-form').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
        modal: false,

        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
          beforeOpen: function() {
            if (!document.getElementById('name').readonly) {
              this.st.focus = '#name';
            }
            if (!document.getElementById('input_div').classList.contains("ng-hide")) {
              this.st.focus = '#input';
            }
          }
        }
      });

      $('.modal-with-task').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
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

      $('.modal-with-list').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#listContent',
        modal: true,
        callbacks: {
          beforeOpen: function() {
            this.st.focus = '#listContent';
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

    $scope.$state = $state;

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
          vm.isChanged = false;
          modalInstance.dismiss();
          $state.go(toState.name);
        };
        $scope.no = function () {
          modalInstance.dismiss();
        };
      }
    });

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
      if (vm.curI && (vm.curI.str.indexOf('@') != 0) && (vm.curI.str.indexOf('#') != 0) && (vm.curI.str.indexOf('/') != 0) && (vm.curI.str.indexOf('if ') != 0)){
        $scope.processInput();
      }
    });

    var editor;

    var newTask_template = "\nvar newTask = {\n\tname: 'newTask',\n\taction: function (task,context,callback) {" +
      "\n\t\tcallback(task,context);\n\t}\n};\n\n" +
      "bot.setTask('newTask',newTask);";


    // $scope.saveIntent = function () {
    //   $scope.intent.botName = $rootScope.botId;
    //   $scope.intent.content = $scope.intentContent;
    //   $scope.intent.$save({botName: $rootScope.botId},successCallback, errorCallback);
    //
    //   function successCallback(res) {
    //     console.log(res);
    //     $scope.backToEdit(false);
    //   }
    //
    //   function errorCallback(res) {
    //     console.log(res);
    //   }
    // };

    $scope.saveList = function(isValid) {
      if (vm.curO.list)
        vm.curO.str = '' + vm.curO.list.map(function(item) { return item.title; });
      $scope.saveO();
      $scope.backToEdit(false);
    };

    $scope.saveListContent = function(isValid) {
      if ($scope.listTitle == '') {
        return;
      }

      if (vm.curO.list) {
        for(var i = 0; i < vm.curO.list.length; ++i){
          if (vm.curO.list[i].title == $scope.listTitle){
            $scope.contentError = '동일한 항목이 존재합니다';
            return false
          }
        }
      }
      $scope.contentError = '';

      var item = {title:$scope.listTitle};
      if ($scope.listContent)
        item.content = $scope.listContent;
      if (vm.curO.filename) {
        item.image = '/files/' + vm.curO.filename;
        item.displayname = vm.curO.str;
      }

      (vm.curO.list = vm.curO.list || []).push(item);
      vm.curO.filename = '';
      vm.curO.str = '';
      $scope.listTitle = '';
      $scope.listContent = '';
    };

    $scope.itemRemoveBeforeSave = function(target) {
      var index = vm.curO.list.indexOf(target);
      if(index > -1){
        vm.curO.list.splice(index, 1)
      }
    };

    $scope.saveIntent = function (isValid) {
      if (!$scope.intent.name) {
        $scope.intentError = '인텐트 이름을 입력해주세요';
        return false;
      }
      console.log($scope.intent.content)
      if (!$scope.intent.content || $scope.intent.content.length == 0){
        $scope.contentListError = '적어도 하나의 내용을 목록에 추가해주세요';
        return false
      }

      $scope.intent.botName = $rootScope.botId;

      $scope.intent.$save({botName: $rootScope.botId},successCallback, errorCallback);

      function successCallback(res) {
        IntentsService.query({botName: $rootScope.botId}).$promise.then(function (result) {
          vm.intents = result.map(function(i) { return i.name; });
          $scope.backToEdit(false);
        }, function (err) {
          console.log(err);
        });
      }

      function errorCallback(res) {
        console.log(res);
        $scope.intentError = res.data.message;
        if (res.data.message.code == 11000){
          $scope.intentError = '\'' + res.data.message.op.name + '\'' +' 이름의 인텐트가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    }

    $scope.saveIntentContent = function (isValid) {
      if(!$scope.intent.content){
        $scope.intent['content'] = [];
      }
      if ($scope.intentContent){
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
        $scope.contentError = '내용을 입력해주세요'
      }
    };

    $scope.contentRemoveBeforeSave = function (target) {
      console.log($scope.intent.content.indexOf(target))
      var index = $scope.intent.content.indexOf(target);
      if(index > -1){
        $scope.intent.content.splice(index, 1)
      }
    }



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
          $scope.backToEdit(false);
        }, function (err) {
          console.log(err)
        });
      }

      function errorCallback(res) {
        console.log(res);
        $scope.entityError = res.data.message;
        if (res.data.message.code == 11000){
          $scope.entityError = '\'' + res.data.message.op.name + '\'' +' 이름의 엔터티가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    }

    $scope.saveEntityContent = function (isValid) {
      if(!$scope.entity.content){
        $scope.entity['content'] = [];
      }
      if ($scope.entityContent){
        for(var i = 0; i < $scope.entity.content.length; i++){
          if ($scope.entity.content[i].name == $scope.entityContent){
            $scope.contentError = '동일한 내용이 존재합니다';
            return false
          }
        }
        $scope.entity.content.unshift({name: $scope.entityContent, syn:[{name: $scope.entityContent}]});

        $scope.entityContent = '';
        $scope.contentError = ''
        $scope.contentListError = null;

      }else {
        $scope.contentError = '내용을 입력해주세요'
      }
    };

    $scope.contentRemoveBeforeSave = function (target) {
      console.log($scope.entity.content.indexOf(target))
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
          console.log('fff')
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
        console.log(target)
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



    $scope.addTask = function() {

      vm.fromTask = true;
      vm.changeTab(vm.tabs[1]);

      vm.currentTab.data += newTask_template;

      $scope.refreshCodemirror = true;
      vm.editor.focus();
      vm.editor.setCursor({line:vm.editor.lastLine() ,ch:0});
      $timeout(function () {
        $scope.refreshCodemirror = false;
      }, 100);
    };


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

    $scope.openType = function(type) {
      $.magnificPopup.close();
      vm.fromTask = true;
      vm.changeTab(vm.tabs[1]);
      $scope.setPosition(type);
    };

    $scope.closeEdit = function() {
      vm.edit = false;
      $scope.closeEditor();
    };

    var vm = this;
    vm.showTree = true;
    vm.userId = $rootScope.userId;
    vm.bot_id = $stateParams.botId ? $stateParams.botId : $cookies.get('botObjectId');
    // vm.bot_id = $stateParams.botId ? $stateParams.botId : $rootScope.botObjectId;
    vm.file_id = $stateParams.fileId ? $stateParams.fileId : file._id;
    vm.maxId = 0;
    vm.isChanged = false;
    vm.changeHistory = [];

    console.log(vm.bot_id + '/' + vm.file_id);

    // tab handling
    vm.botName = file.botName;
    vm.name = file.name.substring(0, file.name.length-3);
    vm.data = file.data;
    vm.files = files;

    vm.initialized = false;
    vm.smallDialog = true;

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

    vm.initTabs = function() {
      vm.tabs.forEach(function(t) {
        t.active = false;
      });
    };

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

    vm.saveFile = function () {
      new BotFilesService({botId: vm.bot_id, _id: vm.currentTab.file_id, fileData: vm.currentTab.data}).$save(function (botFile) {
        $resource('/api/loadBot/:bot_id/:fileName', {}).get({bot_id: vm.botId, fileName: vm.fileName}, function(res) {

          notificationService.success('저장되었습니다');

        });
      }, function (err) {
        CoreUtils.showConfirmAlert(err.data.message);
      });
    };

    // graph edit
    vm.setChanged = function(c, updateScope, isReplace) {
      if (c == true) {
        vm.changeHistory.push({source:angular.copy(selectedNode),  dialogs:angular.copy(dialogs), isReplace: isReplace});
      }
      vm.isChanged = c;

      if (updateScope) {
        $scope.safeApply();
      }
    };

    $scope.undo = function() {
      if (vm.changeHistory.length > 0) {
        var history = vm.changeHistory.pop();
        if (!history.isReplace) {
          dialogs = angular.copy(history.dialogs);
          vm.initTreeData();
          init(history.source);
          var svg = baseSvg.selectAll(".node").filter(function(d) {
            if (d.id === history.source.id)
              return true;
          });
          svg.remove();
          initSelect();
          update(history.source);
        } else {
          d3.selectAll('path').remove();
          d3.selectAll('.node').remove();
          dialogs = angular.copy(history.dialogs);
          vm.initTreeData();
          selectedSVG =null;
          init(treeData);
          if (selectedNode) {
            selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
              if (d.id === selectedNode.id)
                return true;
            });
            update(selectedNode);
          }
        }
        vm.isChanged = true;
      }
      // if (vm.changeHistory.length == 0) {
      //   vm.setChanged(false);
      // }
    };

    console.log('Tree Controller');

    // internal data represented by tree
    var links_internal = [];
    var nodes = [];
    var dialogs;
    var common_dialogs;
    var treeData;

    // var currentDialog;
    var currentNode;
    var selectedNode;
    var selectedSVG;

    vm.depth = 1;

    $scope.$on('updateLog', function(event, arg0) {
      var index = $rootScope.logUpdated.indexOf('[DIALOG_SEL]');

      if(index != -1) {
        var json = $rootScope.logUpdated.substring('[DIALOG_SEL]'.length);

        console.log(json);
        currentNode = null;
        try {
          var dialog = JSON.parse(json);
          for(var i in nodes) {
            if(nodes[i].id == dialog.id) {
              currentNode = nodes[i];
              break;
            } else if (dialog.name == "시작") {
              currentNode = treeData;
              break;
            }
          }

          if(currentNode) {
            update(currentNode);

            (currentNode);
          }
        } catch(e) {
          console.log(e);
        }
      }
    });

    var updateSelected = function(newd) {
      selectedNode = newd;
      selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
        if (d.id === newd.id)
          return true;
      });
      update(selectedNode);
      centerNode(selectedNode);

      if (vm.edit === 'dialog')
        edit(selectedNode);
    };

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
        if (vm.edit === 'dialog') {
          if (event.keyCode == 27) { // esc
            event.preventDefault();
            $scope.closeEdit();
          } else if (event.ctrlKey && event.keyCode == 13) { // ctrl+enter
            $scope.update(true);
            $scope.closeEdit();
          }
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

      if (event.ctrlKey && event.keyCode == 82) { // ctrl+r
        event.preventDefault();
        vm.isReplace = !vm.isReplace;
        if (vm.isReplace)
          document.getElementById('search').focus();
        $scope.safeApply();
        return;
      }

      if (document.activeElement == document.getElementById('search') ||
        document.activeElement == document.getElementById('replace') ) {
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
      } else if (event.keyCode == 191) { //  /
        event.preventDefault();
        if (event.shiftKey) {
          // shortcut help
          if ($.magnificPopup.instance.isOpen) {
            $.magnificPopup.close();
          } else {
            $('.modal-with-help').click();
          }
        } else {
          document.getElementById('search').focus();
        }
        return;
      }

      if (!selectedNode)
        return false;

      // to prevent keydown event from filetree
      if (document.activeElement != document.getElementById('mainpage'))
        return;

      if ([45,46,32,13, 37,38,39,40].indexOf(event.keyCode) == -1)
        return false;

      event.preventDefault();

      if (event.keyCode == 45) { // insert
        addChild(selectedNode);
      } else if (event.keyCode == 46) { // del
        deleteNode(selectedNode);
      } else if (event.keyCode == 32) { // space
        toggleAndCenter(selectedNode);
      } else if (event.keyCode == 13) { //enter
        edit(selectedNode);
      } else if (event.keyCode == 37) { //left
        if (selectedNode.parent) {
          updateSelected(selectedNode.parent);
        }
      } else if (event.keyCode == 38) { //up
        if (selectedNode.parent && selectedNode.parent.children) {
          if (selectedNode.parent.children.indexOf(selectedNode) > 0) {
            if (event.ctrlKey) { // ctrl+up
              goUp(selectedNode);
            } else {
              updateSelected(selectedNode.parent.children[selectedNode.parent.children.indexOf(selectedNode)-1]);
            }
          } else {
            var nearUp = {x:0};
            visit(treeData, function(d) {
              if (d.y == selectedNode.y && d.x < selectedNode.x && d.x > nearUp.x)
                nearUp = d;
            }, function (d) {
              return d.children && d.children.length > 0 ? d.children : null;
            });

            if (nearUp.x != 0) {
              updateSelected(nearUp);
            }
          }
        }
      } else if (event.keyCode == 39) { //right
        if (selectedNode.children && selectedNode.children.length > 0) {
          updateSelected(selectedNode.children[0]);
        }
      } else if (event.keyCode == 40) { //down
        if (selectedNode.parent && selectedNode.parent.children) {
          if (selectedNode.parent.children.indexOf(selectedNode) < selectedNode.parent.children.length-1) {
            if (event.ctrlKey) { // ctrl+down
              goDown(selectedNode);
            } else {
              updateSelected(selectedNode.parent.children[selectedNode.parent.children.indexOf(selectedNode) + 1]);
            }
          } else {
            var nearDown = {x:99999};
            visit(treeData, function(d) {
              if (d.y == selectedNode.y && d.x > selectedNode.x && d.x < nearDown.x)
                nearDown = d;
            }, function (d) {
              return d.children && d.children.length > 0 ? d.children : null;
            });

            if (nearDown.x != 99999) {
              updateSelected(nearDown);
            }
          }
        }
      }
    };

    var element = document.getElementById('tree-container');
    var element2 = document.getElementById('editor-container');
    new ResizeSensor(element, function() {
      console.log('Graph Changed to ' + element.clientWidth);
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
      console.log('Editor Changed to ' + element2.clientWidth);
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
    document.getElementById('modalListForm').addEventListener("keydown", keydown);
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

    $scope.openEdit = function(i, input) {
      if ($scope.getInputType(i.type) === 'button')
        return;
      $scope.processedInput = '';
      vm.curInput = input;
      vm.targetI = i;
      vm.curI = angular.copy(i);

      vm.inputMode = true;
      setTimeout(function () {
        if (document.getElementById('input'))
          document.getElementById('input').focus();
      }, 300);
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

    $scope.printOutput= function(o) {
      return 'deprecated';
      if (vm.typeClass[o.type].input === 'button')
        return '';
      else
        return o.str.substring(0,10);
    };

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

    $scope.resetO= function() {
      vm.inputModeO = false;
    };

    $scope.setType = function(i, type) {
      i.type = type;
      if (type != "Keyword" && type != "If" && type !="RegExp" && type !="Button")
        i.str = "";
      if ($scope.getInputType(type) === 'button') {
        if (i == vm.curO) {
          vm.curO.type = type;
          vm.curO.str = '1';
          $scope.saveO();
        } else {
          vm.curI.type = type;
          vm.curI.str = '1';
          $scope.saveI();
        }
      }
      if ($scope.getInputType(type) === 'list') {
        $scope.openList();
      }
    };

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

    var findType = function(input, typeName) {
      for (var i=0; i < input.length; ++i) {
        if (input[i].type === typeName) {
          return true;
        }
      }
      return false;
    };

    var addType = function(types, type) {
      if (types.indexOf(type) == -1) {
        types.push(type);
      }
    };

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
      $scope.dialog.input.splice($scope.dialog.input.indexOf(input),1);

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

    var currentKeyword = "";
    var currentKind = "";
    var currentSearchIdx = 0;

    vm.searchKind = 'name';
    vm.isReplace = false;
    $scope.searchNode = function(event) {
      //find the node
      var selectedVal = document.getElementById('search').value;
      var node = baseSvg.selectAll(".node");
      if (selectedVal != "") {
        var selected = node.filter(function (d, i) {
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
        });
        if (currentKeyword !== selectedVal || currentKind !== vm.searchKind) {
          currentKeyword = selectedVal;
          currentKind = vm.searchKind;
          currentSearchIdx = 0;
        }

        if (selected && selected.length == 1 && selected[0].length >= 1) {
          selectedNode = selected[0][currentSearchIdx].__data__;
          selectedSVG = d3.select(selected[0][currentSearchIdx]);
          update(selectedNode);
          centerNode(selectedNode);

          currentSearchIdx = (++currentSearchIdx) % selected[0].length;
        }
      }
    };

    $scope.replaceNode = function(event) {
      var selectedVal = document.getElementById('search').value;
      var replacedVal = document.getElementById('replace').value;
      if (selectedVal == '' || replacedVal == '')
        return;

      vm.setChanged(true, false, true);

      var re = new RegExp(selectedVal, "g");
      for (var idx=0; idx < dialogs.length; ++idx) {
        var d = dialogs[idx];
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
      }

      d3.selectAll('.node').remove();
      d3.selectAll('path').remove();
      selectedSVG =null;
      update(treeData);
      if (selectedNode) {
        selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
          if (d.id === selectedNode.id)
            return true;
        });
        update(selectedNode);
      }
    };

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
      if (type == 'Entity') return '@ ';
      if (type == 'Intent') return '# ';
      if (type == 'RegExp') return '/ ';
      if (type == 'If') return 'If ( ';
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

    var procOutput = function(d,r) {
      if (typeof d === 'string') {
        r.push({type: 'Text', str: d.replace(/\n/g,'\\n')});
      }
      if (!d.if && d.output) {
        r.push({type:'Text', str:d.output.replace(/\n/g,'\\n')});
      }
      if (d.call) {
        r.push({type:'Call', str:d.call});
      }
      if (d.callChild) {
        r.push({type:'CallChild', str:d.callChild});
      }
      if (d.returnCall) {
        r.push({type:'ReturnCall', str:d.returnCall});
      }
      if (d.if) {
        r.push({type:'If', str:d.if});
        if (typeof d.output === 'string') {
          r.push({type:'Text', str:d.output});
        } else {
          procOutput(d.output, r);
        }
      }
      if (d.up) {
        r.push({type:'Up', str:d.up});
      }
      if (d.repeat && typeof d.repeat == 'string') {
        r.push({type:'Repeat', str:d.repeat+""});
      }
      if (d.options && d.options.output) {
        r.push({type:'Options', str:d.options.output.replace(/\n/g, '\\n')});
      }
      if (d.return) {
        r.push({type:'Return', str:d.return+""});
      }
      if (d.buttons) {
        d.buttons.forEach(function(b) {
          if (b.url) {
            r.push({type:'URLButton', str:b.text, url:b.url});
          } else {
            r.push({type:'Button', str:b.text});
          }
        });
      }
      if (d.image) {
        r.push({type:'Image', str:d.image.displayname, filename:d.image.url.substring(7)});
      }

      if (d.list) {
        r.push({type:'List', str:''+d.list.map(function(item) { return item.title; }), list:d.list});
      }

    };

    var initOutput = function(output) {
      var res = [];
      if (Array.isArray(output)) {
        output.forEach(function(d) {
          var r = [];
          procOutput(d,r);
          res.push(r);
        });
      } else {
        var r = [];
        if (typeof output === 'string') {
          r.push({type:'Text', str:output.replace(/\n/g,'\\n')});
        } else {
          procOutput(output,r);
        }
        res.push(r);
      }
      return res;
    };

    var initOutput2 = function(output) {
      var res = [];
      if (Array.isArray(output)) {
        output.forEach(function(d) {
          res.push(d);
        });
      } else {
        if (typeof output === 'string') {
          res.push({if: null, text: output.replace(/\n/g, '\\n')});
        }
        else {
          res.push(output);
        }
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

    var restoreOutput = function(result) {
      var output = [];
      result.forEach(function(res) {
        var o = {};
        res.forEach(function(r) {
          if (r.type === 'Text') {
            o.output = r.str;
          } else if (r.type === 'Call') {
            o.call = r.str;
          } else if (r.type === 'CallChild') {
            o.callChild = r.str;
          } else if (r.type === 'ReturnCall') {
            o.returnCall = r.str;
          } else if (r.type === 'If') {
            o.if = r.str;
          } else if (r.type === 'Up') {
            o.up = r.str;
          } else if (r.type === 'Repeat') {
            o.repeat = r.str;
          } else if (r.type === 'Options') {
            o.options = {output: r.str};
          } else if (r.type === 'Return') {
            o.return = r.str;
          } else if (r.type === 'Image') {
            o.image = {url: '/files/'+r.filename, displayname:r.str};
          } else if (r.type === 'Button') {
            (o.buttons || (o.buttons = [])).push({text:r.str});
          } else if (r.type === 'URLButton') {
            (o.buttons || (o.buttons = [])).push({text:r.str, url:r.url});
          } else if (r.type === 'List') {
            o.list = r.list;
          }
        });
        var newo = {};
        if (o.if) {
          newo.if = angular.copy(o.if);
          delete o.if;
          if (Object.keys(o).length == 1 && typeof o.output === 'string') {
            o = o.output;
          }
          newo.output = angular.copy(o);
        } else if (Object.keys(o).length == 1 && typeof o.output === 'string') {
          newo = o.output
        } else {
          newo = o;
        }
        output.push(newo);
      });
      if (output.length == 1) {
        output = output[0];
      }
      return output;
    };

    // output handling
    vm.outputKind = [
      {name:"Text",  active:true},
      {name:"Content",  active:false},
      {name:"List",  active:false},
      {name:"Action",  active:false},
    ];

    vm.changeOutputKind = function(output, kind) {
      vm.outputKind.forEach(function(k) {k.active = false});
      kind.active = true;
      output.kind = kind.name;
    };

    vm.getOutputKind = function(output) {
      if (typeof output === 'string') return 'Text';
      if (output.kind) return output.kind;
      return 'Text';
    };

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
      else if (dialog.task)
        $scope.dialog.task = {name: dialog.task};

      $scope.dialog.output = initOutput2(dialog.output);

      if (dialog.output.length == 0) {
        $scope.addOutput(dialog.input.length == 0);
      } else if (dialog.output.length == 1 && Object.keys(dialog.output[0]).length == 0) {
        $scope.addO($scope.dialog.output[0], dialog.input.length == 0);
      }

      if (dialog.input.length == 0) {
        $scope.addInput();
      }

      $resource('/api/dialoginfos/:bot_id/:file_id', {}).get({bot_id: vm.bot_id, file_id: vm.file_id}, function(res) {
        vm.tasks = res.tasks.map(function (t) { return {name: t, type: 'User Tasks'} });
        vm.types = res.types.map(function (t) { return t.name });
        vm.type_dic = res.type_dic;

        OpenTasksService.query({botId: $cookies.get('default_bot')}).$promise.then(function (result) {
          vm.commonTasks = result;
          vm.entity = [];
          vm.commonTasks.forEach(function (d) { vm.entity[d.name] = d.entity; });
          vm.commonTasks = vm.commonTasks.map(function (t) { return {name: t.name, displayName:t.displayName, paramSchema: t.paramSchema, type: 'Common Tasks'}; });
          vm.tasks = vm.tasks.concat(vm.commonTasks);
        });
      });

      IntentsService.query({botName: $rootScope.botId}).$promise.then(function (result) {
        vm.intents = result.map(function(i) { return i.name; });
        console.log(vm.intents)
      }, function (err) {
        console.log(err);
      });

      EntityContentsService.query({botName: $cookies.get('default_bot')}).$promise.then(function (result) {
        console.log(result);
        vm.entities = result.map(function (i) {
          return i.name
        })
      }, function (err) {
        console.log(err)
      });

      $scope.safeApply();
      $timeout(function() {
        $scope.openEditor();
        $scope.initButton();
      });

    };

    $scope.openEditorTask  = function() {
      $('#content').css('padding-right', '450px');
      $('#modalTaskForm').show();
    };

    $scope.closeEditorTask= function() {
      $('#modalTaskForm').hide();
      $('#content').css('padding-right', '0px');
    };

    $scope.openEditor = function() {
      $('#content').css('padding-right', '450px');
      $('#modalForm').show();
    };

    $scope.closeEditor = function() {
      $('#modalForm').hide();
      $('#content').css('padding-right', '0px');
      document.getElementById('mainpage').focus();
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

    $scope.update = function (isValid) {

      vm.edit = false;
      vm.setChanged(true);

      // $scope.error = null;
      // if (!isValid) {
      //   $event.stopPropagation();
      //   $scope.$broadcast('show-errors-check-validity', 'dialogForm');
      //   return false;
      // }

      selectedNode.name = $scope.dialog.name;
      selectedNode.input = restoreInput($scope.dialog.input);
      if ($scope.dialog.task && Object.keys($scope.dialog.task).length == 1)
        selectedNode.task = $scope.dialog.task.name || $scope.dialog.task.template;
      else
        selectedNode.task = $scope.dialog.task;
      //selectedNode.output = restoreOutput($scope.dialog.output);
      selectedNode.output = $scope.dialog.output;

      // selectedSVG.remove();
      selectedSVG = null;

      _update(selectedNode);
      _updateSelected(selectedNode);

      $scope.closeEditor();
      //Dialogs.update(dialog);
    };

    $scope.save = function(func) {
      //vm.changeHistory = [];
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
        delete node.buttons;

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

        if (node.children)
          node.children.forEach(clear);
      };

      dialogs.forEach(clear);

      var common = angular.copy(treeData);
      delete common.children;
      common_dialogs[0] = common;
      common_dialogs.forEach(clear);

      return DialogSaveService.update({botId: vm.botId, fileName: vm.fileName, dialogs:dialogs, commons:common_dialogs},
        function() {
          $scope.emitMsg(':reset user');
          $scope.emitMsg(':init');

          notificationService.success('저장되었습니다');

          console.log("saved");
        }, function(err) {
          console.log(err);
        });
    };


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
      } else {
        var text = [];
        if (typeof output.output === 'string') {
          text.push(/*'[문장] ' + */output.output.replace(/\n/g, '\\n'));
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
          dialog.image_text = '/files/' + output.image;
        }
        if (output.buttons) {
          dialog.buttons = output.buttons.map(function(b) { return b.name });
        }
        if (output.list)
          text.push('[리스트] ' + output.list.map(function(item) { return item.title; }));

        return text + "";
      }
    };

    var initPrintOutput = function(dialog) {
      delete dialog.image_text;
      delete dialog.buttons;
    };

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
          treeData.children.push(d);
        }
        common_dialogs.forEach(handleDialog); // for-loop is 10 times faster
        vm.otherDialogs = dialogs;
      }
      console.log(nodes);
      console.log(links_internal);
    };

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
        // var input_text = (typeof d.input_text == 'string' ? d.input_text.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.input_text);
        // var output_text = (typeof d.output_text == 'string' ? d.output_text.replace(/(?:\r\n|\r|\n)/g, '<br />') : d.output_text);
        // return "<strong>Input:</strong><br/><span style='color:cornflowerblue'>" + input_text + "</span><br/><br/>" +
        //   "<strong>Output:</strong><br/><span style='color:cornflowerblue'>" + output_text + "</span>";
        return "<image src='" + d.image_text + "' height='150px'>";
      });
    baseSvg.call(tip);

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

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

      // var prev = 0;
      // for (var i=0; i < levelWidth.length; ++i) {
      //   levelWidth[i] = prev + levelWidth[i];
      //   prev = levelWidth[i]-2 ;
      // }

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
        //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
        d.y = (d.depth * labelWidth); //maxLabelLength * 10px
        // alternatively to keep a fixed scale one can set a fixed depth per level
        // Normalize for fixed-depth by commenting out below line
        // d.y = (d.depth * 500); //500px per level.
      });

      // var layout = function(node) {
      //   if (node.parent != null) {
      //     node.x = node.parent.x + itemHeight * node.parent.children.indexOf(node);
      //   }
      //   if (node.children) {
      //     node.children.forEach(layout);
      d3.selectAll('node').remove();
      //   }
      // };
      // treeData.children.forEach(layout);

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
      // .attr("stroke-width", 2)
      // .style("stroke", function (d) {
      //   return d._children ? "lightsteelblue" : "#fff";
      // })
      //.on('mouseover', tip.show)
      //.on('mouseout', tip.hide);

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

      // Change the rect fill depending on whether it has children and is collapsed
      // node.select("rect.nodeRect")
      //   .style("stroke", function (d) {
      //     return d._children ? "lightsteelblue" : "#fff";
      //   });

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });


      //add the text
      // nodeUpdate.select("text#name")
      //   .text(function(d) { return d.name; });
      //
      // nodeUpdate.select("text#input")
      //   .text(function(d) { return "In: " + (d.input_text ? d.input_text: ""); })
      //   .call(wrap, rectW-30, 1);
      //
      // nodeUpdate.select("text#task")
      //   .text(function(d) {
      //     if (d.task && d.task.name)
      //       return "Task: " + d.task.name;
      //     else if (d.task)
      //       return "Task: " + d.task;
      //     return "Task: ";
      //   })
      //   .call(wrap, rectW-25, 2);
      //
      // nodeUpdate.select("text#output")
      //   .text(function(d) { return "Out: " + (d.output_text ? d.output_text : ""); })
      //   .call(wrap, rectW-25, 2);
      //
      // nodeUpdate.select("text#image")
      //   .text(function(d) { return "Image: " + (d.image_text ? d.image_text: ""); })
      //   .call(wrap, rectW-25, 1);
      //
      // nodeUpdate.select("text#button")
      //   .text(function(d) { return "Button: " + (d.buttons ? d.buttons + "": ""); })
      //   .call(wrap, rectW-25, 1);

      // Fade the text in
      // nodeUpdate.select("text")
      //   .transition().duration(0)
      //   .style("fill", "red")
      //   .transition().duration(1000)
      //   .style("fill", "black");

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

      // var edgelabels = svgGroup.selectAll(".edgelabel")
      //   .data(links_internal)
      //   .enter().append('text')
      //   .text(function(d) { return d.type; })
      //   .attr("x", function(d) {
      //     return ((d.source.x + rectW/2 + d.target.x + rectW/2 )/2);
      //   })
      //   .attr("y", function(d) {
      //     return ((d.source.y + rectH/2 + d.target.y + rectH/2 )/2);
      //   });

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

    var dblclick_occured = false;
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

    function toggleAndCenter(d) {
      d = toggleChildren(d);
      update(d);
      centerNode(d);
    }

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
    function centerNode(source, isStart) {
      var svg  = baseSvg.selectAll(".node").filter(function(d) {
        if (d.id === source.id)
          return true;
      })[0];
      var offset = svg[0].getBoundingClientRect();
      if (offset["left"] == 0 && offset["bottom"] == 0)
        return;
      //console.log([offset["left"], offset["top"],offset["right"],offset["bottom"]]+"");
      if (isStart !=='start' && offset["left"] > 300 && offset["top"] > 200 && offset["top"] < viewerHeight && offset["left"] < viewerWidth)
        return;

      var scale = zoomListener.scale();
      var x = -source.y0;
      if (isStart != undefined) {
        if (isStart === 'start') {
          x -= 300;
        } else {
          //x -= 400;
        }
      }
      var y = -source.x0 - 100;
      x = x * scale + viewerWidth / 2;
      y = y * scale + viewerHeight / 2;

      d3.select('g').transition()
        .duration(duration)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
      zoomListener.scale(scale);
      zoomListener.translate([x, y]);
    }

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

      vm.setChanged(true, true);
      if (d3.event)
        d3.event.stopPropagation();
      if (d._children) {
        toggleChildren(d);
      }
      var newDialog = {name:"", id:(!vm.dialog ? "common" : "") + vm.fileName + (++vm.maxId),
        filename:vm.fileName+(!vm.dialog?"common" : "") , input:[], output:[]};
      (d.children || (d.children = [])).push(newDialog);
      if (d.depth === 0) {
        if (vm.dialog) {
          dialogs.push(newDialog);
        } else {
          common_dialogs.push(newDialog);
        }
      }

      update(d);

      updateSelected(newDialog);

      edit(selectedNode);
    }

    function initSelect() {
      selectedNode = null;
      selectedSVG = null;
    }

    function swapNode(parent,src, target) {
      var srcNode = parent.children[src];
      var targetNode = parent.children[target];

      var temp = srcNode;
      parent.children[src] = targetNode;
      parent.children[target] = temp;

      if (parent.depth == 0) {
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

      updateSelected(srcNode);
    }

    // assumption: idx is already checked when creating buttons for the following actions
    function goUp(d) {
      vm.setChanged(true , true);
      var idx = d.parent.children.indexOf(d);
      swapNode(d.parent, idx, idx-1 );
    }

    function goDown(d) {
      vm.setChanged(true, true);
      var idx = d.parent.children.indexOf(d);
      swapNode(d.parent, idx, idx+1 );
    }

    function deleteNode(d) {
      if (d.name === "시작")
        return;
      vm.setChanged(true, true);
      if (d3.event)
        d3.event.stopPropagation();
      initSelect();

      if (d.parent && d.parent.children) {
        for (var i=0; i < d.parent.children.length; ++i) {
          if (d.parent.children[i].id === d.id) {
            d.parent.children.splice(i,1);
            break;
          }
        }
      }

      if (d.depth == 1) {
        for (var i=0; i < dialogs.length; ++i) {
          if (dialogs[i].id === d.id) {
            dialogs.splice(i,1);
            break;
          }
        }
      }

      //TODO: need to remove other links such as call...
      delete_int(d);
      updateSelected(d.parent);
    }

    function delete_int(d) {
      if (d.children) {
        d.deleted_children = d.children;
        d.deleted_children.forEach(delete_int);
        d.children = null;
      }
    }

    function edit(d) {
      if (d3.event)
        d3.event.stopPropagation();
      if (d.name === "시작") {
        angular.element(document.getElementById('control')).scope().findOne(d, true);
      } else {
        angular.element(document.getElementById('control')).scope().findOne(d);
      }
    }

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

      vm.curO.filename = response.filename;
      vm.curO.str = response.displayname;
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
    vm.showOneline = function() {
      vm.oneline = true;
      d3.selectAll('.node').remove();
      d3.selectAll('path').remove();
      selectedSVG =null;
      update(treeData);
      if (selectedNode) {
        selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
          if (d.id === selectedNode.id)
            return true;
        });
        update(selectedNode);
      }
    };
    vm.showDetail = function() {
      vm.oneline = false;
      d3.selectAll('.node').remove();
      d3.selectAll('path').remove();
      selectedSVG =null;
      update(treeData);
      if (selectedNode) {
        selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
          if (d.id === selectedNode.id)
            return true;
        });
        update(selectedNode);
      }
    };

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
        bot: vm.botName,
        user: vm.userId,
        msg: msg
      });
    };

    // for task template
    //TODO: this should be a separte module
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

    vm.parseSchema = function(dataSchema) {
      var jsonSchema;
      try {
        jsonSchema = JSON.parse(dataSchema);
      } catch(e) {
        alert("invalid schema" + e.message);
        return;
      }

      console.log(jsonSchema);

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
      console.log(paramSchema);

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

      console.log("schema="+ JSON.stringify(schema));

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

        console.log("given input=" + JSON.stringify(temp));
        jsonEditor.setValue(temp);
      }

      jsonEditor.on('change', function() {
        console.log('editor.onchange -> $compile editor');
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

    $scope.openIntent = function(task, isCommon) {
      $scope.intent = new IntentsService({botName: $rootScope.botId});
      $timeout(function() {
        $('.modal-with-intent').click();
      });
    };

    $scope.openList = function(task, isCommon) {
      vm.curO.filename = '';
      $timeout(function() {
        $('.modal-with-list').click();
      });

    };

    $scope.openEntity = function(task, isCommon) {
      $scope.entity = new EntitysService({botName: $rootScope.botId});
      $('.modal-with-entity').click();
    };

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

    IntentsService.query({botName: $rootScope.botId}).$promise.then(function (result) {
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

    vm.inlineInputFocus = function (index) {
      $timeout(function () {
        document.getElementById('inlineInput_' + index).focus()
      })
    };

    vm.searchTopic = function(topicTerm, target) {
      var topicList = [];
      if(target == 'entity'){
        angular.forEach(vm.entities, function(item) {
          if (item.toUpperCase().indexOf(topicTerm.toUpperCase()) >= 0) {
            topicList.push(item);
          }
        });
        vm.matchedEntities = topicList;
      }else if(target == 'intent'){
        angular.forEach(vm.intents, function(item) {
          if (item.toUpperCase().indexOf(topicTerm.toUpperCase()) >= 0) {
            topicList.push(item);
          }
        });
        vm.matchedIntents = topicList;
      }
    };

    vm.getTopicTextRaw = function(topic, inlineInput) {
      if(vm.curI.str.indexOf('@') > -1){
        inlineInput.push({type: 'Entity', str: topic});
      }else if(vm.curI.str.indexOf('#') > -1){
        inlineInput.push({type: 'Intent', str: topic});
      }else if(vm.curI.str.indexOf(':') == 0){
        inlineInput.push({type: 'RegExp', str: topic});
      }
      vm.curI.str = '';
      return '';
    };

    $scope.inlineInputKeyDown = function (event, inlineInput) {
      if(event.keyCode == 13 && (vm.curI.str.indexOf('@') != 0) && (vm.curI.str.indexOf('#') != 0) && (vm.curI.str.indexOf(':') != 0) && (vm.curI.str.indexOf('if ') != 0)){
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
      if(event.keyCode == 13 && (vm.curI.str.indexOf(':') == 0)){
        vm.curI.str = vm.curI.str.slice(1);
        inlineInput.push({type: 'RegExp', str: vm.curI.str});
        vm.curI.str = '';
        $scope.processedInput = '';
        event.preventDefault();
        event.stopPropagation();
      }
      if(event.keyCode == 13 && (vm.curI.str.indexOf('if ') == 0)){
        vm.curI.str = vm.curI.str.slice(2);
        inlineInput.push({type: 'If', str: vm.curI.str});
        vm.curI.str = '';
        $scope.processedInput = '';
        event.preventDefault();
        event.stopPropagation();
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
        _update(source.children);
        // centerNode(source);
      } else {
        var dg = document.getElementById('dialog-graph');
        while (dg.firstChild) dg.removeChild(dg.firstChild);

        // _update(root.children, document.getElementById('dialog-graph'), 1);
        _update(root, document.getElementById('dialog-graph'));

        _updateSelected(root);
        // vm.collapseDepth();
        // update(root, true);
        // centerNode(root, 'start');
      }
    }

    var _update = function(dialog, parent, collapseAll) {
      var input = handleInput(dialog.input);
      var output = handlePrintOutput(dialog, dialog.output);

      var dlgGroup, dlg;
      if(document.getElementById(dialog.id)) {
        dlg = document.getElementById(dialog.id);
        dlgGroup = dlg.parentNode;
      } else {
        var dlgGroup = document.createElement('div');
        parent.appendChild(dlgGroup);

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
      if(dialog.children) dlg.className = 'dlg with-children';
      else dlg.className = 'dlg';

      if(vm.oneline) {
        dlg.classList.add('dlg-oneline');
        dlg.innerHTML =
          '<div>' + dialog.name + ' ('+ dialog.id + ')' + '</div>';
      } else {
        dlg.innerHTML =
          '<div class="dlg-name">' + dialog.name + ' ('+ dialog.id + ')' + '</div>' +
          '<div class="dlg-input">' + input + '</div>' +
          '<div class="dlg-output">' + output.replace(/\\n/g, '\n') + '</div>';

        if(dialog.output.buttons) {
          for(var i in dialog.output.buttons) {
            if(dialog.output.buttons[i].url) dlg.innerHTML += '<div class="bubble-button"><a href="' + dialog.output.buttons[i].url + '" target="_blank">' + dialog.output.buttons[i].text + '</a></div>';
            else dlg.innerHTML += '<div class="bubble-button"><a ng-click="vm.sendMsg(\'' + dialog.output.buttons[i].text + '\')">' + dialog.output.buttons[i].text + '</a></div>';
          }
        }

        var actionGroup = document.createElement('div');
        dlg.appendChild(actionGroup);
        actionGroup.id = dialog.id + 'dlg-action';
        actionGroup.className = 'dlg-action';

        updateDialogAction(dialog, actionGroup);
      }

      dlg.onclick = function(e) {
        _updateSelected(dialog);
        // angular.element(document.getElementById('control')).scope().findOne(dialog);
      };

      // console.log(dialog.id + ':' + dialog.parent + ',' + dialog.children);

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
      } else if(document.getElementById(dialog.id + '_children')) {
        var elem = document.getElementById(dialog.id + '_children');
        elem.parentNode.removeChild(elem);
      }
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

      if(dialog.parent && dialog.parent.children) {
        var idx = dialog.parent.children.indexOf(dialog);
        if(idx > 0) {
          var goUpBtn = document.createElement('div');
          actionGroup.appendChild(goUpBtn);
          goUpBtn.innerHTML = '<i class="fa fa-arrow-up"></i>';
          goUpBtn.onclick = function(e) {
            _goUp(dialog);
          };
        }

        idx = dialog.parent.children.indexOf(dialog);
        if(idx < dialog.parent.children.length - 1) {
          var goDownBtn = document.createElement('div');
          actionGroup.appendChild(goDownBtn);
          goDownBtn.innerHTML = '<i class="fa fa-arrow-down"></i>';
          goDownBtn.onclick = function(e) {
            _goDown(dialog);
          };
        }
      }

      if(dialog.children || dialog._children) {
        var toggleBtn = document.createElement('div');
        toggleBtn.style.float = 'right';
        actionGroup.appendChild(toggleBtn);
        if (dialog.children) toggleBtn.innerHTML = '<i class="fa fa-chevron-left"></i>'; else if(dialog._children) toggleBtn.innerHTML = '<i class="fa fa-chevron-right"></i>';
        // toggleBtn.innerText = '토글';
        toggleBtn.onclick = function(e) {
          _toggleAndCenter(dialog)
        };
      }

      var deleteBtn = document.createElement('div');
      deleteBtn.style.float = 'right';
      actionGroup.appendChild(deleteBtn);
      deleteBtn.innerHTML = '<i class="fa fa-close"></i>';
      deleteBtn.onclick = function(e) {
        _deleteNode(dialog);
      };

      var addBtn = document.createElement('div');
      addBtn.style.float = 'right';
      actionGroup.appendChild(addBtn);
      addBtn.innerHTML = '<i class="fa fa-plus"></i>';
      addBtn.onclick = function(e) {
        _addChild(dialog);
      };

      var editBtn = document.createElement('div');
      editBtn.style.float = 'right';
      actionGroup.appendChild(editBtn);
      editBtn.innerHTML = '<i class="fa fa-edit"></i>';
      editBtn.onclick = function(e) {
        edit(dialog);
      };
    }

    function drawDialogLines(target) {
      var svgNode = target.childNodes[0];
      svgNode.innerHTML = '';

      var x1 = 0;
      var y1 = 35;
      if(vm.oneline) y1 = 20;
      else y1 = 35;

      var targetOffset = getOffset(target);
      var last = target.childNodes[target.childNodes.length -1].childNodes[1];
      var off2 = getOffset(last);
      var x2 = 0;
      var y2;
      if(vm.oneline) y2 = off2.top - targetOffset.top + 15;
      else y2 = off2.top - targetOffset.top + 25;

      svgNode.innerHTML = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="black"/>';
      if(vm.oneline)
        svgNode.innerHTML += '<line x1="' + (x1 - 10) + '" y1="' + y1 + '" x2="' + x1+ '" y2="' + y1+'" stroke="black"/>';
      else
        svgNode.innerHTML += '<line x1="' + (x1 - 10) + '" y1="' + y1 + '" x2="' + x1+ '" y2="' + y1+'" stroke="black"/>';
      svgNode.style.height = y2;
    }

    function drawSelectDialogLine(node) {
      var cNode = node;
      while(cNode.parent) {
        drawDialogLines(document.getElementById(cNode.parent.id + '_children'));
        cNode = cNode.parent;
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

    var _updateSelected = function(newd) {
      if(selectedNode) {
        var dlg = document.getElementById(selectedNode.id);
        if(dlg) dlg.classList.remove('dlg-selected');

        drawSelectDialogLine(selectedNode);
      }

      selectedNode = newd;
      // selectedSVG = baseSvg.selectAll(".node").filter(function(d) {
      //   if (d.id === newd.id)
      //     return true;
      // });

      var dlg = document.getElementById(selectedNode.id);
      if(dlg) dlg.classList.add('dlg-selected');
      // dlg.className += ' dlg-selected';

      // _update(selectedNode);
      // centerNode(selectedNode);
      drawSelectDialogLine(newd);
    };

    vm._showOneline = function() {
      vm.oneline = true;
      document.getElementById('dialog-graph').innerHTML = '';
      _update(treeData, document.getElementById('dialog-graph'));
      if (selectedNode) {
        _updateSelected(selectedNode);
      }
    };

    vm._showDetail = function() {
      vm.oneline = false;
      document.getElementById('dialog-graph').innerHTML = '';
      _update(treeData, document.getElementById('dialog-graph'));
      if (selectedNode) {
        _updateSelected(selectedNode);
      }
    };

    vm.zoom = 1.0;
    vm.zoomin = function() {
      if(vm.zoom < 1.5) vm.zoom += 0.1;
      if(vm.zoom > 1.5) vm.zoom = 1.5;
      document.getElementById('dialog-graph').style.zoom = vm.zoom;
    }

    vm.zoomout = function() {
      if(vm.zoom > 0.4) vm.zoom -= 0.1;
      if(vm.zoom < 0.3) vm.zoom = 0.3;
      document.getElementById('dialog-graph').style.zoom = vm.zoom;
    }

    function _toggleAndCenter(d) {
      console.log('_toggleAndCenter');
      d = toggleChildren(d);
      _update(d);
      // centerNode(d);
    }

    function _goUp(d) {
      vm.setChanged(true , true);
      var idx = d.parent.children.indexOf(d);

      _swapNode(d.parent, idx, idx-1 );
    }

    function _goDown(d) {
      vm.setChanged(true , true);
      var idx = d.parent.children.indexOf(d);

      _swapNode(d.parent, idx, idx+1 );
    }

    function _swapNode(parent, src, target) {
      var srcNode = parent.children[src];
      var targetNode = parent.children[target];

      var temp = srcNode;
      parent.children[src] = targetNode;
      parent.children[target] = temp;

      if (parent.depth == 0) {
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

      console.log(srcNode.id + ', ' + targetNode.id + ', '+ srcElement + ',' + targetElement + ',' + parentElement);
      // parentElement.insertBefore(srcElement, targetElement);

      if(src > target) parentElement.insertBefore(srcElement, targetElement);
      else if(src < target) parentElement.insertBefore(targetElement, srcElement);
      // updateSelected(srcNode);

      updateDialogAction(srcNode, document.getElementById(srcNode.id + 'dlg-action'));
      updateDialogAction(targetNode, document.getElementById(targetNode.id + 'dlg-action'));
    }

    function _deleteNode(d) {
      if (d.name === "시작")
        return;
      vm.setChanged(true, true);
      if (d3.event)
        d3.event.stopPropagation();
      initSelect();

      if (d.parent && d.parent.children) {
        for (var i=0; i < d.parent.children.length; ++i) {
          if (d.parent.children[i].id === d.id) {
            d.parent.children.splice(i,1);
            break;
          }
        }
      }

      if (d.depth == 1) {
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
      // updateSelected(d.parent);
    }

    function _addChild(d) {
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

      vm.setChanged(true, true);
      if (d3.event)
        d3.event.stopPropagation();
      if (d._children) {
        toggleChildren(d);
      }
      var newDialog = {name:"", id:(!vm.dialog ? "common" : "") + vm.fileName + (++vm.maxId),
        filename:vm.fileName+(!vm.dialog?"common" : "") , input:[], output:[]};
      (d.children || (d.children = [])).push(newDialog);
      if (d.depth === 0) {
        if (vm.dialog) {
          dialogs.push(newDialog);
        } else {
          common_dialogs.push(newDialog);
        }
      }

      if(d.children) {
        var dlgChildren = document.getElementById(d.id + '_children');

        if(!dlgChildren) {
          var dlgGroup = document.getElementById(d.id).parentNode;
          dlgChildren = document.createElement('div');
          dlgGroup.appendChild(dlgChildren);
          dlgChildren.id = d.id + '_children';
          dlgChildren.className = 'dlg-children';

          if(vm.oneline) {
            dlgChildren.innerHTML +='<svg width="10" height="100"></svg>';
          } else {
            dlgChildren.innerHTML +='<svg width="20" height="100"></svg>';
          }
        }

        // addObserver(dlgChildren);
        _update(newDialog, dlgChildren);
      } else if(document.getElementById(dialog.id + '_children')) {
        var elem = document.getElementById(dialog.id + '_children');
        elem.parentNode.removeChild(elem);
      }

      _update(d);

      _updateSelected(newDialog);

      edit(selectedNode);
    }

  }]
)
  .directive('autoFocus', [ '$timeout', function ($timeout) {
    return {
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