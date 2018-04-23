//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    var instance = undefined;
    var menuInstance = undefined;

    angular.module('playchat').factory('DialogGraph', function($window, $rootScope)
    {
        var Menu = function()
        {
            this.tempDialog = undefined;
            this.tempDialogElement = undefined;
            this.currentDialog = undefined;
            this.isOpened = false;
        };

        Menu.prototype.setCurrentDialog = function(dialog)
        {
            this.currentDialog = dialog;
        };

        Menu.prototype.execute = function(name)
        {
            if(this[name])
            {
                this[name](this.currentDialog);
            }
            else
            {
                throw new Error('[' + name + '] menu is not defined');
            }
        };

        Menu.prototype.addChild = function()
        {
            var dialog = this.currentDialog.get(0).children[0].dialog;
            instance.editor.open(dialog, null);

            this.closeMenu();
        };

        Menu.prototype.cut = function()
        {
            var dialog = this.currentDialog.get(0).children[0].dialog;
            var parent = this.currentDialog.parent().parent();
            var parentDialog = parent.get(0).children[0].dialog;

            instance.focusById(parentDialog.id);

            var index = parentDialog.children.indexOf(dialog);
            parentDialog.children.splice(index, 1);

            parent.find('.graph-fold').get(0).style.display = 'none';

            if(this.currentDialog.next().get(0).nodeName == 'BUTTON')
            {
                this.currentDialog.next().css('margin-top', '21.4px');
            }

            this.currentDialog.parent().get(0).removeChild(this.currentDialog.get(0));
            
            this.tempDialogElement = this.currentDialog;
            this.tempDialog = dialog;
            this.closeMenu();

            instance.refreshLine();

            angular.element('#menuPaste').attr('data-using', 'true');
        };

        var changeDialogInfo = function(dialogs)
        {
            for(var i=0; i<dialogs.length; i++)
            {
                dialogs[i].id += '-Clone';
                dialogs[i].name += '-Clone';

                if(dialogs[i].children)
                {
                    changeDialogInfo(dialogs[i].children);
                }
            }
        };

        Menu.prototype.copy = function()
        {
            var dialog = JSON.parse(JSON.stringify(this.currentDialog.get(0).children[0].dialog));

            var clone = this.currentDialog.get(0).cloneNode(true);

            this.tempDialogElement = angular.element(clone);
            this.tempDialog = dialog;

            changeCloneInfo(this.tempDialog);

            // this.tempDialog.id += '-Clone';
            // this.tempDialog.name += '-Clone';

            if(this.tempDialog.children)
            {
                changeDialogInfo(this.tempDialog.children);
            }

            this.tempDialogElement.attr('id', this.tempDialog.id);
            this.tempDialogElement.find('.graph-dialog-header span').text(this.tempDialog.name);

            this.closeMenu();

            angular.element('#menuPaste').attr('data-using', 'true');
        };

        Menu.prototype.paste = function()
        {
            if(this.tempDialog && this.tempDialogElement)
            {
                var parentDialog = this.currentDialog.get(0).children[0].dialog;
                (parentDialog.children || (parentDialog.children = [])).push(this.tempDialog);
                var children = this.currentDialog.get(0).children[1].children;
                this.tempDialogElement.insertBefore(children[children.length-1]);

                this.tempDialogElement.get(0).children[0].dialog = this.tempDialog;

                instance.focusById(this.tempDialog.id);

                instance.bindDialogFunctions(this.tempDialogElement);

                this.tempDialog = undefined;
                this.tempDialogElement = undefined;

                this.currentDialog.find('.graph-fold').get(0).style.display = '';

                instance.refreshLine();

                instance.dirty = true;

                instance.$rootScope.$broadcast('saveDialogGraph', { saveFileName: instance.fileName });
            }

            angular.element('#menuPaste').attr('data-using', 'false');

            // $rootScope.$broadcast('simulator-build-without-reset-focus');

            this.closeMenu();
        };

        Menu.prototype.moveUp = function()
        {
            instance.moveUpDialog(this.currentDialog);
            // var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            // var dialog = this.currentDialog.get(0).children[0].dialog;
            // var prevDialog = (this.currentDialog.prev().get(0) ? this.currentDialog.prev().get(0).children[0].dialog : undefined);
            // if(prevDialog)
            // {
            //     var prevIndex = parentDialog.children.indexOf(prevDialog);
            //     var currentIndex = parentDialog.children.indexOf(dialog);
            //
            //     var temp = parentDialog.children[prevIndex];
            //     parentDialog.children[prevIndex] = dialog;
            //     parentDialog.children[currentIndex] = temp;
            //
            //     //실제 엘리먼트들도 바꾼다.
            //     this.currentDialog.insertBefore(this.currentDialog.prev());
            //
            //     instance.setDirty(true);
            // }

            // $rootScope.$broadcast('simulator-build');

            this.closeMenu();
        };

        Menu.prototype.moveDown = function()
        {
            instance.moveDownDialog(this.currentDialog);
            // var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            // var dialog = this.currentDialog.get(0).children[0].dialog;
            // var nextDialog = (this.currentDialog.next().get(0) ? this.currentDialog.next().get(0).children[0].dialog : undefined);
            // if(nextDialog)
            // {
            //     var nextIndex = parentDialog.children.indexOf(nextDialog);
            //     var currentIndex = parentDialog.children.indexOf(dialog);
            //
            //     var temp = parentDialog.children[nextIndex];
            //     parentDialog.children[nextIndex] = dialog;
            //     parentDialog.children[currentIndex] = temp;
            //
            //     //실제 엘리먼트들도 바꾼다.
            //     this.currentDialog.insertAfter(this.currentDialog.next());
            //
            //     instance.setDirty(true);
            // }

            // $rootScope.$broadcast('simulator-build');

            this.closeMenu();
        };

        var checkUniqueName = function(name, dialogs)
        {
            for(var i=0; i<dialogs.length; i++)
            {
                if(dialogs[i].name == name)
                {
                    return false;
                }
                else if(dialogs[i].children)
                {
                    if(!checkUniqueName(name, dialogs[i].children))
                    {
                        return false;
                    }
                }
            }

            return true;
        };

        var changeCloneInfo = function (dialog)
        {
            var postfix = '';
            while(!checkUniqueName((dialog.name + (postfix += '-Clone')), instance.userDialogs));

            dialog.name = dialog.name + postfix;
            dialog.id += postfix;
            if(dialog.children)
            {
                for(var i = 0; i < dialog.children.length; i++)
                {
                    changeCloneInfo(dialog.children[i]);
                }
            }
        };

        Menu.prototype.duplicate = function()
        {
            var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            var dialog = this.currentDialog.get(0).children[0].dialog;
            var index = -1;

            for(var i=0; i<parentDialog.children.length; i++)
            {
                if(parentDialog.children[i].id == dialog.id)
                {
                    index = i;
                    break;
                }
            }

            var clone = JSON.parse(JSON.stringify(dialog));

            changeCloneInfo(clone);

            instance.createDialogId(clone);
            instance.addChildDialog(parentDialog, clone, index + 1);

            instance.refresh();
            instance.setDirty(true);
            instance.focusById(clone.id);

            this.closeMenu();
        };

        Menu.prototype.duplicatecard = function()
        {
            var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            var dialog = this.currentDialog.get(0).children[0].dialog;

            var clone = JSON.parse(JSON.stringify(dialog));

            changeCloneInfo(clone);

            delete clone.children;

            var index = parentDialog.children.indexOf(dialog);
            instance.createDialogId(clone);
            instance.addChildDialog(parentDialog, clone, index + 1);

            instance.refresh();
            instance.setDirty(true);
            instance.focusById(clone.id);

            this.closeMenu();
        };

        Menu.prototype.delete = function()
        {
            instance.deleteDialog(this.currentDialog, false);
            this.closeMenu();
        };

        Menu.prototype.deletecard = function()
        {
            instance.deleteDialog(this.currentDialog, true);
            this.closeMenu();
        };

        Menu.prototype.addMenu = function(name, callback)
        {
            this.menus[name] = callback;
        };

        Menu.prototype.openMenu = function(e, dialog)
        {
            if(this.isOpened)
            {
                this.closeMenu();
            }
            else
            {
                this.isOpened = true;

                var dialogCard = e.currentTarget.parentElement.parentElement;
                var left = dialogCard.offsetLeft + dialogCard.offsetWidth - 20;
                var top = dialogCard.offsetTop;

                this.setCurrentDialog(dialog);

                var graphbody = angular.element('.graph-body').get(0);

                angular.element('.dialog-menu').css('left', left + 'px').css('top', top + 'px').show();

                var menuDialog = angular.element('.dialog-menu').get(0);

                // -30은 스크롤바
                if(left + menuDialog.offsetWidth > graphbody.offsetWidth - 30)
                {
                    angular.element('.dialog-menu').css('left', graphbody.offsetWidth - menuDialog.offsetWidth - 30 + 'px');
                }

                if(top + menuDialog.offsetHeight > graphbody.offsetHeight + graphbody.scrollTop - 30)
                {
                    angular.element('.dialog-menu').css('top', top + (graphbody.offsetHeight + graphbody.scrollTop - (top + menuDialog.offsetHeight)) + 'px');
                }
            }

            e.preventDefault();
            e.stopPropagation();
        };

        Menu.prototype.closeMenu = function(e)
        {
            if(!this.isOpened)
                return;

            this.isOpened = false;
            menuInstance.setCurrentDialog(undefined);
            angular.element('.dialog-menu').hide();

            if(e)
            {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        if(!menuInstance)
            menuInstance = new Menu();









        var DialogGraph = function()
        {
            this.graphData = undefined;
            this.template = undefined;
            this.canvas = undefined;
            this.editor = undefined;

            this.commonDialogs = undefined;
            this.userDialogs = undefined;

            this.$compile = undefined;
            this.$scope = undefined;
            this.$rootScope = undefined;

            this.history = [];

            this.focusedTarget = undefined;
            this.testFocusedTarget = undefined;

            this.dirtyCallback = undefined;

            this.fileName = undefined;

            this.focusedDialog = undefined;
            this.idList = {};

            this.onLoadCallback = undefined;

            this.dirty = false;

            this.mode = 'dialog';

            this.isFocused = true;
        };

        DialogGraph.prototype.getCommonDialogs = function()
        {
            return this.commonDialogs;
        };

        DialogGraph.prototype.getUserDialogs = function()
        {
            return this.userDialogs;
        };

        DialogGraph.prototype.setScope = function($compile, $scope, $rootScope)
        {
            this.$compile = $compile;
            this.$scope = $scope;
            this.$rootScope = $rootScope;

            var that = this;
            //역시나 아름답지 않지만..
            $scope.$on('focusToDialogGraph', function()
            {
                console.dir(that.focusedTarget);
                // that.focusById(that.focusedTarget.dialog.id);
            });

            $scope.$on('saveDialogGraph', function()
            {
            });

            $scope.$on('dialogGraphTestFocus', function(context, dialogId)
            {
                that.testFocus(dialogId);
            });
        };

        DialogGraph.prototype.setEditor = function(editor)
        {
            this.editor = editor;
        };

        DialogGraph.prototype.setDialogTemplate = function(template)
        {
            this.template = template;
        };

        DialogGraph.prototype.setCanvas = function(selector)
        {
            this.canvas = angular.element(selector);
            this.makeCanvasDraggable();
            this.bindKeyboardEventToCanvas();
        };

        DialogGraph.prototype.makeCanvasDraggable = function()
        {
            var prevLocation = undefined;
            var isDragStart = false;
            var canvas = this.canvas.get(0);
            var graphBody = canvas.parentElement;

            angular.element('.graph-body').on('click' ,function()
            {
                // that.editor.close();
            });

            canvas.addEventListener('click', function(e)
            {
                // that.editor.close();
            });

            canvas.parentElement.addEventListener('mousedown', function(e)
            {
                if(e.which != 1)
                    return;

                menuInstance.closeMenu(e);

                e.preventDefault();
            });

            window.addEventListener('mouseup', function(e)
            {
                isDragStart = false;
                canvas.style.cursor = 'default';
                prevLocation = undefined;
            });

            canvas.addEventListener('mousedown', function(e)
            {
                if(e.which != 1)
                    return;

                menuInstance.closeMenu(e);

                isDragStart = true;
                e.preventDefault();
            });

            canvas.addEventListener('mousemove', function(e)
            {
                if(isDragStart)
                {
                    canvas.style.cursor = 'all-scroll';

                    if(!prevLocation)
                    {
                        prevLocation = { x: e.pageX, y: e.pageY };
                    }
                    else
                    {
                        var x = e.pageX - prevLocation.x;
                        var y = e.pageY - prevLocation.y;

                        if(0 <= graphBody.scrollTop - y && graphBody.scrollTop - y <= graphBody.scrollHeight)
                            graphBody.scrollTop = graphBody.scrollTop - y;

                        if(0 <= graphBody.scrollLeft - x && graphBody.scrollLeft - x <= graphBody.scrollWidth)
                            graphBody.scrollLeft = graphBody.scrollLeft - x;

                        prevLocation = { x: e.pageX, y: e.pageY };
                    }

                    e.preventDefault();
                }
            });

            canvas.addEventListener('mouseup', function(e)
            {
                isDragStart = false;
                canvas.style.cursor = 'default';
                prevLocation = undefined;
                e.preventDefault();
            });
        };

        DialogGraph.prototype.moveUpDialog = function(target)
        {
            var parentDialog = target.parent().prev().get(0).dialog;
            var dialog = target.get(0).children[0].dialog;
            var prevDialog = (target.prev().get(0) ? target.prev().get(0).children[0].dialog : undefined);
            if(prevDialog)
            {
                var prevIndex = parentDialog.children.indexOf(prevDialog);
                var currentIndex = parentDialog.children.indexOf(dialog);

                var temp = parentDialog.children[prevIndex];
                parentDialog.children[prevIndex] = dialog;
                parentDialog.children[currentIndex] = temp;

                //실제 엘리먼트들도 바꾼다.
                target.insertBefore(target.prev());

                this.setDirty(true);
                this.refreshLine();
            }
        };

        DialogGraph.prototype.moveDownDialog = function(target)
        {
            var parentDialog = target.parent().prev().get(0).dialog;
            var dialog = target.get(0).children[0].dialog;
            var nextDialog = (target.next().get(0) ? target.next().get(0).children[0].dialog : undefined);
            if(nextDialog)
            {
                var nextIndex = parentDialog.children.indexOf(nextDialog);
                var currentIndex = parentDialog.children.indexOf(dialog);

                var temp = parentDialog.children[nextIndex];
                parentDialog.children[nextIndex] = dialog;
                parentDialog.children[currentIndex] = temp;

                //실제 엘리먼트들도 바꾼다.
                target.insertAfter(target.next());

                this.setDirty(true);
                this.refreshLine();
            }
        };

        DialogGraph.prototype.deleteFocusedDialog = function()
        {
            this.deleteDialog(angular.element('#' + this.focusedDialog));
        };

        DialogGraph.prototype.deleteDialogById = function(id, saveHistory, isEditorClose)
        {
            if(id)
            {
                var target = angular.element('#' + id);
                if(target.length > 0)
                {
                    this.deleteDialog(angular.element('#' + id), null, saveHistory, isEditorClose);
                }
            }
        };

        DialogGraph.prototype.deleteDialog = function(target, withChildren, saveHistory, isEditorClose)
        {
            var parentDialog = target.parent().prev().get(0);
            if(parentDialog)
            {
                parentDialog = target.parent().prev().get(0).dialog;
            }
            else
            {
                alert(this.$scope.lan('Start cards can not be deleted'));
                return;
            }

            var dialog = target.get(0).children[0].dialog;

            var prev = target.prev().get(0);
            var next = target.next().get(0);

            var afterFocusId = '';
            if(prev)
            {
                afterFocusId = prev.children[0].dialog.id;
            }
            else if(next && next.children[0])
            {
                afterFocusId = next.children[0].dialog.id;
            }
            else
            {
                afterFocusId = parentDialog.id;
            }

            if(parentDialog.children)
            {
                var index = parentDialog.children.indexOf(dialog);
                if(index != -1)
                {
                    parentDialog.children.splice(index, 1);

                    if(withChildren && dialog.children.length > 0)
                    {
                        for(var i=0; i<dialog.children.length; i++)
                        {
                            parentDialog.children.splice(index, 0, dialog.children[i]);
                        }

                        afterFocusId = dialog.children[0].id;
                    }

                    instance.setDirty(true, this.fileName, saveHistory);
                }
            }

            instance.focusedDialog = null;
            instance.refresh();
            instance.focusById(afterFocusId);

            if(this.editor.focusId != dialog.id && isEditorClose !== false)
            {
                //수정창 열어논 상태에서 삭제 해버렸을경우 닫기 위함.
                this.editor.close(false);
            }
        };

        DialogGraph.prototype.bindKeyboardEventToCanvas = function()
        {
            var that = this;
            window.addEventListener('keydown', function(e)
            {
                if(location.href.indexOf('/playchat/development/dialog-graph') == -1 || angular.element('.dialog-graph-code-editor').is(':visible') == true)
                    return;

                console.log('야 : ', that.editor.isOpen);
                if(that.editor.isOpen)
                {
                    //에디터로 포커스 이동되어있을때
                    if(e.keyCode == 27)
                    {
                        that.editor.close();
                    }
                    else if((e.metaKey || e.ctrlKey) && e.keyCode == 13)
                    {
                        if(e.target && e.target.className == 'editable')
                        {
                            e.target.blur();
                            that.$rootScope.$broadcast('saveDialogGraphEditor');
                        }
                    }

                    return;
                }
                else if(that.editor.isOpen === false && that.isFocused)
                {
                    if(e.keyCode == 27)
                    {
                        that.editor.close();
                    }
                    else if(e.keyCode == 39) // right
                    {
                        if(e.ctrlKey || e.metaKey)
                        {

                        }
                        else if(e.altKey)
                        {
                            var next = angular.element('#' + that.$scope.currentTabName.replace(/\./gi, '\\.')).next();
                            if(next.length == 1)
                            {
                                var id = next.attr('id').replace(/\./gi, '\\\\.');

                                that.$scope.selectTab({ currentTarget: '#' + id}, next.attr('id'));

                                that.$scope.currentTabName = next.attr('id');
                            }
                        }
                        else
                        {
                            if(that.focusedTarget.nextElementSibling && that.focusedTarget.nextElementSibling.children.length > 0)
                            {
                                if(that.focusedTarget.nextElementSibling.children[0].className.indexOf('plus') != -1)
                                {
                                    // that.focus(that.focusedTarget.nextElementSibling.children[0]);
                                }
                                else
                                {
                                    that.focus(that.focusedTarget.nextElementSibling.children[0].children[0]);
                                }
                            }
                        }

                        e.preventDefault();
                    }
                    else if(e.keyCode == 40) // down
                    {
                        if(e.ctrlKey || e.metaKey)
                        {
                            that.moveDownDialog(angular.element(that.focusedTarget.parentElement));
                        }
                        else
                        {
                            if(that.focusedTarget.parentElement.nextElementSibling)
                            {
                                if(that.focusedTarget.parentElement.nextElementSibling.className.indexOf('plus') != -1)
                                {
                                    if(that.focusedTarget.parentElement.parentElement.parentElement.nextElementSibling)
                                    {
                                        var parent = that.focusedTarget.parentElement.parentElement.parentElement;
                                        var target = undefined;
                                        do
                                        {
                                            parent = parent.nextElementSibling;
                                            if(parent.children.length <= 1)
                                                return;

                                            target = parent.children[1].children.length > 1 ? parent.children[1].children[0] : undefined;

                                        } while(!target);

                                        that.focus(target.children[0]);
                                    }

                                    // that.focus(that.focusedTarget.parentElement.nextElementSibling);
                                }
                                else
                                {
                                    that.focus(that.focusedTarget.parentElement.nextElementSibling.children[0]);
                                }
                            }
                        }

                        e.preventDefault();
                    }
                    else if(e.keyCode == 37) // left
                    {
                        if(e.ctrlKey || e.metaKey)
                        {

                        }
                        else if(e.altKey)
                        {
                            var prev = angular.element('#' + that.$scope.currentTabName.replace(/\./gi, '\\.')).prev();
                            var id = prev.attr('id').replace(/\./gi, '\\\\.');

                            that.$scope.selectTab({ currentTarget: '#' + id}, prev.attr('id'));

                            that.$scope.currentTabName = prev.attr('id');
                        }
                        else
                        {
                            if (that.focusedTarget.className.indexOf('plus') != -1)
                            {
                                // that.focus(that.focusedTarget.parentElement.previousElementSibling);
                            }
                            else if (that.focusedTarget.parentElement.parentElement.previousElementSibling)
                            {
                                that.focus(that.focusedTarget.parentElement.parentElement.previousElementSibling);
                            }
                        }

                        e.preventDefault();
                    }
                    else if(e.keyCode == 38) // up
                    {
                        if(e.ctrlKey || e.metaKey)
                        {
                            that.moveUpDialog(angular.element(that.focusedTarget.parentElement));
                        }
                        else
                        {
                            if(that.focusedTarget.className.indexOf('plus') != -1)
                            {
                                // that.focus(that.focusedTarget.previousElementSibling.children[0]);
                            }
                            else if(that.focusedTarget.parentElement.previousElementSibling)
                            {
                                if(that.focusedTarget.parentElement.previousElementSibling.nodeName == 'DIV')
                                {
                                    that.focus(that.focusedTarget.parentElement.previousElementSibling.children[0]);
                                }
                            }
                            else
                            {
                                if(that.focusedTarget.parentElement.parentElement.parentElement.previousElementSibling)
                                {
                                    var parent = that.focusedTarget.parentElement.parentElement.parentElement;
                                    var target = undefined;
                                    do
                                    {
                                        parent = parent.previousElementSibling;
                                        if(!parent || parent.children.length <= 1)
                                            return;

                                        target = parent.children[1].children.length > 1 ? parent.children[1].children[parent.children[1].children.length-2] : undefined;

                                    } while(!target);

                                    that.focus(target.children[0]);
                                }
                            }
                        }

                        e.preventDefault();
                    }
                    else if(e.keyCode == 13)
                    {
                        if(e.srcElement.id != 'search')
                        {
                            //ENTER
                            var parent = that.focusedTarget.parentElement.parentElement.parentElement.children[0];
                            var dialog = that.focusedTarget.dialog;

                            that.editor.open(parent ? parent.dialog : undefined, dialog);

                            e.preventDefault();
                        }
                    }
                    else if(e.keyCode == 45)
                    {
                        //INSERT
                        if(e.shiftKey)
                        {
                            var parent = that.focusedTarget.parentElement.parentElement.parentElement.children[0];
                            that.editor.open(parent.dialog, null);
                        }
                        else
                        {
                            that.editor.open(that.focusedTarget.dialog, null);
                        }
                    }
                    else if(e.keyCode == 46)
                    {
                        //DEL
                        that.deleteDialog(angular.element(that.focusedTarget.parentElement));
                    }
                    else if(e.keyCode == 32)
                    {
                        var target = that.focusedTarget.nextElementSibling;
                        that.toggleChild(target);
                    }
                    else if(e.keyCode == 83 && (e.metaKey || e.ctrlKey))
                    {
                        that.$scope.save();

                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if(e.keyCode == 90 && (e.metaKey || e.ctrlKey))
                    {
                        if(e.shiftKey)
                        {
                            that.$scope.redo();
                        }
                        else
                        {
                            that.$scope.undo();
                        }

                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if(e.keyCode == 186 && e.shiftKey)
                    {
                        angular.element('#search').focus();

                        e.preventDefault();
                        e.stopPropagation();
                    }
                    else if(e.keyCode == 9 || e.keyCode == 36 || e.keyCode == 35)
                    {
                        e.preventDefault();
                    }
                }
            });
        };

        DialogGraph.prototype.removeInitialDialog = function(dialogs)
        {
            for(var i=0; i<dialogs.length; i++)
            {
                if(dialogs[i].input.length == 1 && dialogs[i].input[0].text && !dialogs[i].input[0].text.raw.trim())
                {
                    dialogs.splice(i, 1);
                    i--;
                }

                if(dialogs[i] && dialogs[i].children)
                {
                    this.removeInitialDialog(dialogs[i].children);
                }
            }
        };

        DialogGraph.prototype.loadFromFile = function(data, fileName)
        {
            this.dirty = false;
            this.focusedDialog = undefined;

            if(fileName)
            {
                this.fileName = fileName;
            }

            if(!this.template)
            {
                throw new Error('[DialogGraph] Template is undefined');
            }

            try
            {
                this.commonDialogs = data.commonDialogs;

                var startDialog = this.commonDialogs[0];
                if(!startDialog)
                {
                    startDialog = { name: 'Default Start Dialog', input: [{ text: 'Default' }], output: { kind: 'Content', text: 'Hello World!' }};
                }

                startDialog.children = this.userDialogs = data.dialogs;
                this.graphData = startDialog;
                this.startDialog = startDialog;

                this.removeInitialDialog(this.userDialogs);

                this.refresh();
                this.onLoad();

                return true;
            }
            catch(err)
            {
                console.error(err.stack);
            }

            return false;
        };

        DialogGraph.prototype.changeToCommonDialogs = function()
        {
            if(this.commonDialogs.length > 1)
            {
                this.commonDialogs[0].children = [];

                for(var i=1; i<this.commonDialogs.length; i++)
                {
                    this.commonDialogs[0].children.push(this.commonDialogs[i]);
                }

                this.mode = 'common';
            }

            this.refresh();
        };

        DialogGraph.prototype.changeToDialogs = function()
        {
            this.mode = 'dialog';
            this.graphData.children = this.userDialogs;
            this.refresh();
        };

        DialogGraph.prototype.getAllUserDialogs = function(dialogs)
        {
            if(!dialogs)
                dialogs = this.userDialogs;

            var list = [];
            for(var i=0; i<dialogs.length; i++)
            {
                list.push(dialogs[i]);
                if(dialogs[i].children)
                {
                    var children = this.getAllUserDialogs(dialogs[i].children);
                    for(var j=0; j<children.length; j++)
                    {
                        list.push(children[j]);
                    }
                }
            }

            return list;
        };

        DialogGraph.prototype.drawDialogs = function(parent, list)
        {
            for(var i=0, l=list.length; i<l; i++)
            {
                var dialog = list[i];
                this.drawDialog(parent, dialog);
            }

            //plus 버튼을 여기서 붙여주면..
            if(this.$scope.myBotAuth.edit)
            {
                this.addPlusButton(parent);
            }
        };

        DialogGraph.prototype.addPlusButton = function(parent, style)
        {
            var button = angular.element('<button type="button" class="plus"' + (style ? style : '') + '>' + this.$scope.lan('Add') + '</button>');

            var target = parent.get(0).children[parent.get(0).children.length-1];

            parent.append(button);

            if(target)
            {
                var diff = button[0].offsetTop - target.children[0].offsetTop - target.children[0].offsetHeight - 10;
                if(diff > 50)
                {
                    button[0].style.top = -(button[0].offsetTop - target.offsetTop) + (target.children[0].offsetHeight + button[0].offsetHeight) + 'px';
                    button[0].style.position = 'relative';
                    button[0].setAttribute('data-diff', diff);
                }
            }

            var that = this;
            button.on('click', function(e)
            {
                that.editor.open(parent.parent().find('.graph-dialog-item').get(0).dialog, null);
                e.stopPropagation();
            });
        };

        var makeInputTemplate = function(input)
        {
            var template = '';

            if(typeof input == 'string')
            {
                template = '<span class="graph-dialog-input-span" data-key="text" data-content="' + input + '">' + input + '</span>';
            }
            else
            {
                for(var key in input)
                {
                    var displayText = '';
                    if(key == 'entities')
                    {
                        displayText = '@' + input[key];
                    }
                    else if(key == 'intent')
                    {
                        displayText = '#' + input[key];
                    }
                    else if(key == 'types')
                    {
                        displayText = '$' + input[key];
                    }
                    else if(key == 'regexp')
                    {
                        displayText = input[key];
                    }
                    else if(key == 'text' && input[key].raw.trim())
                    {
                        displayText = input[key].raw;
                    }
                    else if(key == 'if')
                    {
                        displayText = 'if(' + input[key].replace(/[\n\r]*/gi, '').trim() + ')';
                    }

                    if(displayText)
                    {
                        template += '<span class="graph-dialog-input-span" data-content="' + input[key] + '">' + displayText + '</span>';
                        break;
                    }
                }
            }

            return template;
        };

        var makeOutputTemplate = function(output)
        {
            if(output.text)
            {
                var template = '<div>';

                template += '<div>' + output.text.replace(/\n/gi, '<br/>') + '</div>';

                if(output.kind == 'Action')
                {
                    template += '<div><span>[' + output.type + ']' + (output.dialogName ? ' ' + output.dialogName : '') + '</span></div>';
                }

                template += '</div>';

                return template;
            }
            else
            {
                var template = '';

                if(output.kind == 'Action')
                {
                    template = '<div><span>[' + output.type + ']' + (output.dialogName ? ' ' + output.dialogName : '') + '</span></div>';
                }

                if(output.options)
                {
                    if(typeof output.options == 'object')
                    {
                        template += '<div><span>' + JSON.stringify(output.options) + '</span></div>';
                    }
                    else if(typeof output.options == 'string')
                    {
                        template += '<div><span>[options] ' + output.options + '</span></div>';
                    }
                    else if(typeof output.options.output == 'string')
                    {
                        template += '<div><span>' + output.options.output + '</span></div>';
                    }
                    else if(typeof output.options.output != 'string')
                    {
                        console.log('텍스트가 아닙니다 : ', output, typeof output.options.output);
                    }
                }

                if(!template)
                    console.log('나머지 : ', output);

                return template;
            }
        };

        var makeButtonsTemplate = function(buttons)
        {
            var template = '';

            for(var i=0; i<buttons.length; i++)
            {
                if(buttons[i].url)
                {
                    template = '<div style="border-bottom:solid 1px #b1dbf4; text-align: center;color: #038eda;font-weight:600; height: 35px;"><a href="' + buttons[i].url + '" target="_blank" style="color: #038eda;">#' + buttons[i].text + '</a></div>' + template;
                }
                else
                {
                    template += '<div style="border-bottom:solid 1px #b1dbf4; text-align: center;color: #038eda;font-weight:600;">' + buttons[i].text + '</div>';
                }
            };

            return '<div class="graph-dialog-buttons"> ' + template + ' </div>';
        };

        var makeDialogDraggable = function(item)
        {
            var graphBody = angular.element('.graph-body').get(0);

            var clone = undefined;
            var line = document.createElement('div');
            line.className = 'graph-dialog-line';

            var parent = undefined;

            var startX = undefined;
            var startY = undefined;
            var prevX = undefined;
            var prevY = undefined;

            var dragStart = false;
            item.addEventListener('mousedown', function(e)
            {
                instance.focusById(item.dialog.id);
                if(e.which != 1 || dragStart)
                    return;

                parent = item.parentElement.parentElement;

                if(parent.id == 'graphDialogCanvas')
                    return;

                dragStart = true;

                clone = item.cloneNode(true);
                clone.origin = item;
                clone.style.opacity = 0.8;
                clone.style.position = 'absolute';
                clone.style.pointerEvents = 'none';
                angular.element(clone).find('.graph-fold').remove();

                var left = angular.element('.playchat-background .gnb+div').get(0).offsetLeft;
                var top = graphBody.offsetTop;
                var scrollTop = graphBody.scrollTop;
                var scrollLeft = graphBody.scrollLeft;

                clone.style.left = e.pageX - left - 50 + scrollLeft + 'px';
                clone.style.top = e.pageY - top - 63 - 30 + scrollTop + 'px';

                startX = e.pageX;
                startY = e.pageY;

                e.stopPropagation();
            });

            window.addEventListener('mousemove', function(e)
            {
                if(!dragStart)
                    return;

                prevX = e.clientX;
                prevY = e.clientY;

                if(Math.abs(startX - e.pageX) < 10 && Math.abs(startY - e.pageY) < 10)
                {
                    return;
                }

                if(!clone.parentElement)
                {
                    angular.element('#graphDialogCanvas').append(clone);
                }

                var left = angular.element('.playchat-background .gnb+div').get(0).offsetLeft;
                var top = angular.element('.graph-body').get(0).offsetTop;

                // var target = document.elementFromPoint(e.clientX, e.clientY);
                //
                // while(target && !target.dialog)
                // {
                //     target = target.parentElement;
                // }
                //
                // if(target && target.parentElement.parentElement == parent)
                // {
                //     target.parentElement.insertBefore(line, target);
                //
                //     line.style.top = target.offsetTop - 10 + 'px';
                //     line.style.left = target.offsetLeft + 'px';
                // }

                var min = -1;
                var minTarget = undefined;
                var siblings = item.parentElement.parentElement.children;
                for(var i=0; i<siblings.length; i++)
                {
                    if(!siblings[i].children[0])
                        continue;

                    var compareTarget = angular.element(siblings[i]).find('.graph-dialog-item').get(0);

                    var rect = compareTarget.getBoundingClientRect();
                    var half = rect.top + (rect.bottom - rect.top) / 2;

                    if(!minTarget || min > Math.abs(half - e.clientY))
                    {
                        min = Math.abs(half - e.clientY);
                        minTarget = compareTarget;
                    }
                }

                minTarget.parentElement.insertBefore(line, minTarget);

                if(angular.element(minTarget).parent().next().attr('class') == 'plus')
                {
                    var rect = minTarget.getBoundingClientRect();
                    var half = rect.top + (rect.bottom - rect.top) / 2;

                    if(half < e.clientY)
                    {
                        line.style.top = minTarget.offsetTop + minTarget.offsetHeight + 10 + 'px';
                        line.isLast = true;
                    }
                    else
                    {
                        line.style.top = minTarget.offsetTop - 10 + 'px';
                        line.isLast = false;
                    }
                }
                else
                {
                    line.style.top = minTarget.offsetTop - 10 + 'px';
                    line.isLast = false;
                }

                line.style.left = minTarget.offsetLeft + 'px';

                var scrollTop = graphBody.scrollTop;
                var scrollLeft = graphBody.scrollLeft;

                clone.style.left = e.pageX - left - 50 + scrollLeft + 'px';
                clone.style.top = e.pageY - top - 63 - 30 + scrollTop + 'px';

                e.stopPropagation();
            });

            window.addEventListener('mouseup', function(e)
            {
                if(dragStart)
                {
                    if(clone.parentElement)
                    {
                        var change = false;
                        if(clone.origin.parentElement != line.parentElement)
                        {
                            var children = line.parentElement.parentElement.previousElementSibling.dialog.children;

                            //먼저 children에서 index를 빼고
                            var index = children.indexOf(clone.origin.dialog);

                            var prev = clone.origin.parentElement.previousElementSibling;
                            if(line.isLast)
                            {
                                line.parentElement.parentElement.appendChild(clone.origin.parentElement);
                            }
                            else
                            {
                                line.parentElement.parentElement.insertBefore(clone.origin.parentElement, line.parentElement);
                            }

                            change = prev != clone.origin.parentElement.previousElementSibling;

                            if(change)
                            {
                                var source = children.splice(index, 1);

                                var targetIndex = children.indexOf(line.nextElementSibling.dialog);

                                if(line.isLast)
                                {
                                    children.push(source[0]);
                                }
                                else
                                {
                                    children.splice(targetIndex, 0, source[0]);
                                }
                            }
                        }

                        clone.parentElement.removeChild(clone);
                        line.parentElement.removeChild(line);

                        if(change)
                        {
                            var scrollTop = graphBody.scrollTop;
                            instance.setDirty(true);
                            instance.refresh();

                            graphBody.scrollTop = scrollTop;

                            if(instance.$scope.compactMode != 'Compact')
                            {
                                instance.$scope.compactMode = 'Compact';
                                instance.$scope.toggleCompactMode();
                            }
                        }
                    }

                    dragStart = false;
                    e.stopPropagation();
                }
            });
        };

        DialogGraph.prototype.reloadDialog = function(dialog)
        {
            var t = this.template.replace(/{id}/gi, dialog.id).replace('{name}', dialog.name);

            var inputTemplate = '';
            var taskTemplate = '';
            var outputTemplate = '';
            var imageTemplate = '';
            var buttonTemplate = '';

            if(typeof dialog.input == 'object' && dialog.input.length)
            {
                //or
                for(var i=0; i<dialog.input.length; i++)
                {
                    var input = dialog.input[i];
                    inputTemplate += '<div>' + makeInputTemplate(input) + '</div>';
                }
            }
            else
            {
                // 예전 그래프에 input이 리스트가 아닌것도 있었다.
                inputTemplate = '<div>' + makeInputTemplate(dialog.input) + '</div>';
            }

            if(dialog.task && dialog.task.name)
            {
                taskTemplate = '<div class="graph-dialog-input"><div style="font-weight: bold; font-style: italic; text-align: center;">' + dialog.task.name + '</div></div>';
            }

            if(typeof dialog.output == 'object')
            {
                if(dialog.output.length)
                {
                    for(var i=0; i<dialog.output.length; i++)
                    {
                        var output = dialog.output[i];

                        if(output.kind == 'Text')
                        {
                            outputTemplate += '<div>' + output.text + '</div>';
                        }
                        else
                        {
                            outputTemplate += makeOutputTemplate(output);
                        }

                        if(output.image)
                        {
                            imageTemplate += '<img src="' + output.image.url + '" style="max-width: 100%; margin-top: 5px;">';
                        }

                        if(dialog.output[i].buttons && dialog.output[i].buttons.length > 0)
                        {
                            buttonTemplate = makeButtonsTemplate(dialog.output[i].buttons);
                        }

                        break;
                    }
                }
                else
                {
                    outputTemplate = makeOutputTemplate(dialog.output);
                    if(dialog.output.image)
                    {
                        imageTemplate += '<img src="' + dialog.output.image.url + '" style="max-width: 100%; margin-top: 5px;">';
                    }

                    if(dialog.output.buttons && dialog.output.buttons.length > 0)
                    {
                        buttonTemplate = makeButtonsTemplate(dialog.output.buttons);
                    }
                }
            }
            else
            {
                outputTemplate = makeOutputTemplate(dialog.output);
                if(dialog.output.image)
                {
                    imageTemplate += '<img src="' + dialog.output.image.url + '" style="max-width: 100%; margin-top: 5px;">';
                }
            }

            if(imageTemplate)
            {
                imageTemplate = '<div class="graph-dialog-image">' + imageTemplate + '</div>';
            }

            t = t.replace('{input}', inputTemplate).replace('{task}', taskTemplate).replace('{output}', outputTemplate).replace('{image}', imageTemplate).replace('{buttons}', buttonTemplate);
            t = angular.element(this.$compile(t)(this.$scope));

            var that = this;
            t.find('.graph-dialog-image img').on('load', function()
            {
                that.refreshLine();
            });

            if(!dialog.children || dialog.children.length == 0)
            {
                t.find('.graph-fold').hide();
            }

            makeDialogDraggable(t.find('.graph-dialog-item').get(0));

            var itemElement = t.find('.graph-dialog-item').get(0);

            var parent = angular.element(this.canvas).find('#' + dialog.id).get(0);

            for(var key in dialog)
            {
                parent.children[0].dialog[key] = dialog[key];
            }

            itemElement.dialog = parent.children[0].dialog;

            parent.replaceChild(itemElement, parent.children[0]);

            // var parentDialog = parent.parentElement.parentElement.children[0].dialog;
            // if(parentDialog && parentDialog.children)
            // {
            //     for(var i=0; i<parentDialog.children.length; i++)
            //     {
            //         if(parentDialog.children[i].id == dialog.id)
            //         {
            //             for(var key in dialog)
            //             {
            //                 if(key != 'children')
            //                 {
            //                     parentDialog.children[i][key] = dialog[key];
            //                 }
            //             }
            //
            //             break;
            //         }
            //     }
            // }
            // else if(dialog.id == 'startDialog')
            // {
            //     for(var key in dialog)
            //     {
            //         if(key != 'id' && key != 'children')
            //         {
            //             this.startDialog[key] = dialog[key];
            //         }
            //     }
            // }

            this.bindDialogFunctions(angular.element(parent));

            this.setFoldButtonPosition(this.canvas.find('.graph-dialog-item .graph-fold'));

            this.focusById(dialog.id);
        };

        DialogGraph.prototype.createDialogId = function(dialog)
        {
            var prefix = this.fileName.split('.')[0];
            var number = 0;
            while(this.idList[number])
            {
                number++;
            }

            dialog.id = prefix + number;
        };

        DialogGraph.prototype.drawDialog = function(parent, dialog)
        {
            if(!dialog.id)
            {
                this.createDialogId(dialog);
            }

            var prefix = this.fileName.split('.')[0];
            this.idList[dialog.id.replace(prefix, '')] = true;
            var t = this.template.replace(/{id}/gi, dialog.id).replace('{name}', dialog.name);

            var inputTemplate = '';
            var taskTemplate = '';
            var outputTemplate = '';
            var imageTemplate = '';
            var buttonTemplate = '';

            if(typeof dialog.input == 'object' && dialog.input.length)
            {
                //or
                for(var i=0; i<dialog.input.length; i++)
                {
                    var input = dialog.input[i];
                    inputTemplate += '<div>' + makeInputTemplate(input) + '</div>';
                }
            }
            else
            {
                // 예전 그래프에 input이 리스트가 아닌것도 있었다.
                inputTemplate = '<div>' + makeInputTemplate(dialog.input) + '</div>';
            }

            if(dialog.task && dialog.task.name)
            {
                taskTemplate = '<div class="graph-dialog-input"><div style="font-weight: bold; font-style: italic; text-align: center;">' + dialog.task.name + '</div></div>';
            }

            if(typeof dialog.output == 'object')
            {
                if(dialog.output.length)
                {
                    for(var i=0; i<dialog.output.length; i++)
                    {
                        var output = dialog.output[i];

                        if(output.kind == 'Text')
                        {
                            outputTemplate += '<div>' + output.text + '</div>';
                        }
                        else
                        {
                            outputTemplate += makeOutputTemplate(output);
                        }

                        if(output.image)
                        {
                            imageTemplate += '<img src="' + output.image.url + '" style="max-width: 100%; margin-top: 5px;">';
                        }

                        if(dialog.output[i].buttons && dialog.output[i].buttons.length > 0)
                        {
                            buttonTemplate = makeButtonsTemplate(dialog.output[i].buttons);
                        }

                        break;
                    }
                }
                else
                {
                    outputTemplate = makeOutputTemplate(dialog.output);

                    if(dialog.output.image)
                    {
                        imageTemplate += '<img src="' + dialog.output.image.url + '" style="max-width: 100%; margin-top: 5px;">';
                    }

                    if(dialog.output.buttons && dialog.output.buttons.length > 0)
                    {
                        buttonTemplate = makeButtonsTemplate(dialog.output.buttons);
                    }
                }
            }
            else
            {
                outputTemplate = makeOutputTemplate(dialog.output);

                if(dialog.output.image)
                {
                    imageTemplate += '<img src="' + dialog.output.image.url + '" style="max-width: 100%; margin-top: 5px;">';
                }
            }

            if(imageTemplate)
            {
                imageTemplate = '<div class="graph-dialog-image">' + imageTemplate + '</div>';
            }


            t = t.replace('{input}', inputTemplate).replace('{task}', taskTemplate).replace('{output}', outputTemplate).replace('{image}', imageTemplate).replace('{buttons}', buttonTemplate);
            t = angular.element(this.$compile(t)(this.$scope));

            var that = this;
            t.find('.graph-dialog-image img').on('load', function()
            {
                that.refreshLine();
            });

            t.find('.graph-dialog-item').get(0).dialog = dialog;

            this.bindDialogFunctions(t);

            makeDialogDraggable(t.find('.graph-dialog-item').get(0));

            var plusButton = parent.children('.plus').get(0);
            if(plusButton)
            {
                t.insertBefore(plusButton);

                var target = t.get(0);
                if(target)
                {
                    plusButton.style.top = '';
                    plusButton.style.position = '';
                    var diff = plusButton.offsetTop - target.children[0].offsetTop - target.children[0].offsetHeight - 10;
                    if(diff > 50)
                    {
                        plusButton.style.top = -(plusButton.offsetTop - target.offsetTop) + (target.children[0].offsetHeight + plusButton.offsetHeight) + 'px';
                        plusButton.style.position = 'relative';
                        plusButton.setAttribute('data-diff', diff);
                    }
                }
            }
            else
            {
                parent.append(t);
            }

            if(!dialog.children || dialog.children.length == 0)
            {
                t.find('.graph-fold').hide();
                var target = t.find('.graph-dialog-item').get(0);

                var half = Math.ceil(target.offsetHeight / 2) + 1.4;
                if(this.$scope.myBotAuth.edit)
                {
                    this.addPlusButton(t.find('.graph-dialog-children'), ' style="margin-left: 0; margin-top: 21.4px"');
                }
            }
            else
            {
                this.drawDialogs(t.find('.graph-dialog-children'), dialog.children);
            }
        };

        DialogGraph.prototype.setFoldButtonPosition = function(list)
        {
            for(var i=0; i<list.length; i++)
            {
                list[i].style.top = '55px';
            }
        };

        DialogGraph.prototype.setPlusButtonPosition = function(list)
        {
            for(var i=0; i<list.length; i++)
            {
                if(!list[i].previousElementSibling)
                {
                    var target = list[i].parentElement.previousElementSibling;
                    var half = (target.offsetHeight / 2);
                    list[i].style.marginTop = (half > 90 ? 90 : half) + 'px';
                }
            }
        };

        DialogGraph.prototype.bindDialogFunctions = function(dialog)
        {
            var that = this;
            dialog.find('.graph-dialog-header:first').on('click', function(e)
            {
                that.focus(this.parentElement);
                e.stopPropagation();
            });

            // dialog.find('.graph-dialog-item').on('dblclick', function(e)
            // {
            //     if(that.$scope.myBotAuth.edit)
            //     {
            //         var parent = e.currentTarget.parentElement.parentElement.previousElementSibling;
            //         that.editor.open(parent ? parent.dialog : undefined, dialog.get(0).children[0].dialog);
            //
            //         e.stopPropagation();
            //     }
            // });

            //헤더, 인풋, 아웃풋 더블 클릭 별로 포커스 다르게
            dialog.find('.graph-dialog-header:first').on('dblclick', function(e)
            {
                if(that.$scope.myBotAuth.edit)
                {
                    var parent = e.currentTarget.parentElement.parentElement.previousElementSibling;
                    that.editor.open(parent ? parent.dialog : undefined, dialog.get(0).children[0].dialog, 'header');

                    e.stopPropagation();
                }
            });

            dialog.find('.graph-dialog-input:first').on('dblclick', function(e)
            {
                if(that.$scope.myBotAuth.edit)
                {
                    var parent = e.currentTarget.parentElement.parentElement.previousElementSibling;
                    that.editor.open(parent ? parent.dialog : undefined, dialog.get(0).children[0].dialog, 'input');

                    e.stopPropagation();
                }
            });

            dialog.find('.graph-dialog-output:first').on('dblclick', function(e)
            {
                if(that.$scope.myBotAuth.edit)
                {
                    var parent = e.currentTarget.parentElement.parentElement.previousElementSibling;
                    that.editor.open(parent ? parent.dialog : undefined, dialog.get(0).children[0].dialog, 'output');

                    e.stopPropagation();
                }
            });


            dialog.find('.dialog-more:first').on('click', function(e)
            {
                that.openMenu(e, dialog);
                e.stopPropagation();
                e.preventDefault();
            }).on('mousedown', function(e)
            {
                e.stopPropagation();
                e.preventDefault();
            });
        };

        DialogGraph.prototype.openMenu = function(e, dialog)
        {
            menuInstance.openMenu(e, dialog);
        };

        var createLine = function(x1, y1, x2, y2)
        {
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#ddd');
            line.setAttribute('stroke-width', '1px');
            line.setAttribute('vector-effect', 'non-scaling-stroke');
            // line.setAttribute('shape-rendering', 'crispEdges');

            return line;
        };

        DialogGraph.prototype.drawHorizontalLineForPlusButton = function(src, dest)
        {
            var half = src.offsetHeight / 2;
            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = dest.offsetTop + dest.offsetHeight / 2;

            var x2 = dest.offsetLeft;
            var y2 = dest.offsetTop + dest.offsetHeight / 2;

            var line = createLine(x1, y1, x2, y2);

            this.svg.appendChild(line);
        };

        DialogGraph.prototype.drawVerticalLineForPlusButton = function(src, dest)
        {
            var x1 = src.offsetLeft + src.offsetWidth / 2;
            var y1 = src.offsetTop + src.offsetHeight;

            var x2 = dest.offsetLeft + dest.offsetWidth / 2;
            var y2 = dest.offsetTop;

            var line = createLine(x1, y1, x2, y2);

            this.svg.appendChild(line);
        };

        DialogGraph.prototype.drawLine = function(src, children)
        {
            var svg = this.svg;

            var srcHalf = (src.offsetHeight / 2);

            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = src.offsetTop + 67;

            for(var i=0, l=children.length; i<l; i++)
            {
                var x2 = undefined;
                var y2 = undefined;

                var dest = children[i].children[0];
                if(!dest)
                {
                    //plus 버튼들.
                    if(i == 0)
                    {
                        //children plus
                        this.drawHorizontalLineForPlusButton(children[i].parentElement.previousElementSibling, children[i]);
                        continue;
                    }
                    else
                    {
                        //sibling plus
                        // 바로 위 다이얼로그에서 세로선 그리는 방법
                        // this.drawVerticalLineForPlusButton(children[i-1].children[0], children[i]);
                        // continue;

                        // 상위 다이얼로그에서 선 그리는 방법.

                        dest = children[i];

                        var destCompareTarget = dest.previousElementSibling.children[0];

                        var destHalf = dest.offsetHeight / 2;

                        x2 = destCompareTarget.offsetLeft;
                        y2 = dest.offsetTop + (destHalf > 90 ? 90 : destHalf);

                        // 세로선.
                        var x1_5 = ((x2 - x1)/2) + x1;
                        var line = createLine(x1_5, y1, x1_5, y2);
                        svg.appendChild(line);

                        // 가로선.
                        line = createLine(x1_5, y2, x2 + 80, y2);
                        svg.appendChild(line);
                    }
                }
                else
                {
                    //일반 다이얼로그
                    x2 = dest.offsetLeft;
                    y2 = dest.offsetTop + 67;

                    if(i == 0)
                    {
                        // 가로선
                        var line = createLine(x1, y1, x2, y2);
                        svg.appendChild(line);
                    }
                    else
                    {
                        // 세로선.
                        var x1_5 = (x2 - x1)/2 + x1;
                        var line = createLine(x1_5, y1, x1_5, y2);
                        svg.appendChild(line);

                        // 가로선.
                        line = createLine(x1_5, y2, x2, y2);
                        svg.appendChild(line);
                        y1 = y2;
                    }
                }
            }
        };

        DialogGraph.prototype.drawLines = function(children)
        {
            this.canvas.find('svg').remove();
            this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.svg.setAttribute('shape-rendering', 'geometricPrecision');

            for(var i=0, l=children.length; i<l; i++)
            {
                var child = children[i];
                if(child.children[1].style.display != 'none')
                    this.drawLine(child.children[0], child.children[1].children);
            }

            this.canvas.prepend(this.svg);
        };

        DialogGraph.prototype.toggleChild = function(child)
        {
            var children = child.parentElement.parentElement.children;
            if(child.style.display == 'none')
            {
                child.style.display = 'inline-block';
                children[children.length-1].style.top = children[children.length-1].previousTop;
                delete children[children.length-1].previousTop;
            }
            else
            {
                children[children.length-1].previousTop = children[children.length-1].style.top;
                children[children.length-1].style.top = '';
                child.style.display = 'none';
            }

            this.drawLines(this.canvas.find('.graph-dialog'));
        };

        DialogGraph.prototype.checkDuplicatedName = function(dialog)
        {
            var check = true;
            this.canvas.find('.graph-dialog-header > span').each(function()
            {
                if(this.innerText == dialog.name && this.parentElement.parentElement.dialog.id != dialog.id)
                {
                    check = false;
                }
            });

            return check;
        };

        DialogGraph.prototype.testFocus = function(target)
        {
            if(target)
            {
                target = angular.element('#' + target).get(0);
                if(target)
                {
                    angular.element('.test-selected').removeClass('test-selected');
                    angular.element(target).children('.graph-dialog-item').addClass('test-selected');

                    this.testFocusedTarget = target.id;

                    this.moveScrollToTarget(target.children[0]);
                }
            }
        };

        DialogGraph.prototype.focus = function(target)
        {
            this.canvas.find('.selected').removeClass('selected');
            angular.element(target).addClass('selected');

            this.focusedTarget = target;

            this.moveScrollToTarget(target);
        };

        DialogGraph.prototype.focusByName = function(name)
        {
            var that = this;
            this.canvas.find('.graph-dialog-header > span').each(function()
            {
                if(this.innerText == name)
                {
                    that.focus(this.parentElement.parentElement);
                    return;
                }
            });
        };

        DialogGraph.prototype.focusById = function(id)
        {
            this.focusedDialog = id;
            this.focus(this.canvas.find('#' + id + ' > .graph-dialog-item').get(0));
        };

        DialogGraph.prototype.openEditorForFocused = function(text)
        {
            this.editor.open(this.canvas.find('#' + this.focusedDialog + ' > .graph-dialog-item').get(0).dialog, null, null, text);
        };

        DialogGraph.prototype.bindDataToEditor = function(data)
        {
            this.editor.bindData(data);
        };

        DialogGraph.prototype.moveScrollToTarget = function(target)
        {
            var canvas = this.canvas.get(0);
            var graphBody = canvas.parentElement;

            // target이 보이는 부분에 있는지 검사.
            var l = target.offsetLeft;
            var r = target.offsetLeft + target.offsetWidth;
            var t = target.offsetTop;
            var b = target.offsetTop + target.offsetHeight;

            var frameLeft = graphBody.scrollLeft;
            var frameRight = frameLeft + graphBody.offsetWidth;
            var frameTop = graphBody.scrollTop;
            var frameBottom = frameTop + graphBody.offsetHeight;

            if(frameLeft > l || r > frameRight || frameRight < l || frameLeft > r)
            {
                // 카드 좌우가 완전히 프레임안으로 들어오지 않았을 경우
                var value = l - target.offsetWidth / 2;
                if(value <= 0)
                {
                    value = 0;
                }
                else if(value + graphBody.offsetWidth > graphBody.scrollWidth)
                {
                    value = graphBody.scrollWidth - graphBody.offsetWidth;
                }

                graphBody.scrollLeft = value;
            }

            if(frameTop > t || b > frameBottom || frameBottom < t || frameTop > b)
            {
                var value = t - target.offsetHeight / 2;
                if(value <= 0)
                {
                    value = 0;
                }
                else if(value + graphBody.offsetHeight > graphBody.scrollHeight)
                {
                    value = graphBody.scrollHeight - graphBody.offsetHeight;
                }

                graphBody.scrollTop = value;
            }
        };

        DialogGraph.prototype.setMenu = function(selector)
        {
            angular.element(selector).find('.dialog-menu-item').each(function()
            {
                this.addEventListener('mousedown' , function(e)
                {
                    e.stopPropagation();
                    e.preventDefault();

                    var dialog = menuInstance.currentDialog.get(0).children[0].dialog;
                    instance.focusById(dialog.id);
                    menuInstance.execute(this.getAttribute('data-name'));
                });
            });
        };

        DialogGraph.prototype.refresh = function()
        {
            if(this.mode == 'common')
            {
                this.idList = {};
                this.canvas.html('');
                this.drawDialog(this.canvas, this.commonDialogs[0]);
                this.drawLines(this.canvas.find('.graph-dialog'));
                if(this.focusedDialog)
                {
                    this.focusById(this.focusedDialog);
                }
                else
                {
                    this.focus(this.canvas.find('.graph-dialog:first .graph-dialog-item')[0]);
                }

                this.setFoldButtonPosition(this.canvas.find('.graph-dialog-item .graph-fold'));
            }
            else
            {
                this.idList = {};
                this.canvas.html('');
                this.drawDialog(this.canvas, this.graphData);
                this.drawLines(this.canvas.find('.graph-dialog'));
                if(this.focusedDialog)
                {
                    this.focusById(this.focusedDialog);
                }
                else
                {
                    this.focus(this.canvas.find('.graph-dialog:first .graph-dialog-item')[0]);
                }

                this.setFoldButtonPosition(this.canvas.find('.graph-dialog-item .graph-fold'));
            }

            this.testFocus(this.testFocusedTarget || this.commonDialogs[0].id);
        };

        DialogGraph.prototype.refreshLine = function()
        {
            this.drawLines(this.canvas.find('.graph-dialog'));
        };

        DialogGraph.prototype.refreshButtonsPosition = function()
        {
            this.setPlusButtonPosition(this.canvas.find('.graph-dialog-children .plus'));
            this.setFoldButtonPosition(this.canvas.find('.graph-dialog-item .graph-fold'));
        };

        DialogGraph.prototype.addChildDialog = function(parent, dialog, index)
        {
            if(!parent.children)
                parent.children = [];

            if(index)
            {
                parent.children.splice(index, 0, dialog);
            }
            else
            {
                parent.children.push(dialog);
            }
        };

        DialogGraph.prototype.getCompleteData = function()
        {
            var children = this.commonDialogs[0].children;
            delete this.commonDialogs[0].children;

            var userDialogsString = JSON.stringify(JSON.parse(angular.toJson(this.userDialogs)), null, 4);
            var commonDialogsString = JSON.stringify(JSON.parse(angular.toJson(this.commonDialogs)), null, 4);

            this.commonDialogs[0].children = children;

            var data = 'var dialogs = ' + userDialogsString + ';\r\n\r\n' + 'var commonDialogs = ' + commonDialogsString + ';\r\n\r\n' + 'module.exports = function(bot)\r\n{\r\n\tbot.setDialogs(dialogs);\r\n\tbot.setCommonDialogs(commonDialogs);\r\n}';
            return data;
        };

        DialogGraph.prototype.setDirty = function(dirty, saveFileName, saveHistory)
        {
            this.dirty = (dirty === undefined ? true : dirty);
            if(this.dirtyCallback)
                this.dirtyCallback(this.dirty);

            if(this.dirty == true)
            {
                this.$rootScope.$broadcast('saveDialogGraph', { saveFileName: saveFileName, saveHistory: saveHistory });
            }
        };

        DialogGraph.prototype.isDirty = function()
        {
            return this.dirty;
        };

        DialogGraph.prototype.setDirtyCallback = function(callback)
        {
            this.dirtyCallback = callback;
        };

        DialogGraph.prototype.onLoad = function(callback)
        {
            if(callback)
            {
                this.onLoadCallback = callback;
            }
            else
            {
                if(this.onLoadCallback)
                    this.onLoadCallback();
            }
        };

        DialogGraph.prototype.removeOnLoad = function()
        {
            this.onLoadCallback = undefined;
        };

        var deleteCircular = function(list)
        {
            for(var index=0; index<list.length; index++)
            {
                var json = list[index];
                for(var key in json)
                {
                    if(typeof json[key] == 'function')
                    {
                        delete json[key];
                    }
                    else if(json[key].length > 0)
                    {
                        for(var i=0; i<json[key].length; i++)
                        {
                            deleteCircular(json[key][i]);
                        }
                    }
                }
            }
        };

        var checkDuplicateName = function(name, list)
        {
            for(var i=0; i<list.length; i++)
            {
                var dialog = list[i];

                if(dialog.name == name)
                {
                    return true;
                }
                else if(dialog.children)
                {
                    if(checkDuplicateName(name, dialog.children))
                    {
                        return true;
                    }
                }
            }

            return false;
        };

        DialogGraph.prototype.getRandomName = function()
        {
            var name = 'New Dialog';

            if(!checkDuplicateName(name, this.userDialogs))
                return name;

            for(var i=1;; i++)
            {
                if(!checkDuplicateName(name + i, this.userDialogs))
                {
                    return name + i;
                }
            }
        };

        if(!instance)
            instance = new DialogGraph();

        return instance;
    });
})();
