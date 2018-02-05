'use strict';

angular.module('template').controller('flowerServiceController', ['$scope', '$resource', '$cookies', 'FileUploader','$rootScope', 'LanguageService', function ($scope, $resource, $cookies, FileUploader,$rootScope,LanguageService )
{
    $scope.$parent.changeWorkingGroundName('후기관리', '/modules/playchat/gnb/client/imgs/menu_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/services', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

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
                            $scope.datas = [];
                            for(var j=0; j<list.length; j++)
                            {
                                if(list[j].status!=="삭제"){
                                    $scope.datas.push(list[j]);
                                }
                            }
                            console.log(list);

                            // for(var i=0; i<list.length; i++)
                            // {
                            //     addUploader(i);
                            // }
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

        $scope.change=function(event,data){
            var target = angular.element(event.currentTarget);
            var href = target.attr('data-href');
            //alert('=============data=='+data);
            location.href = href + '#' + encodeURIComponent(JSON.stringify(data));
        };

        $scope.delete = function(event,data)
        {
            var confirmresult=confirm("정말로 삭제하겠습니까?");
            if(confirmresult===true) {
                for (var i = 0; i < $scope.datas.length; i++) {
                    if ($scope.datas[i]._id=== data._id) {
                        $scope.datas[i].status = "삭제";
                    }
                }
                var datas = JSON.parse(angular.toJson($scope.datas));
                ChatbotTemplateService.get({templateId: chatbot.templateId._id}, function (result) {
                    DataService.save({
                            templateId: result.id,
                            botId: chatbot.id,
                            datas: datas
                        }, function (result1) {
                            console.log(result1);
                            $scope.datas.splice($scope.datas.indexOf(data), 1);//删除后删除已经删除了的那行
                            alert("삭제하였습니다");
                            $rootScope.$broadcast('simulator-build');
                        },
                        function (err) {
                            console.log(err);
                        });
                });
            }
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
