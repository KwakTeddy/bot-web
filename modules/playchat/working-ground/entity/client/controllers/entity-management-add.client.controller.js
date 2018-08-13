'use strict';

angular.module('playchat').controller('EntityManagementAddController', ['$scope', '$resource', '$cookies', '$location','LanguageService', function ($scope, $resource, $cookies, $location, LanguageService)
{
    var id = $location.search()._id;
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Entity') + ' > ' + (id ? LanguageService('Edit') : LanguageService('Add')), '/modules/playchat/gnb/client/imgs/entity.png');

    var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });
    var EntityContentService = $resource('/api/:botId/entitys/:entityId/contents', { botId: '@botId', entityId: '@entityId' });

    var chatbot = $cookies.getObject('chatbot');

    $scope.$parent.loaded('working-ground');

    $scope.entities = [];
    $scope.entity = {};

    (function()
    {
        var _id = $location.search()._id;

        if(_id)
        {
            EntityService.get({ botId: chatbot.id, entityId: _id }, function(entity)
            {
                $scope.name = entity.name;
                $scope.entity = entity;
            },
            function(err)
            {
                alert(err);
            });

            EntityContentService.query({ botId: chatbot.id, entityId: _id }, function(entityContents)
            {
                if(entityContents.length > 0)
                {
                    console.log(entityContents);
                    $scope.entities = entityContents;
                }
            });
        }
    })();

    $scope.contentInputKeydown = function(e)
    {
        if(e.keyCode == 13)
        {
            if(e.currentTarget.value)
            {
                for(var i=0; i<$scope.entities.length; i++)
                {
                    if($scope.entities[i].name == e.currentTarget.value)
                    {
                        return alert($scope.lan('Content is already added'));
                    }
                }

                $scope.entities.push({ name: e.currentTarget.value, synonyms: [{ name: e.currentTarget.value }] });
                e.currentTarget.value = '';
            }

            e.currentTarget.focus();
            e.preventDefault();
        }
    };

    $scope.addEntityContentClick = function(e)
    {
        var input = e.currentTarget.previousElementSibling;
        if(input.value)
        {
            for(var i=0; i<$scope.entities.length; i++)
            {
                if($scope.entities[i].name == input.value)
                {
                    return alert($scope.lan('Content is already added'));
                }
            }

            $scope.entities.push({ name: input.value, synonyms: [{ name: input.value }] });
            input.value = '';
        }

        input.focus();
    };

    $scope.addEntityContentSynonym = function(e, synonyms)
    {
        if(e.keyCode == 13)
        {
            var value = e.currentTarget.value;
            if(value)
            {
                synonyms.push({ name: value });
                setTimeout(function()
                {
                    angular.element(e.currentTarget).parent().parent().find('input:last').focus();
                }, 100);

                e.currentTarget.value = '';

                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    $scope.deleteContent = function(entities, index)
    {
        entities.splice(index, 1);
    };

    $scope.deleteSynonym = function(synonyms, index)
    {
        synonyms.splice(index, 1);
    };

    $scope.save = function(modal)
    {
        var params = {};
        params.botId = chatbot.id;
        if(chatbot.templateId)
            params.templateId = chatbot.templateId._id;
        params.name = $scope.name;
        params.entityContents = JSON.parse(angular.toJson($scope.entities));

        for(var i=0; i<params.entityContents.length; i++)
        {
            for(var j=0; j<params.entityContents[i].synonyms.length; j++)
            {
                if(params.entityContents[i].synonyms[j].name)
                    params.entityContents[i].synonyms[j] = params.entityContents[i].synonyms[j].name;
            }
        }

        if($scope.entity._id)
        {
            params._id = $scope.entity._id;
            EntityService.update(params, function(result)
            {
                $location.url('/playchat/management/entity');
            },
            function(err)
            {
                alert(err);
                if(err.data.message == 'Duplicated entity name')
                {
                    alert(params.name + '은 중복된 이름 입니다.');
                }
            });
        }
        else
        {
            EntityService.save(params, function(result)
            {
                $location.url('/playchat/management/entity');
            },
            function(err)
            {
                if(err.data.message == 'Duplicated entity name')
                {
                    alert(params.name + $scope.lan('is duplicated name.'));
                }
            });
        }
    };

    $scope.cancel = function()
    {
        $location.url('/playchat/management/entity');
    };
    $scope.lan=LanguageService;
}]);
