//selectTask

//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('DialogGraphEditorTask', function ($cookies, $resource, $rootScope, LanguageService)
    {
        var TaskService = $resource('/api/:botId/tasks', { botId: '@botId' }, { update: { method: 'PUT' } });

        var chatbot = $cookies.getObject('chatbot');

        var make = function($scope)
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
                if(e.keyCode == 38)
                {
                    if(selectedTask && selectedTask.previousElementSibling)
                    {
                        selectedTask.previousElementSibling.className = 'selected';
                        selectedTask.className = '';

                        selectedTask = selectedTask.previousElementSibling;
                    }
                }
                else if(e.keyCode == 40)
                {
                    if(selectedTask)
                    {
                        if(selectedTask.nextElementSibling)
                        {
                            selectedTask.nextElementSibling.className = 'selected';
                            selectedTask.className = '';

                            selectedTask = selectedTask.nextElementSibling;
                        }
                    }
                    else
                    {
                        var ul = e.currentTarget.nextElementSibling;
                        ul.children[0].className = 'selected';

                        selectedTask = ul.children[0];
                    }
                }
                else if(e.keyCode == 13)
                {
                    if(selectedTask)
                    {
                        if(!$scope.dialog.task)
                            $scope.dialog.task = {};

                        $scope.dialog.task.name = selectedTask.children[0].innerText;

                        selectedTask = undefined;

                        e.currentTarget.blur();

                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            };

            $scope.selectTask = function(e, task)
            {
                $scope.dialog.task = { name: task.name };
            };

            $scope.moveCodeEditor = function(e, task)
            {
                e.stopPropagation();

                $rootScope.$broadcast('moveToTask', { fileName: task.fileName, name: task.name});
            };

            $scope.createTask = function(taskName)
            {
                if(!taskName)
                {
                    return alert(LanguageService('Please enter Task name'));
                }

                $rootScope.$broadcast('makeNewTask', taskName);

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
