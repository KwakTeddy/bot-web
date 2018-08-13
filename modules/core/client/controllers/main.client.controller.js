'use strict';

window.saveAs || ( window.saveAs = (window.navigator.msSaveBlob ? function(b,n){ return window.navigator.msSaveBlob(b,n); } : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || (function(){

    // URL's
    window.URL || (window.URL = window.webkitURL);

    if(!window.URL){
        return false;
    }

    return function(blob,name){
        var url = URL.createObjectURL(blob);

        // Test for download link support
        if( "download" in document.createElement('a') ){

            var a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', name);

            // Create Click event
            var clickEvent = document.createEvent ("MouseEvent");
            clickEvent.initMouseEvent ("click", true, true, window, 0,
                event.screenX, event.screenY, event.clientX, event.clientY,
                event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
                0, null);

            // dispatch click event to simulate download
            a.dispatchEvent (clickEvent);

        }
        else{
            // fallover, open resource in new tab.
            window.open(url, '_blank', '');
        }
    };

})() );

angular.module('playchat').controller('MainController', ['$scope', '$location', '$timeout', '$cookies', 'Authentication', 'LanguageService', 'LogService', function ($scope, $location, $timeout, $cookies, Authentication, LanguageService, LogService)
{
    var userId = $cookies.getObject('user') ? $cookies.getObject('user')._id : '';
    var botId = $cookies.getObject('chatbot') ? $cookies.getObject('chatbot')._id : '';
    if(userId) LogService.init(userId, botId);

    $scope.loading = true;

    $scope.$watch('loading', function(after, before)
    {
        if(!after)
        {
            angular.element('.main-logo-background').css('opacity', 0);
            $timeout(function()
            {
                angular.element('.main-logo-background').css('display', 'none');
            }, 1200);
        }
        else if(!before && after)
        {
            angular.element('.main-logo-background').css('display', '');
            $timeout(function(){
                angular.element('.main-logo-background').css('opacity', 1);
            }, 100);
        }
    });

    if(!Authentication.user)
    {
        if(location.href.indexOf('/signin') == -1 && location.href.indexOf('/password/forgot') == -1 && location.href.indexOf('/signup') == -1 && location.href.indexOf('/password/reset') == -1)
        {
            var user = $cookies.getObject('user');
            if(!user)
            {
                user = {};
            }

            $cookies.putObject('user', { language: user.language });
            $cookies.put('login', false);
            location.href = '/signin';
        }
    }
    else
    {
        $cookies.putObject('user', Authentication.user);
    }





    (function()
    {
        $scope.lan = LanguageService;
    })();
}]);
