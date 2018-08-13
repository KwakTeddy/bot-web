//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorOutput', function ($window, $timeout, $rootScope, FileUploader)
    {
        var make = function($scope)
        {
            $scope.isUseOutput = true;
            $scope.actionTypeCheck = false;

            $scope.outputTypeChanged = function($event)
            {
            };

            $scope.setOutputButtons = function(index)
            {
                if(!$scope.dialog.output[index].buttons)
                    $scope.dialog.output[index].buttons = [];
            };

            $scope.deleteOutputButton = function(buttons, index)
            {
                buttons.splice(index, 1);
            };

            $scope.setOutputImageUploader = function(index)
            {
                $scope.dialog.output[index].uploader = new FileUploader({
                    url: '/api/' + $scope.chatbot.id + '/dialog-graphs/uploadImage',
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

            $scope.onKeyDownTextArea = function(e)
            {
                if(e.keyCode == 45)
                {
                    $scope.addOutput();
                }
            };

            $scope.addOutput = function(e)
            {
                if(!$scope.useOutput)
                    return;

                var output = { kind: 'Content', text: '' };
                $scope.dialog.output.unshift(output);
                $scope.setOutputImageUploader(0);

                $scope.isUseOutput = true;

                angular.element('.dialog-editor-subject input:first').prop('checked', true);
            };

            $scope.deleteOutput = function(output, index)
            {
                if(output.length == 1)
                {
                    alert('마지막 Output은 삭제할 수 없습니다');
                    return;
                }

                output.splice(index, 1);
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
                var imageFile = angular.element(e.currentTarget).find('input[type="file"]');
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
                    e.currentTarget.previousElementSibling.querySelector('input').focus();
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

            $scope.selectActionDialog = function(e, dialog, output)
            {
                if($scope.isAdvancedMode)
                {
                    output.dialog = dialog.name;
                    // $scope.dialog.output[index].dialog = dialog.name;
                }
                else
                {
                    $scope.dialog.actionOutput.dialog = dialog.name;
                }
            }

            $scope.actionValueChanged = function(dialog)
            {
                var type = dialog.type;
                if(type == 'up' || type == 'repeat' || type == 'return')
                {
                    $scope.actionTypeCheck = true;
                    dialog.dialog = 1;

                    if(type == 'return')
                    {
                        dialog.dialog = '';
                    }
                }
                else
                {
                    $scope.actionTypeCheck = false;
                }
            };

            $scope.findActionDialogs = function(e)
            {
                var value = e.currentTarget.value;

                angular.element(e.currentTarget.nextElementSibling).find('li').each(function()
                {
                    if(!value)
                    {
                        $(this).show();
                    }
                    else
                    {
                        if($(this).attr('data-name').indexOf(value) != -1)
                        {
                            $(this).show();
                        }
                        else
                        {
                            $(this).hide();
                        }
                    }
                });
            };
        };

        return { make: make };
    });
})();
