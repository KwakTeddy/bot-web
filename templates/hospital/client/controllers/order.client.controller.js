'use strict';

angular.module('template').controller('reserveController', ['$scope', '$resource', '$cookies', 'FileUploader', function ($scope, $resource, $cookies, FileUploader)
{
    $scope.$parent.changeWorkingGroundName('컨텐츠 관리 > 예약관리', '/modules/playchat/gnb/client/imgs/reservation_grey.png');
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
            menu.status = '예약승인';
            MenuService.update({ templateId: $scope.template.id, botId: chatbot.id, _id: menu._id, status: menu.status }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });

            SendSMS.save({mobile:menu.mobile, message:"< "+chatbot.name + " >\n" + "예약이 확정되었습니다.\n" + menu.date.substring(0,10) + " / " + menu.time}, function(result)
                {
                    alert('예약이 승인되었습니다');
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
        };

        $scope.deny = function(menu)
        {
            menu.status = '예약거부';
            MenuService.update({ templateId: $scope.template.id, botId: chatbot.id, _id: menu._id, status: menu.status }, function(result)
                {
                    alert('예약이 거부되었습니다');
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });

            SendSMS.save({mobile:menu.mobile, message:("<"+chatbot.name + ">\n" + "죄송합니다. 요청하신 시간에 예약이 불가하여, 예약이 승인되지 못했습니다.")}, function(result)
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
