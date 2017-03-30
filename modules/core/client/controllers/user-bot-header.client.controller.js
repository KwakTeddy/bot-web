'use strict';

angular.module('core').controller('UserBotHeaderController', ['$scope', '$state', 'Authentication', '$location', '$rootScope', 'UserBotsService',
  function ($scope, $state, Authentication, $location, $rootScope, UserBotsService) {
    // Expose view variables
      console.log(123);
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.currentUrl = $location.absUrl();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // var title = document.getElementById('htmltitle');
        // var meta = document.createElement('meta');
        // meta.setAttribute('property', 'test');
        // meta.setAttribute('content', 123);
        // title.parentNode.insertBefore(meta, title.nextSibling);
        // console.log(title);
        // console.log(meta);
        var ogTitle = document.getElementById('ogTitle');


        if (toState.name == 'home'){
            $scope.title = '플레이챗 PlayChat - 1분만에 만드는 인공지능 챗봇 머니브레인 MoneyBrain Inc';
        } else if (toState.name == 'user-bots-web.list'){
            if (toParams.listType == 'popular') $scope.title = '인기봇 - 플레이챗 PlayChat';
            if (toParams.listType == 'recent') $scope.title = '최신봇 - 플레이챗 PlayChat';
            if (toParams.listType == 'followed') $scope.title = '친구봇 - 플레이챗 PlayChat';
            if (toParams.listType == 'my') $scope.title = '마이봇 - 플레이챗 PlayChat';
        }else if (toState.name == 'user-bots-web.create'){
            $scope.title = '챗봇 만들기 - 플레이챗 PlayChat';
        }else if (toState.name == 'user-bots-web.view'){
            UserBotsService.get({
                userBotId: toParams.userBotId
            }, function (response) {
                $scope.title = response.name + ' - 플레이챗 PlayChat';
            });
        }else {
            $scope.title = '플레이챗 PlayChat - 1분만에 만드는 인공지능 챗봇 머니브레인 MoneyBrain Inc';
        }
    });




  }
]);
