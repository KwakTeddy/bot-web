(function()
{
    'use strict';

    angular.module('playchat').controller('BizDialogGraphIntentAddController', ['$scope', '$resource', '$cookies', '$timeout', '$element', 'LanguageService',function ($scope, $resource, $cookies, $timeout, $element, LanguageService)
    {
        var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');
        var formElement = $element.get(0);

        $scope.intent = {
            name: '',
            intentContents: [{ content: '' }]
        };

        $scope.checkNamePattern = function(e)
        {
            if(e.keyCode == 51 && e.shiftKey)
            {
                e.preventDefault();
            }
        };

        $scope.keydown = function(e, index)
        {
            if(e.keyCode == 13)
            {
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
                alert($scope.lan('The last input cannot be deleted.'));
                return;
            }

            $scope.intent.intentContents.splice(index, 1);

            $timeout(function()
            {
                angular.element('.intent-management-add-input-wrapper .intent-management-add-input').get(index).focus();
            }, 100);
        };

        $scope.save = function()
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = $scope.intent.name;
            params.intentContents = [];

            for(var i=0,l=$scope.intent.intentContents.length; i<l; i++)
            {
                if($scope.intent.intentContents[i].content)
                {
                    params.intentContents.push($scope.intent.intentContents[i].content);
                }
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

        formElement.open = function()
        {
            $element.find('.intent-management-add-input:first').focus();
        };

        formElement.openCallback = function(name)
        {

            if($scope.$$phase == '$apply' || $scope.$$phase == '$digest')
            {
                $scope.intent = {
                    name: name,
                    intentContents: [{ content: '' }]
                };
            }
            else
            {
                $scope.$apply(function()
                {
                    $scope.intent = {
                        name: name,
                        intentContents: [{ content: '' }]
                    };
                });
            }
        };

        $scope.lan=LanguageService;
    }]);
})();
