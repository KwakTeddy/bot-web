'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.working-ground').controller('EntityManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, $compile, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Management > Entity');

    var EntityService = $resource('/api/entitys/:botId', { botId: '@botId' }, { update: { method: 'PUT' } });
    var EntityPageService = $resource('/api/entitys/:botId/totalpage', { botId: '@botId' });
    // var EntityUsableService = $resource('/api/entitys/:botId/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');

    (function()
    {
        // List Page
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

            EntityPageService.get({ botId: chatbot._id, countPerPage: countPerPage }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            EntityService.query({ botId: chatbot._id, page: page, countPerPage: countPerPage }, function(list)
            {
                $scope.entitys = list;
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
                EntityService.update(params, function(result)
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
                EntityService.save(params, function(result)
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

                EntityService.delete(params, function(result)
                {
                    var index = $scope.dialogsets.indexOf(item);
                    $scope.dialogsets.splice(index, 1);
                });
            }
        };
    })();

    (function()
    {
        // Add New Modal
        var contentTemplate = '<tr>' +
                              '<td>{content}</td>' +
                              '<td>' +
                              '  <span class="entity-content" contenteditable="true" ng-keyup="contentPlaceholder($event);">{content} <span contenteditable="false">동의어 입력(enter)</span></span>' +
                              '  <span class="entity-content placeholder" contenteditable="true" ng-keyup="contentPlaceholder($event);"><span contenteditable="false">동의어 입력(enter)</span></span>' +
                              '</td>' +
                              '<td></td>' +
                              '</tr>';

        $scope.entityList = [];
        $scope.addContent = function(e)
        {
            var input = e.currentTarget.previousElementSibling;

            if(!input.value)
            {
                input.className = 'data-input ng-invalid';
                input.focus();
                return;
            }

            $scope.entityList.push(input.value);

            var t = contentTemplate.replace(/{content}/gi, input.value);
            angular.element('#entityList').append($compile(t)($scope));
        };

        $scope.contentPlaceholder = function(e)
        {
            var me = e.currentTarget;
            if(me.innerText == '')
            {
                me.className = 'entity-content placeholder';
            }
            else
            {
                me.className = 'entity-content';
            }
        };

        $scope.placeholderFocusing = function(e)
        {
            e.currentTarget.parentElement.className = 'entity-content';
        };

        $scope.placeholderBlur = function(e)
        {
            e.currentTarget.parentElement.className = 'entity-content placeholder';
        };

    })();

    (function()
    {
        // Import Modal
        $scope.updateUsable = function(item)
        {
            EntityUsableService.update({ botId: chatbot._id, _id: item._id, usable: item.usable ? false : true }, function(result)
            {
            });
        };

        $scope.uploader = new FileUploader({
            url: '/api/dialogsets/uploadfile',
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
