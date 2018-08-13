'use strict';

angular.module('template').controller('flowerReservationScheduleDetailCancelController', ['$scope', '$resource', '$cookies','$http', 'FileUploader', 'LanguageService','$rootScope','DateRangePickerService',function ($scope, $resource, $cookies,  $http,FileUploader, LanguageService, $rootScope,DateRangePickerService)
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
                   data.order_status= "주문취소";
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

               $scope.accept = function(event,data)
               {
                   for(var i=0; i<$scope.datas.length; i++) {
                       if ($scope.datas[i]._id===data._id) {
                           $scope.datas[i].order_status = "승인 대기중";
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
                           $scope.datas[i]= $scope.data;
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
