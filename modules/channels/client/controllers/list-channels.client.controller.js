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

    // Connect UserBot Dialogue
    vm.modal = function (channel, method) {
      $scope.channel = channel;
      $scope.method = method;
      $scope.userBotId = $cookies.get('default_bot');
      $scope.host = location.protocol + "//" + location.host;

      if ((channel == 'facebook') && (method !== 'easy')){
        $scope.fbLoading = true;
        $scope.noPage = false;
        return $http.get('/api/auth/facebook/token/' + vm.user._id).then(function (result) {
          console.log(result);
          if ((result.data.provider == 'facebook') || (result.data.additionalProvidersData && result.data.additionalProvidersData.facebook)){
            var accessToken = '';
            if (result.data.provider == 'facebook') accessToken = result.data.providerData.accessToken;
            else accessToken = result.data.additionalProvidersData.facebook.accessToken;
            console.log(accessToken);

            FB.api('/me/accounts?fields=picture,name,link,access_token,perms&access_token=' + accessToken, function(response) {
              console.log(response)

              if (response.error){
                console.log(response.error);
                var url = '/api/auth/facebook/page';
                if ($state.previous && $state.previous.href) url += '?redirect_to=' + encodeURIComponent($state.previous.href);
                $scope.fbLoading = false;
                $window.location.href = url; //register facebook but No page Token(getting Token)

              }else if(!response.data.length){
                $scope.noPage = true; //user has no page
                $scope.fbLoading = false;
                var modalInstance = $uibModal.open({
                  templateUrl: 'modules/bots/client/views/modal-user-bots.client.connect.html',
                  scope: $scope
                });
                modalInstance.result.then(function (response) {
                  console.log(response);
                })
              } else {
                $http.post('/api/auth/facebook/pageInfo', {user: vm.user._id, list: true, pageInfo: response.data}).then(function (res) {
                  console.log(response.data);
                  console.log(res.data);
                  for(var j = 0; j < response.data.length; j++){ // show which page is connected
                    for(var i = 0; i < res.data.length; i++){
                      if ((res.data[i].pageId == response.data[j].id) && res.data[i].connect){
                        console.log('getin')
                        response.data[j]['connected'] = res.data[i].bot
                        break;
                      }else {
                        response.data[j]['connected'] = false;
                      }
                    }
                  }
                  console.log(response.data);
                  console.log(res.data);
                  $scope.fbLoading = false;
                  $scope.pageLists = [];
                  $scope.pageLists = response.data;

                  $scope.close = function () {
                    modalInstance.dismiss();
                  };

                  $scope.connect = function (page) {
                    FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'post', function (response) {
                      if(response.success){
                        var info = {};
                        info['user'] = vm.user._id;
                        info['userBot'] = vm.userBot._id;
                        info['userBotId'] = vm.userBot.id;
                        info['page'] = page;
                        info['connect'] = true;
                        page['connected'] = vm.userBot;
                        $http.post('/api/auth/facebook/pageInfo', info).then(function (response) {
                          FB.api('me/messenger_profile?access_token='+ page.access_token, 'post', {
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
                    FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'delete', function (response) {
                      if (response.success){
                        page['connected'] = false;
                        $http.post('/api/auth/facebook/pageInfo', info).then(function (response) {
                          FB.api('me/messenger_profile?access_token='+ page.access_token, 'DELETE', {
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
            }, function (err) {
              console.log(err)
            });
          }else {
            var url = '/api/auth/facebook/page';
            if ($state.previous && $state.previous.href) url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            $window.location.href = url;             //register through local not facebook(getting Token)
          }
        });
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
