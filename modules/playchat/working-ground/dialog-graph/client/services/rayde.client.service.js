//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat.working-ground').factory('Rayde', function($window, $rootScope)
    {
        var instance = undefined;
        var Rayde = function()
        {
            this.originalFileData = undefined;
            this.rawDatas = undefined;
            this.template = undefined;
            this.canvas = undefined;

            this.$compile = undefined;
            this.$scope = undefined;
        };
        
        Rayde.prototype.setScope = function($compile, $scope)
        {
            this.$compile = $compile;
            this.$scope = $scope;
        };

        Rayde.prototype.setDialogTemplate = function(template)
        {
            this.template = template;
        };

        Rayde.prototype.setCanvas = function(selector)
        {
            this.canvas = angular.element(selector);

            this.makeCanvasDraggable();
        };

        Rayde.prototype.makeCanvasDraggable = function()
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

                isDragStart = true;
                canvas.style.cursor = 'all-scroll';
                e.preventDefault();
            });

            canvas.addEventListener('mousemove', function(e)
            {
                if(isDragStart)
                {
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

        Rayde.prototype.load = function(data)
        {
            if(!this.template)
            {
                throw new Error('[Rayde] Template is undefined');
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

        Rayde.prototype.drawDialogs = function(parent, list)
        {
            for(var i=0, l=list.length; i<l; i++)
            {
                var dialog = list[i];
                this.drawDialog(parent, dialog);
            }

            //plus 버튼을 여기서 붙여주면..
            parent.append('<button type="button" class="plus"></button>');
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

        Rayde.prototype.drawDialog = function(parent, dialog)
        {
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

            parent.append(t);

            if(!dialog.children || dialog.children.length == 0)
            {
                t.find('.graph-fold').hide();
                var target = t.find('.graph-dialog-item').get(0);
                t.find('.graph-dialog-children').append('<button type="button" class="plus" style="margin-left: 0; margin-top: ' + (target.offsetHeight / 2 - 19 + 20) + 'px"></button>');
            }
            else
            {
                this.drawDialogs(t.find('.graph-dialog-children'), dialog.children);
            }
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

        Rayde.prototype.drawHorizontalLineForPlusButton = function(src, dest)
        {
            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = src.offsetTop + src.offsetHeight / 2;

            var x2 = dest.offsetLeft;
            var y2 = dest.offsetTop + dest.offsetHeight / 2;

            var line = createLine(x1, y1, x2, y2);

            this.svg.appendChild(line);
        };

        Rayde.prototype.drawVerticalLineForPlusButton = function(src, dest)
        {
            var x1 = src.offsetLeft + src.offsetWidth / 2;
            var y1 = src.offsetTop + src.offsetHeight;

            var x2 = dest.offsetLeft + dest.offsetWidth / 2;
            var y2 = dest.offsetTop;

            var line = createLine(x1, y1, x2, y2);

            this.svg.appendChild(line);
        };

        Rayde.prototype.drawLine = function(src, children)
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

        Rayde.prototype.drawLines = function(children)
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

        Rayde.prototype.toggleChild = function(child)
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

        if(!instance)
            instance = new Rayde();

        return instance;
    });
})();
