'use strict';

angular.module('template').controller('eventController', ['$scope', '$resource', '$cookies', 'FileUploader', function ($scope, $resource, $cookies, FileUploader)
{
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var EventService = $resource('/api/:templateName/:botId/events', { templateName : '@templateName', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.events = [];

    (function()
    {
        $scope.getList = function()
        {
            ChatbotTemplateService.get({ templateId: chatbot.templateId }, function(result)
            {
                $scope.template = result;

                EventService.query({ templateName: result.name, botId: chatbot.id }, function(list)
                {
                    $scope.events = list;
                    for(var i=0; i<list.length; i++)
                    {
                        addUploader(i);
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
        };

        var addUploader = function(index)
        {
            $scope.events[index].uploader = new FileUploader({
                url: '/api/' + chatbot.id + '/template-contents/upload',
                alias: 'uploadImage',
                autoUpload: true
            });

            $scope.events[index].uploader.onErrorItem = function(item, response, status, headers)
            {
            };

            $scope.events[index].uploader.onSuccessItem = function(item, response, status, headers)
            {
                $scope.events[index].image = response.url;
            };

            $scope.events[index].uploader.onProgressItem = function(fileItem, progress)
            {
                angular.element('.form-box-progress').css('width', progress + '%');
            };
        };

        $scope.editImage = function(e)
        {
            angular.element(e.currentTarget).next().click();
        };

        $scope.addMenu = function()
        {
            $scope.events.push({ category: '', name: '', price: '', image: '', uploader: undefined});
            addUploader($scope.events.length-1);
        };

        $scope.deleteMenu = function(index)
        {
            $scope.events.splice(index, 1);
        };

        $scope.addEvent = function()
        {
            $scope.events.push({ name: '', description: '', image: ''});
        };

        $scope.deleteEvent = function(index)
        {
            $scope.events.splice(index, 1);
        };

        $scope.saveEvent = function()
        {
            for(var i=0; i<$scope.events.length; i++)
            {
                delete $scope.events[i].uploader;
            }

            var events = JSON.parse(angular.toJson($scope.events));

            console.log(events);

            EventService.save({ templateName: $scope.template.name, botId: chatbot.id, events: events }, function(result)
            {
                console.log(result);
            },
            function(err)
            {
                alert(err);
            });
        };
    })();

    $scope.getList();
}]);
