'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('TaskManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', '$element', 'FileUploader', 'ModalService', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, $element, FileUploader, ModalService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Task'), '/modules/playchat/gnb/client/imgs/task.png');

    var TaskService = $resource('/api/:botId/tasks/:fileName/:taskName', { botId: '@botId', fileName: '@fileName', taskName: '@taskName' }, { update: { method: 'PUT' } });
    var TaskFilesService = $resource('/api/:botId/taskfiles', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');

    $scope.isEditMode = false;

    var editor = CodeMirror.fromTextArea($element.find('.management-modal textarea').get(0),
    {
        lineNumbers: true,
        smartIndent: true
    });

    (function()
    {
        var updateTarget = undefined;
        var mgmtModal = new ModalService('mgmtModal', $scope);
        mgmtModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                $scope.modal.mgmtModal.isNewFile = false;
                angular.element('.task-title').focus();
            }, 100);
        });

        var importModal = new ModalService('importModal', $scope);
        importModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.task-title').focus();
            }, 100);
        });

        TaskFilesService.query({ botId: chatbot.id }, function(list)
        {
            $scope.taskFiles = list;
        },
        function(err)
        {
            alert(err.data.error || err.data.message);
        });

        $scope.getList = function(page)
        {
            $scope.modal.mgmtModal.isNewFile = false;

            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            // TaskPageService.get({ botId: chatbot._id, countPerPage: countPerPage }, function(result)
            // {
            //     var totalPage = result.totalPage;
            //     $scope.pageOptions = PagingService(page, totalPage);
            // });

            TaskService.query({ botId: chatbot.id, page: page, countPerPage: countPerPage }, function(list)
            {
                $scope.tasks = list;

                console.log('리스트 : ', list);
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.selectedFileName = function(e)
        {
            var value = angular.element('.task-file-select').val();
            if(value == '[Create File]')
            {
                $scope.modal.mgmtModal.isNewFile = true;
                $scope.modal.mgmtModal.data.fileName = '';
            }
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.save = function(modal)
        {
            var params = {};
            params.botId = chatbot.id;
            params.fileName = modal.data.fileName;
            params.name = modal.data.name;
            params.editMode = $scope.isEditMode;

            var logic = editor.getValue();

            var content = "var " + params.name + " = {\r\n";
            content += "    name: '" + params.name + "',\r\n";
            content += "    action: function(task, context, callback) {\r\n";
            content += logic + '\r\n';
            content += "    }\r\n";
            content += "};\r\n";
            content += "bot.setTask('" + params.name + "', " + params.name + ");";

            console.log(content);

            params.content = content;

            TaskService.save(params, function()
            {
                $scope.tasks.unshift({ fileName: params.fileName, name: params.name });
                modal.close();
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.open = function()
        {
            editor.setValue('\tcallback(task, context);');
            setTimeout(function() {
                editor.refresh();
            },1);

            $scope.isEditMode = false;

            $scope.modal.mgmtModal.open();
        };

        $scope.modify = function(item)
        {
            updateTarget = item;
            TaskService.get({ botId: chatbot.id, fileName : item.fileName, taskName: item.name }, function(content)
            {
                editor.setValue(content.content.trim());
                setTimeout(function() {
                    editor.refresh();
                },1);

                $scope.isEditMode = true;
                mgmtModal.setData(item);
                mgmtModal.open();
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.delete = function(item)
        {
            if(confirm($scope.lan('Are you sure you want to delete this item?')))
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
    $scope.lan=LanguageService;
}]);
