"user strict";
angular.module("bots").controller("BotAuthsController", ["$scope", "$timeout", "$http", "$cookies", "$state", "$stateParams", "$window",
  function ($scope, $timeout, $http, $cookies, $state, $stateParams, $window) {
  $timeout(function () {
    document.getElementById('sidebar-left').style.display = 'none';
    document.getElementById('chat-include').style.display = 'none';
    document.getElementById('log-button').style.display = 'none';
    document.getElementById('intent-button').style.display = 'none';
    document.getElementById('main').classList.remove('content-body');
  });
  var vm = this;
  $scope.authData = [];
  $scope.authUser = {email: ""};

  var processAuthData = function () {
    var authData = [];
    $scope.menuList.forEach(function (doc) {
      var data = {
        subjectSchema: "MenuNavigation",
        subject: doc._id,
        bot: $cookies.get("authManageId"),
        edit: doc.edit,
        view: doc.view
      };
      authData.push(data);
    });

    $scope.botFiles.forEach(function (doc) {
      var data = {
        subjectSchema: "BotFile",
        subject: doc._id,
        bot: $cookies.get("authManageId"),
        edit: doc.edit,
        view: doc.view
      };
      authData.push(data);
    });
    $scope.botDialogsets.forEach(function (doc) {
      var data = {
        subjectSchema: "Dialogset",
        subject: doc._id,
        bot: $cookies.get("authManageId"),
        edit: doc.edit,
        view: doc.view
      };
      authData.push(data);
    });
    return authData;
  };

  var getBotFiles = function () {
    $http.get("/api/bots/files/" + $cookies.get('authManageId')).then(function (doc) {
      $scope.botFiles = doc.data
    }, function (err) {
      console.log(err)
    });
  };

  var getDialogsets = function () {
    $http.get("/api/dialogsets", {params: {bId : $cookies.get("authManageId")}}).then(function (doc) {
      $scope.botDialogsets = doc.data;
    }, function (err) {
      console.log(err)
    });
  };

  var getMenus = function () {
    $http.get("/api/menu-navigations").then(function (doc) {
      $scope.menuList = doc.data;
    }, function (err) {
      console.log(err)
    });
  };
  //bot권한 관련 데이터를 불러와 메뉴 봇파일 다이얼로그셋 별로 view edit 가능 여부 데이터 넣어주는 함수
  var getAuth = function () {
      $http.post("/api/bot-auths/getAuth", {bId: $cookies.get("authManageId"), user: $stateParams.userId}).then(function (doc) {
        if(doc.data.length) $scope.authUser = doc.data[0].user;
        doc.data.forEach(function (_doc) {
          $scope.menuList.forEach(function (menu) {
            if(_doc.subject && _doc.subject.title == menu.title) {
              menu.view = true;
              menu.edit = _doc.edit
            }
          });

          $scope.botFiles.forEach(function (botFile) {
            if(_doc.subject && _doc.subject.name == botFile.name) {
              botFile.view = true;
              botFile.edit = _doc.edit
            }
          });

          $scope.botDialogsets.forEach(function (dialogset) {
            if(_doc.subject && _doc.subject.title == dialogset.title) {
              dialogset.view = true;
              dialogset.edit = _doc.edit
            }
          });
        })
      }, function (err) {
        console.log(err);
      });
    };

  $scope.init = function () {
    getBotFiles();
    getDialogsets();
    getMenus();
    getAuth();
  };

  $scope.save = function (isValid) {
    $scope.submitted = true;
    if (!isValid){
      vm.error = null;
      $scope.$broadcast('show-errors-check-validity', 'authForm');
      return false;
    }
    var authData= processAuthData();

    var allow = false;
    authData.forEach(function (doc) {
      if(doc.view) allow = true
    });
    if(!allow){
      $scope.error = "적어도 하나의 권한을 선택하세요";
      return false;
    }

    $http.post("/api/bot-auths", {authData: authData, email: $scope.authUser.email}).then(function (doc) {
      $state.go("bot-auths.list")
    }, function (err) {
      $scope.error = err.data.message;
      console.log(err);
    })
  };
  $scope.update = function (user) {
    var authData= processAuthData();
    $http.put("/api/bot-auths/" + $cookies.get("authManageId") + "/" + user._id, {authData: authData}).then(function (doc) {
      $state.go("bot-auths.list");
    }, function (err) {
      console.log(err);
    })
  };
  $scope.remove = function (user) {
    if($window.confirm("정말 삭제하시겠습니까?")){
      $http.delete("/api/bot-auths/" + $cookies.get("authManageId") + "/" + user._id).then(function (doc) {
        $state.go("bot-auths.list");
      }, function (err) {
        console.log(err);
      })
    }
  };

  $scope.editSelect = function (target) {
    if(!target.view) target.view = true;
  };
  $scope.viewSelect = function (target) {
    if(target.edit) target.edit = false;
  };
  $scope.inputEmailChange = function () {
    if($scope.error) $scope.error = null;
  }
}]);
