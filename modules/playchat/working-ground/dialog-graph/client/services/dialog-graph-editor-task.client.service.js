//selectTask

//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorTask', function ($cookies, $resource, $rootScope, LanguageService)
    {
        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');

        var make = function($scope, DialogGraphEditor)
        {
            TaskService.query({ botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : '') }, function(list)
            {
                $scope.tasks = list;
            },
            function(err)
            {
                alert(err.data.message);
            });

            var selectedTask = undefined;

            $scope.taskKeydown = function(e)
            {
                if(e.keyCode == 38) //윗 방향키
                {
                    if(selectedTask && selectedTask.previousElementSibling)
                    {
                        selectedTask.previousElementSibling.className = 'selected';
                        selectedTask.className = '';

                        selectedTask = selectedTask.previousElementSibling;

                        var top = selectedTask.offsetTop;
                        var scrollTop = selectedTask.parentElement.scrollTop;

                        if(scrollTop > top)
                        {
                            var diff = top - scrollTop;
                            selectedTask.parentElement.scrollTop += diff - 5;
                        }
                    }
                }
                else if(e.keyCode == 40) //아래 방향키
                {
                    if(selectedTask)
                    {
                        if(selectedTask.nextElementSibling)
                        {
                            selectedTask.nextElementSibling.className = 'selected';
                            selectedTask.className = '';

                            selectedTask = selectedTask.nextElementSibling;

                            var bottom = selectedTask.offsetTop + selectedTask.offsetHeight;
                            var scrollTop = selectedTask.parentElement.scrollTop;
                            var scrollHeight = selectedTask.parentElement.offsetHeight;

                            if(scrollTop + scrollHeight < bottom)
                            {
                                var diff = bottom - (scrollTop + scrollHeight);
                                selectedTask.parentElement.scrollTop += diff + 5;
                            }
                        }
                    }
                    else
                    {
                        var ul = e.currentTarget.nextElementSibling;

                        for(var i=0; i<ul.children.length; i++)
                        {
                            if(ul.children[i].style.display != 'none')
                            {
                                ul.children[i].className = 'selected';
                                selectedTask = ul.children[i];
                                break;
                            }
                        }
                    }
                }
                else if(e.keyCode == 13) //Enter
                {
                    if(selectedTask)
                    {
                        DialogGraphEditor.isDirty = true;

                        if(selectedTask.children[0])
                        {
                            if(!$scope.dialog.task)
                                $scope.dialog.task = {};

                            $scope.dialog.task.name = selectedTask.children[0].innerText;

                            selectedTask.className = '';
                            selectedTask = undefined;

                            e.currentTarget.blur();
                            angular.element('.dialog-editor-output-text > textarea').focus();


                            e.stopPropagation();
                            e.preventDefault();
                        }
                        else
                        {
                            selectedTask.className = '';
                            selectedTask = undefined;
                            var taskName = e.currentTarget.value;
                            $scope.createTask(taskName);
                        }
                    }
                }
            };

            $scope.taskKeyUp = function(e)
            {
                DialogGraphEditor.isDirty = true;

                var value = e.currentTarget.value;

                if(value)
                {
                    angular.element('.dialog-editor-select-options span[data-filename]').each(function()
                    {
                        if(angular.element(this).text().indexOf(value) == -1)
                        {
                            angular.element(this).parent().hide();
                        }
                        else
                        {
                            angular.element(this).parent().show();
                        }
                    });
                }
                else
                {
                    angular.element('.dialog-editor-select-options span[data-filename]').parent().show();
                }
            };

            $scope.taskFocus = function(e)
            {
                TaskService.query({ botId: chatbot.id, templateId: (chatbot.templateId ? chatbot.templateId.id : '') }, function(list)
                {
                    $scope.tasks = list;
                },
                function(err)
                {
                    alert(err.data.message);
                });
                $scope.taskKeyUp(e);
            };

            $scope.selectTask = function(e, task)
            {
                DialogGraphEditor.isDirty = true;
                $scope.dialog.task = { name: task.name };
            };

            $scope.moveCodeEditor = function(e, task)
            {
                e.stopPropagation();

                $rootScope.$broadcast('moveToTask', { fileName: task.fileName, name: task.name });
            };

            $scope.createTask = function(taskName)
            {
                DialogGraphEditor.isDirty = true;

                if(!taskName)
                {
                    alert(LanguageService('Please enter Task name'));
                    setTimeout(function () {
                        angular.element('div.dialog-editor-row.ng-scope > div > input').focus();
                    },1);
                    return;
                }

                $rootScope.$broadcast('makeNewTask', taskName, angular.element('.graph-background .select_tab').attr('id'));

                // //열어야 함.
                // var target = angular.element('.dialog-editor-creation-panel[data-type="task"]');
                // target.css('right', '0');
                //
                // setTimeout(function()
                // {
                //     target.find('form input').focus();
                //     target.find('form').get(0).openCallback();
                // }, 501);
                //
                // target.find('form').get(0).saveCallback = function(name)
                // {
                //     $scope.dialog.task = { name: name };
                //     target.css('right', '-368px');
                // };
                //
                // target.find('form').get(0).closeCallback = function()
                // {
                //     target.css('right', '-368px');
                // };
            };
        };

        return { make : make };
    });

})();
