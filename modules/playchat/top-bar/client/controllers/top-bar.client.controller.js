'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('TopBarController', ['$window', '$scope', '$cookies', '$rootScope', '$resource', 'LanguageService', function ($window, $scope, $cookies, $rootScope, $resource, LanguageService)
{
    $scope.$parent.loaded('top-bar');

    var UserService = $resource('/api/users');

    angular.element('.user-menu a').on('click', function()
    {
        angular.element('.user-menu').hide();
    });

    var user = $scope.user = $cookies.getObject('user');

    // var userLang = navigator.language || navigator.userLanguage;
    // var code = user ? user.language : userLang || 'en';

    // code = code.split('-')[0];

    var code = $cookies.get('language');



    $scope.language = code || 'ko';

    $scope.reportContent = '';

    $scope.isTopBarOpen = false;

    $scope.languageChange = function()
    {
        UserService.save({ language: $scope.language }, function(result)
        {
            user.language = $scope.language;
            $cookies.putObject('user', user);
            $cookies.put('language', $scope.language);

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
        angular.forEach($cookies.getAll(), function (v, k) {
            if(k != 'language') $cookies.remove(k);
        });

        $window.location.href = '/api/auth/signout';
    };

    $scope.toggleTopBar = function (open) {
        if(open){
            $scope.isTopBarOpen = true;
            var topBarContainer = angular.element("#top-bar-container");
            topBarContainer.css("position", "static");
            topBarContainer.css("top", "0px");

            var middleContainer = angular.element('#middle-container');
            middleContainer.css("top", "64px")

        }else {
            $scope.isTopBarOpen = false;
            var topBarContainer = angular.element("#top-bar-container");
            topBarContainer.css("position", "relative");
            topBarContainer.css("top", "-63px");

            var middleContainer = angular.element('#middle-container');
            middleContainer.css("top", "0px")

        }
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
