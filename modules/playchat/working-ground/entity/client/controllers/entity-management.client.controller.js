'use strict';

//플레이챗 전반적인 관리

angular.module('playchat.working-ground').controller('EntityManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', function ($window, $scope, $resource, $cookies, $location, $compile, FileUploader, ModalService, TabService, FormService, PagingService)
{
    $scope.$parent.changeWorkingGroundName('Management > Entity');

    var EntityService = $resource('/api/entitys/:botId/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });
    var EntityPageService = $resource('/api/entitys/:botId/totalpage', { botId: '@botId' });
    // var EntityUsableService = $resource('/api/entitys/:botId/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');

    (function()
    {
        $scope.entityContentAdded = false;

        // List Page
        var updateTarget = undefined;
        var mgmtModal = new ModalService('mgmtModal', $scope);
        mgmtModal.setOpenCallback(function()
        {
            $scope.entityList = [];

            angular.element('#entityList .entity-row').remove();

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

            EntityPageService.get({ botId: chatbot.id, countPerPage: countPerPage }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            EntityService.query({ botId: chatbot.id, page: page, countPerPage: countPerPage }, function(list)
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
            params.botId = chatbot.id;
            params.name = modal.data.name;
            params.content = modal.data.content;
            params.entityContents = [];
            params.user = user._id;

            if(!modal.data.path && !modal.data.filename)
            {
                //New Modal인 경우 entityList를 저장해야함.
                angular.element('#entityList .entity-row').each(function()
                {
                    var content = {};
                    content._id = angular.element(this).attr('data-id');
                    content.name = angular.element(this).find('td:first').text();
                    content.synonyms = [];

                    angular.element(this).find('.entity-content').each(function()
                    {
                        if(this.innerText && this.className.indexOf('mother') == -1)
                            content.synonyms.push(this.innerText);
                    });

                    params.entityContents.push(content);
                });
            }

            if(modal.data._id)
                params._id = modal.data._id;

            console.log(params);

            if(params._id)
            {
                EntityService.update(params, function(result)
                {
                    if(result.message)
                    {
                        alert(params.name + '을 사용하는 Entity가 존재합니다.');
                    }
                    else
                    {
                        updateTarget.name = params.name;

                        updateTarget = undefined;
                        modal.close();
                    }
                });
            }
            else
            {
                EntityService.save(params, function(result)
                {
                    $scope.entitys.unshift(result);
                    modal.close();
                });
            }
        };

        $scope.modify = function(item)
        {
            updateTarget = item;

            EntityService.get({ botId: chatbot.id, entityId: item._id }, function(result)
            {
                $scope.entityContentAdded = true

                var contents = result.entity.contents;
                console.log(result.entity);
                for(var i=0, l=contents.length; i<l; i++)
                {
                    contents[i]._id = result.entity.models[i]._id;
                    $scope.addContentAndSynonyms(contents[i]);
                }
            });

            mgmtModal.setData(item);
            mgmtModal.open();
        };

        $scope.delete = function(item)
        {
            if(confirm('정말 삭제하시겠습니까'))
            {
                var params = {};
                params.botId = chatbot.id;
                params._id = item._id;

                EntityService.delete(params, function(result)
                {
                    var index = $scope.entitys.indexOf(item);
                    $scope.entitys.splice(index, 1);
                });
            }
        };
    })();

    (function()
    {
        // New Modal
        var contentTemplate = '<tr class="entity-row" data-id="{_id}">' +
                              '<td>{content}</td>' +
                              '<td style="position:relative;">' +
                              '  <input type="text" style="width:1px; padding:0; opacity:0; position: absolute; top: 15px; left: 18px; z-index: -1000;" required="required">' +
                              '  {synonyms}' +
                              '  <span class="entity-content mother" contenteditable="true" ng-keydown="contentsynonymediting($event)" ng-blur="contentblur($event);"></span>' +
                              '</td>' +
                              '<td>' +
                              '<img src="/modules/playchat/working-ground/common/client/img/delete.png" class="delete-img" ng-click="deleteEntityContent($event);">' +
                              '</td>' +
                              '</tr>';

        $scope.addContentAndSynonyms = function(content)
        {
            var name = content.name;
            var synonyms = content.synonyms;

            var t = contentTemplate.replace(/{content}/gi, name).replace('{_id}', content._id || '');

            var synonymsTemplate = '';
            if(synonyms && synonyms.length> 0)
            {
                for(var i=0, l=synonyms.length; i<l; i++)
                {
                    synonymsTemplate += '<span class="entity-content" contenteditable="true" ng-keydown="contentsynonymediting($event)">' + synonyms[i].name + '</span>'
                }

                t = t.replace(' required="required"', '');
            }

            t = t.replace('{synonyms}', synonymsTemplate);

            angular.element('#entityList').append($compile(t)($scope));
            angular.element('#entityList .entity-content:last').focus();

            $scope.entityContentAdded = true;
        };

        $scope.contentediting = function(e)
        {
            if(e.keyCode == 13)
            {
                var input = e.currentTarget;

                if(input.value)
                {
                    $scope.addContentAndSynonyms({ name : input.value, synonyms: [] });
                    input.value = '';
                }

                e.preventDefault();
            }
        };

        $scope.addContent = function(e)
        {
            var input = e.currentTarget.previousElementSibling;

            if(!input.value)
            {
                input.className = 'data-input ng-invalid';
                input.focus();
                return;
            }
            else
            {
                input.className = 'data-input';
            }

            $scope.addContentAndSynonyms({ name : input.value, synonyms: [] });

            input.value = '';
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

        $scope.contentsynonymediting = function(e)
        {
            var prev = e.currentTarget.previousElementSibling;
            if(e.keyCode == 13) //enter
            {
                var clone = e.currentTarget.cloneNode(true);

                clone.className = 'entity-content';

                var span = '<span class="entity-content" contenteditable="true" ng-keydown="contentsynonymediting($event)">' + e.currentTarget.innerText + '</span>'

                angular.element($compile(span)($scope)).insertBefore(angular.element(e.currentTarget));
                // e.currentTarget.parentElement.insertBefore($compile(clone)($scope)[0], e.currentTarget);
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

        $scope.deleteEntityContent = function(e)
        {
            var tr = e.currentTarget.parentElement.parentElement;
            tr.parentElement.removeChild(tr);
        };

        $scope.contentblur = function(e)
        {
            var value = e.currentTarget.innerText;
            if(value)
            {
                var clone = e.currentTarget.cloneNode(true);

                clone.className = 'entity-content';

                e.currentTarget.parentElement.insertBefore($compile(clone)($scope)[0], e.currentTarget);
                e.currentTarget.innerText = '';
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
