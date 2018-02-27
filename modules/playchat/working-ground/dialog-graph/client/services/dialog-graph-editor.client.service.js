//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    var instance = undefined;

    angular.module('playchat').factory('DialogGraphEditor', function($window, $rootScope, CaretService)
    {
        var DialogGraphEditor = function()
        {
            this.rightStyle = '-368px';
            this.callback = undefined;
            this.bindCallback = undefined;
            this.saveCallback = undefined;
            this.closeCallback = undefined;
            this.isDirty = false;
            this.myBotAuth = { read: true, edit: true };
        };

        DialogGraphEditor.prototype.open = function(parent, dialog, which)
        {
            console.log('오픈 : ');
            this.isDirty = false;

            if(!this.myBotAuth.edit)
            {
                return alert(LanguageService('You do not have permission to edit this bot'));
            }

            angular.element('.graph-background').css('width', '80%');
            angular.element('#graphDialogEditor').css('right', '0');


            setTimeout(function()
            {
                if(which == 'header')
                {
                    var el = angular.element('#graphDialogEditor .dialog-editor-input:first').focus().get(0);
                    el.setSelectionRange(0, el.value.length);
                }
                else if(which == 'input')
                {
                    var el = angular.element('#graphDialogEditor .dialog-editor-input-box .editable').focus().get(0);
                    CaretService.placeCaretAtEnd(el);
                }
                else if(which == 'output')
                {
                    var el = angular.element('#graphDialogEditor .dialog-editor-output-text textarea').focus().get(0);

                }
            }, 502);

            if(this.callback)
                this.callback(parent, dialog);
        };

        DialogGraphEditor.prototype.bindData = function(data)
        {
            if(this.bindCallback)
                this.bindCallback(data);
        };

        DialogGraphEditor.prototype.setOpenCallback = function(callback, bindCallback)
        {
            this.callback = callback;
            this.bindCallback = bindCallback;
        };

        DialogGraphEditor.prototype.setSaveCallback = function(callback)
        {
            this.saveCallback = callback;
        };

        DialogGraphEditor.prototype.setCloseCallback = function(callback)
        {
            this.closeCallback = callback;
        };

        DialogGraphEditor.prototype.close = function()
        {
            angular.element('.graph-background').css('width', '');
            angular.element('.dialog-editor-creation-panel').css('right', this.rightStyle);
            angular.element('#graphDialogEditor').css('right', this.rightStyle);
            angular.element('.dialog-editor-input-list-modal').hide();

            angular.element('.dialog-graph-code-editor-controller').removeClass('edit');

            if(this.closeCallback)
            {
                this.closeCallback();
            }
        };

        if(!instance)
            instance = new DialogGraphEditor();

        return instance;
    });
})();
