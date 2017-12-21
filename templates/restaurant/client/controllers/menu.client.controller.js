'use strict';

angular.module('template').controller('restaurantMenuController', ['$scope', '$resource', '$cookies', 'FileUploader','$rootScope', function ($scope, $resource, $cookies, FileUploader,$rootScope)
{
    $scope.$parent.changeWorkingGroundName('컨텐츠 관리 > 메뉴정보관리', '/modules/playchat/gnb/client/imgs/menu_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/menus', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.datas = [];

    (function()
    {
        $scope.getList = function()
        {
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
                {
                    $scope.template = result;

                    DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.datas = list;
                            // console.log('00000000006666666'+JSON.stringify(list));
                            //console.log(JSON.stringify(list)+'-----------------------------');
                            console.log(list);
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
            $scope.datas[index].uploader = new FileUploader({
                url: '/api/' + chatbot.id + '/template-contents/upload',
                alias: 'uploadImage',
                autoUpload: true
            });

            $scope.datas[index].uploader.onErrorItem = function(item, response, status, headers)
            {
            };

            $scope.datas[index].uploader.onSuccessItem = function(item, response, status, headers)
            {
                $scope.datas[index].image = response.url;
            };

            $scope.datas[index].uploader.onProgressItem = function(fileItem, progress)
            {
                angular.element('.form-box-progress').css('width', progress + '%');
            };
        };

        $scope.editImage = function(e)
        {
            angular.element(e.currentTarget).next().click();
        };

        $scope.add = function()
        {
            $scope.datas.push({ categor: '',name:'', hotmenus:'',price:'',description:'',uploader: undefined });
            addUploader($scope.datas.length-1);
        };

        $scope.delete = function(index)
        {
            $scope.datas.splice(index, 1);
            for(var i=0; i<$scope.datas.length; i++)
            {
                delete $scope.datas[i].uploader;
            }

            var datas = JSON.parse(angular.toJson($scope.datas));
            DataService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: datas }, function(result)
                {
                    console.log(result);
                    alert("삭제하였습니다");
                    $rootScope.$broadcast('simulator-build');

                },
                function(err)
                {
                    alert(err);
                });
        };

        $scope.save = function()
        {
            for(var i=0; i<$scope.datas.length; i++)
            {
                delete $scope.datas[i].uploader;
            }

            var datas = JSON.parse(angular.toJson($scope.datas));
            DataService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: datas }, function(result)
                {
                    console.log(result);
                    alert("저장하였습니다");
                    $rootScope.$broadcast('simulator-build');
                },
                function(err)
                {
                    alert(err);
                });
        };
    })();

    $scope.getList();
}]);
