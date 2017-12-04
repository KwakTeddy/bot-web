angular.module('playchat').controller('FailedDialogTrainingController', ['$window', '$scope', '$resource', '$cookies', '$location', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, LanguageService)
{
    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var SimiliarsService = $resource('/api/:botId/operation/training/similiars', { botId: '@botId' });
    var TrainingService = $resource('/api/:botId/operation/training/save', { botId: '@botId' });

    console.log('실패 대화 학습');

    var chatbot = $cookies.getObject('chatbot');

    $scope.list = [];

    (function()
    {
        $scope.getList = function()
        {
            FailedDialogService.query({ botId: chatbot.id, ignoreType: 'qna' }, function(list)
            {
                $scope.list = list;

                $scope.$parent.loaded('working-ground');
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.getSimiliars = function(text, item, type)
        {
            SimiliarsService.query({ botId: chatbot.id, text: text, type: type }, function(result)
            {
                if(type == 'inputRaw')
                {
                    item.similiarQuestion = result;
                }
                else
                {
                    item.similiarAnswer = result;
                }
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.focus = function(e, item)
        {
            var target = e.currentTarget;
            angular.element(target).parent().parent().parent().parent().find('.selected').removeClass('selected');
            angular.element(target).parent().parent().parent().addClass('selected');

            console.log(angular.element(target).parent().parent().parent());

            var text = angular.element(target).prev().text();
            console.log(text);

            $scope.getSimiliars(text, item, 'inputRaw');

            e.stopPropagation();
        };

        $scope.focusByClick = function(e, item)
        {
            var target = e.currentTarget;
            angular.element(target).parent().find('.selected').removeClass('selected');
            angular.element(target).addClass('selected').find('input').focus();

            var text = angular.element(target).addClass('selected').find('input').prev().text();
            console.log(text);

            $scope.getSimiliars(text, item, 'inputRaw');
        };

        $scope.findSimiliarAnswer = function(e, item)
        {
            var text = e.currentTarget.value;
            $scope.getSimiliars(text, item, 'output');
        };

        $scope.selectSuggestion = function(e, item)
        {
            angular.element(e.currentTarget).parent().parent().parent().find('input').val(item.output);
        };

        $scope.save = function(e, id)
        {
            var inputRaw = angular.element(e.currentTarget).find('.failed-dialog-question').text();
            var output = angular.element(e.currentTarget).find('input').val();

            TrainingService.save({ botId: chatbot._id, inputRaw: [ inputRaw ], output: [ output ]}, function()
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
            FailedDialogService.update({ botId: chatbot._id, _id: item.id, clear: (item.clear ? item.clear + '|qna' : 'qna') }, function()
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

    $scope.getList();
    $scope.lan=LanguageService;
}]);
