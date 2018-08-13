'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('IntentManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService','LanguageService', 'ExcelDownloadService', function ($window, $scope, $resource, $cookies, $location, $compile, FileUploader, ModalService, TabService, FormService, PagingService, LanguageService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Intent'), '/modules/playchat/gnb/client/imgs/intent.png');

    var IntentService = $resource('/api/:botId/intents/:intentId', { botId: '@botId', intentId: '@intentId' }, { update: { method: 'PUT' } });
    var IntentContentsService = $resource('/api/:botId/intents/:intentId/contents', { botId: '@botId', intentId: '@intentId' });
    var IntentPageService = $resource('/api/:botId/intents/totalpage', { botId: '@botId' });
    // var IntentUsableService = $resource('/api/intents/:botId/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    var user = $cookies.getObject('user');

    $scope.intentContentAdded = false;

    $scope.myBotAuth = chatbot.myBotAuth;

    (function()
    {
        var updateTarget = undefined;
        var mgmtModal = new ModalService('mgmtModal', $scope);
        mgmtModal.setOpenCallback(function()
        {
            $scope.intentContentAdded = false;
            angular.element('#intentList .intent-content-row').remove();

            setTimeout(function()
            {
                angular.element('.intent-title').focus();
            }, 100);
        });

        var importModal = new ModalService('importModal', $scope);
        importModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.intent-title').focus();
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

            IntentPageService.get({ botId: chatbot.id, countPerPage: countPerPage, name: name }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            IntentService.query({ botId: chatbot.id, page: page, countPerPage: countPerPage, name: name }, function(list)
            {
                $scope.intents = list;
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
            params.user = user._id;
            params.language = chatbot.language;
            params.intentContents = [];

            if(chatbot.templateId)
                params.templateId = chatbot.templateId.id;

            angular.element('#intentList .intent-content-row').each(function()
            {
                var content = angular.element(this).find('td:first-child').text();
                console.log(content);
                params.intentContents.push(content);
            });

            if(modal.data._id)
                params._id = modal.data._id;

            if(params._id)
            {
                IntentService.update(params, function(result)
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
                IntentService.save(params, function(result)
                {
                    $scope.intents.unshift(result);
                    modal.close();
                });
            }
        };

        $scope.saveByImport = function(modal)
        {
            var params = {};
            params.botId = chatbot.id;
            params.name = modal.data.name;
            params.user = user._id;
            params.path = modal.data.path;
            params.filename = modal.data.filename;

            IntentService.save(params, function(result)
            {
                $scope.intents.unshift(result);
                var inputs = document.querySelectorAll( '.inputfile' );
                Array.prototype.forEach.call( inputs, function( input ) {
                    var label = input.nextElementSibling,
                        labelVal = LanguageService('Choose a file');
                    label.innerHTML = labelVal;
                });
                modal.close();
            });
        };

        $scope.modify = function(item)
        {
            updateTarget = item;
            mgmtModal.setData(item);
            mgmtModal.open();

            IntentContentsService.query({ botId: chatbot.id, intentId: item._id }, function(result)
            {
                var html = '';
                for(var i=0, l=result.length; i<l; i++)
                {
                    var tr = '<tr class="intent-content-row">';
                    tr += '<td>' + result[i].name + '</td> <td> <img src="modules/playchat/working-ground/common/client/imgs/delete.png" class="delete-img" ng-click="deleteContent($event);"> </td>';
                    tr += '</tr>';

                    html += tr;
                }

                angular.element('#intentList').append($compile(html)($scope));
                $scope.intentContentAdded = true;
            });
        };

        $scope.delete = function(item)
        {
            if(confirm($scope.lan('Are you sure you want to delete this item?')))
            {
                var params = {};
                params.botId = chatbot.id;
                params.intentId = item._id;

                IntentService.delete(params, function(result)
                {
                    var index = $scope.intents.indexOf(item);
                    $scope.intents.splice(index, 1);
                });
            }
        };

        $scope.updateUsable = function(item)
        {
            IntentUsableService.update({ botId: chatbot.id, _id: item._id, usable: item.usable ? false : true }, function(result)
            {
            });
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
            url: '/api/intents/uploadfile',
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


        $scope.addContent = function(e)
        {
            var input = undefined;
            var target = e.currentTarget;
            if(e.keyCode)
            {
                if(e.keyCode == 13)
                {
                    input = target;
                    e.preventDefault();
                }
                else
                {
                    return;
                }
            }
            else
            {
                input = target.previousElementSibling;
            }

            var tr = '<tr class="intent-content-row">';
            tr += '<td>' + input.value + '</td> <td> <img src="modules/playchat/working-ground/common/client/imgs/delete.png" class="delete-img" ng-click="deleteContent($event);"> </td>';
            tr += '</tr>';

            angular.element('#intentList').append($compile(tr)($scope));
            $scope.intentContentAdded = true;

            input.value = '';
        };

        $scope.deleteContent = function(e)
        {
            var tr = e.currentTarget.parentElement.parentElement;

            if(tr.parentElement.querySelectorAll('.intent-content-row').length == 1)
            {
                $scope.intentContentAdded = false;
            }

            tr.parentElement.removeChild(tr);
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Intent'),
                columnOrder: ['Content(required)'],
                orderedData: [{
                    'Content(required)': 'Example',
                },
                {
                    'Content(required)': 'Sample',
                }]
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Intent'), null, template);
        };
    })();

    (function()
    {
        // initialize
        $scope.getList();
    })();
    $scope.lan=LanguageService;
}]);
