//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorOutput', function ($window, $rootScope, FileUploader)
    {
        var make = function($scope)
        {
            $scope.isUseOutput = true;

            $scope.outputTypeChanged = function($event)
            {
                console.log('하 : ', $scope.dialog.output);
            };

            $scope.setOutputButtons = function(index)
            {
                if(!$scope.dialog.output[index].buttons)
                    $scope.dialog.output[index].buttons = [];
            };

            $scope.setOutputImageUploader = function(index)
            {
                $scope.dialog.output[index].uploader = new FileUploader({
                    url: '/api/' + $scope.chatbot.id + '/dialoggraphs/uploadImage',
                    alias: 'uploadFile',
                    autoUpload: true
                });

                $scope.dialog.output[index].uploader.item = 'none';
                if($scope.dialog.output[index].kind == 'Content' && $scope.dialog.output[index].image)
                    $scope.dialog.output[index].uploader.item = $scope.dialog.output[index].image.url;

                $scope.dialog.output[index].uploader.onErrorItem = function(item, response, status, headers)
                {
                    alert(response.message);
                };

                $scope.dialog.output[index].uploader.onSuccessItem = function(item, response, status, headers)
                {
                    // console.log('성공 : ', item, response, status, headers);
                    $scope.dialog.output[index].image = {
                        url: response.url,
                        displayname: item.file.name
                    };

                    $scope.$apply(function()
                    {
                        $scope.dialog.output[index].uploader.item = response.url;
                    });
                };

                $scope.dialog.output[index].uploader.onProgressItem = function(fileItem, progress)
                {
                    console.log(progress);
                };
            };

            $scope.addOutput = function(e)
            {
                if(!$scope.useOutput)
                    return;

                var output = { kind: 'text', text: '' };
                $scope.dialog.output.unshift(output);
                $scope.setOutputImageUploader(0);
            };

            $scope.changeOutputType = function(e)
            {

            };

            $scope.addOutputImage = function(e, output)
            {
                if(!$scope.isUseOutput)
                    return;

                $timeout(function()
                {
                    console.log(e.currentTarget.children[1]);
                    e.currentTarget.children[1].click();
                })
            };

            $scope.deleteOutputImage = function(e, index)
            {
                delete $scope.dialog.output[index].image;
                $scope.dialog.output[index].uploader.item = 'none';

                // $scope.setOutputImageUploader(index);

                e.stopPropagation();
            };

            $scope.clickToImageFile = function(e, direction)
            {
                var imageFile = e.currentTarget[direction];
                console.log(imageFile);
                $timeout(function()
                {
                    imageFile.click();
                });
            };

            $scope.addOutputButton = function(e, output)
            {
                if(!$scope.isUseOutput)
                    return;

                output.buttons.push({ url : '', text: ''});

                $timeout(function()
                {
                    e.currentTarget.nextElementSibling.querySelector('input').focus();
                });
            };

            $scope.useOutput = function (e)
            {
                $scope.isUseOutput = true;
            };

            $scope.useAction = function(e)
            {
                $scope.isUseOutput = false;
            };

            $scope.selectActionDialog = function(e, dialog)
            {
                if($scope.isAdvancedMode)
                {
                    $scope.dialog.output.dialog = dialog.name;
                }
                else
                {
                    $scope.dialog.actionOutput.dialog = dialog.name;
                }
            }
        };

        return { make: make };
    });
})();
