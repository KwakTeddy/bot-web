'use strict';

angular.module('template').controller('flowerReservationScheduleController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader, LanguageService, $rootScope,DateRangePickerService)
   {
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.datas = [];
    $scope.date = {};
    $scope.list = [];
    (function()
    {
        // $scope.search = function()
        // {
        //     var value = angular.element('#search').val();
        //     $scope.getList(1, value);
        // };

        $scope.getList = function()
        {

            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.template = result;
                    // $scope.list = result;
                    //alert(" $scope.template"+JSON.stringify( $scope.template));
                    DataService.query({ templateId: result.id, botId: chatbot.id, order_status: "주문취소"}, function(list)
                        {

                            $scope.datas = list;
                            alert("$scope.datas================"+JSON.stringify($scope.datas));
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
            $scope.datas.push({ order_name: '', order_mobile: '', order_itemname: '', order_itemcode: '', order_date:'',order_hour:'',order_receivername:'',order_receivermobile:'',order_receiveraddress:'',order_deliverydate:'',order_deliveryhour:'',order_greeting:'',order_sendername:''});
        };

        $scope.delete = function(data)
        {alert("00000000000000000"+JSON.stringify(data.order_status));
            var confirmresult=confirm("정말로 삭제하겠습니까?");
            alert("00000000000000000"+confirmresult);
            if(confirmresult===true) {

                 data.order_status = '주문취소';
                alert("00000000000000000"+JSON.stringify(data.order_status));
                alert("222444");
                DataService.update({templateId: $scope.template.id,botId: chatbot.id, _id: data._id, order_status:"주문취소"}, function(result)
                    { alert("삭제하였습니다33");
                        alert("result==============="+JSON.stringify(result));
                       // $rootScope.$broadcast('simulator-build');
                    },
                    function(err)
                    {
                        alert("err++++++++:"+JSON.stringify(err));
                    });
                DataService.save({ templateId: $scope.templateId._id, botId: chatbot.id, _id: data._id, datas: data }, function(result)
                    {
                        console.log(result);
                        alert("저장하였습니다");
                        $rootScope.$broadcast('simulator-build');
                    },
                    function(err)
                    {
                        alert(err);
                    });
            }
        };

        $scope.save = function()
        {
            var datas = JSON.parse(angular.toJson($scope.datas));

            console.log('데이터스 : ', datas);

            DataService.save({ templateId: chatbot.templateId._id, botId: chatbot.id, datas: datas }, function(result)
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
