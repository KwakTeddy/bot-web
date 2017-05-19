(function () {
  'use strict';

  angular
    .module('channels')
    .controller('ChannelsListController', ChannelsListController);

  ChannelsListController.$inject = ['ChannelsService', '$scope', '$cookies', '$uibModal', '$http', 'Authentication', '$window', '$state'];

  function ChannelsListController(ChannelsService, $scope, $cookies, $uibModal, $http, Authentication, $window, $state) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userBot = {};
    vm.userBot['id'] = $cookies.get('default_bot');

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
          console.log(result)
          if ((result.data.provider == 'facebook') || (result.data.additionalProvidersData && result.data.additionalProvidersData.facebook)){
            var accessToken = '';
            if (result.data.provider == 'facebook'){
              accessToken = result.data.providerData.accessToken;
            }else {
              accessToken = result.data.additionalProvidersData.facebook.accessToken
            }

            FB.api('/me/accounts?fields=picture,name,link,access_token,perms&access_token=' + accessToken, function(response) {
              if (response.error){
                console.log(response.error);
                var url = '/api/auth/facebook/page';
                // if ($state.previous && $state.previous.href) {
                //     url += '?redirect_to=' + encodeURIComponent($state.previous.h`ref);
                // }
                // Effectively call OAuth authentication route:
                console.log(url);
                $scope.fbLoading = false;
                $window.location.href = url;
              } else {
                console.log(response);
                $http.post('/api/auth/facebook/pageInfo', {user: vm.user._id, list: true, pageInfo: response.data}).then(function (res) {
                  for(var i = 0; i < res.data.length; i++){
                    for(var j = 0; j < response.data.length; j++){
                      if ((res.data[i].pageId == response.data[j].id) && res.data[i].connect){
                        response.data[j]['connected'] = res.data[i].bot;
                        continue;
                      }else {
                        response.data[j]['connected'] = false;
                      }
                    }
                  }

                  $scope.fbLoading = false;
                  $scope.pageLists = [];
                  $scope.pageLists = response.data;
                  if (!response.data.length){
                    $scope.noPage = true;
                  }

                  $scope.close = function () {
                    modalInstance.dismiss();
                  };

                  $scope.connect = function (page) {
                    // modalInstance.dismiss();
                    FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'post', function (response) {
                      if(response.success){
                        var info = {};
                        info['user'] = vm.user._id;
                        info['userBot'] = vm.userBot._id;
                        info['userBotId'] = vm.userBot.id;
                        info['page'] = page;
                        info['connect'] = true;
                        page['connected'] = vm.userBot;
                        $http.post('/api/auth/facebook/pageInfo', info, function (err) {
                          if(err) {
                            console.log(err)
                          }else {

                          }
                        });
                      }else {

                      }
                    });
                  };
                  $scope.disconnect = function (page) {
                    // modalInstance.dismiss();
                    var info = {};
                    info['user'] = vm.user._id;
                    info['userBot'] = vm.userBot._id;
                    info['userBotId'] = vm.userBot.id;
                    info['page'] = page;
                    info['connect'] = false;
                    page['connected'] = false;
                    FB.api('/me/subscribed_apps?access_token='+ page.access_token, 'delete', function (response) {
                      console.log(response);
                      if (response.success){
                        page['connected'] = false;
                        $http.post('/api/auth/facebook/pageInfo', info, function (err) {
                          if(err) {
                            console.log(err)
                          }else {

                          }
                        });
                      }else {

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
          }else {
            //register through local not facebook
            var url = '/api/auth/facebook';
            if ($state.previous && $state.previous.href) {
              url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
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
