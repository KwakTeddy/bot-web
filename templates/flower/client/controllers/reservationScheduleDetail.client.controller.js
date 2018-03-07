'use strict';

angular.module('template').controller('flowerReservationScheduleDetailController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http,FileUploader, LanguageService, $rootScope,DateRangePickerService)
   {
    $scope.$parent.changeWorkingGroundName( '주문 관리>상세내역', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    (function() {


        $scope.getList = function () {

            var hash = location.hash;

            var data = JSON.parse(decodeURIComponent(hash.substring(1)));
            console.log('데이터 : ', data);
            data.order_status="승인완료";

            $scope.data = data;

            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.template = result;
                    DataService.query({ templateId: result.id, botId: chatbot.id}, function(list)
                        {
                            $scope.datas=list;
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

        $scope.delete = function(event,data)
        {
                for(var i=0; i<$scope.datas.length; i++) {
                    if ($scope.datas[i]._id===data._id) {
                        $scope.datas[i].order_status = "주문취소";
                    }
                }
                var datas = JSON.parse(angular.toJson($scope.datas));
                ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result) {
                    DataService.save({
                            templateId: result.id,
                            botId: chatbot.id,
                            datas: datas
                        }, function (result1) {
                            console.log(result1);
                            $rootScope.$broadcast('simulator-build');
                        },
                        function (err) {
                            console.log(err);
                        });
                });
        };

        $scope.save = function()
        {
            for(var i=0; i<$scope.datas.length; i++) {
                if ($scope.datas[i]._id===$scope.data._id) {
                    // alert("botId======="+$scope.datas[i].botId);
                    $scope.datas[i].order_date= $scope.data.order_date;
                    $scope.datas[i].order_hour= $scope.data.order_hour;
                    $scope.datas[i].order_name= $scope.data.order_name;
                    $scope.datas[i].order_mobile= $scope.data.order_mobile;
                    $scope.datas[i].order_sendername= $scope.data.order_sendername;
                    $scope.datas[i].order_receivername= $scope.data.order_receivername;
                    $scope.datas[i].order_receivermobile= $scope.data.order_receivermobile;
                    $scope.datas[i].order_receiveraddress= $scope.data.order_receiveraddress;
                    $scope.datas[i].order_greeting= $scope.data.order_greeting;
                    $scope.datas[i].order_itemname= $scope.data.order_itemname;
                    $scope.datas[i].order_itemcode= $scope.data.order_itemcode;
                    $scope.datas[i].order_deliverydate= $scope.data.order_deliverydate;
                    $scope.datas[i].order_deliveryhour= $scope.data.order_deliveryhour;
                    $scope.datas[i].order_status= $scope.data.order_status;
                }
            }

            var datas = JSON.parse(angular.toJson($scope.datas));

            console.log('데이터스 : ', datas);

            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result) {
                DataService.save({
                        templateId: result.id,
                        botId: chatbot.id,
                        datas: datas
                    }, function (result1) {
                        console.log(result1);
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
