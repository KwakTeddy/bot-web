(function()
{
    'use strict';

    angular.module('playchat').controller('ChatbotCreateTemplateController', ['$scope', '$resource', '$stateParams', '$location', '$compile', '$cookies', function ($scope, $resource, $stateParams, $location, $compile, $cookies)
    {
        var ChatbotService = $resource('/api/chatbots');
        var ChatbotTemplatesService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' });
        var ChatbotTemplateDataService = $resource('/api/:botId/template-data', { botId: '@botId' });

        $scope.$parent.loading = false;

        $scope.templateId = $stateParams.templateId;

        $scope.bot = {
            language: 'ko'
        };

        (function()
        {
            if($scope.templateId != 'blank')
            {
                ChatbotTemplatesService.get({ templateId: $stateParams.templateId }, function(template)
                {
                    console.log(template);

                    $scope.template = template;

                    angular.element('#templateCreateHtml').html('').append($compile(template.createHtml)($scope));
                },
                function(err)
                {
                    alert(err);
                });
            }

            $scope.save = function()
            {
                if(!$scope.bot.id.match(/^[a-zA-Z]+/))
                {
                    return alert('아이디는 영문자 소문자로 시작해야합니다.');
                }

                ChatbotService.save({ id: $scope.bot.id, name: $scope.bot.name, language: $scope.bot.language, description: $scope.bot.description }, function()
                {
                    $location.url('/playchat/chatbots');
                },
                function(err)
                {
                    alert(err.data.error || err.data.message);
                });
            };

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

                data.name = angular.element('input[data-bot-name="true"]').val();

                ChatbotService.save({ id: $scope.template.id + '_' + $cookies.getObject('user').username + '_' + new Date().getTime(), name: data.name, language: data.language, description: data.description, templateId: $scope.template._id, templateDir: $scope.template.id }, function(chatbot)
                {
                    $cookies.putObject('chatbot', chatbot);
                    ChatbotTemplateDataService.save({ templateId: $scope.template.id, botId: chatbot.id, data: data }, function(result)
                    {
                        $location.url('/playchat');
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

            $scope.cancel = function()
            {
                location.href = '/playchat/chatbots';
            };
        })();
    }]);
})();
