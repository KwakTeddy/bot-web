'use strict';

angular.module('playchat').controller('DialogSetManagementAddController', ['$scope', '$resource', '$cookies', '$location', 'LanguageService',function ($scope, $resource, $cookies, $location, LanguageService)
{
    var id = $location.search()._id;
    $scope.$parent.changeWorkingGroundName('Management > Dialog Set > ' + (id ? 'Edit' : 'Add'), '/modules/playchat/gnb/client/imgs/speech_select.png');

    var DialogSetsService = $resource('/api/:botId/dialogsets/:dialogsetId', { botId: '@botId', dialogsetId: '@dialogsetId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    $scope.$parent.loaded('working-ground');

    $scope.title = '';
    $scope.content = '';

    (function()
    {
        var id = $location.search()._id;

        if(id)
        {
            DialogSetsService.get({ botId: chatbot.id, dialogsetId: id }, function(result)
            {
                $scope.title = result.title;
                $scope.content = result.content;
            }, function(err)
            {
                alert(err);
            });
        }

        $scope.save = function()
        {
            var params = {};
            params.botId = chatbot._id;
            params.title = $scope.title;
            params.content = $scope.content;

            if(id)
                params._id = id;

            if(params._id)
            {
                DialogSetsService.update(params, function(result)
                {
                    $location.url('/playchat/management/dialog-set');
                });
            }
            else
            {
                DialogSetsService.save(params, function(result)
                {
                    $location.url('/playchat/management/dialog-set');
                });
            }
        };
    })();

    $scope.lan=LanguageService;
}]);
