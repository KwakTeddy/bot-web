'use strict';

angular.module('template').controller('orderController', ['$scope', '$resource', '$cookies', 'FileUploader', function ($scope, $resource, $cookies, FileUploader)
{
    $scope.$parent.changeWorkingGroundName('컨텐츠 관리 > 예약관리', '/modules/playchat/gnb/client/imgs/order_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var MenuService = $resource('/api/:templateId/:botId/orders', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });
    var SendSMS = $resource('/api/sendSMS');



    var chatbot = $cookies.getObject('chatbot');

    console.log(chatbot);

    $scope.menus = [];

    (function()
    {
        $scope.getList = function()
        {
            ChatbotTemplateService.get({ templateId: chatbot.templateId._id }, function(result)
            {
                $scope.template = result;

                MenuService.query({ templateId: result.id, botId: chatbot.id }, function(list)
                {
                    $scope.menus = list;
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

        $scope.addMenu = function()
        {
            $scope.menus.push({ category1: '', category2: '', name: '', price: '' });
        };

        $scope.accept = function(menu)
        {
            menu.status = '주문승인';
            MenuService.update({ templateId: $scope.template.id, botId: chatbot.id, _id: menu._id, datas: {status:menu.status} }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });

            SendSMS.save({mobile:menu.mobile, message:"주문이 확정되었습니다."}, function(result)
                {
                    alert('주문 승인되었습니다');
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
        };

        $scope.deny = function(menu)
        {
            menu.status = '주문거부';
            MenuService.update({ templateId: $scope.template.id, botId: chatbot.id, _id: menu._id, status: menu.status }, function(result)
                {
                    alert('주문 거부되었습니다');
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });

            SendSMS.save({mobile:menu.mobile, message:"주문이 거부되었습니다."}, function(result)
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
