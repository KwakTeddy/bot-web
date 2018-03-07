angular.module('playchat').controller('FailedDialogTrainingController', ['$window', '$scope', '$resource', '$cookies', '$location', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, LanguageService)
{
    var FailedDialogService = $resource('/api/:botId/operation/failed-dialogs/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });
    var SimiliarsService = $resource('/api/:botId/operation/training/similiars', { botId: '@botId' });
    var TrainingService = $resource('/api/:botId/operation/training/save', { botId: '@botId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.list = [];

    $scope.myBotAuth = chatbot.myBotAuth;
    if(!$scope.myBotAuth.edit)
    {
        alert(LanguageService('You do not have permission to edit this bot'));
        location.href='/playchat/';
        return;
    }

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
            SimiliarsService.query({ botId: chatbot._id, text: text, type: type }, function(result)
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

            var text = angular.element(target).prev()[0].value;
            $scope.getSimiliars(text, item, 'inputRaw');
            e.stopPropagation();
        };

        $scope.focusByClick = function(e, item)
        {
            var target = e.currentTarget;
            angular.element(target).parent().find('.selected').removeClass('selected');
            angular.element(target).addClass('selected').find('input').focus();

            var text = angular.element(target).addClass('selected').find('input').prev()[0].value;
            var text = angular.element(target).addClass('selected').find('input').prev()[0].style.backgroundColor = '#f2f2f2!important';
            $scope.getSimiliars(text, item, 'inputRaw');
        };

        $scope.findSimiliarAnswer = function(e, item)
        {
            var text = e.currentTarget.value;
            $scope.getSimiliars(text, item, 'output');
        };

        $scope.selectSuggestion = function(e, item)
        {
            angular.element(e.currentTarget).parent().parent().parent().find('input')[1].value = item.output;
        };

        $scope.save = function(e, item, list)
        {
            var id = item.id;
            var inputRaw = angular.element(e.currentTarget).find('.failed-dialog-question').val();
            var output = angular.element(e.currentTarget).find('input:last').val();

            TrainingService.save({ botId: chatbot._id, inputRaw: [ inputRaw ], output: [ output ], language: chatbot.language}, function()
            {
                FailedDialogService.update({ botId: chatbot.id, _id: id, clear: (item.clear ? item.clear + '|qna' : 'qna'), dialog: item._id.dialog}, function()
                {
                    list.splice(list.indexOf(item), 1);
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
            FailedDialogService.update({ botId: chatbot.id, _id: item.id, clear: (item.clear ? item.clear + '|qna' : 'qna'), dialog: item._id.dialog }, function()
            {
                var index = $scope.list.indexOf(item);
                $scope.list.splice(index, 1);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.focusQuestion = function(e)
        {
            var target = e.currentTarget;
            var className = angular.element(target).parent().parent().parent().attr('class');

            if(className.indexOf('selected') != -1)
            {
                e.stopPropagation();
                e.preventDefault();
            }
            else
            {

            }
        };
    })();

    $scope.getList();
    $scope.lan=LanguageService;
}]);
