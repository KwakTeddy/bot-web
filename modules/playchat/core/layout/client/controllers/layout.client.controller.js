'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('LayoutController', ['$location', '$scope', '$resource', '$rootScope', 'EventService', '$state', '$stateParams', '$compile', '$cookies', 'LanguageService', function ($location, $scope, $resource, $rootScope, EventService, $state, $stateParams, $compile, $cookies, LanguageService)
{
    $scope.componentsLoaded = {
        'side-menu': false,
        'top-bar': false,
        'simulator': false,
        'log-analysis': false,
        'working-ground': false
    };

    EventService.subscribeMe();

    var chatbot = $cookies.getObject('chatbot');
    if(!chatbot)
    {
        alert(LanguageService('The bot is not selected. Please select a bot.'));
        location.href = '/playchat/chatbots';
    }
    else if(!chatbot.myBotAuth)
    {
        alert(LanguageService('Your bot\'s permissions are not set. Please select bot again. This message is shown only once at the beginning.'));
        location.href = '/playchat/chatbots';
    }

    var templateId = chatbot.templateId && chatbot.templateId.id || '';
    var templatePage = $stateParams.templatePage || '';

    var link = angular.element('#gnb-responsive-css');
    if(location.href.indexOf('/development/dialog-graph') != -1)
    {
        // gnb 숨기기
        link.attr('data-media', link.attr('media')).removeAttr('media').removeAttr('disabled');
        angular.element('.video-popup').css('left', '75px');
    }
    else
    {
        link.attr('media', link.attr('data-media')).attr('disabled', '');
        angular.element('.video-popup').css('left', '255px');
    }

    //각 컴포넌트가 자신의 로딩작업이 끝나면 호출한다.
    $scope.loaded = function(name)
    {
        $scope.componentsLoaded[name] = true;
        for(var key in $scope.componentsLoaded)
        {
            if($scope.componentsLoaded[key] === false)
                return;
        }

        if($scope.$parent)
        {
            $scope.$parent.loading = false;
        }

        angular.element('.working-ground').on('scroll', function(e)
        {
            if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight >= e.currentTarget.scrollHeight)
            {
                $scope.$broadcast('working-ground-scroll-bottom', e);
            }
        });
    };

    $scope.changeWorkingGroundName = function(name, imgUrl)
    {
        $rootScope.$broadcast('update-topbar-title', { name: name, imgUrl: imgUrl });
    };

    if(templateId && templatePage)
    {
        $scope.page = '/templates/' + templateId + '/client/views/html/' + templatePage + '.html';
        $scope.loaded('working-ground');
    }
    else
    {
        var category = $stateParams.category ? $stateParams.category : '';
        var page = $stateParams.page ? $stateParams.page : 'dashboard';
        var detail = $stateParams.detail ? $stateParams.detail: '';

        if(templateId && page == 'dashboard')
        {
            $scope.page = '/templates/' + templateId + '/client/views/html/dashboard.html';
            $scope.loaded('working-ground');
        }
        else
        {
            $scope.page = '/modules/playchat/working-ground/' + page + '/client/views/' + page + (category ? '-' + category : '') + (detail ? '-' + detail : '') + '.client.view.html';
        }
    }
}]);
