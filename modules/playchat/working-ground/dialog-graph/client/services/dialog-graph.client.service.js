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

        Menu.prototype.moveUp = function()
        {
            var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            var dialog = this.currentDialog.get(0).children[0].dialog;
            var prevDialog = (this.currentDialog.prev().get(0) ? this.currentDialog.prev().get(0).children[0].dialog : undefined);
            if(prevDialog)
            {
                var prevIndex = parentDialog.children.indexOf(prevDialog);
                var currentIndex = parentDialog.children.indexOf(dialog);

                var temp = parentDialog.children[prevIndex];
                parentDialog.children[prevIndex] = dialog;
                parentDialog.children[currentIndex] = temp;

                //실제 엘리먼트들도 바꾼다.
                this.currentDialog.insertBefore(this.currentDialog.prev());

                instance.setDirty(true);
            }

            this.closeMenu();
        };

        Menu.prototype.moveDown = function()
        {
            var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            var dialog = this.currentDialog.get(0).children[0].dialog;
            var nextDialog = (this.currentDialog.next().get(0) ? this.currentDialog.next().get(0).children[0].dialog : undefined);
            if(nextDialog)
            {
                var nextIndex = parentDialog.children.indexOf(nextDialog);
                var currentIndex = parentDialog.children.indexOf(dialog);

                var temp = parentDialog.children[nextIndex];
                parentDialog.children[nextIndex] = dialog;
                parentDialog.children[currentIndex] = temp;

                //실제 엘리먼트들도 바꾼다.
                this.currentDialog.insertAfter(this.currentDialog.next());

                instance.setDirty(true);
            }

            this.closeMenu();
        };

        Menu.prototype.duplicate = function()
        {
            var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            var dialog = this.currentDialog.get(0).children[0].dialog;

            var clone = JSON.parse(JSON.stringify(dialog));

            clone.name += ' Clone';

            var index = parentDialog.children.indexOf(dialog);
            instance.addChildDialog(parentDialog, clone, index + 1);

            instance.refresh();
            instance.setDirty(true);
            instance.focusById(clone.id);

            this.closeMenu();
        };

        Menu.prototype.delete = function()
        {
            var parentDialog = this.currentDialog.parent().prev().get(0).dialog;
            var dialog = this.currentDialog.get(0).children[0].dialog;

            var prev = this.currentDialog.prev().get(0);
            var next = this.currentDialog.next().get(0);

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

            var index = parentDialog.children.indexOf(dialog);

            parentDialog.children.splice(index, 1);

            instance.focusedDialog = null;
            instance.refresh();
            instance.setDirty(true);
            instance.focusById(afterFocusId);

            this.closeMenu();
        };

        Menu.prototype.addMenu = function(name, callback)
        {
            this.menus[name] = callback;
        };

        Menu.prototype.openMenu = function(e, dialog)
        {
            this.isOpened = true;

            var dialogCard = e.currentTarget.parentElement.parentElement;
            var left = dialogCard.offsetLeft + dialogCard.offsetWidth - 20;
            var top = dialogCard.offsetTop;

            this.setCurrentDialog(dialog);

            angular.element('.dialog-menu').css('left', left + 'px').css('top', top + 'px').show();

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
            this.originalFileData = undefined;
            this.graphData = undefined;
            this.template = undefined;
            this.canvas = undefined;
            this.editor = undefined;

            this.commonDialogs = undefined;
            this.userDialogs = undefined;

            this.$compile = undefined;
            this.$scope = undefined;

            this.history = [];
            this.historyIndex = 0;

            this.focusedTarget = undefined;

            this.dirtyCallback = undefined;

            this.fileName = undefined;

            this.focusedDialog = undefined;
            this.idList = {};

            this.onLoadCallback = undefined;

            this.dirty = false;
        };

        DialogGraph.prototype.getCommonDialogs = function()
        {
            return this.commonDialogs;
        };

        DialogGraph.prototype.getUserDialogs = function()
        {
            return this.userDialogs;
        };

        DialogGraph.prototype.setScope = function($compile, $scope)
        {
            this.$compile = $compile;
            this.$scope = $scope;
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

            var that = this;

            angular.element('.graph-body').on('click' ,function()
            {
                that.editor.close();
            });

            canvas.addEventListener('click', function(e)
            {
                that.editor.close();
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

        DialogGraph.prototype.bindKeyboardEventToCanvas = function()
        {
            var that = this;
            window.addEventListener('keydown', function(e)
            {
                if(e.srcElement.nodeName != 'BODY')
                    return;

                if(e.keyCode == 39) // right
                {
                    if(that.focusedTarget.nextElementSibling && that.focusedTarget.nextElementSibling.children.length > 0)
                    {
                        if(that.focusedTarget.nextElementSibling.children[0].className.indexOf('plus') != -1)
                        {
                            that.focus(that.focusedTarget.nextElementSibling.children[0]);
                        }
                        else
                        {
                            that.focus(that.focusedTarget.nextElementSibling.children[0].children[0]);
                        }
                    }

                    e.preventDefault();
                }
                else if(e.keyCode == 40) // down
                {
                    if(that.focusedTarget.parentElement.nextElementSibling)
                    {
                        if(that.focusedTarget.parentElement.nextElementSibling.className.indexOf('plus') != -1)
                        {
                            that.focus(that.focusedTarget.parentElement.nextElementSibling);
                        }
                        else
                        {
                            that.focus(that.focusedTarget.parentElement.nextElementSibling.children[0]);
                        }
                    }

                    e.preventDefault();
                }
                else if(e.keyCode == 37) // left
                {
                    if(that.focusedTarget.className.indexOf('plus') != -1)
                    {
                        that.focus(that.focusedTarget.parentElement.previousElementSibling);
                    }
                    else if(that.focusedTarget.parentElement.parentElement.previousElementSibling)
                    {
                        that.focus(that.focusedTarget.parentElement.parentElement.previousElementSibling);
                    }

                    e.preventDefault();
                }
                else if(e.keyCode == 38) // up
                {
                    if(that.focusedTarget.className.indexOf('plus') != -1)
                    {
                        that.focus(that.focusedTarget.previousElementSibling.children[0]);
                    }
                    else if(that.focusedTarget.parentElement.previousElementSibling)
                    {
                        that.focus(that.focusedTarget.parentElement.previousElementSibling.children[0]);
                    }

                    e.preventDefault();
                }
            });
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
                data = data.trim();

                this.originalFileData = data;

                var commandMatch = data.match(/var commonDialogs[^;]*;/gi);
                if(commandMatch && commandMatch.length == 1)
                {
                    var parsed = commandMatch[0].replace(/var commonDialogs[^\[]*/gi, '').replace(';', '');

                    this.commonDialogs = JSON.parse(parsed);

                    this.originalFileData = this.originalFileData.replace(commandMatch, '{{commonDialogs}}');

                    var startDialog = this.commonDialogs[0];
                    if(!startDialog)
                        startDialog = { name: 'Default Start Dialog', input: [{ text: 'Default' }], output: { kind: 'Content', text: 'Hello World!' }};

                    var match = data.match(/var dialogs[^;]*;/gi);
                    if(match && match.length == 1)
                    {
                        parsed = match[0].replace(/var dialogs[^\[]*/gi, '').replace(';', '');

                        startDialog.children = this.userDialogs = JSON.parse(parsed);
                        this.graphData = startDialog;

                        this.originalFileData = this.originalFileData.replace(match, '{{dialogs}}');

                        this.refresh();

                        this.onLoad();

                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch(err)
            {
                console.error(err.stack);
            }

            return false;
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
            this.addPlusButton(parent);
        };

        DialogGraph.prototype.addPlusButton = function(parent, style)
        {
            var button = angular.element('<button type="button" class="plus"' + (style ? style : '') + '></button>');

            var target = parent.get(0).children[parent.get(0).children.length-1];

            parent.append(button);

            if(target)
            {
                var diff = button[0].offsetTop - target.children[0].offsetTop - target.children[0].offsetHeight - 10;
                if(diff > 50)
                {
                    button[0].style.top = -(button[0].offsetTop - target.offsetTop - 188) + 'px';
                    button[0].style.position = 'relative';
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
            for(var key in input)
            {
                var icon = key.charAt(0).toUpperCase();
                if(key == 'if')
                    icon = 'IF';

                if(!input[key])
                    continue;

                template += '<span class="graph-dialog-input-span" data-key="' + icon + '" data-content="' + input[key] + '">[' + key + '] ' + input[key] + '</span>';
            }

            return template;
        };

        var makeOutputTemplate = function(output)
        {
            if(typeof output == 'string')
            {
                return '<div><span>' + output + '</span></div>';
            }
            else if(typeof output.output == 'string')
            {
                return '<div><span>' + output.output + '</span></div>';
            }
            else if(typeof output.output == 'object')
            {
                return '<div><span>' + output.output.output ? output.output.output : output.output.text + '</span></div>';
            }
            else if(output.text)
            {
                return '<div><span>' + output.text + '</span></div>';
            }
            else
            {
                if(output.options)
                {
                    if(typeof output.options.output != 'string')
                    {
                        console.log('텍스트가 아닙니다 : ', output, typeof output.options.output);
                    }

                    return '<div><span>' + output.options.output + '</span></div>';
                }
                else
                {
                    if(output.kind == 'Action')
                    {
                        for(var key in output)
                        {
                            if(key != 'kind')
                            {
                                return '<div><span>[' + key + '] ' + output[key] + '</span></div>';
                            }
                        }
                    }
                }

                console.log('나머지 : ', output);
            }
        };

        var makeButtonsTemplate = function(buttons)
        {
            var template = ''

            for(var i=0; i<buttons.length; i++)
            {
                template += '<div><span>[button] ' + buttons[i].text + '</span></div>';
                break;
            }

            return '<div class="graph-dialog-buttons"> ' + template + ' </div>';
        };

        var makeDialogDraggable = function(item)
        {
            var clone = undefined;
            var line = document.createElement('div');
            line.className = 'graph-dialog-line';

            var parent = undefined;

            var prevX = undefined;
            var prevY = undefined;

            var dragStart = false;
            item.addEventListener('mousedown', function(e)
            {
                instance.focusById(item.dialog.id);
                if(e.which != 1 || dragStart)
                    return;

                dragStart = true;

                parent = item.parentElement.parentElement;

                clone = item.cloneNode(true);
                clone.origin = item;
                clone.style.opacity = 0.8;
                clone.style.position = 'absolute';
                clone.style.pointerEvents = 'none';
                angular.element(clone).find('.graph-fold').remove();

                var left = angular.element('.playchat-background .gnb+div').get(0).offsetLeft;
                var top = angular.element('.graph-body').get(0).offsetTop;

                clone.style.left = e.pageX - left - 50 + 'px';
                clone.style.top = e.pageY - top - 63 - 30 + 'px';

                e.stopPropagation();
            });

            window.addEventListener('mousemove', function(e)
            {
                if(!dragStart)
                    return;

                if(!clone.parentElement && prevX && prevY)
                {
                    if(Math.abs(prevX - e.clientX) < 10 && Math.abs(prevY - e.clientY) < 10)
                    {
                        prevX = e.clientX;
                        prevY = e.clientY;
                        return;
                    }
                }

                prevX = e.clientX;
                prevY = e.clientY;

                if(!clone.parentElement)
                {
                    angular.element('#graphDialogCanvas').append(clone);
                }

                var left = angular.element('.playchat-background .gnb+div').get(0).offsetLeft;
                var top = angular.element('.graph-body').get(0).offsetTop;

                var target = document.elementFromPoint(e.clientX, e.clientY);

                while(target && !target.dialog)
                {
                    target = target.parentElement;
                }

                if(target && target.parentElement.parentElement == parent)
                {
                    target.parentElement.insertBefore(line, target);

                    line.style.top = target.offsetTop - 10 + 'px';
                    line.style.left = target.offsetLeft + 'px';
                }

                // while (target && target.className != 'graph-body')
                // {
                //     if(target)
                //     resetList.push(target);
                //     target.style.pointerEvents = 'none';
                //     target = document.elementFromPoint(e.clientX, e.clientY);
                // }

                // for(var i=0; i<resetList.length; i++)
                // {
                //     resetList[i].style.pointerEvents = 'auto';
                // }

                clone.style.left = e.pageX - left - 50 + 'px';
                clone.style.top = e.pageY - top - 63 - 30 + 'px';

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

                            var prev = clone.origin.parentElement.previousElementSibling;
                            line.parentElement.parentElement.insertBefore(clone.origin.parentElement, line.parentElement);

                            change = prev != clone.origin.parentElement.previousElementSibling;

                            if(change)
                            {
                                var children = line.parentElement.parentElement.previousElementSibling.dialog.children;
                                var index = children.indexOf(clone.origin.dialog);
                                var targetIndex = children.indexOf(line.nextElementSibling.dialog);

                                var origin = children[index];
                                children[index] = children[targetIndex];
                                children[targetIndex] = origin;
                            }
                        }

                        clone.parentElement.removeChild(clone);
                        line.parentElement.removeChild(line);

                        if(change)
                        {
                            instance.setDirty(true);
                            instance.refresh();
                        }
                    }

                    dragStart = false;
                    e.stopPropagation();
                }
            });
        };

        DialogGraph.prototype.drawDialog = function(parent, dialog)
        {
            var prefix = this.fileName.split('.')[0];
            this.idList[dialog.id.replace(prefix, '')] = true;
            var t = this.template.replace(/{id}/gi, dialog.id).replace('{name}', dialog.name);

            var inputTemplate = '';
            var outputTemplate = '';
            var buttonTemplate = '';

            //or
            for(var i=0; i<dialog.input.length; i++)
            {
                var input = dialog.input[i];
                inputTemplate += '<div>' + makeInputTemplate(input) + '</div>';
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
                    if(dialog.output.buttons && dialog.output.buttons.length > 0)
                    {
                        buttonTemplate = makeButtonsTemplate(dialog.output.buttons);
                    }
                }
            }
            else
            {
                outputTemplate = makeOutputTemplate(dialog.output);
            }


            t = t.replace('{input}', inputTemplate).replace('{output}', outputTemplate).replace('{buttons}', buttonTemplate);
            t = angular.element(this.$compile(t)(this.$scope));

            t.find('.graph-dialog-item').get(0).dialog = dialog;

            this.bindDialogFunctions(t);

            makeDialogDraggable(t.find('.graph-dialog-item').get(0));

            parent.append(t);

            if(!dialog.children || dialog.children.length == 0)
            {
                t.find('.graph-fold').hide();
                var target = t.find('.graph-dialog-item').get(0);

                var half = (target.offsetHeight / 2);
                this.addPlusButton(t.find('.graph-dialog-children'), ' style="margin-left: 0; margin-top: ' + (half > 90 ? 90 : half) + 'px"');
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
                var target = list[i].previousElementSibling.parentElement;

                var half = target.offsetHeight / 2;
                list[i].style.top = ((half > 90 ? 90 : half) - 11) + 'px';
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
            dialog.find('.graph-dialog-header').on('click', function(e)
            {
                that.focus(this.parentElement);
                e.stopPropagation();
            });

            dialog.find('.graph-dialog-item').on('dblclick', function(e)
            {
                var parent = e.currentTarget.parentElement.parentElement.previousElementSibling;
                if(parent && parent.dialog)
                {
                    that.editor.open(parent.dialog, dialog.get(0).children[0].dialog);
                }

                e.stopPropagation();
            });

            dialog.find('.dialog-more').on('click', function(e)
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
            line.setAttribute('shape-rendering', 'crispEdges');

            return line;
        };

        DialogGraph.prototype.drawHorizontalLineForPlusButton = function(src, dest)
        {
            var half = src.offsetHeight / 2;
            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = src.offsetTop + (half > 90 ? 90 : half);

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
            var y1 = src.offsetTop + (srcHalf > 90 ? 90 : srcHalf);

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

                        var destHalf = dest.offsetHeight / 2;

                        x2 = dest.offsetLeft - 80;
                        y2 = dest.offsetTop + (destHalf > 90 ? 90 : destHalf);

                        // 세로선.
                        var x1_5 = (x2 - x1)/2 + x1;
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
                    y2 = dest.offsetTop + (srcHalf > 90 ? 90 : srcHalf);

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
            if(child.style.display == 'none')
            {
                child.style.display = 'inline-block';
            }
            else
            {
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

        DialogGraph.prototype.openEditorForFocused = function()
        {
            this.editor.open(this.canvas.find('#' + this.focusedDialog + ' > .graph-dialog-item').get(0).dialog, null);
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
            var prefix = this.fileName.split('.')[0];
            var number = 0;
            while(this.idList[number])
            {
                number++;
            }

            dialog.id = prefix + number;

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
            var temp = JSON.parse(JSON.stringify(this.commonDialogs));
            delete temp[0].children;

            var data = this.originalFileData.replace('{{dialogs}}', 'var dialogs = ' + JSON.stringify(JSON.parse(angular.toJson(this.userDialogs)), null, 4) + ';\r\n').replace('{{commonDialogs}}', 'var commonDialogs = ' + JSON.stringify(JSON.parse(angular.toJson(temp)), null, 4) + ';\r\n');
            return data;
        };

        DialogGraph.prototype.setDirty = function(dirty)
        {
            this.dirty = (dirty === undefined ? true : dirty);
            if(this.dirtyCallback)
                this.dirtyCallback(this.dirty);
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

        if(!instance)
            instance = new DialogGraph();

        return instance;
    });
})();
