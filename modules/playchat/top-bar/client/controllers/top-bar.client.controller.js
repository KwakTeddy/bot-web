'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('TopBarController', ['$window', '$scope', '$cookies', '$rootScope', '$resource', 'LanguageService', function ($window, $scope, $cookies, $rootScope, $resource, LanguageService)
{
    $scope.$parent.loaded('top-bar');

    var UserLanguageService = $resource('/api/users/language');
    var ReportingService = $resource('/api/reporting');

    angular.element('.user-menu a').on('click', function()
    {
        angular.element('.user-menu').hide();
    });

    var user = $scope.user = $cookies.getObject('user');

    var userLang = navigator.language || navigator.userLanguage;
    var code = user ? user.language : userLang || 'en';

    code = code.split('-')[0];

    $scope.language = code || 'ko';

    $scope.openReporting = false;

    $scope.reportContent = '';

    $scope.languageChange = function()
    {
        UserLanguageService.save({ language: $scope.language }, function(result)
        {
            user.language = $scope.language;
            $cookies.putObject('user', user);

            $rootScope.$broadcast('changeLanguage');
        },
        function(err)
        {
            alert(err);
        });
    };

    $scope.openMenu = function(e)
    {
        var x = e.currentTarget.offsetLeft;
        var y = e.currentTarget.offsetTop + e.currentTarget.offsetHeight;

        x -= angular.element('.user-menu').css('width').replace('px', '')*1;

        angular.element('.user-menu').css('left', x + 'px').css('top', y + 'px').show();

        e.stopPropagation();
        e.preventDefault();
    };

    $scope.signout = function()
    {
        $window.location.href = '/api/auth/signout';
    };

    $scope.reporting = function()
    {
        $scope.openReporting = true;
        setTimeout(function()
        {
            angular.element('.reporting-content').focus();
        }, 100);
    };

    $scope.sendReporting = function()
    {
        ReportingService.save({ content: $scope.reportContent }, function(result)
        {
            alert(LanguageService('Successfully transferred!'));
            $scope.reportContent = '';
            $scope.closeReporting();
        },
        function(err)
        {
            console.log('에러 : ', err);
        });
    };

    $scope.closeReporting = function()
    {
        $scope.openReporting = false;
    };

    $scope.$on('update-topbar-title', function(scope, data)
    {
        var element = angular.element('.breadcrumbs .menu-name').get(0);
        while(!element)
        {
            element = angular.element('.breadcrumbs .menu-name').get(0);
        }
        angular.element('.breadcrumbs .menu-name').text(data.name);
        angular.element('.breadcrumbs .menu-name-icon').get(0).src = data.imgUrl;
    });

    window.addEventListener('click', function(e)
    {
        angular.element('.user-menu').hide();
    });

    $scope.lan=LanguageService;
}]);
