angular.module('playchat').controller('FailedDialogIntentController', ['$window', '$scope', '$resource', '$cookies', function ($window, $scope, $resource, $cookies)
{
    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var FailedIntentService = $resource('/api/:botId/operation/failed-intent/:intentId', { botId: '@botId', intentId: '@intentId' });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        $scope.getFailedIntentList = function()
        {
            FailedIntentService.query({ botId: chatbot.id }, function(result)
            {
                $scope.list = result;
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.addToIntent = function(dialog, intent, id)
        {
            FailedIntentService.save({ botId: chatbot.id, intentId: intent[0].intent._id, name: dialog}, function()
            {
                FailedDialogService.update({ botId: chatbot._id, _id: id }, function()
                {
                },
                function(err)
                {
                    alert(err.data.error || err.data.message);
                });
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.ignore = function(item)
        {
            console.log(item);
            FailedDialogService.update({ botId: chatbot._id, _id: item.id, clear: (item.clear ? item.clear + '|intent' : 'intent') }, function()
            {
                var index = $scope.list.indexOf(item);
                $scope.list.splice(index, 1);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };
    })();

    $scope.getFailedIntentList();
}]);
