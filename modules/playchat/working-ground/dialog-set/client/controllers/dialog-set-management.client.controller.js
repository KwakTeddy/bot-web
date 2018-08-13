'use strict';

angular.module('playchat').controller('DialogSetManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', '$rootScope', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService','LanguageService', 'ExcelDownloadService', function ($window, $scope, $resource, $cookies, $location, $rootScope, FileUploader, ModalService, TabService, FormService, PagingService, LanguageService, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Dialog Set'), '/modules/playchat/gnb/client/imgs/speech.png');

    var DialogSetsService = $resource('/api/:botId/dialogsets/:dialogsetId', { botId: '@botId', dialogsetId: '@dialogsetId' }, { update: { method: 'PUT' } });
    var DialogSetsPageService = $resource('/api/:botId/dialogsets/totalpage', { botId: '@botId' });
    var DialogSetsUsableService = $resource('/api/:botId/dialogsets/usable', { botId: '@botId' }, { update: { method: 'PUT' } });

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
                angular.element('.dialogset-title').focus();
            }, 100);
        });

        var importModal = new ModalService('importModal', $scope);
        importModal.setOpenCallback(function()
        {
            setTimeout(function()
            {
                angular.element('.dialogset-title').focus();
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

            DialogSetsPageService.get({ botId: chatbot._id, countPerPage: countPerPage, title: title }, function(result)
            {
                var totalPage = result.totalPage;
                $scope.pageOptions = PagingService(page, totalPage);
            });

            DialogSetsService.query({ botId: chatbot._id, page: page, countPerPage: countPerPage, title: title }, function(list)
            {
                $scope.dialogsets = list;

                console.log(list);

                var check = false;
                for(var i=0; i<list.length; i++)
                {
                    if(list[i].title == 'default')
                    {
                        check = true;
                        break;
                    }
                }

                if(!title && !check)
                {
                    DialogSetsService.save({ botId: chatbot._id, title: 'default', usable: true }, function(dialogset)
                    {
                        console.log(dialogset);
                        $scope.dialogsets = [dialogset];
                    },
                    function(err)
                    {
                        if(err.status == 401)
                        {

                        }
                        else
                        {
                            alert(err.data.error || err.data.message);
                        }
                    });
                }

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
                DialogSetsService.update(params, function(result)
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
                DialogSetsService.save(params, function(result)
                {
                    $scope.dialogsets.unshift(result);
                    var inputs = document.querySelectorAll( '.inputfile' );
                    Array.prototype.forEach.call( inputs, function( input ) {
                        var label = input.nextElementSibling,
                            labelVal = LanguageService('Choose a file');
                        label.innerHTML = labelVal;
                    });

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
            if(confirm($scope.lan('Are you sure you want to delete this item?')))
            {
                var params = {};
                params.botId = chatbot._id;
                params.dialogsetId = item._id;

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

                DialogSetsService.delete(params, function(result)
                {
                    var index = $scope.dialogsets.indexOf(item);
                    $scope.dialogsets.splice(index, 1);

                    var openDialogsets = $cookies.getObject('openDialogsets');
                    if(!openDialogsets)
                    {
                        openDialogsets = {};
                    }
                    else
                    {
                        openDialogsets = JSON.parse(openDialogsets);
                    }

                    delete openDialogsets[chatbot.id][item.title];
                    $cookies.putObject('openDialogsets', JSON.stringify(openDialogsets));
                });
            }
        };

        $scope.updateUsable = function(item)
        {
            DialogSetsUsableService.update({ botId: chatbot._id, _id: item._id, usable: item.usable ? false : true }, function(result)
            {
                $rootScope.$broadcast('simulator-build');
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
            importModal.data.path = response.path;
            importModal.data.filename = response.filename;
            
            console.log(importModal);
        };

        $scope.uploader.onProgressItem = function(fileItem, progress)
        {
            angular.element('.form-box-progress').css('width', progress + '%');
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: LanguageService('Dialog Set'),
                columnOrder: ['Context1', 'Context2', 'Context3', 'Question(required)', 'Answer(required)'],
                orderedData: [{
                    Context1: '',
                    Context2: '',
                    Context3: '',
                    Question: '',
                    Answer: ''
                }]
            };

            ExcelDownloadService.download(chatbot.id, LanguageService('Dialog Set'), null, template);
        };
    })();

    (function()
    {
        // initialize
        $scope.getList();
    })();

    $scope.lan=LanguageService;
}]);
