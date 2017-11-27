(function()
{
    'use strict';

    angular.module('playchat').controller('DialogGraphEntityAddController', ['$scope', '$resource', '$cookies', '$timeout', '$element', 'CaretService', function ($scope, $resource, $cookies, $timeout, $element, CaretService)
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
            if(e.keyCode == 13 && (e.ctrlKey || e.metaKey))
            {
                e.preventDefault();
                $scope.entity.entityContents.splice(index + 1, 0, { name: '', synonyms: [''] });

                $timeout(function()
                {
                    angular.element('.entity-management-add-content-row').get(index + 1).children[0].children[0].focus();
                }, 50);
            }
        };

        $scope.synonymKeyDown = function(e, content, index)
        {
            if(e.keyCode == 13)
            {
                content.synonyms.splice(index + 1, 0, '');

                $timeout(function()
                {
                    e.currentTarget.parentElement.nextElementSibling.children[0].focus();
                }, 50);

                e.preventDefault();
                e.stopPropagation();
            }
        };

        $scope.synonymKeyUp = function(e, synonyms, index)
        {
            synonyms[index] = e.currentTarget.innerText;
        };

        $scope.focusToContentEditable = function(e)
        {
            e.currentTarget.children[0].focus();
            e.stopPropagation();
        };

        $scope.addEntityContent = function()
        {
            $scope.entity.entityContents.push({ name: '', synonyms: [''] });

            $timeout(function()
            {
                angular.element('.entity-management-add-content-row:last .inside').focus();
            }, 50);
        };

        $scope.deleteEntityContent = function(index)
        {
            if($scope.entity.entityContents.length == 1)
            {
                alert('마지막 엔티티는 삭제할 수 없습니다');
                return;
            }

            $scope.entity.entityContents.splice(index, 1);

            $timeout(function()
            {
                angular.element('.entity-management-add-content-row').get(index).children[0].children[0].focus();
            }, 100);
        };

        $scope.deleteEntityContentSynonym = function(content, index, e)
        {
            if(content.synonyms.length == 1)
            {
                alert('마지막 Synonym은 삭제할 수 없습니다');
                return;
            }

            var target = e.currentTarget.parentElement.previousElementSibling;
            if(!target)
                target = e.currentTarget.parentElement.nextElementSibling;

            target.children[0].focus();

            content.synonyms.splice(index, 1);
        };

        $scope.save = function(e)
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = $scope.entity.name;
            params.entityContents = JSON.parse(angular.toJson($scope.entity.entityContents));

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
            $scope.$apply(function()
            {
                $scope.entity = {
                    name: name,
                    entityContents: [{ name: '', synonyms: [''] }]
                };
            });
        };
    }]);
})();
