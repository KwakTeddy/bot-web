'use strict';

angular.module('template').controller('deliveryMenuController', ['$scope', '$resource', '$cookies', '$rootScope', 'FileUploader', function ($scope, $resource, $cookies, $rootScope, FileUploader)
{
    $scope.$parent.changeWorkingGroundName('컨텐츠 관리 > 메뉴관리', '/modules/playchat/gnb/client/imgs/order_grey.png');
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var MenuService = $resource('/api/:templateId/:botId/menus', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });
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
                    // $scope.menus = list;
                    $scope.menus = [{status : " 승인대기중", mobile : "01092597716", address:"서울시 관악구 봉천동 1645-55 201호", pay:"현금", discr:"문앞에 놔주세요", order:[{name:"양념치킨", quant:1, price:12000}]}];

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
            var prev = $scope.menus[$scope.menus.length-1];
            $scope.menus.push({ category1: prev.category1, category2: prev.category2, name: '', price: '' });
        };

        $scope.deleteMenu = function(index)
        {
            $scope.menus.splice(index, 1);
        };

        $scope.saveMenu = function()
        {
            var menus = JSON.parse(angular.toJson($scope.menus));

            MenuService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: menus }, function(result)
            {
                alert('저장되었습니다.');
                console.log(result);
                $rootScope.$broadcast('simulator-build');
            },
            function(err)
            {
                alert(err);
            });

        };

    })();
    console.log($scope.menus);
    $scope.getList();
}]);
