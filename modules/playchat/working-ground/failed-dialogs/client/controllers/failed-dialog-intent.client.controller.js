angular.module('playchat').controller('FailedDialogIntentController', ['$window', '$scope', '$resource', '$cookies', 'LanguageService',function ($window, $scope, $resource, $cookies, LanguageService)
{
    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var FailedIntentService = $resource('/api/:botId/operation/failed-intent/:intentId', { botId: '@botId', intentId: '@intentId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.list = [];

    (function()
    {
        $scope.getFailedIntentList = function()
        {
            FailedIntentService.query({ botId: chatbot.id }, function(result)
            {
                for(var i=0; i<result.length; i++)
                {
                    var check = {};
                    var intentList = [];

                    for(var j=0; j<result[i].intent.length; j++)
                    {
                        if(!result[i].intent[j].intent.intentId)
                            continue;

                        if(!check[result[i].intent[j].intent.intentId._id])
                        {
                            check[result[i].intent[j].intent.intentId._id] = true;
                            intentList.push(result[i].intent[j].intent.intentId);
                        }
                    }

                    result[i].intent = intentList;
                }

                $scope.list = result;
                console.log(result)
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.addToIntent = function(item, intentId, index)
        {
            FailedIntentService.save({ botId: chatbot.id, intentId: intentId, name: item.dialog, language: chatbot.language}, function(r)
            {
                FailedDialogService.update({ botId: chatbot.id, _id: item.id , clear: (item.clear ? item.clear + '|intent' : 'intent') , dialog: item.dialog}, function(result)
                {
                    $scope.list.splice(index, 1);
                },
                function(err)
                {
                    alert(err.data.error || err.data.message);
                });
            },
            function(err)
            {
                alert(JSON.stringify(err.data.error || err.data.message));
            });
        };

        $scope.ignore = function(item)
        {
            console.log(item);
            FailedDialogService.update({ botId: chatbot.id, _id: item.id, clear: (item.clear ? item.clear + '|intent' : 'intent'), dialog: item._id}, function()
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
    $scope.lan=LanguageService;
}]);
