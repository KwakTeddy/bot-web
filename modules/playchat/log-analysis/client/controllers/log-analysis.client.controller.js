'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('LogAnalysisController', ['$window', '$scope', 'LanguageService', function ($window, $scope, LanguageService)
{
    $scope.$parent.loaded('log-analysis');

    var expandMode = 0;
    var scrollTimer = undefined;

    $scope.currentTab = 'logcontent';

    $scope.taskLogs = [];
    $scope.$on('onlog', function(context, data)
    {
        if(expandMode == -1)
        {
            $scope.toggleExpand();
        }

        if(data.type == 'input')
        {
            $scope.userInput = data.log;
            console.log('음 : ', data.log);
        }
        else if(data.type == 'answer')
        {
            $scope.target = data.log.target;
            $scope.output = data.log.output;
        }
        else if(data.type == 'task')
        {
            if(typeof data.log.logs == 'string')
            {
                $scope.taskLogs.push(data.log.logs);
            }
            else
            {
                var lines = '';
                for(var key in data.log.logs)
                {
                    lines += data.log.logs[key] + ' ';
                }

                $scope.taskLogs.push(lines);
            }
        }


        // var selector = '#logcontent';
        //
        // if(data.message.indexOf('entities: ') != -1)
        // {
        //     selector = '#entitycontent';
        // }
        // else if(data.message.indexOf('intent: ') != -1)
        // {
        //     selector = '#intentcontent';
        // }
        //
        // var log = data.message.replace(':log ', '').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        // angular.element(selector).append('<div>' + log + '</div>');
        //
        // if(scrollTimer)
        // {
        //     clearTimeout(scrollTimer);
        // }
        //
        // scrollTimer = setTimeout(function()
        // {
        //     var logContent = angular.element('.logcontent > div').get(0);
        //     if(logContent)
        //     {
        //         logContent.parentElement.scrollTop = logContent.offsetHeight;
        //     }
        // }, 300);
    });

    $scope.selectTab = function(e, selector)
    {
        var target = e.currentTarget;
        angular.element('.logTab.select').removeClass('select');
        angular.element(target).addClass('select');
        angular.element('.logcontent > div').hide();
        angular.element(selector).show();

        setTimeout(function()
        {
            var logContent = angular.element('.logcontent > div').get(0);
            logContent.parentElement.scrollTop = logContent.offsetHeight;
        }, 300);
    };

    //굉장히 아름답지 못한 코드들... 내가 이렇게 코드를 짜야하다니
    $scope.toggleExpand = function()
    {
        angular.element('.working-ground').css('bottom', '');
        angular.element('.log-analysis').css('overflow', '');
        if(expandMode == 0)
        {
            expandMode = 500;
            angular.element('.log-analysis').css('height', expandMode + 'px');
        }
        else if(expandMode == 500)
        {
            expandMode = -1;
            angular.element('.log-analysis').css('height', '').css('top', '0').css('height', 'auto');
        }
        else if(expandMode == -1)
        {
            expandMode = 0;
            angular.element('.working-ground').css('bottom', '211px');
            angular.element('.log-analysis').css('height', '').css('top', '');
        }
    };

    $scope.close = function()
    {
        angular.element('.log-analysis').css('height', '39px').css('overflow', 'hidden').css('top', '');
        angular.element('.working-ground').css('bottom', '39px');
        expandMode = -1;
    };

    $(document).ready(function()
    {
        angular.element('.log-analysis').css('height', expandMode + 'px');
        $scope.close();

        angular.element('#logroom > table > thead th').on('click', function()
        {
            if(expandMode == -1)
            {
                expandMode = 0;
                angular.element('.working-ground').css('bottom', '211px');
                angular.element('.log-analysis').css('height', '').css('top', '');
            }
        });

        setTimeout(function()
        {
            angular.element('.log-analysis').css('transition', 'all 0.2s');
        }, 500);
    });

    $scope.lan=LanguageService;
}]);
