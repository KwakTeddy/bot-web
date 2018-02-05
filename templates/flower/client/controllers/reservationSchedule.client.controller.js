'use strict';

angular.module('template').controller('flowerReservationScheduleController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader, LanguageService, $rootScope,DateRangePickerService)
   {
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId'}, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');


    // $scope.date = angular.element('#createdRange').get(0).getCurrentDate();
    // $scope.list = [];

       function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
           var  oDate1,oDate2,iDays;
           oDate1  =  new  Date(sDate1);   //转换为12-18-2002格式
           oDate2  =  new  Date(sDate2);
           iDays  =  oDate2  -  oDate1;   //把相差的毫秒数转换为天数
           return  iDays
       }
       $scope.searchword=undefined;
    (function()
    {
        $scope.getList = function(searchword)
        {
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.datass=[];
                    $scope.datas=[];
                    $scope.template = result;
                            DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                            {
                                for(var i=0;i<list.length;i++){
                                    var datetime =new Date(list[i].order_deliverydate+" "+list[i].order_deliveryhour);
                                    var datestart=new Date($scope.date.start);
                                    var dateend=new Date($scope.date.end);
                                    var startdate=DateDiff(datetime, datestart);
                                    var enddate=DateDiff(datetime, dateend);
if(searchword===undefined) {
    if (list[i].order_status !== "주문취소" && list[i].order_status !== "주문삭제" && startdate <= 0 && enddate >= 0) {
        $scope.datas.push(list[i]);
    }
}
else{
    if (list[i].order_status !== "주문취소" && list[i].order_name === searchword && list[i].order_status !== "주문삭제" && startdate <= 0 && enddate >= 0) {
        $scope.datas.push(list[i]);
    }
}
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
           $scope.getList($scope.searchword);
       });

    $scope.getList();
    $scope.lan=LanguageService;
}]);
