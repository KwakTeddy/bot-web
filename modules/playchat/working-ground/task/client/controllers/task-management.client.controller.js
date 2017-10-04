'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.working-ground').controller('IntentManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Management > Intent');

    // var DialogSetsService = $resource('/api/dialogsets/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    // var DialogSetsPageService = $resource('/api/dialogsets/:botId/totalpage', { botId: '@botId' });
    // var DialogSetsUsableService = $resource('/api/dialogsets/:botId/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

    //Functions
    (function()
    {
        var chatbot = $cookies.getObject('chatbot');

        $scope.getList = function(page)
        {
            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            // DialogSetsPageService.get({ botId: chatbot._id, countPerPage: countPerPage }, function(result)
            // {
                // var totalPage = result.totalPage;
                // $scope.pageOptions = PagingService(page, totalPage);
            // });

            // DialogSetsService.query({ botId: chatbot._id, page: page, countPerPage: countPerPage }, function(list)
            // {
            //     $scope.dialogsets = list;
            //     $scope.$parent.loaded('working-ground');
            // });
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.save = function()
        {
            var params = {};

            if($scope.modalForm._id)
                params._id = $scope.modalForm._id;

            if(params._id)
            {
                //update
            }
            else
            {
                //create
            }

            $scope.modalForm = {};
        };

        $scope.modify = function(item)
        {
            $scope.modalForm = {};
            for(var key in item)
            {
                $scope.modalForm[key] = item[key];
            }

            $scope.modal.open();

            $scope.updateTarget = item;
        };

        $scope.delete = function(item)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
            }
        };
    })();


    // UI Handling
    (function()
    {
        var modal = new ModalService($scope);
        var tab = new TabService($scope.modalTab = {});
        FormService('.management-modal');
        $scope.modalForm = {};

        tab.setDefaultTab('default');

        modal.addOpenCallback(function()
        {
            tab.setDefaultTab('default');
        });

        modal.addCloseCallback(function()
        {
            $scope.modalForm = {};
        });
    })();


    (function()
    {
        // initialize
        $scope.getList();
    })();
}]);
