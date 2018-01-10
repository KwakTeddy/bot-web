'use strict';

angular.module('template').controller('demoBasicController', ['$scope', '$resource', '$cookies', function ($scope, $resource, $cookies)
{
    var ChatbotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateDataService = $resource('/api/:botId/template-data', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
        ChatbotTemplateService.get({ templateId: chatbot.templateId.id }, function(result)
        {
            $scope.template = result;
            ChatbotTemplateDataService.get({ botId: chatbot.id, templateId: result.id }, function(result)
            {
                result = JSON.parse(JSON.stringify(result));

                $scope.templateData = result;

                console.log(result);

                for(var key in result)
                {
                    if(key == 'holiday')
                    {
                        for(var holidayKey in result[key])
                        {
                            angular.element('input[name="holiday.' + holidayKey + '.start"]').val(result[key][holidayKey].start);
                            angular.element('input[name="holiday.' + holidayKey + '.end"]').val(result[key][holidayKey].end);
                            angular.element('input[name="holiday.' + holidayKey + '.close"]').get(0).checked = result[key][holidayKey].close;
                        }
                    }
                    else
                    {
                        angular.element('*[name="' + key + '"]').val(result[key]);
                    }
                }
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

        ChatbotService.update({ botId: chatbot._id, name: data.name, language: data.language, description: data.description }, function()
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
