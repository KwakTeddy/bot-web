angular.module('playchat').controller('LayoutSamDevelopmentController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', '$timeout', '$rootScope', 'LanguageService', function ($window, $scope, $resource, $cookies, $location, $compile, $timeout, $rootScope, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > 샘플 영역' , '/modules/playchat/gnb/client/imgs/scenario.png');
    $scope.$parent.loaded('working-ground');
    $timeout(() => {
        angular.element('.log-analysis').css('display', 'none');
        angular.element('.simulator').css('display', 'none');
    })
    $scope.lan=LanguageService;
}]);
