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
            params.entityContents = [];
            params.user = user._id;

            if(!modal.data.path && !modal.data.filename)
            {
                //New Modal인 경우 entityList를 저장해야함.
                angular.element('#entityList .entity-content').each(function()
                {
                    params.entityContents.push(this.innerText);
                });
            }

            if(modal.data._id)
                params._id = modal.data._id;

            console.log(params);

            // if(params._id)
            // {
            //     EntityService.update(params, function(result)
            //     {
            //         for(var key in params)
            //         {
            //             updateTarget[key] = params[key];
            //         }
            //
            //         updateTarget = undefined;
            //         modal.close();
            //     });
            // }
            // else
            // {
            //     EntityService.save(params, function(result)
            //     {
            //         $scope.dialogsets.unshift(result);
            //         modal.close();
            //     });
            // }
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
                              '<td style="position:relative;">' +
                              '  <input type="text" style="width:1px; padding:0; opacity:0; position: absolute; top: 0; left: 10px; z-index: -1000;" required="required">' +
                              '  <span type="text" class="entity-content" contenteditable="true" ng-keydown="contentediting($event)">{content}</span>' +
                              '  <span type="text" class="entity-content mother" contenteditable="true" ng-keydown="contentediting($event)"></span>' +
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
            angular.element('#entityList .entity-content:last').focus();
        };

        function placeCaretAtEnd(el)
        {
            el.focus();
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined")
            {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            else if (typeof document.body.createTextRange != "undefined")
            {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }

        $scope.contentediting = function(e)
        {
            var prev = e.currentTarget.previousElementSibling;

            if(e.keyCode == 13) //enter
            {
                var clone = e.currentTarget.cloneNode(true);

                clone.className = 'entity-content';

                e.currentTarget.parentElement.insertBefore($compile(clone)($scope)[0], e.currentTarget);
                e.currentTarget.innerText = '';
                e.preventDefault();
            }
            else if(e.keyCode == 8) //backspace
            {
                if(prev && prev.nodeName.toLowerCase() == 'input')
                {
                    // 한글자 남아있으면 이 함수가 끝나고 지워지고 length가 0이된다. 그러면 reuiqred가 필요하므로 추가해줌.
                    if(e.currentTarget.innerText.length == 1)
                    {
                        prev.setAttribute('required', 'required');
                    }
                }
                else if(prev && e.currentTarget.innerText == '')
                {
                    //이전 동의어가 있으면 커서를 마지막으로
                    placeCaretAtEnd(prev);
                    e.preventDefault();

                    if(e.currentTarget.className.indexOf('mother') == -1)
                    {
                        e.currentTarget.parentElement.removeChild(e.currentTarget);
                    }
                }
            }
            else
            {
                // 글자가 입력되면 required는 필요 없어지므로 지워버린다.
                if(prev && prev.nodeName.toLowerCase() == 'input')
                {
                    prev.removeAttribute('required');
                }
            }
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
