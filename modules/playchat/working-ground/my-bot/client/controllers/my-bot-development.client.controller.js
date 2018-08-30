angular.module('playchat').controller('MyBotDevelopmentController', ['$window', '$scope', '$cookies', '$rootScope', '$location', '$timeout', '$resource', function ($window, $scope, $cookies, $rootScope, $location, $timeout,$resource)
{
    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var SharedChatBotService = $resource('/api/chatbots/shared');
    angular.element('#AreaDeletePopup').html(angular.element('#DeleteBotTemplate').html())
    var page = 1;
    var countPerPage = $location.search().countPerPage || 50;

    //$scope.$parent.changeWorkingGroundName(LanguageService('Development') + ' > 샘플 영역' , '/modules/playchat/gnb/client/imgs/scenario.png');

    var user = $cookies.getObject('user');

    $scope.botList = [];

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

    $scope.deleteBot = (bot) => {
        $scope.selectBot = bot;
        angular.element('#AreaDeletePopup').fadeIn();
    };

    $scope.botDevelopPage = (bot) => {
        bot.myBotAuth = { read: true, edit: true };
        $cookies.putObject('chatbot', bot);
        $location.url('/playchat/development/biz-dialog-graph');
    };

    $scope.botSendingPage = (bot) => {
        bot.myBotAuth = { read: true, edit: true };
        $cookies.putObject('chatbot', bot);
        $location.url('/playchat/sending/outbound');
    };

    // default environment setting
    (() => {
        $scope.getList();
        popupClickEvt = (is) => {
            if(is){
                ChatBotService.delete({ botId : $scope.selectBot._id, botDisplayId: $scope.selectBot.id }, function()
                {
                    $scope.getList();
                    angular.element('#AreaDeletePopup').fadeOut();
                }, function(err)
                {
                    alert(err.data.message);
                });
            }else{
                angular.element('#AreaDeletePopup').fadeOut();
            }
        };

        angular.element('.main-logo-background').css('opacity', 0);
        $timeout(function()
        {
            angular.element('.main-logo-background').css('display', 'none');
        }, 1200);
    })();
    $scope.$parent.loaded('working-ground');
    //$scope.lan=LanguageService;
}]);
var popupClickEvt;
