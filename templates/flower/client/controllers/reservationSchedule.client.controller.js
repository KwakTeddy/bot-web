'use strict';

angular.module('template').controller('flowerReservationScheduleController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','$location','PagingService','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader, LanguageService, $rootScope,$location,PagingService,DateRangePickerService)
   {
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId'}, { update: { method: 'PUT' } });
    // var PageService = $resource('/api/chatbots/totalpage', { botId: '@botId' });
    var chatbot = $cookies.getObject('chatbot');

       $scope.searchword=undefined;
    (function()
    {
        $scope.getList = function(page,searchword)
        {
            var startDate=$scope.date.start.getTime();
            var endDate=$scope.date.end.getTime();

            var page = page || $location.search().page || 1;

            var countPerPage = $location.search().countPerPage || 10;


            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.datas = [];
                    $scope.datass = [];
                    $scope.list = [];
                    $scope.template = result;

                    DataService.query({
                            templateId: result.id,
                            botId: chatbot.id,
                            query: {order_status: {$in:['승인 대기중','승인완료']}, order_deliverytime: {$lte: endDate, $gte: startDate}}
                        }, function (list) {
                            $scope.datass = list;
                        },
                        function (err) {
                            alert(err);
                        });

                    if(searchword===undefined) {
                        DataService.query({
                                templateId: result.id,
                                botId: chatbot.id,
                                query: {order_status: {$in:['승인 대기중','승인완료']}, order_deliverytime: {$lte: endDate, $gte: startDate}}
                            }, function (list) {
                                var total = list.length/countPerPage;
                                if(total<=1){
                                    var totalPage = 1;
                                }
                                else{
                                    var totalPage = Math.ceil(total);
                                }
                                $scope.pageOptions = PagingService(page, totalPage);
                            },
                            function (err) {
                                alert(err);
                            });

                        DataService.query({
                                templateId: result.id,
                                botId: chatbot.id,
                                page:page,
                                countPerPage:countPerPage,
                                query: {order_status: {$in:['승인 대기중','승인완료']}, order_deliverytime: {$lte: endDate, $gte: startDate}}
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
                                query: {order_status: {$in:['승인 대기중','승인완료']}, order_deliverytime: {$lte: endDate, $gte: startDate},
                                    $or:[{order_name:searchword},{order_mobile:searchword},
                                        {order_itemname:searchword},{order_itemcode:searchword},
                                        {order_date:searchword},{order_hour:searchword},
                                        {order_receivername:searchword},{order_receivermobile:searchword},
                                        {order_receiveraddress:searchword},{order_deliverydate:searchword},
                                        {order_deliveryhour:searchword},{order_greeting:searchword}]}
                            }, function (list) {
                                var total = list.length/countPerPage;
                                if(total<=1){
                                    var totalPage = 1;
                                }
                                else{
                                    var totalPage = Math.ceil(total);
                                }
                                $scope.pageOptions = PagingService(page, totalPage);
                            },
                            function (err) {
                                alert(err);
                            });


                        DataService.query({
                                templateId: result.id,
                                botId: chatbot.id,
                                page: page, countPerPage: countPerPage,
                                query: {order_status: {$in:['승인 대기중','승인완료']}, order_deliverytime: {$lte: endDate, $gte: startDate},
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

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.delete = function(data,index)
        {
            var confirmresult=confirm("정말로 삭제하겠습니까?");
            if(confirmresult===true) {
                for(var i=0; i<$scope.datass.length; i++) {
                    if ($scope.datass[i]._id===data._id) {
                        $scope.datass[i].order_status = "주문취소";
                    }
                }
                var datas = JSON.parse(angular.toJson($scope.datass));
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
                        },
                        function (err) {
                            alert(err);
                        });
                });
            }
        };

        $scope.detail=function(event, data){

            var target = angular.element(event.currentTarget);

            var href = target.attr('data-href');

            location.href = href + '#' + encodeURIComponent(JSON.stringify(data));
        };

    })();

       $rootScope.$on('reservation_order_date_changed', function(context, date)
    {
        $scope.date = date;
        $scope.getList();
    });
       $scope.$on('reservation_search_changed', function(context, date)
       {
           $scope.searchword = date;
           $scope.getList(1,$scope.searchword);
       });

    $scope.getList();
    $scope.lan=LanguageService;
}]);
