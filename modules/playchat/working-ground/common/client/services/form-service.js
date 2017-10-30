//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('FormService', function($window, $rootScope)
    {
        var f = function(selector)
        {
            angular.element(selector + ' .form-box input').on('focus', function()
            {
                $(this).parent().addClass('focused');
            });

            angular.element(selector + ' .form-box input').on('blur', function()
            {
                $(this).parent().removeClass('focused');
            });
        };

        return f;
    });
})();
