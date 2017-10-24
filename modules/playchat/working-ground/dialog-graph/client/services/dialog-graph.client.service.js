//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat.working-ground').factory('DialogGraph', function($window, $rootScope)
    {
        var instance = undefined;
        var menuInstance = undefined;

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
        };

        Menu.prototype.moveUp = function()
        {

        };

        Menu.prototype.moveDown = function()
        {

        };

        Menu.prototype.duplicate = function()
        {

        };

        Menu.prototype.delete = function()
        {

        };

        Menu.prototype.addMenu = function(name, callback)
        {
            this.menus[name] = callback;
        };

        Menu.prototype.openMenu = function(e, dialog)
        {
            this.isOpened = true;

            var dialogCard = e.currentTarget.parentElement.parentElement;
            var left = dialogCard.offsetLeft + dialogCard.offsetWidth + 20;
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

            e.preventDefault();
            e.stopPropagation();
        };

        if(!menuInstance)
            menuInstance = new Menu();

        var DialogGraph = function()
        {
            this.originalFileData = undefined;
            this.rawDatas = undefined;
            this.template = undefined;
            this.canvas = undefined;
            this.editor = undefined;

            this.$compile = undefined;
            this.$scope = undefined;

            this.focusedTarget = undefined;
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

        DialogGraph.prototype.load = function(data)
        {
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

                    var startDialog = JSON.parse(parsed)[0];

                    var match = data.match(/var dialogs[^;]*;/gi);
                    if(match && match.length == 1)
                    {
                        parsed = match[0].replace(/var dialogs[^\[]*/gi, '').replace(';', '');

                        startDialog.children = JSON.parse(parsed);
                        this.rawDatas = startDialog;

                        this.drawDialog(this.canvas, this.rawDatas);
                        this.drawLines(this.canvas.find('.graph-dialog'));
                        this.focus(this.canvas.find('.graph-dialog:first .graph-dialog-item')[0]);

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
            parent.append(button);

            var that = this;
            button.on('click', function()
            {
                that.editor.open();
            });
        };

        var makeInputTemplate = function(input)
        {
            var template = '';
            for(var key in input)
            {
                var icon = key.charAt(0).toUpperCase();
                if(key == 'if')
                    icon = 'if';

                template += '<span class="graph-dialog-input-span" data-key="' + icon + '" data-content="' + input[key] + '">' + input[key] + '</span>';
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
                        console.log('텍스트가 아닙니다 : ', output, typeof output.options.output);

                    return '<div><span>' + output.options.output + '</span></div>';
                }
                else if(output.call)
                {
                    return '<div><span>[call]' + output.call + '</span></div>';
                }
                else if(output.callChild)
                {
                    return '<div><span>[callChild]' + output.callChild + '</span></div>';
                }

                console.log('나머지 : ', output);
            }
        };

        var makeDialogDraggble = function(item)
        {
            item.addEventListener('mousedown', function(e)
            {

            });

            window.addEventListener('mousemove', function(e)
            {
            });

            window.addEventListener('mouseup', function(e)
            {
            });
        };

        DialogGraph.prototype.drawDialog = function(parent, dialog)
        {
            var that = this;
            var t = this.template.replace('{id}', dialog.id).replace('{name}', dialog.name);

            var inputTemplate = '';
            var outputTemplate = '';
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
                    }
                }
                else
                {
                    outputTemplate = makeOutputTemplate(dialog.output);
                }
            }
            else
            {
                outputTemplate = makeOutputTemplate(dialog.output);
            }

            t = t.replace('{input}', inputTemplate).replace('{output}', outputTemplate);
            t = angular.element(this.$compile(t)(this.$scope));

            this.bindDialogFunctions(t);

            makeDialogDraggble(t.find('.graph-dialog-item').get(0));

            parent.append(t);

            if(!dialog.children || dialog.children.length == 0)
            {
                t.find('.graph-fold').hide();
                var target = t.find('.graph-dialog-item').get(0);

                this.addPlusButton(t.find('.graph-dialog-children'), ' style="margin-left: 0; margin-top: ' + (target.offsetHeight / 2 - 19 + 20) + 'px"');
            }
            else
            {
                this.drawDialogs(t.find('.graph-dialog-children'), dialog.children);
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

            dialog.find('.graph-dialog-header').on('dblclick', function(e)
            {
                that.editor.open(dialog);
                e.stopPropagation();
            });

            dialog.find('.dialog-more').on('click', function(e)
            {
                that.openMenu(e, dialog);
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
            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = src.offsetTop + src.offsetHeight / 2;

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

            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = src.offsetTop + 90;

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
                        x2 = dest.offsetLeft - 80;
                        y2 = dest.offsetTop + dest.offsetHeight / 2;

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
                    y2 = dest.offsetTop + 90;

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

        DialogGraph.prototype.focus = function(target)
        {
            this.canvas.find('.selected').removeClass('selected');
            angular.element(target).addClass('selected');

            this.focusedTarget = target;

            this.moveScrollToTarget(target);
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
                this.addEventListener('click' , function()
                {
                    menuInstance.execute(this.getAttribute('data-name'));
                });
            });
        };

        if(!instance)
            instance = new DialogGraph();

        return instance;
    });
})();
