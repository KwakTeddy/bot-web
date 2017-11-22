angular.module('playchat').controller('FailedIntentController', ['$window', '$scope', '$resource', '$cookies', '$location', function ($window, $scope, $resource, $cookies, $location)
{
    var FailedIntentService = $resource('/api/:botId/operation/failedintents', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        $scope.getFailedIntentList = function()
        {
            FailedIntentService.query({ botId: chatbot.id }, function(result)
            {
                console.log('결과 : ', result);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    })();

    $scope.getFailedIntentList();
}]);
