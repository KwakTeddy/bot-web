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

    var ChatbotAuthService = $resource('/api/:botId/bot-auth/:_id', { botId: '@botId', _id: '@_id' }, { update: { method: 'PUT' } });

    var chatbot = $cookies.getObject('chatbot');
    var templateId = chatbot.templateId && chatbot.templateId.id || '';
    var templatePage = $stateParams.templatePage || '';

    ChatbotAuthService.query({ botId: chatbot._id }, function(result)
    {
        if(result.length > 0)
        {
            $cookies.putObject('editableBot', result[0].edit);
        }
        else
        {
            alert(LanguageService('You do not have permission to access this bot'));
            location.href = '/playchat/chatbots';
        }

    }, function(err)
    {
        if(err.status == 401)
        {
            alert(LanguageService('You do not have permission to access this bot'));
            location.href = '/playchat/chatbots';
        }
    });

    //각 컴포넌트가 자신의 로딩작업이 끝나면 호출한다.
    $scope.loaded = function(name)
    {
        $scope.componentsLoaded[name] = true;
        for(var key in $scope.componentsLoaded)
        {
            if($scope.componentsLoaded[key] === false)
                return;
        }

        $scope.$parent.loading = false;

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
