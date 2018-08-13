'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('EntityManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService', 'LanguageService', 'ExcelDownloadService','$rootScope', function ($window, $scope, $resource, $cookies, $location, $compile, FileUploader, ModalService, TabService, FormService, PagingService, LanguageService, ExcelDownloadService,$rootScope)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Entity'), '/modules/playchat/gnb/client/imgs/entity.png');

    var EntityService = $resource('/api/:botId/entitys/:entityId', { botId: '@botId', entityId: '@entityId' }, { update: { method: 'PUT' } });
    var EntityContentService = $resource('/api/:botId/entitys/:entityId/contents', { botId: '@botId', entityId: '@entityId' });
    var EntityPageService = $resource('/api/:botId/entitys/totalpage', { botId: '@botId' });
    // var EntityUsableService = $resource('/api/entitys/:botId/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');

    var updateTarget = undefined;

    (function()
    {
        $scope.entityContentAdded = false;

        // List Page
        var mgmtModal = new ModalService('mgmtModal', $scope);
        mgmtModal.setOpenCallback(function()
        {
            $scope.entityList = [];

            angular.element('#entityList .entity-content-row').remove();

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

        $scope.getList = function(page, name)
        {
            var page = page || $location.search().page || 1;
            var countPerPage = $location.search().countPerPage || 10;

            EntityPageService.get({ botId: chatbot.id, countPerPage: countPerPage, name : name }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            EntityService.query({ botId: chatbot.id, page: page, countPerPage: countPerPage, name : name }, function(list)
            {
                $scope.entitys = list;
                $scope.$parent.loaded('working-ground');
            });
        };

        $scope.toPage = function(page)
        {
            $scope.getList(page);
        };

        $scope.updateUsable = function(item)
        {
            EntityUsableService.update({ botId: chatbot._id, _id: item._id, usable: item.usable ? false : true }, function(result)
            {
            });
        };

        $scope.modify = function(item)
        {
            updateTarget = item;
            mgmtModal.setData(item);
            mgmtModal.open();

            EntityContentService.query({ botId: chatbot.id, entityId: item._id }, function(entityContents)
            {
                if(entityContents.length > 0)
                {
                    $scope.entityContentAdded = true;

                    for(var i=0, l=entityContents.length; i<l; i++)
                    {
                        $scope.addEntityContent(entityContents[i]);
                    }
                }
            });
        };

        $scope.delete = function(item)
        {
            if(confirm($scope.lan('Are you sure you want to delete this item?')))
            {
                var params = {};
                params.botId = chatbot.id;
                params.entityId = item._id;

                EntityService.delete(params, function(result)
                {
                    var index = $scope.entitys.indexOf(item);
                    $scope.entitys.splice(index, 1);
                });
            }
        };

        $scope.save = function(modal)
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = modal.data.name;
            params.entityContents = [];
            params.user = user._id;

            if(!modal.data.path && !modal.data.filename)
            {
                //New Modal인 경우 entityList를 저장해야함.
                angular.element('#entityList .entity-content-row').each(function()
                {
                    var content = {};
                    content._id = angular.element(this).attr('data-id');
                    content.name = angular.element(this).find('td:first').text();
                    content.synonyms = [];

                    angular.element(this).find('.entity-content-synonym').each(function()
                    {
                        content.synonyms.push(this.innerText);
                    });

                    params.entityContents.push(content);
                });
            }

            if(modal.data._id)
                params._id = modal.data._id;

            if(params._id)
            {
                EntityService.update(params, function(result)
                {
                    updateTarget.name = params.name;

                    updateTarget = undefined;
                    modal.close();
                },
                function(err)
                {
                    if(err.data.message == 'Duplicated entity name')
                    {
                        alert(params.name + $scope.lan('is duplicated name.'));
                    }
                });
            }
            else
            {
                EntityService.save(params, function(result)
                {
                    $scope.entitys.unshift(result);
                    modal.close();
                },
                function(err)
                {
                    if(err.data.message == 'Duplicated entity name')
                    {
                        alert(params.name + $scope.lan('is duplicated name.'));
                    }
                });
            }
        };

        $scope.saveByImport = function(modal)
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = modal.data.name;
            params.user = user._id;
            params.filename = modal.data.filename;
            params.path = modal.data.path;

            EntityService.save(params, function(result)
            {
                $scope.entitys.unshift(result);
                var inputs = document.querySelectorAll( '.inputfile' );
                Array.prototype.forEach.call( inputs, function( input ) {
                    var label = input.nextElementSibling,
                        labelVal = LanguageService('Choose a file');
                    label.innerHTML = labelVal;
                });

                modal.close();
            },
            function(err)
            {
                if(err.data.message == 'Duplicated entity name')
                {
                    alert(params.name + $scope.lan('is duplicated name.'));
                }
            });
        };

        $scope.contentInputKeydown = function(e)
        {
            if(e.keyCode == 13)
            {
                $scope.addEntityContent({ name : e.currentTarget.value });
                e.currentTarget.value = '';
                e.currentTarget.focus();
                e.preventDefault();

                $scope.entityContentAdded = true;
            }
        };

        $scope.addEntityContentClick = function(e)
        {
            var input = e.currentTarget.previousElementSibling;
            $scope.addEntityContent({ name: input.value });
            input.value = '';
            input.focus();

            $scope.entityContentAdded = true;
        };

        $scope.addEntityContent = function(content)
        {
            var tr = '<tr class="entity-content-row" data-id="' + (content.id || '') +'">';
            tr += '<td>' + content.name + '</td>';
            tr += '<td class="entity-content-synonyms">' +
                  '    <input type="text" required="required">' +
                  '    <input type="text" placeholder="동의어입력(enter)" ng-keydown="synonymInputKeydown($event);">' +
                  '</td>';
            tr += '<td><img src="/modules/playchat/working-ground/common/client/imgs/delete.png" class="delete-img" ng-click="deleteEntityContent($event);"></td>';
            tr += '</tr>';

            tr = $compile(tr)($scope);
            angular.element('#entityList').append(tr);

            var input = tr.find('.entity-content-synonyms input:last-child').get(0);

            var synonyms = content.synonyms;
            if(synonyms)
            {
                for(var i=0, l=synonyms.length; i<l; i++)
                {
                    var s = synonyms[i];
                    var span = addConentSynonym(s.name);

                    input.parentElement.insertBefore(span, input);
                }

                tr.find('.entity-content-synonyms input:first-child').removeAttr('required');
            }
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

        var addConentSynonym = function(value)
        {
            var span = document.createElement('span');
            span.className = 'entity-content-synonym';
            span.setAttribute('contenteditable', 'true');
            span.innerText = value;
            span.addEventListener('keydown', function(e)
            {
                if(e.keyCode == 8)
                {
                    //backspace
                    console.log('backspace');
                    if(e.currentTarget.innerText.length == 1)
                    {
                        var prev = e.currentTarget.previousElementSibling;
                        var next = e.currentTarget.nextElementSibling;

                        e.preventDefault();
                        var input = e.currentTarget.parentElement.children[0];
                        e.currentTarget.parentElement.removeChild(e.currentTarget);

                        if(prev.nodeName == 'INPUT')
                        {
                            if(next.nodeName == 'INPUT')
                            {
                                input.setAttribute('required', 'required');
                                next.focus();
                            }
                            else
                            {
                                placeCaretAtEnd(next);
                            }
                        }
                        else
                        {
                            placeCaretAtEnd(prev);
                        }
                    }
                }
                else if(e.keyCode == 9)
                {
                    //tab
                    placeCaretAtEnd(e.currentTarget.nextElementSibling);
                }
                else if(e.keyCode == 13)
                {
                    //enter
                    placeCaretAtEnd(e.currentTarget.nextElementSibling);
                    e.preventDefault();
                }
            });

            return span;
        };

        $scope.synonymInputKeydown = function(e)
        {
            if(e.keyCode == 13)
            {
                var value = e.currentTarget.value;
                var span = addConentSynonym(value);
                e.currentTarget.parentElement.insertBefore(span, e.currentTarget);
                e.currentTarget.value = '';

                var input = e.currentTarget.parentElement.children[0];
                input.removeAttribute('required');

                e.preventDefault();
            }
        };

        $scope.deleteEntityContent = function(e)
        {
            var tr = e.currentTarget.parentElement.parentElement;
            tr.parentElement.removeChild(tr);
        };


        var inputs = document.querySelectorAll( '.inputfile' );
        Array.prototype.forEach.call( inputs, function( input ) {
            var label = input.nextElementSibling,
                labelVal = LanguageService('Choose a file');
                label.innerHTML = labelVal;
            input.addEventListener( 'change', function( e ) {
                var fileName = '';
                if( this.files && this.files.length > 1 )
                    fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
                else
                    fileName = e.target.value.split( '\\' ).pop();

                if( fileName )
                {
                    label.innerHTML = fileName;
                    }
                else label.innerHTML = labelVal;
            });
        });

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
            console.log("fileItemfilename:"+response.filename);

        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Entity'),
                columnOrder: ['Name(required)', 'Synonym(required)'],
                orderedData: [{
                    'Name(required)': 'Example',
                    'Synonym(required)': 'Example'
                },
                {
                    'Name(required)': '',
                    'Synonym(required)': 'Sample'
                }]
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Entity'), null, template);
        };

        $scope.uploader.onProgressItem = function(fileItem, progress)
        {
            angular.element('.form-box-progress').css('width', progress + '%');

        };
    })();

    //file name
    // var inputs = document.querySelectorAll( '.inputfile' );
    // Array.prototype.forEach.call( inputs, function( input ) {
    //     var label = input.nextElementSibling,
    //         labelVal = label.innerHTML;
    //     input.addEventListener( 'change', function( e ) {
    //         var fileName = '';
    //         if( this.files && this.files.length > 1 )
    //             fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
    //         else
    //             fileName = e.target.value.split( '\\' ).pop();
    //
    //         if( fileName )
    //         {
    //             label.innerHTML = fileName;
    //             }
    //         else label.innerHTML = labelVal;
    //     });
    // });


    // initialize
    $scope.getList();
    $scope.lan=LanguageService;
}]);
