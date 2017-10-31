//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    var instance = undefined;

    angular.module('playchat').factory('DialogGraphEditor', function($window, $rootScope)
    {
        var DialogGraphEditor = function()
        {
            this.rightStyle = '-368px';
            this.callback = undefined;
        };

        DialogGraphEditor.prototype.open = function(parent, dialog)
        {
            angular.element('#graphDialogEditor').css('right', '0');
            setTimeout(function()
            {
                angular.element('#graphDialogEditor .dialog-editor-input:first').focus();
            }, 600);

            if(this.callback)
                this.callback(parent, dialog);
        };

        DialogGraphEditor.prototype.setOpenCallback = function(callback)
        {
            this.callback = callback;
        };

        DialogGraphEditor.prototype.close = function()
        {
            angular.element('.dialog-editor-creation-panel').css('right', this.rightStyle);
            angular.element('#graphDialogEditor').css('right', this.rightStyle);
        };

        if(!instance)
            instance = new DialogGraphEditor();

        return instance;
    });
})();
