'use strict';
angular.module('template').controller('flowerReservationController', ['$scope', '$resource', '$cookies','$http', 'FileUploader','$location', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader,$location, LanguageService, $rootScope,DateRangePickerService)
{
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
        var  oDate1,oDate2,iDays;
        oDate1  =  new  Date(sDate1);   //转换为12-18-2002格式
        oDate2  =  new  Date(sDate2);
        iDays  =  oDate2  -  oDate1;   //把相差的毫秒数转换为天数
        return  iDays
    }


    $scope.changeTab = function(e, name)
    {
        angular.element(e.currentTarget).parent().find('.select_tab').removeClass('select_tab');
        angular.element(e.currentTarget).addClass('select_tab');

        angular.element('.tab-body').hide();
        angular.element('.tab-body[data-id="' + name + '"]').show();

        $location.hash(name);

        e.preventDefault();
        e.stopPropagation();
    };
$scope.selectedTab='schedule';

    if($location.hash())
    {
        $scope.selectedTab=$location.hash();

        angular.element('.failed-dialog .select_tab').removeClass('select_tab');
        angular.element('.failed-dialog a[href="#' + $location.hash() + '"]').parent().addClass('select_tab');
    setTimeout(function()
    {
        angular.element('.failed-dialog .tab-body').hide();
        angular.element('.failed-dialog .tab-body[data-id="' + $location.hash() + '"]').show();
    }, 100);
    }

    $scope.date = [];
    $scope.searchword=undefined;
    (function()
    {
        $scope.getList = function(searchword)
        {
            $scope.datas = [];
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.template = result;
                      DataService.query({ templateId: result.id, botId: chatbot.id}, function(list)
                        {
                            $scope.datas=list;

                            $scope.await=[];
                            $scope.accept=[];
                            $scope.cancel=[];
                            $scope.awaitlength= "0";
                            $scope.acceptlength= "0";
                            $scope.cancellength= "0";

                            for(var i=0;i<list.length;i++) {
                                var datetime = new Date(list[i].order_deliverydate + " " + list[i].order_deliveryhour);
                                var datestart = new Date($scope.date.start);
                                var dateend = new Date($scope.date.end);
                                var startdate = DateDiff(datetime, datestart);
                                var enddate = DateDiff(datetime, dateend);
                                if (searchword===undefined) {
                                    if (list[i].order_status === "주문취소" && startdate <= 0 && enddate >= 0) {
                                        $scope.cancel.push(list[i]);
                                    }
                                    if (list[i].order_status === "승인 대기중" && startdate <= 0 && enddate >= 0) {
                                        $scope.await.push(list[i]);
                                    }
                                    if (list[i].order_status === "승인완료" && startdate <= 0 && enddate >= 0) {
                                        $scope.accept.push(list[i]);
                                    }
                                }
                                else{
                                    if (list[i].order_status === "주문취소" && list[i].order_name === searchword && startdate <= 0 && enddate >= 0) {
                                        $scope.cancel.push(list[i]);
                                    }
                                    if (list[i].order_status === "승인 대기중" && list[i].order_name === searchword && startdate <= 0 && enddate >= 0) {
                                        $scope.await.push(list[i]);
                                    }
                                    if (list[i].order_status === "승인완료" && list[i].order_name === searchword && startdate <= 0 && enddate >= 0) {
                                        $scope.accept.push(list[i]);
                                    }
                                }
                            }
                            $scope.awaitlength= $scope.await.length;
                            $scope.acceptlength= $scope.accept.length;
                            $scope.cancellength= $scope.cancel.length;
                            $scope.searchword=undefined;
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

        $scope.search = function(e)
        {
            if(e.keyCode == 13)
            {
                // $scope.getList(1, e.currentTarget.value);
                if(e.currentTarget.value) {
                    $scope.searchword = e.currentTarget.value;
                    $scope.getList(e.currentTarget.value);
                    $rootScope.$broadcast('reservation_search_changed', $scope.searchword);
                }
                else{
                    $scope.searchword = undefined;
                    $scope.getList($scope.searchword);
                    $rootScope.$broadcast('reservation_search_changed', $scope.searchword);
                }
            }
            else if(e.keyCode == 8)
            {
                //backspace

                if(e.currentTarget.value.length == 1)
                {
                    // $scope.getList(1);
                    $scope.searchword=undefined;
                    rootScope.$broadcast('reservation_search_changed', $scope.searchword);
                    $scope.getList($scope.searchword);
                }
            }
        };




    })();

    DateRangePickerService.init('#createdRange', $scope.date, function()
{
    var hash = $location.hash();
    if(!hash)
    {
        hash = 'schedule';
    }
    $scope.getList();
    $rootScope.$broadcast('reservation_order_date_changed', $scope.date);
});

    angular.element('#createdRange').get(0).getCurrentDate = function(date)
    {
        return $scope.date=date;
    };

    $scope.$on('delete', function(context, date)
    {
        $scope.getList();
    });

    $scope.getList();
    $scope.lan=LanguageService;

}]);
