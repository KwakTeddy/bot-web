'use strict';

angular.module('template').controller('hospitalMenuController', ['$scope', '$resource', '$cookies', 'FileUploader', function ($scope, $resource, $cookies, FileUploader)
{
    $scope.$parent.changeWorkingGroundName('컨텐츠 관리 > 시술정보관리', '/modules/playchat/gnb/client/imgs/info_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var MenuService = $resource('/api/:templateId/:botId/menus', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });
    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.menus = [];

    (function()
    {
        $scope.getList = function()
        {
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
                {
                    $scope.template = result;

                    MenuService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.menus = list;
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
            $scope.menus[index].uploader = new FileUploader({
                url: '/api/' + chatbot.id + '/template-contents/upload',
                alias: 'uploadImage',
                autoUpload: true
            });

            $scope.menus[index].uploader.onErrorItem = function(item, response, status, headers)
            {
            };

            $scope.menus[index].uploader.onSuccessItem = function(item, response, status, headers)
            {
                $scope.menus[index].image = response.url;
            };

            $scope.menus[index].uploader.onProgressItem = function(fileItem, progress)
            {
                angular.element('.form-box-progress').css('width', progress + '%');
            };

            $scope.menus[index].uploader2 = new FileUploader({
                url: '/api/' + chatbot.id + '/template-contents/upload',
                alias: 'uploadImage',
                autoUpload: true
            });

            $scope.menus[index].uploader2.onErrorItem = function(item, response, status, headers)
            {
            };

            $scope.menus[index].uploader2.onSuccessItem = function(item, response, status, headers)
            {
                $scope.menus[index].reviewImage = response.url;
            };

            $scope.menus[index].uploader2.onProgressItem = function(fileItem, progress)
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
            $scope.menus.push({ category1: '', category2: '', name: '', price: '' });
            addUploader($scope.menus.length -1);
        };

        $scope.deleteMenu = function(index)
        {
            $scope.menus.splice(index, 1);
        };

        $scope.saveMenu = function()
        {
            for(var i=0; i<$scope.menus.length; i++)
            {
                delete $scope.menus[i].uploader;
                delete $scope.menus[i].uploader2;
            }

            var menus = JSON.parse(angular.toJson($scope.menus));

            MenuService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: menus }, function(result)
                {
                    console.log(result);
                    alert('저장되었습니다');
                },
                function(err)
                {
                    alert(err);
                });
        };
    })();

    $scope.getList();
}]);
