'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.working-ground').controller('DialogLearningManagementController', ['$window', '$scope', '$resource', '$cookies', 'ModalService', 'TabService', 'FormService', function ($window, $scope, $resource, $cookies, ModalService, TabService, FormService)
{
    $scope.$parent.changeWorkingGroundName('Management > Dialog Learning');

    var DialogSetsService = $resource('/api/dialogsets/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });

    (function()
    {
        // Get Dialogsets
        var chatbot = $cookies.getObject('chatbot');
        DialogSetsService.query({ botId: chatbot._id }, function(list)
        {
            $scope.dialogsets = list;
            $scope.$parent.loaded('working-ground');
        });

        $scope.save = function()
        {
            var title = $scope.modalForm.dialogsetTitle;
            var content = $scope.modalForm.dialogsetContent;

            if(!title || !content)
            {
                alert('입력 - 추후 폼 에러 어쩌고로 변경');
            };

            var params = {};
            params.botId = chatbot._id;
            params.title = title;
            params.content = content;

            if($scope.updateTargetItem)
                params._id = $scope.updateTargetItem._id;

            if(params._id)
            {
                DialogSetsService.update(params, function(result)
                {
                    $scope.updateTargetItem.title = result.title;
                    $scope.updateTargetItem.content = result.content;
                    $scope.updateTargetItem = undefined;
                    $scope.modal.close();
                });
            }
            else
            {
                DialogSetsService.save(params, function(result)
                {
                    $scope.dialogsets.unshift(result);
                    $scope.modal.close();
                });
            }
        };

        $scope.modify = function(item)
        {
            $scope.dialogsetTitle = item.title;
            $scope.dialogsetContent = item.content;
            $scope.updateTargetItem = item;

            $scope.modal.open();
        };

        $scope.delete = function(item)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
                var params = {};
                params.botId = chatbot._id;
                params._id = item._id;
                DialogSetsService.delete(params, function(result)
                {
                    var index = $scope.dialogsets.indexOf(item);
                    $scope.dialogsets.splice(index, 1);
                });
            }
        };
    })();


    // UI Makeup
    (function()
    {
        var modal = new ModalService($scope);
        var tab = new TabService($scope.modalTab = {});
        FormService('.management-modal');
        $scope.modalForm = {};

        tab.setDefaultTab('default');

        modal.addOpenCallback(function()
        {
            for(var key in $scope.modalForm)
            {
                $scope.modalForm[key] = undefined;
            }

            tab.setDefaultTab('default');
            setTimeout(function()
            {
                angular.element('.dialogset-title').focus();
            }, 100);
        });

        modal.addCloseCallback(function()
        {
            $scope.updateTargetItem = undefined;
        });
    })();
}]);
