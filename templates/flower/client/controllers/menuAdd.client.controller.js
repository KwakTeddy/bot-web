'use strict';

angular.module('template').controller('flowerMenuAddController', ['$scope', '$resource', '$cookies', 'FileUploader','$rootScope','LanguageService', function ($scope, $resource, $cookies, FileUploader,$rootScope,LanguageService)
{
    $scope.$parent.changeWorkingGroundName('상품관리', '/modules/playchat/gnb/client/imgs/menu_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/menus', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);


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

    (function()
    {
        $scope.getList = function()
        {
            var hash = location.hash;

            var data = JSON.parse(decodeURIComponent(hash.substring(1)));
            console.log('데이터 : ', data);

            $scope.data = data;

            ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
                {   $scope.datas = [];
                    $scope.template = result;

                    DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.datas=list;
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



        $scope.editImage = function(e)
        {
            angular.element(e.currentTarget).next().click();
        };

        $scope.save = function()
        {
            for(var i=0; i<$scope.datas.length; i++) {
                if ($scope.datas[i]._id===$scope.data._id) {
                    $scope.datas[i].code= $scope.data.code;
                    $scope.datas[i].category= $scope.data.category;
                    $scope.datas[i].name= $scope.data.name;
                    $scope.datas[i].price= $scope.data.price;
                    $scope.datas[i].image= $scope.data.image;
                }
            }

            var datas = JSON.parse(angular.toJson($scope.datas));

            console.log('데이터스 : ', datas);

            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result) {
                DataService.save({
                        templateId: result.id,
                        botId: chatbot.id,
                        datas: datas
                    }, function (list) {
                        for(var i=0; i<list.length; i++)
                        {
                            addUploader(i);
                        }
                        console.log(list);
                        alert("저장했습니다");
                        $rootScope.$broadcast('simulator-build');
                    },
                    function (err) {
                        alert(err);
                    });
            });
        };

    })();

    $scope.getList();
}]);
