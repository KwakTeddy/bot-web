'use strict';
angular.module('template').controller('flowerReservationAwaitController', ['$scope', '$resource', '$cookies','$http', 'FileUploader','$location', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader,$location, LanguageService, $rootScope,DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId', query: '@query' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);


    // function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
    //     var  oDate1,oDate2,iDays;
    //     oDate1  =  new  Date(sDate1);   //转换为12-18-2002格式
    //     oDate2  =  new  Date(sDate2);
    //     iDays  =  oDate2  -  oDate1;   //把相差的毫秒数转换为天数
    //     return  iDays
    // }
    $scope.searchword=undefined;
    (function()
    {

        $scope.getList = function(searchword)
        {

            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.datas = [];
                    $scope.list = [];
                    $scope.template = result;
                    var startDate=$scope.date.start.getTime();
                    var endDate=$scope.date.end.getTime();
                    if(searchword===undefined) {
                        DataService.query({
                                templateId: result.id,
                                botId: chatbot.id,
                                query: {order_status: '승인 대기중', order_deliverytime: {"$gte": startDate,"$lte": endDate}}
                            }, function (list) {
                                $scope.datas = list;
                                console.log('결과 : ', list);
                                $scope.searchword = undefined;
                            },
                            function (err) {
                                alert(err);
                            });
                    }
                    else{
                        DataService.query({
                                templateId: result.id,
                                botId: chatbot.id,
                                query: {order_status: '승인 대기중', order_deliverytime: {$lte: endDate, $gte: startDate},
                                    $or:[{order_name:searchword},{order_mobile:searchword},
                                        {order_itemname:searchword},{order_itemcode:searchword},
                                        {order_date:searchword},{order_hour:searchword},
                                        {order_receivername:searchword},{order_receivermobile:searchword},
                                        {order_receiveraddress:searchword},{order_deliverydate:searchword},
                                        {order_deliveryhour:searchword},{order_greeting:searchword}]}
                            }, function (list) {
                                $scope.datas = list;
                                console.log('결과 : ', list);
                                $scope.searchword = undefined;
                            },
                            function (err) {
                                alert(err);
                            });
                    }
                },
                function(err)
                {
                    alert(err);
                });
        };

        $scope.detail=function(event, data){

            var target = angular.element(event.currentTarget);

            var href = target.attr('data-href');

            location.href = href + '#' + encodeURIComponent(JSON.stringify(data));
        };

        $scope.delete = function(data,index)
        {
            $scope.delete = function(data,index)
            {
                var confirmresult=confirm("정말로 삭제하겠습니까?");
                if(confirmresult===true) {
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
                                // window.location.reload(); 强行刷新
                                $scope.datas.splice($scope.datas.indexOf(data), 1);//删除后删除已经删除了的那行
                                alert("삭제하였습니다");
                                $rootScope.$broadcast('simulator-build');
                                $rootScope.$broadcast('delete');
                            },
                            function (err) {
                                alert(err);
                            });
                    });
                }
            };
        };

    })();
    $scope.$on('reservation_order_date_changed', function(context, date)
    {
        $scope.date = date;
        $scope.getList();
    });
    $scope.$on('reservation_search_changed', function(context, data)
    {
        $scope.searchword = data;
        $scope.getList($scope.searchword);
    });
    $scope.getList();
    $scope.lan=LanguageService;

}]);
