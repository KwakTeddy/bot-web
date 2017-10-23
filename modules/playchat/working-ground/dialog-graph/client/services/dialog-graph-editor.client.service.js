//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat.working-ground').factory('DialogGraphEditor', function($window, $rootScope)
    {
        var instance = undefined;

        var DialogGraphEditor = function()
        {

        };

        DialogGraphEditor.prototype.open = function()
        {
            angular.element('#graphDialogEditor').css('right', '0');
        };

        if(!instance)
            instance = new DialogGraphEditor();

        return instance;
    });
})();
