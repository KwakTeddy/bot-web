//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('MenuService', function($window, $rootScope)
    {
        var instance = undefined;
        var Menu = function()
        {

        };

        return (function()
        {
            if(!instance)
            {
                instance = new Menu();
            }

            return instance;
        })();
    });
})();
