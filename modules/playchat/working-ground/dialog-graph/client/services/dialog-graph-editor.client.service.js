//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    var instance = undefined;

    angular.module('playchat.working-ground').factory('DialogGraphEditor', function($window, $rootScope)
    {
        var DialogGraphEditor = function()
        {
            this.rightStyle = '-368px';
            this.callback = undefined;
            this.inputListModal = undefined;
        };

        DialogGraphEditor.prototype.open = function(parent, dialog)
        {
            var that = this;
            angular.element('#graphDialogEditor').off('click').on('click', function(e)
            {
                angular.element('.dialog-editor-input-list-modal').remove();
                that.inputListModal = undefined;
            });

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
            angular.element('#graphDialogEditor').css('right', this.rightStyle);
            angular.element('.dialog-editor-input-list-modal').remove();
            this.inputListModal = undefined;
        };

        DialogGraphEditor.prototype.closeInputEditor = function()
        {
            angular.element('.dialog-editor-input-list-modal').remove();
            this.inputListModal = undefined;
        };

        DialogGraphEditor.prototype.openInputEditor = function(type, y, x, dataCallback, selectCallback)
        {
            var that = this;

            if(this.inputListModal)
            {
                this.inputListModal.find('li').each(function(index)
                {
                    if(index > 0)
                    {
                        angular.element(this).remove();
                    }
                });
            }
            else
            {
                var page = 1;
                var template = '<ul class="dialog-editor-input-list-modal">' +
                               '<li data-new="true">새로만들기</li>' +
                               '</ul>';

                var t = angular.element(template);

                t.find('li').on('click', function(e)
                {
                    if(this.getAttribute('data-new') == 'true')
                    {
                        //열어야 함.
                    }

                    e.stopPropagation();
                });

                t.on('scroll', function(e)
                {
                    if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight >= e.currentTarget.scrollHeight)
                    {
                        dataCallback(++page, function(name, list)
                        {
                            that.inputListModal.find('li:first').attr('data-name', name);
                            for(var i=0; i<list.length; i++)
                            {
                                var li = document.createElement('li');
                                li.innerText = list[i].name;
                                li.data = list[i];
                                li.addEventListener('click', function()
                                {
                                    selectCallback(this.innerText);
                                    that.closeInputEditor();
                                });

                                that.inputListModal.append(li);
                            }
                        });
                    }
                });

                t.css('top', y + 'px').css('left', x + 'px').focus();

                angular.element('body').append(t);

                this.inputListModal = t;
            }

            dataCallback(1, function(name, list)
            {
                that.inputListModal.find('li:first').attr('data-name', name);
                for(var i=0; i<list.length; i++)
                {
                    var li = document.createElement('li');
                    li.innerText = list[i].name;
                    li.data = list[i];
                    li.addEventListener('click', function(e)
                    {
                        selectCallback(this.innerText);
                        that.closeInputEditor();

                        e.stopPropagation();
                    });

                    that.inputListModal.append(li);
                }
            });
        };

        if(!instance)
            instance = new DialogGraphEditor();

        return instance;
    });
})();
