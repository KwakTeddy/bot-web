//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('EventService', function($window, $rootScope)
    {
        function subsFunc()
        {
            $window.addEventListener('resize', function(e)
            {
                $rootScope.$broadcast('window.resize', e);
            });
        }

        return { "subscribeMe": subsFunc };
    });
})();
