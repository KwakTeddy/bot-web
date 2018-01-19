//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorOutput', function ($window, $timeout, $rootScope, FileUploader)
    {
        var make = function($scope)
        {
            $scope.actionList =
            [
                { key: 'call', name: 'Call' },
                { key: 'callChild', name: 'Call Child' },
                { key: 'returnCall', name: 'Return Call' },
                { key: 'up', name: 'Up' },
                { key: 'repeat', name: 'Repeat' },
                { key: 'return', name: 'Return' }
            ];

            $scope.actionTypeCheck = true;
            $scope.controlDialogFlow = false;

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

            $scope.addOutputImage = function(e)
            {
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

                e.stopPropagation();
            };

            $scope.clickToImageFile = function(e)
            {
                var imageFile = angular.element(e.currentTarget).find('input[type="file"]');
                $timeout(function()
                {
                    imageFile.click();
                });
            };

            $scope.addOutputButton = function(e, output)
            {
                output.buttons.push({ url : '', text: ''});

                $timeout(function()
                {
                    e.currentTarget.previousElementSibling.querySelector('input').focus();
                });
            };

            $scope.addActionButton = function()
            {
                $scope.controlDialogFlow = true;
            };

            $scope.onActionFocus = function(e)
            {
                angular.element(e.currentTarget).next().find('.selected').removeClass('selected');
                angular.element(e.currentTarget).next().find('li:first').addClass('selected');
            };

            $scope.onActionKeyDown = function(e, output)
            {
                if(e.keyCode == 38)  //up
                {
                    var prev = angular.element(e.currentTarget).next().find('.selected').prev();
                    if(prev.get(0))
                    {
                        angular.element(e.currentTarget).next().find('.selected').removeClass('selected');
                        prev.addClass('selected');

                        var top = prev.get(0).offsetTop;
                        var scrollTop = prev.parent().get(0).scrollTop;

                        if(scrollTop > top)
                        {
                            var diff = top - scrollTop;
                            prev.parent().get(0).scrollTop += diff - 5;
                        }
                    }
                }
                else if(e.keyCode == 40) //down
                {
                    var next = angular.element(e.currentTarget).next().find('.selected').next();
                    if(next.get(0))
                    {
                        angular.element(e.currentTarget).next().find('.selected').removeClass('selected');
                        next.addClass('selected');

                        var bottom = next.get(0).offsetTop + next.get(0).offsetHeight;
                        var scrollTop = next.parent().get(0).scrollTop;
                        var scrollHeight = next.parent().get(0).offsetHeight;

                        if(scrollTop + scrollHeight < bottom)
                        {
                            var diff = bottom - (scrollTop + scrollHeight);
                            next.parent().get(0).scrollTop += diff + 5;
                        }
                    }
                }
                else if(e.keyCode == 13) //enter
                {
                    var name = angular.element(e.currentTarget).next().find('.selected').text();
                    output.dialog = name;

                    e.currentTarget.blur();
                }
            };

            $scope.onActionKeyUp = function(e)
            {
                var value = e.currentTarget.value;
                angular.element(e.currentTarget).next().find('li').each(function()
                {
                    if(value)
                    {
                        if($(this).text().indexOf(value) != -1)
                        {
                            $(this).show();
                        }
                        else
                        {
                            $(this).hide();
                        }
                    }
                    else
                    {
                        $(this).show();
                    }
                });

                angular.element(e.currentTarget).next().find('.selected').removeClass('selected');
                angular.element(e.currentTarget).next().find('li:first').addClass('selected');
            };

            $scope.selectActionDialog = function(e, dialog, output)
            {
                output.dialog = dialog.name;
            }

            $scope.deleteActionButton = function(output)
            {
                delete output.dialog;

                for(var i=0; i<$scope.actionList.length; i++)
                {
                    delete output[$scope.actionList[i].key];
                }

                $scope.controlDialogFlow = false;
            };

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

                dialog.kind = 'Action';
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
