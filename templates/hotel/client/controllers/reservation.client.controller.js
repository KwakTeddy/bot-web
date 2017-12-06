'use strict';

angular.module('template').controller('hotelReservationController', ['$scope', '$resource', '$cookies', 'FileUploader', function ($scope, $resource, $cookies, FileUploader)
{
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var DataService = $resource('/api/:templateId/:botId/reservations', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });

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
                            $scope.datas = list;
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
            $scope.datas.push({ order_user: '', order_phone: '', order_room: '', order_category: '', order_oneprice: '' ,order_price:'',order_date:'',order_paydate:'',order_daynumbers:'',order_period:'',order_peoplenumber:'',order_status:''});
        };

        $scope.delete = function(index)
        {
            $scope.datas.splice(index, 1);
        };

        $scope.save = function()
        {
            var datas = JSON.parse(angular.toJson($scope.datas));

            console.log('데이터스 : ', datas);

            DataService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: datas }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
        };
    })();

    $scope.getList();
}]);
