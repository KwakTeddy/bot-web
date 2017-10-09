'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.working-ground').controller('TaskManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Management > Task');

    var TaskService = $resource('/api/tasks/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var TaskPageService = $resource('/api/tasks/:botId/totalpage', { botId: '@botId' });
    // var TaskUsableService = $resource('/api/tasks/:botId/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');

    (function()
    {
        var updateTarget = undefined;
        var mgmtModal = new ModalService('mgmtModal', $scope);
        mgmtModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.entity-title').focus();
            }, 100);
        });

        var importModal = new ModalService('importModal', $scope);
        importModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.entity-title').focus();
            }, 100);
        });

        $scope.getList = function(page)
        {
            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            TaskPageService.get({ botId: chatbot._id, countPerPage: countPerPage }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            TaskService.query({ botId: chatbot._id, page: page, countPerPage: countPerPage }, function(list)
            {
                $scope.tasks = list;
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.save = function(modal)
        {
            var params = {};
            params.botId = chatbot._id;
            params.name = modal.data.name;
            params.content = modal.data.content;
            params.user = user._id;

            if(modal.data._id)
                params._id = modal.data._id;

            if(params._id)
            {
                TaskService.update(params, function(result)
                {
                    for(var key in params)
                    {
                        updateTarget[key] = params[key];
                    }

                    updateTarget = undefined;
                    modal.close();
                });
            }
            else
            {
                TaskService.save(params, function(result)
                {
                    $scope.dialogsets.unshift(result);
                    modal.close();
                });
            }
        };

        $scope.modify = function(item)
        {
            updateTarget = item;
            mgmtModal.setData(item);
            mgmtModal.open();
        };

        $scope.delete = function(item)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
                var params = {};
                params.botId = chatbot._id;
                params._id = item._id;

                TaskService.delete(params, function(result)
                {
                    var index = $scope.dialogsets.indexOf(item);
                    $scope.dialogsets.splice(index, 1);
                });
            }
        };

        $scope.updateUsable = function(item)
        {
            TaskUsableService.update({ botId: chatbot._id, _id: item._id, usable: item.usable ? false : true }, function(result)
            {
            });
        };

        $scope.uploader = new FileUploader({
            url: '/api/tasks/uploadfile',
            alias: 'uploadFile',
            autoUpload: true
        });

        $scope.uploader.onErrorItem = function(item, response, status, headers)
        {
            $scope.modalForm.fileUploadError = response.message;
            console.log($scope.modalForm.fileUploadError);
        };

        $scope.uploader.onSuccessItem = function(item, response, status, headers)
        {
            console.log('성공 : ', item, response, status, headers);

            importModal.data.path = response.path;
            importModal.data.filename = response.filename;

            console.log(importModal);
        };

        $scope.uploader.onProgressItem = function(fileItem, progress)
        {
            angular.element('.form-box-progress').css('width', progress + '%');
        };
    })();

    (function()
    {
        // initialize
        $scope.getList();
    })();
}]);
