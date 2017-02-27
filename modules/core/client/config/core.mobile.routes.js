// Ionic Starter App


angular.module('core')

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('mobile', {
        abstract: true
        // views: {
        //   'menuContent@': {
        //     template: '<ion-nav-view name="mobileRoot" class="view-container"></ion-nav-view>'
        //   }
        // }
      })
    ;

    $urlRouterProvider.otherwise('/userbot');
  });

getMyInvestments.$inject = ['InvestmentsMyService'];
function getMyInvestments(InvestmentsMyService) {
  return InvestmentsMyService.query().$promise;
}

getInvestmentUserExt.$inject = ['UsersExtService', 'Authentication'];
function getInvestmentUserExt(UsersExtService, Authentication) {
  return UsersExtService.get({
    userId: Authentication.user._id
  }).$promise;
}

