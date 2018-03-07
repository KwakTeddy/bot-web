(function()
{
    'use strict';

    angular.module('playchat').controller('DialogGraphEntityAddController', ['$scope', '$resource', '$cookies', '$timeout', '$element', 'CaretService','LanguageService', function ($scope, $resource, $cookies, $timeout, $element, CaretService, LanguageService)
    {
        var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');
        var formElement = $element.get(0);

        $scope.entity = {
            name: '',
            entityContents: [{ name: '', synonyms: [''] }]
        };

        $scope.checkNamePattern = function(e)
        {
            if(e.keyCode == 50 && e.shiftKey)
            {
                e.preventDefault();
            }
        };

        $scope.keydown = function(e, index)
        {
            if(e.keyCode == 13)
            {
                e.preventDefault();
                $scope.entity.entityContents.splice(index + 1, 0, { name: '' });

                $timeout(function()
                {
                    angular.element('.entity-management-add-input-wrapper').get(index + 1).children[0].focus();
                }, 50);
            }
        };

        $scope.focusToContentEditable = function(e)
        {
            e.currentTarget.children[0].focus();
            e.stopPropagation();
        };

        $scope.addEntityContent = function()
        {
            $scope.entity.entityContents.push({ name: '' });

            $timeout(function()
            {
                angular.element('.entity-management-add-content-row:last .inside').focus();
            }, 50);
        };

        $scope.deleteEntityContent = function(index)
        {
            if($scope.entity.entityContents.length == 1)
            {
                alert($scope.lan('The last entity cannot be deleted.'));
                return;
            }

            $scope.entity.entityContents.splice(index, 1);

            $timeout(function()
            {
                angular.element('.entity-management-add-content-row').get(index).children[0].children[0].focus();
            }, 100);
        };

        $scope.save = function(e)
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = $scope.entity.name;
            params.entityContents = [];

            for(var i=0; i<$scope.entity.entityContents.length; i++)
            {
                if($scope.entity.entityContents[i].name)
                {
                    params.entityContents.push($scope.entity.entityContents[i]);
                }
            }

            console.log(params);

            EntityService.save(params, function()
            {
                if(formElement.saveCallback)
                {
                    formElement.saveCallback($scope.entity.name);
                }
            },
            function(err)
            {
                if(err.data.message == 'Duplicated entity name')
                {
                    alert(err.data.message);
                }
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
            $element.find('.entity-management-add-input:first').focus();
        };

        formElement.openCallback = function(name)
        {
            if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' ) {
                $scope.entity = {
                    name: name,
                    entityContents: [{ name: '', synonyms: [''] }]
                };
            } else {
                $scope.$apply(function () {
                    $scope.entity = {
                        name: name,
                        entityContents: [{ name: '', synonyms: [''] }]
                    };
                });
            }
        };
        $scope.lan=LanguageService;
    }]);
})();
