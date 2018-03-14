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
            this.isOpen = false;

            this.timeout = undefined;
        };

        DialogGraphEditor.prototype.open = function(parent, dialog, which, text)
        {
            this.isOpen = true;
            this.isDirty = false;

            if(!this.myBotAuth.edit)
            {
                return alert(LanguageService('You do not have permission to edit this bot'));
            }

            angular.element('.graph-background').css('width', '80%');
            angular.element('#graphDialogEditor').css('right', '0');

            this.timeout = setTimeout(function()
            {
                if(!which || which == 'header')
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
                    el.focus();
                }
            }, 502);

            if(this.callback)
                this.callback(parent, dialog, text);
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

        DialogGraphEditor.prototype.close = function(withCallback)
        {
            if(this.closeCallback && withCallback !== false)
            {
                if(!this.closeCallback())
                {
                    return false;
                }
            }

            if(this.timeout)
            {
                clearTimeout(this.timeout);
            }

            angular.element('.graph-background').css('width', '');
            angular.element('.dialog-editor-creation-panel').css('right', this.rightStyle);
            angular.element('#graphDialogEditor').css('right', this.rightStyle);
            angular.element('.dialog-editor-input-list-modal').hide();

            angular.element('.dialog-graph-code-editor-controller').removeClass('edit');

            var that = this;
            setTimeout(function()
            {
                that.isOpen = false;
            }, 500);

            that.isOpen = undefined;
        };

        if(!instance)
            instance = new DialogGraphEditor();

        return instance;
    });
})();
