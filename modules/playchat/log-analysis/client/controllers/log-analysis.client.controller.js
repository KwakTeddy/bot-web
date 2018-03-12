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
            var intents = data.log.intents;

            var check = {};
            var result = [];
            for(var i=0; i<intents.length; i++)
            {
                if(!check[intents[i].intentName])
                {
                    intents[i].matchRateText = Math.round(intents[i].matchRate * 100);
                    result.push(intents[i]);
                    check[intents[i].intentName] = true;
                }
            }

            data.log.intents = result;

            $scope.userInput = data.log;
        }
        else if(data.type == 'answer')
        {
            $scope.target = data.log.target;

            if(data.log.target)
            {
                if(data.log.target.matchRate)
                {
                    $scope.target.matchRateText = Math.round(data.log.target.matchRate * 100);
                }

                if(data.log.target.requiredMatchRate)
                {
                    $scope.target.requiredMatchRate = Math.round(data.log.target.requiredMatchRate * 100);
                }
            }

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

    $scope.close = function(e)
    {
        angular.element('.log-analysis').css('height', '39px').css('overflow', 'hidden').css('top', '');
        angular.element('.working-ground').css('bottom', '39px');
        expandMode = -1;

        if(e)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    $(document).ready(function()
    {
        angular.element('.log-analysis').css('height', expandMode + 'px');
        $scope.close();

        angular.element('#logroom > table > thead th').on('click', function(e)
        {
            if(e.originalEvent.srcElement.nodeName == 'th' && expandMode == -1)
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
