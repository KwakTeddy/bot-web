//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat.working-ground').factory('DialogGraphEditor', function($window, $rootScope)
    {
        var instance = undefined;

        var DialogGraphEditor = function()
        {
            this.rightStyle = '-368px';
        };

        DialogGraphEditor.prototype.open = function(dialog)
        {
            angular.element('#graphDialogEditor').css('right', '0');

            console.log(dialog);
        };

        DialogGraphEditor.prototype.close = function()
        {
            angular.element('#graphDialogEditor').css('right', this.rightStyle);
        };

        if(!instance)
            instance = new DialogGraphEditor();

        return instance;
    });
})();
