angular.module('playchat').controller('MyBotDevelopmentController', ['$window', '$scope', '$cookies', '$rootScope', '$location', '$timeout', '$resource', function ($window, $scope, $cookies, $rootScope, $location, $timeout,$resource)
{
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var SharedChatBotService = $resource('/api/chatbots/shared');

    var page = 1;
    var countPerPage = $location.search().countPerPage || 50;

    //$scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > 샘플 영역' , '/modules/playchat/gnb/client/imgs/scenario.png');

    var user = $cookies.getObject('user');

    $scope.botList = [];

    //console.log(chatbot);
    $scope.getList = function()
    {
        ChatBotService.query({ page: page, countPerPage: countPerPage, type : true }, function(list)
        {
            list.forEach((e) => {
               e.created = moment(e.created).format('YYYY.MM.DD');
            });

            $scope.botList = list;

        });
    };


    // default environment setting
    (() => {
        $scope.getList();
        angular.element('.main-logo-background').css('opacity', 0);
        $timeout(function()
        {
            angular.element('.main-logo-background').css('display', 'none');
        }, 1200);
    })();
    $scope.$parent.loaded('working-ground');
    //$scope.lan=LanguageService;
}]);
