angular.module('playchat').controller('LayoutSamDevelopmentController', ['$window', '$scope', '$cookies', '$location', 'LanguageService', function ($window, $scope, $cookies, $location, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > 샘플 영역' , '/modules/playchat/gnb/client/imgs/scenario.png');

    var chatbot = $scope.chatbot = $cookies.getObject('chatbot');

    $scope.chatbot = chatbot;

    $scope.isFirst = $location.search().isFirst;

    $scope.$parent.loaded('working-ground');
    //$timeout(() => {
    //    angular.element('.log-analysis').css('display', 'none');
    //    angular.element('.simulator').css('display', 'none');
    //})
    $scope.lan=LanguageService;
}]);
