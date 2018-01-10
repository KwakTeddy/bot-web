'use strict';

angular.module('playchat').controller('DialogGraphManagementController', ['$window', '$scope', '$resource', '$cookies', '$location', 'FileUploader', 'ModalService', 'TabService', 'FormService', 'PagingService','LanguageService', function ($window, $scope, $resource, $cookies, $location, FileUploader, ModalService, TabService, FormService, PagingService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Management') + ' > ' + LanguageService('Dialog Graph'), '/modules/playchat/gnb/client/imgs/scenario.png');

    var DialogGraphExistService = $resource('/api/:botId/dialog-graphs/:fileName/exist', { botId: '@botId', fileName: '@fileName' });
    var DialogGraphsService = $resource('/api/:botId/dialog-graphs/:fileName', { botId: '@botId', fileName: '@fileName' });

    var chatbot = $cookies.getObject('chatbot');

    (function()
    {
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
            var fileName = modal.data.fileName + (modal.data.fileType == '.graph' ? modal.data.fileType + '.js' : modal.data.fileType);

            var params = {};
            params.botId = chatbot.id;
            params.fileName = fileName;

            if(modal.data.path)
            {
                params.path = modal.data.path;
                params.fileName = fileName;
            }
            else if($scope.uploadError)
            {
                return alert(LanguageService($scope.uploadError));
            }

            // DialogGraphsService.save(params, function(result)
            // {
            //     $scope.dialogGraphs.unshift(result.fileName);
            //     var inputs = document.querySelectorAll( '.inputfiles' );
            //     Array.prototype.forEach.call( inputs, function( input ) {
            //         var label = input.nextElementSibling,
            //             labelVal = LanguageService('Choose a file');
            //         label.innerHTML = labelVal;
            //     });
            //     modal.close();
            // });
        };

        $scope.save = function(modal)
        {
            var fileName = modal.data.fileName + (modal.data.fileType == '.graph' ? modal.data.fileType + '.js' : modal.data.fileType);
            DialogGraphExistService.get({ botId: chatbot.id, fileName: fileName }, function(result)
            {
                if(result.exist)
                {
                    if(confirm($scope.lan('Filename is duplicated. Keep going?')))
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
            if(confirm($scope.lan('Are you sure you want to delete this item?')))
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

        var inputs = document.querySelectorAll( '.inputfiles' );
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
            url: '/api/' + chatbot.id + '/dialog-graphs/uploadfile',
            alias: 'uploadFile',
            autoUpload: true
        });

        $scope.uploader.onErrorItem = function(item, response, status, headers)
        {
            $scope.uploadError = response.message;
            alert(LanguageService(response.message));
        };

        $scope.uploader.onSuccessItem = function(item, response, status, headers)
        {
            $scope.uploadError = '';
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

    $scope.lan=LanguageService;
}]);
