'use strict';

angular.module('template').controller('flowerReservationCompleteController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http, FileUploader, LanguageService, $rootScope,DateRangePickerService)
  {
    $scope.$parent.changeWorkingGroundName('주문관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);


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
        // $scope.search = function()
        // {
        //     var value = angular.element('#search').val();
        //     $scope.getList(1, value);
        // };

        $scope.getList = function(searchword)
        {
            $scope.datas = [];
            $scope.datass = [];
            $scope.list = [];
            $scope.datass =[];
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result)
                {
                    $scope.template = result;
                    // $scope.list = result;
                    //alert(" $scope.template"+JSON.stringify( $scope.template));
                    DataService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                        {
                            $scope.datass = list;
                            for(var i=0;i<list.length;i++){
                                var datetime =new Date(list[i].order_deliverydate+" "+list[i].order_deliveryhour);
                                var datestart=new Date($scope.date.start);
                                var dateend=new Date($scope.date.end);
                                var startdate=DateDiff(datetime, datestart);
                                var enddate=DateDiff(datetime, dateend);
                                if(searchword===undefined) {
                                    if (list[i].order_status === "승인완료" && startdate <= 0 && enddate >= 0) {
                                        $scope.datas.push(list[i]);
                                    }
                                }
                                else{
                                    if (list[i].order_status === "승인완료" && list[i].order_name === searchword && startdate <= 0 && enddate >= 0) {
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

        $scope.detail=function(event, data){

            var target = angular.element(event.currentTarget);

            var href = target.attr('data-href');

            location.href = href + '#' + encodeURIComponent(JSON.stringify(data));
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

                var datass = JSON.parse(angular.toJson($scope.datass));
                ChatbotTemplateService.get({ templateId: chatbot.templateId._id}, function(result) {
                    DataService.save({
                            templateId: result.id,
                            botId: chatbot.id,
                            datas: datass
                        }, function (result1) {
                            console.log(result1);
                            alert("취소하였습니다");
                            $scope.datas.splice(index, 1);
                            $rootScope.$broadcast('simulator-build');
                            $rootScope.$broadcast('delete');
                        },
                        function (err) {
                            alert(err);
                        });
                });
            }
        };

    })();
      $scope.$on('reservation_order_date_changed', function(context, date)
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
