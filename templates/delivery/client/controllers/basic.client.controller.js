'use strict';

angular.module('template').controller('deliveryBasicController', ['$scope', '$resource', '$cookies', '$stateParams', function ($scope, $resource, $cookies, $stateParams)
{
    var ChatbotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateDataService = $resource('/api/:botId/template-data', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    (function()
    {
        ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
        {
            console.log('여기 나온다 : ', result);
            $scope.template = result;
            ChatbotTemplateDataService.get({ botId: chatbot.id, templateId: result.id }, function(result)
            {
                console.log('데이터 : ', result);
                result = JSON.parse(JSON.stringify(result));

                $scope.templateData = result;

                for(var key in result)
                {
                    angular.element('*[name="' + key + '"]').val(result[key]);
                }

                console.log(result);
            },
            function(err)
            {
                alert(err);
            });
        },
        function(err)
        {
            alert(err);
        });
    })();

    var getValue = function(target)
    {
        var type = target.getAttribute('type');
        if(type == 'checkbox')
        {
            return target.checked;
        }
        else
        {
            return target.value;
        }
    };

    $scope.saveTemplateBot = function(e)
    {
        var data = {};
        angular.element(e.currentTarget).find('*[name]').each(function()
        {
            var key = $(this).attr('name');

            if(key.indexOf('.') != -1)
            {
                var ref = data;
                var split = key.split('.');
                for(var i=0; i<split.length; i++)
                {
                    if(i < split.length -1 && !ref[split[i]])
                        ref[split[i]] = {};
                    else if(i == split.length-1)
                        ref[split[i]] = getValue(this);

                    ref = ref[split[i]];
                }
            }
            else
            {
                data[key] = getValue(this);
            }
        });

        if(!data.language)
        {
            data.language = 'ko';
        }

        console.log(data);

        ChatbotService.update({ botId: chatbot._id, name: data.resname, language: data.language, description: data.description }, function()
        {
            ChatbotTemplateDataService.update({ botId: chatbot.id, templateId: $scope.template.id, _id: $scope.templateData._id, data: data }, function(result)
            {
                console.log(result);
                alert('저장되었습니다');
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
}]);
