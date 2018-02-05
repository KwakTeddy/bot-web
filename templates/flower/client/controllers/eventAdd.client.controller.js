'use strict';

angular.module('template').controller('flowerEventAddController', ['$scope', '$resource', '$cookies', '$rootScope','LanguageService','FileUploader',function ($scope, $resource, $cookies,$rootScope,LanguageService, FileUploader)
{
    $scope.$parent.changeWorkingGroundName('이벤트 관리', '/modules/playchat/gnb/client/imgs/menu_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/events', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);


    (function()
    {
         var addUploader = function()
        {
            $scope.data={};
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
                $scope.data.picture = response.url;
                var hash = location.hash;

                var data = JSON.parse(decodeURIComponent(hash.substring(1)));
                console.log('데이터 : ', data);

                // $scope.data.category = data.category;
                // $scope.data.name = data.name;
                // $scope.data.code = data.code;
                // $scope.data.price = data.price;
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
                {   $scope.datas = [];
                    $scope.template = result;

                    DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.datas=list;
                            console.log(list);
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


        $scope.save = function(event,data)
        {
            $scope.datas.push({ context:data.context,name:data.name, picture:data.picture,description:data.description,status:"정상"});
            var datas = JSON.parse(angular.toJson($scope.datas));
            console.log('데이터스 : ', datas);
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result) {
                DataService.save({
                        templateId: result.id,
                        botId: chatbot.id,
                        datas: datas
                    }, function (list) {
                        console.log(list);
                        for(var i=0; i<list.length; i++)
                        {
                            addUploader(i);
                        }
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
