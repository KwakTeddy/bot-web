'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('LogAnalysisController', ['$window', '$scope', 'LanguageService', function ($window, $scope, LanguageService)
{
    $scope.$parent.loaded('log-analysis');

    var expandMode = 0;
    var scrollTimer = undefined;

    $scope.currentTab = 'logcontent';

    $scope.$on('onlog', function(context, data)
    {
        var selector = '#logcontent';

        if(data.message.indexOf('entities: ') != -1)
        {
            selector = '#entitycontent';
        }
        else if(data.message.indexOf('intent: ') != -1)
        {
            selector = '#intentcontent';
        }

        angular.element(selector).append('<div>' + data.message.replace(':log ', '').replace(/</gi, '&lt;').replace(/>/gi, '&gt;') + '</div>');

        if(scrollTimer)
        {
            clearTimeout(scrollTimer);
        }

        scrollTimer = setTimeout(function()
        {
            var logContent = angular.element('.logcontent > div').get(0);
            if(logContent)
            {
                logContent.parentElement.scrollTop = logContent.offsetHeight;
            }
        }, 300);
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
        $scope.close();
    });

    $scope.lan=LanguageService;
}]);
