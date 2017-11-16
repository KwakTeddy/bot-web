angular.module('playchat').controller('FailedDialogTrainingController', ['$window', '$scope', '$resource', '$cookies', '$location', function ($window, $scope, $resource, $cookies, $location)
{
    var FailedDialogService = $resource('/api/:botId/operation/operation/faileddialogs', { botId: '@botId' });

    console.log('실패 대화 학습');

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        $scope.getList = function()
        {
            FailedDialogService.query({ botId: chatbot.id }, function(list)
            {
                $scope.$parent.loaded('working-ground');
                console.log(list);
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.focus = function(e)
        {
            var target = e.currentTarget;
            angular.element(target).parent().parent().parent().parent().find('.selected').removeClass('selected');
            angular.element(target).parent().parent().parent().addClass('selected');

            console.log(angular.element(target).parent().parent().parent());

            e.stopPropagation();
        };

        $scope.focusByClick = function(e)
        {
            var target = e.currentTarget;
            angular.element(target).parent().find('.selected').removeClass('selected');
            angular.element(target).addClass('selected').find('input').focus();
        };

        $scope.save = function(e)
        {
            var value = angular.element(e.currentTarget).find('input').val();


        };
    })();

}]);
