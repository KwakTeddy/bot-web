//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorOutput', function ($window, $timeout, $rootScope, FileUploader, LanguageService)
    {
        var make = function($scope, DialogGraphEditor)
        {
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
                DialogGraphEditor.isDirty = true;

                var output = { kind: 'Content', text: '' };
                $scope.dialog.output.push(output);
                $scope.setOutputImageUploader($scope.dialog.output.length - 1);

                // angular.element('.dialog-editor-subject input:first').prop('checked', true);
            };

            $scope.deleteOutput = function(output, index)
            {
                DialogGraphEditor.isDirty = true;

                if(output.length == 1)
                {
                    alert('마지막 Output은 삭제할 수 없습니다');
                    return;
                }

                output.splice(index, 1);
            };

            $scope.isAddExternalImage = false;
            $scope.addExternalImage = function(output)
            {
                if(output.image && output.image.displayname)
                {
                    if(confirm(LanguageService('There are already added images. Do you want to change it?')))
                    {
                        delete output.image.url;
                        delete output.image.displayname;
                        output.uploader.item = 'none';
                    }
                    else
                    {
                        return;
                    }
                }

                $scope.isAddExternalImage = true;
            };

            $scope.deleteExternalImage = function(output)
            {
                $scope.isAddExternalImage = false;
                if(output.image)
                {
                    delete output.image.url;
                    delete output.image.displayname;
                }
            };

            $scope.addOutputImage = function(e)
            {
                DialogGraphEditor.isDirty = true;

                $timeout(function()
                {
                    e.currentTarget.children[1].click();
                })
            };

            $scope.deleteOutputImage = function(e, index)
            {
                DialogGraphEditor.isDirty = true;

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
                DialogGraphEditor.isDirty = true;

                if(!output.buttons) output.buttons = [];

                output.buttons.push({ url : '', text: ''});

                $timeout(function()
                {
                    e.currentTarget.previousElementSibling.querySelector('input').focus();
                });
            };

            $scope.moveButtonToUp = function(output, button)
            {
                var index = output.buttons.indexOf(button);
                if(index > 0)
                {
                    var target = output.buttons[index-1];
                    output.buttons[index-1] = button;
                    output.buttons[index] = target;
                }
            };

            $scope.moveButtonToDown = function(output, button)
            {
                var index = output.buttons.indexOf(button);
                if(index != -1 && index < output.buttons.length - 1)
                {
                    var target = output.buttons[index+1];
                    output.buttons[index+1] = button;
                    output.buttons[index] = target;
                }
            };

            $scope.addActionButton = function(dialog, output)
            {
                DialogGraphEditor.isDirty = true;
                output.kind = 'Action';
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

                    e.preventDefault();
                    e.stopImmediatePropagation();
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

                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                else if(e.keyCode == 13) //enter
                {
                    var selected = angular.element(e.currentTarget).next().find('.selected');
                    var id = selected.attr('data-id');
                    var name = selected.text();
                    output.dialogId = id;
                    output.dialogName = name;
                    output.kind = 'Action';

                    e.currentTarget.blur();
                }
            };

            $scope.onActionKeyUp = function(e)
            {
                if(e.keyCode == 38 || e.keyCode == 40)
                {
                    return;
                }

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
                output.kind = 'Action';
                output.dialogId = dialog.id;
                output.dialogName = dialog.name;
            };

            $scope.deleteActionButton = function(output)
            {
                delete output.dialog;

                for(var i=0; i<$scope.actionList.length; i++)
                {
                    delete output[$scope.actionList[i].key];
                }

                output.kind = 'Content';
            };

            $scope.actionValueChanged = function(output)
            {
                output.kind = 'Action';

                if(output.type == 'call' || output.type == 'callChild' || output.type == 'returnCall')
                {

                }
                else
                {
                    delete output.dialogName;
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
