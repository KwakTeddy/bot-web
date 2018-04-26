'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('HeaderController', ['$scope', '$location', '$timeout', '$cookies', '$window', '$rootScope', '$resource', 'LanguageService', function ($scope, $location, $timeout, $cookies, $window, $rootScope, $resource, LanguageService)
{
    $scope.isLogin = $cookies.get('login') == 'true';

    var UserService = $resource('/api/users');
    var ReportingService = $resource('/api/reporting');

    var user = $scope.user = $cookies.getObject('user');
    
    // var userLang = navigator.language || navigator.userLanguage;
    // var code = user ? user.language : userLang || 'en';
    //
    // code = code.split('-')[0];

    var code = $cookies.get('language');

    $scope.language = code || 'en';

    $scope.openReporting = false;

    $scope.reportContent = '';

    $scope.languageChange = function()
    {

        UserService.save({ language: $scope.language }, function(result)
        {
            if(!user) user = {};

            // user.language = $scope.language;
            // $cookies.putObject('user', user);

            $cookies.put('language', $scope.language);

            $rootScope.$broadcast('changeLanguage');
        },
        function(err)
        {
            if(err.status == 401)
            {
                var user = {};
                user.language = $scope.language;
                $cookies.putObject('user', user);

                $cookies.put('language', $scope.language);

                $rootScope.$broadcast('changeLanguage');
            }
            else
            {
                alert(err);
            }
        });
    };

    angular.element('.user-menu a').on('click', function()
    {
        angular.element('.user-menu').hide();
    });

    $scope.openMenu = function(e)
    {
        var x = e.currentTarget.offsetLeft;
        var y = e.currentTarget.offsetTop + e.currentTarget.offsetHeight;

        x -= angular.element('.user-menu').css('width').replace('px', '')*1;

        console.log(angular.element('.user-menu'));

        angular.element('.user-menu').css('left', x + 'px').css('top', y + 'px').show();

        e.stopPropagation();
        e.preventDefault();
    };

    $scope.signout = function()
    {
        angular.forEach($cookies.getAll(), function (v, k) {
            if(k != 'language') $cookies.remove(k);
        });
        $window.location.href = '/api/auth/signout';
    };

    $scope.reporting = function()
    {
        if(confirm(LanguageService('Questions or error reports and suggestions for improvement are received as friends with KakaoTalk Plus. Move to the PlayChat Plus friend? if select the \'Cancel\', then you can send to our email.')))
        {
            window.open(
                'http://pf.kakao.com/_xoWVbC',
                '_blank' // <- This is what makes it open in a new window.
            );
        }
        else
        {
            $scope.openReporting = true;
            setTimeout(function()
            {
                angular.element('.reporting-content').focus();
            }, 100);
        }
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

    window.addEventListener('click', function(e)
    {
        angular.element('.user-menu').hide();
    });
}]);
