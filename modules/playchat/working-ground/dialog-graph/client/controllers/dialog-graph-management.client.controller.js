'use strict';

angular.module('playchat').controller('DialogGraphManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Management > Dialog Graph', '/modules/playchat/gnb/client/imgs/scenario.png');

    var DialogGraphExistService = $resource('/api/:botId/dialog-graphs/:fileName/exist', { botId: '@botId', fileName: '@fileName' });
    var DialogGraphsService = $resource('/api/:botId/dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');

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

        $scope.modal.mgmtModal.data.fileType = '.js';

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
            DialogGraphsService.query({ botId: chatbot.id, title: title }, function(list)
            {
                $scope.dialogGraphs = list;
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        var saveFunc = function(modal)
        {
            var params = {};
            params.botId = chatbot.id;
            params.fileName = modal.data.fileName + modal.data.fileType;

            if(modal.data.path)
            {
                params.path = modal.data.path;
                params.fileName = modal.data.fileName;
            }

            DialogGraphsService.save(params, function(result)
            {
                $scope.dialogGraphs.unshift(result.fileName);
                modal.close();
            });
        };

        $scope.save = function(modal)
        {
            DialogGraphExistService.get({ botId: chatbot.id, fileName: modal.data.fileName + modal.data.fileType }, function(result)
            {
                if(result.exist)
                {
                    if(confirm('Filename is duplicated. Keep going?'))
                    {
                        saveFunc(modal);
                    }
                    else
                    {
                        return;
                    }
                }

                saveFunc(modal);
            },
            function(err)
            {
                alert(JSON.stringify(err, null, 4));
            });
        };

        $scope.checkEssentionFile = function(fileName)
        {
            if(fileName == 'default.graph.js' || fileName.endsWith('.bot.js') || fileName == 'default.js')
                return false;

            return true;
        };

        $scope.delete = function(fileName)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
                var params = {};
                params.botId = chatbot.id;
                params.fileName = fileName;

                DialogGraphsService.delete(params, function()
                {
                    var index = $scope.dialogGraphs.indexOf(fileName);
                    $scope.dialogGraphs.splice(index, 1);
                },
                function(err)
                {
                    alert(err.error);
                });
            }
        };

        $scope.uploader = new FileUploader({
            url: '/api/' + chatbot.id + '/dialog-graphs/uploadfile',
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
            importModal.data.path = response.path;
            importModal.data.fileName = response.fileName;
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
