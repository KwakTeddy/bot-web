"user strict";
angular.module("bots").controller("BotAuthsController", ["$scope", "$timeout", "$http", "$cookies", "$state", "$stateParams",
  function ($scope, $timeout, $http, $cookies, $state, $stateParams) {
  // $timeout(function () {
  //   document.getElementById('sidebar-left').style.display = 'none';
  //   document.getElementById('chat-include').style.display = 'none';
  //   document.getElementById('log-button').style.display = 'none';
  //   document.getElementById('intent-button').style.display = 'none';
  //   document.getElementById('main').classList.remove('content-body');
  // });
  $http.get("/api/bots/files/" + $cookies.get("botObjectId")).then(function (doc) {
    $scope.botFiles = doc.data
  }, function (err) {
    console.log(err)
  });

  $http.get("/api/dialogsets/" + $cookies.get("botObjectId")).then(function (doc) {
    console.log(doc);
    $scope.botDialogsets = doc.data;
  }, function (err) {
    console.log(err)
  });

  $http.get("/api/menu-navigations").then(function (doc) {
    console.log(doc);
    $scope.menuList = doc.data;
  }, function (err) {
    console.log(err)
  });
  $scope.save = function () {
    $scope.authData = [];
    $scope.menuList.forEach(function (doc) {
      if(doc.view) {
        var data = {
          subjectSchema: "MenuNavigation",
          subject: doc._id,
          bot: $cookies.get("botObjectId"),
          edit: doc.edit
        };
        $scope.authData.push(data);
      }
    });

    $scope.botFiles.forEach(function (doc) {
      if(doc.view) {
        var data = {
          subjectSchema: "BotFile",
          subject: doc._id,
          bot: $cookies.get("botObjectId"),
          edit: doc.edit
        };
        $scope.authData.push(data);
      }
    });
    $scope.botDialogsets.forEach(function (doc) {
      if(doc.view) {
        var data = {
          subjectSchema: "Dialogset",
          subject: doc._id,
          bot: $cookies.get("botObjectId"),
          edit: doc.edit
        };
        $scope.authData.push(data);
      }
    });
    console.log($scope.authData)
    console.log($scope.email)

    $http.post("/api/bot-auths", {authData: $scope.authData, email: $scope.email}).then(function (doc) {
      console.log(doc);
      $state.go("bot-auths.list")
    }, function (err) {
      console.log(err);
    })
  };

  $http.post("/api/bot-auths/getAuth", {bId: $cookies.get("botObjectId"), user: $stateParams.userId}).then(function (doc) {
    console.log(doc)
    doc.data.forEach(function (_doc) {
      $scope.menuList.forEach(function (menu) {
        if(_doc.subject.title == menu.title) {
          menu.view = true;
          menu.edit = _doc.edit
        }

      });

      $scope.botFiles.forEach(function (botFile) {
        if(_doc.subject.title == botFile.title) {
          botFile.view = true;
          botFile.edit = _doc.edit
        }

      });

      $scope.botDialogsets.forEach(function (dialogset) {
        if(_doc.subject.title == dialogset.title) {
          dialogset.view = true;
          dialogset.edit = _doc.edit
        }

      });
    })


  }, function (err) {
    console.log(err);
  });
  console.log($cookies.get("botObjectId"))


}]);
