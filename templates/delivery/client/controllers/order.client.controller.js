'use strict';

angular.module('template').controller('orderController', ['$scope', '$resource', '$cookies', 'FileUploader', function ($scope, $resource, $cookies, FileUploader)
{
    console.log("################################orderControll");
    var ChatbotTemplateService = $resource('/api/chatbots/templates/:templateId', { templateId: '@templateId' }, { update: { method: 'PUT' } });
    var MenuService = $resource('/api/:templateId/:botId/orders', { templateId : '@templateId', botId: '@botId' }, { update: { method: 'PUT' } });



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
            menu.status = '';
            MenuService.update({ templateId: $scope.template.id, botId: chatbot.id, _id: menu._id, status: menu.status }, function(result)
                {
                    console.log(result);
                },
                function(err)
                {
                    alert(err);
                });
        };

        $scope.saveMenu = function()
        {
            var menus = JSON.parse(angular.toJson($scope.menus));

            MenuService.save({ templateId: $scope.template.id, botId: chatbot.id, datas: menus }, function(result)
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
