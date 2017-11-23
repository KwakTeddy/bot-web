angular.module('playchat').controller('FailedDialogGraphController', ['$window', '$scope', '$resource', '$cookies', function ($window, $scope, $resource, $cookies)
{
    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var FailedDialogGraphService = $resource('/api/:botId/operation/failed-graph', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        $scope.getFailedGraphList = function(page)
        {
            page = page || 1;
            var countPerPage = 50;

            FailedDialogGraphService.query({ botId: chatbot.id, page: page, countPerPage: countPerPage }, function(result)
            {
                console.log(result);

                $scope.list = result;
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.jump = function(item)
        {

        };

        $scope.ignore = function(item)
        {
            FailedDialogService.update({ botId: chatbot._id, _id: item.id, clear: (item.clear ? item.clear + '|graph' : 'graph') }, function()
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

    $scope.getFailedGraphList();
}]);
