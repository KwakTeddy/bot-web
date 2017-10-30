'use strict';

angular.module('playchat').controller('DialogGraphManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Management > Dialog Graph');

    var DialogGraphsService = $resource('/api/:botId/dialoggraphs/:dialoggraphId', { botId: '@botId', dialoggraphId: '@dialoggraphId' }, { update: { method: 'PUT' } });
    var DialogGraphsPageService = $resource('/api/:botId/dialoggraphs/totalpage', { botId: '@botId' });
    var DialogGraphsUsableService = $resource('/api/:botId/dialoggraphs/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

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
                angular.element('.dialoggraph-title').focus();
            }, 100);
        });

        var importModal = new ModalService('importModal', $scope);
        importModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.dialoggraph-title').focus();
            }, 100);
        });

        $scope.search = function(e)
        {
            if(e.keyCode == 13)
            {
                $scope.getList(1, e.currentTarget.value);
            }
            else if(e.keyCode == 8)
            {
                //backspace
                if(e.currentTarget.value.length == 1)
                {
                    $scope.getList(1);
                }
            }
        };

        $scope.getList = function(page, title)
        {
            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            DialogGraphsPageService.get({ botId: chatbot._id, countPerPage: countPerPage, title: title }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            DialogGraphsService.query({ botId: chatbot._id, page: page, countPerPage: countPerPage, title: title }, function(list)
            {
                $scope.dialoggraphs = list;
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
            params.title = modal.data.title;
            params.content = modal.data.content;
            params.type = modal.data.type;
            params.path = modal.data.path;
            params.filename = modal.data.filename;
            params.user = user._id;

            if(modal.data._id)
                params._id = modal.data._id;

            if(params._id)
            {
                DialogGraphsService.update(params, function(result)
                {
                    for(var key in result)
                    {
                        updateTarget[key] = result[key];
                    }

                    updateTarget = undefined;
                    modal.close();
                });
            }
            else
            {
                DialogGraphsService.save(params, function(result)
                {
                    $scope.dialoggraphs.unshift(result);
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
                params.dialoggraphId = item._id;

                var openDialogsets = $cookies.getObject('openDialogsets');
                for(var key in openDialogsets)
                {
                    if(openDialogsets[key] == item._id)
                    {
                        delete openDialogsets[key];
                        break;
                    }
                }

                $cookies.putObject(JSON.stringify(openDialogsets));

                DialogGraphsService.delete(params, function(result)
                {
                    var index = $scope.dialoggraphs.indexOf(item);
                    $scope.dialoggraphs.splice(index, 1);
                });
            }
        };

        $scope.updateUsable = function(item)
        {
            DialogGraphsUsableService.update({ botId: chatbot._id, _id: item._id, usable: item.usable ? false : true }, function(result)
            {
            });
        };

        $scope.uploader = new FileUploader({
            url: '/api/dialoggraphs/uploadfile',
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
