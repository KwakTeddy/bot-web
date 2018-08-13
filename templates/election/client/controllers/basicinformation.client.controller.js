'use strict';

angular.module('template').controller('flowerBasicinformationController', ['$scope', '$resource', '$http','$cookies', 'FileUploader','$rootScope', 'LanguageService', function ($scope, $resource, $http, $cookies, FileUploader,$rootScope,LanguageService)
{
    $scope.$parent.changeWorkingGroundName('기본정보', '/modules/playchat/gnb/client/imgs/basic_grey.png');
    var ChatbotService = $resource('/api/chatbots/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var ChatbotTemplateDataService = $resource('/api/:botId/template-data', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);
    $scope.datas = [];
    $scope.list = [];

        (function()
        {
            $scope.data={};
            var addUploader = function()
            {
                $scope.data.uploader = new FileUploader({
                    url: '/api/' + chatbot.id + '/template-contents/upload',
                    alias: 'uploadImage',
                    autoUpload: true
                });

                $scope.data.uploader.onErrorItem = function(item, response, status, headers)
                {
                };

                $scope.data.uploader.onSuccessItem = function(item, response, status, headers)
                {
                    $scope.data.image = response.url;
                };

                $scope.data.uploader.onProgressItem = function(fileItem, progress)
                {
                    angular.element('.form-box-progress').css('width', progress + '%');
                };
            };

            $scope.editImage = function(e)
            {
                angular.element(e.currentTarget).next().click();
            };
            addUploader();
            $scope.getList = function()
            {
                ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
                    {
                        $scope.template = result;

                        console.log('asdf', chatbot);

                        ChatbotTemplateDataService.get({ templateId: result.id, botId: chatbot.id }, function(result)
                            {
                                $scope.flowername=result.flowername;
                                $scope.description=result.description;
                                $scope.data.image=result.image;
                                $scope.phone=result.phone;

                                console.log('데이터 : ', $scope.data);

                            },
                            function(err)
                            {
                                alert("err:"+err);
                            });
                    },
                    function(err)
                    {
                        alert(err);
                    });
            };

        })();

    $scope.getList();
    $scope.lan=LanguageService;

    }]);
