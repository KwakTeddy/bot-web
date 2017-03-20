'use strict';

angular.module('core').controller('UserBotHeaderController', ['$scope', '$state', 'Authentication', '$location', '$rootScope', 'UserBotsService',
  function ($scope, $state, Authentication, $location, $rootScope, UserBotsService) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.currentUrl = $location.absUrl();
    $scope = $rootScope.title;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'home'){
            $rootScope.title = '플레이챗 PlayChat - 1분만에 만드는 인공지능 챗봇 머니브레인 MoneyBrain Inc';
        } else if (toState.name == 'user-bots-web.list'){
            if (toParams.listType == 'popular') $rootScope.title = '인기봇 - 플레이챗 PlayChat';
            if (toParams.listType == 'recent') $rootScope.title = '최신봇 - 플레이챗 PlayChat';
            if (toParams.listType == 'followed') $rootScope.title = '친구봇 - 플레이챗 PlayChat';
            if (toParams.listType == 'my') $rootScope.title = '마이봇 - 플레이챗 PlayChat';
        }else if (toState.name == 'user-bots-web.create'){
            $rootScope.title = '챗봇 만들기 - 플레이챗 PlayChat';
        }else if (toState.name == 'user-bots-web.view'){
            UserBotsService.get({
                userBotId: toParams.userBotId
            }, function (response) {
                $rootScope.title = response.name + ' - 플레이챗 PlayChat';
            });
        }else {
            $rootScope.title = '플레이챗 PlayChat - 1분만에 만드는 인공지능 챗봇 머니브레인 MoneyBrain Inc';
        }
    });
  }
]);
