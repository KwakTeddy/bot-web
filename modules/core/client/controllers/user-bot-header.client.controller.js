'use strict';

angular.module('core').controller('UserBotHeaderController', ['$scope', '$state', 'Authentication', '$location', '$rootScope', 'UserBotsService', '$window',
  function ($scope, $state, Authentication, $location, $rootScope, UserBotsService, $window) {

    console.log('hohoho');

    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    $scope.currentUrl = $location.absUrl();

    // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //   // document.getElementById('header_popular').style.fontSize = 100 + '%'
    //   // document.getElementById('header_recent').style.fontSize = 100 + '%'
    //   // document.getElementById('header_follow').style.fontSize = 100 + '%'
    //   // document.getElementById('header_my').style.fontSize = 100 + '%'
    //   if (toState.name == 'home'){
    //       $scope.title = '플레이챗 PlayChat - 1분만에 만드는 인공지능 챗봇 머니브레인 MoneyBrain Inc';
    //   } else if (toState.name == 'user-bots-web.list'){
    //       if (toParams.listType == 'popular') {
    //         $scope.title = '인기봇 - 플레이챗 PlayChat';
    //         document.getElementById('header_popular').style.fontSize = 120 + '%'
    //       }
    //       if (toParams.listType == 'recent') {
    //         $scope.title = '최신봇 - 플레이챗 PlayChat';
    //         document.getElementById('header_recent').style.fontSize = 120 + '%'
    //       }
    //       if (toParams.listType == 'followed') {
    //         $scope.title = '친구봇 - 플레이챗 PlayChat';
    //         document.getElementById('header_follow').style.fontSize = 120 + '%'
    //       }
    //       if (toParams.listType == 'my') {
    //         $scope.title = '마이봇 - 플레이챗 PlayChat';
    //         document.getElementById('header_my').style.fontSize = 120 + '%'
    //       }
    //   }else if (toState.name == 'user-bots-web.create'){
    //     $scope.title = '챗봇 만들기 - 플레이챗 PlayChat';
    //   }else if (toState.name == 'user-bots-web.edit'){
    //     $scope.title = '챗봇 수정하기 - 플레이챗 PlayChat';
    //   }else if (toState.name === 'user-bots-web.view' || toState.name === 'user-bots-web.graph'){
    //       UserBotsService.get({
    //           userBotId: toParams.userBotId
    //       }, function (response) {
    //           $scope.title = response.name + ' - 플레이챗 PlayChat';
    //       });
    //   }else {
    //       $scope.title = '플레이챗 PlayChat - 1분만에 만드는 인공지능 챗봇 머니브레인 MoneyBrain Inc';
    //   }
    // });




  }
]);
