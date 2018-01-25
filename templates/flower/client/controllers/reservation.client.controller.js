'use strict';

angular.module('template').controller('flowerReservationCompleteController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader, LanguageService, $rootScope,DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.datas = [];
    $scope.date = {};
    (function()
    {
        $scope.getList = function()
        {        $scope.searchKeyDown = function(e)
        {
            if(e.keyCode == 13)
            {
                $scope.search();
                e.preventDefault();
            }
            else if(e.keyCode == 8)
            {
                if(e.currentTarget.value.length == 1)
                {
                    $scope.getList(1, '');
                }
            }
        };

            $scope.search = function()
            {
                var value = angular.element('#operationSearchInput').val();
                $scope.getList(1, value);
            };
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString()}, function(result)
                {
                    $scope.template = result;

                    DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.datas = list;

                           // console.log(list);
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


        $scope.add = function()
        {
            $scope.datas.push({ name: '', mobile: '', numOfPerson: '', memo: '', date:'',time:'',status:'',userKey:''});
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
            var datas = JSON.parse(angular.toJson($scope.datas));

            console.log('데이터스 : ', datas);

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
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;


}]);
