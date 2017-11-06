(function()
{
    'use strict';

    angular.module('playchat').controller('IntentManagementAddController', ['$scope', '$resource', '$cookies', '$timeout', '$element', function ($scope, $resource, $cookies, $timeout, $element)
    {
        var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');
        var formElement = $element.get(0);

        $scope.intent = {
            name: '',
            intentContents: [{ content: '' }]
        };

        $scope.keydown = function(e, index)
        {
            if(e.keyCode == 13 && (e.ctrlKey || e.metaKey))
            {
                console.log(index);
                e.preventDefault();
                $scope.intent.intentContents.splice(index + 1, 0, { content: '' });

                $timeout(function()
                {
                    angular.element('.intent-management-add-input-wrapper .intent-management-add-input').get(index + 1).focus();
                }, 100);
            }
        };

        $scope.addIntent = function()
        {
            $scope.intent.intentContents.push({ content: '' });

            $timeout(function()
            {
                angular.element('.intent-management-add-input-wrapper .intent-management-add-input:last').focus();
            }, 100);
        };

        $scope.deleteContent = function(index)
        {
            if($scope.intent.intentContents.length == 1)
            {
                alert('마지막 Input은 삭제할 수 없습니다');
                return;
            }

            $scope.intent.intentContents.splice(index, 1);

            $timeout(function()
            {
                angular.element('.intent-management-add-input-wrapper .intent-management-add-input').get(index).focus();
            }, 100);
        };

        $scope.save = function(e)
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = $scope.intent.name;
            params.intentContents = [];

            for(var i=0,l=$scope.intent.intentContents.length; i<l; i++)
            {
                params.intentContents.push($scope.intent.intentContents[i].content);
            }

            IntentService.save(params, function()
            {
                if(formElement.saveCallback)
                {
                    formElement.saveCallback($scope.intent.name);
                }
            },
            function(error)
            {
                alert(error.data.message);
            });
        };

        $scope.close = function(e)
        {
            if(formElement.closeCallback)
            {
                formElement.closeCallback();
            }
        };

        formElement.open = function(name)
        {
            $element.find('.intent-management-add-input:first').val(name || '').focus();
        };

        formElement.openCallback = function()
        {
            $scope.$apply(function()
            {
                $scope.intent = {
                    name: '',
                    intentContents: [{ content: '' }]
                };
            });
        };
    }]);
})();
