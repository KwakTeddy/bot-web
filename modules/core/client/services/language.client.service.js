//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('LanguageService', function($cookies)
    {
        var user = $cookies.getObject('user');

        var code = user ? user.language : 'ko';

        var language = {};

        var converter = function($scope)
        {
            $scope.lan = {};
        };

        return f;
    });
})();
