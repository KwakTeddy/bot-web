(function () {
  'use strict';

  angular
    .module('channels')
    .controller('ChannelsListController', ChannelsListController);

  ChannelsListController.$inject = ['ChannelsService', '$scope', '$cookies', '$uibModal', '$http', 'Authentication', '$window', '$state'];

  function ChannelsListController(ChannelsService, $scope, $cookies, $uibModal, $http, Authentication, $window, $state) {
    var vm = this;
    vm.user = Authentication.user;
    $http.get('/api/bots/byNameId/' + $cookies.get('default_bot')).then(function (result) {
      vm.userBot = result.data;
    }, function (err) {
      console.log(err)
    });

    // 채널 연결하는 모달창
    vm.modal = function (channel, method) {
      $scope.channel = channel;
      $scope.method = method;
      $scope.userBotId = $cookies.get('default_bot');
      $scope.host = location.protocol + "//" + location.host;

      if ((channel == 'facebook') && (method !== 'easy')){ //페이스북 연결시 처리
        $scope.fbLoading = true;
        $scope.noPage = false;
        var accessToken = '';
        return $http.get('/api/auth/facebook/token/' + vm.user._id).then(function (result) { //사용자 정보 불러오기
          if ((result.data.provider == 'facebook') || (result.data.additionalProvidersData && result.data.additionalProvidersData.facebook)){ //facebook 과거 로그인 여부 확인 후 토큰 가져오기
            if (result.data.provider == 'facebook') accessToken = result.data.providerData.accessToken;
            else                                    accessToken = result.data.additionalProvidersData.facebook.accessToken;

            FB.api('/me/accounts?fields=picture,name,link,access_token,perms&access_token=' + accessToken, function(response) { //페이스북 페이지 정보 가져오기
              if (response.error){//토큰 이상 - 경우에 따라 토큰 재요청 필요
                console.log(response.error);
              }else if(!response.data.length){ //토큰 이상 || 페이지 없음
                FB.api('/me/permissions?access_token='+accessToken, function (response2) { //현재 토큰의 권한 확인
                  if(response2.error){
                    console.log(response2.error)
                  }else {
                    var hasPageToken = '';
                    for(var i = 0; i < response2.data.length; i++){
                      if(response2.data[i].permission == "manage_pages"){
                        hasPageToken = true;
                        break
                      }
                    }
                    if(!hasPageToken){ // 페이지 권한 요청
                      var url = '/api/auth/facebook/page';
                      if ($state.previous && $state.previous.href) url += '?redirect_to=' + encodeURIComponent($state.previous.href);
                      $scope.fbLoading = false;
                      $window.location.href = url; //register facebook but No page Token(getting Token)
                    }else { //페이지가 없음
                      $scope.noPage = true; //user has no page
                      $scope.fbLoading = false;
                      var modalInstance = $uibModal.open({
                        templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
                        scope: $scope
                      });
                      modalInstance.result.then(function (response) {
                        console.log(response);
                      });
                      $scope.close = function () {
                        modalInstance.dismiss();
                      };
                    }
                  }
                });
              } else {
                $http.post('/api/auth/facebook/pageInfo', {user: vm.user._id, list: true, pageInfo: response.data}).then(function (res) { // 페이지 연결정보 불러오기
                  for(var j = 0; j < response.data.length; j++){ // show which page is connected
                    for(var i = 0; i < res.data.length; i++){
                      if ((res.data[i].pageId == response.data[j].id) && res.data[i].connect){
                        response.data[j]['connected'] = res.data[i].bot;
                        break;
                      }else {
                        response.data[j]['connected'] = false;
                      }
                    }
                  }
                  $scope.fbLoading = false;
                  $scope.pageLists = [];
                  $scope.pageLists = response.data;

                  $scope.close = function () {
                    modalInstance.dismiss();
                  };

                  $scope.connect = function (page) {
                    FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'post', function (response) { // 페이지 연결하기
                      if(response.success){
                        var info = {};
                        info['user'] = vm.user._id;
                        info['userBot'] = vm.userBot._id;
                        info['userBotId'] = vm.userBot.id;
                        info['page'] = page;
                        info['connect'] = true;
                        page['connected'] = vm.userBot;
                        $http.post('/api/auth/facebook/pageInfo', info).then(function (response) { //페이지 연결정보 데이터 변경
                          FB.api('me/messenger_profile?access_token='+ page.access_token, 'post', { //페이지 시작 화면 설정
                            "persistent_menu":[
                              {
                                "locale":"default",
                                "call_to_actions":[
                                  {
                                    "type":"postback",
                                    "title":"시작하기",
                                    "payload":"시작",
                                    "webview_height_ratio":"full"
                                  }
                                ]
                              }
                            ],
                            "get_started":{
                              "payload":"시작"
                            }
                          }, function (response) {
                            console.log(response)
                          });
                        }, function (err) {
                          console.log(err)
                        })
                      }else {
                        console.log(response)
                      }
                    });
                  };
                  $scope.disconnect = function (page) {
                    var info = {};
                    info['user'] = vm.user._id;
                    info['userBot'] = vm.userBot._id;
                    info['userBotId'] = vm.userBot.id;
                    info['page'] = page;
                    info['connect'] = false;
                    page['connected'] = false;
                    FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'delete', function (response) { //페이지 연결 해제
                      if (response.success){
                        page['connected'] = false;
                        $http.post('/api/auth/facebook/pageInfo', info).then(function (response) {//페이지 연결정보 변경
                          FB.api('me/messenger_profile?access_token='+ page.access_token, 'DELETE', { //페이지 시작 화면 설정
                            "fields":[
                              "get_started",
                              "persistent_menu",
                              "greeting"
                            ]
                          }, function (response) {
                            console.log(response)
                          });
                        }, function (err) {
                          console.log(err)
                        })
                      }else {
                        console.log(response)
                      }
                    });
                  };
                  var modalInstance = $uibModal.open({
                    templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
                    scope: $scope
                  });
                  modalInstance.result.then(function (response) {
                    console.log(response);
                  })
                });
              }
            });
          }else { //facebook으로 로그인한 적 없는 사용자
            var url = '/api/auth/facebook/page';
            if ($state.previous && $state.previous.href) url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            $window.location.href = url;             //register through local not facebook(getting Token)
          }
        });
      }else if((channel == 'wechat') && (method !== 'easy')){ //위챗 연결시 처리
        $scope.wcLoading = true;
        $scope.noAccount = false;
      }
      $scope.close = function () {
        modalInstance.dismiss();
      };
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
        scope: $scope
      });
      modalInstance.result.then(function (response) {
        console.log(response);
      })
    };

  }
}());
