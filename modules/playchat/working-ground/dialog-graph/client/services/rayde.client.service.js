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
            this.svg = undefined;
        };

        Rayde.prototype.setDialogTemplate = function(template)
        {
            this.template = template;
        };

        Rayde.prototype.setCanvas = function(selector)
        {
            this.canvas = angular.element(selector);
            this.svg = this.canvas.find('svg');

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

                var match = data.match(/var dialogs[^;]*;/gi);
                if(match && match.length == 1)
                {
                    var parsed = match[0].replace(/var dialogs[^\[]*/gi, '').replace(';', '');
                    this.rawDatas = JSON.parse(parsed);

                    this.drawDialogs(this.canvas, this.rawDatas);
                    this.drawLines(this.canvas.find('.graph-dialog'));

                    return true;
                }
                else
                {
                    return false;
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

                inputTemplate += '<div>';
                //and
                for(var key in input)
                {
                    if(key == 'intent')
                    {
                        inputTemplate += '<span class="graph-dialog-input-intent">' + input[key] + '</span>'
                    }
                }

                inputTemplate += '</div>';
            }

            for(var i=0; i<dialog.output.length; i++)
            {
                var output = dialog.output[i];

                if(output.kind == 'Text')
                {
                    outputTemplate += '<div><span class="graph-dialog-output-text">' + output.text + '</span></div>';
                }
            }

            t = t.replace('{input}', inputTemplate).replace('{output}', outputTemplate);
            t = angular.element(t);

            parent.append(t);

            if(!dialog.children || dialog.children.length == 0)
            {
                t.find('.graph-fold').hide();
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
            line.setAttribute('stroke', 'red');
            line.setAttribute('stroke-width', '1px');

            return line;
        };

        Rayde.prototype.drawLine = function(src, children)
        {
            var svg = this.svg;

            var x1 = src.offsetLeft + src.offsetWidth;
            var y1 = src.offsetHeight/2 + src.offsetTop;

            src.lines = {};

            for(var i=0, l=children.length; i<l; i++)
            {
                var dest = children[i].children[0];

                var x2 = dest.offsetLeft;
                var y2 = dest.offsetHeight/2 + dest.offsetTop;

                if(y1 != y2)
                {
                    //직선이 아닌경우. 이미 가로직선은 그어졌으니 세로직선부터 그리면 된다.
                    // x1, y1 에서 x1과 x2의 중간까지 가로 직선을 그린다. -- 이미 그려졌을 것.

                    var x1_5 = (x2 - x1)/2 + x1;
                    //x1과 x2의 중간부터 y2까지 세로 직선을 그린다.
                    if(!src.lines.hasOwnProperty(x1_5 + '-' + y1 + '-' + x1_5 + '-' + y2))
                    {
                        svg.append(src.lines[x1_5 + '-' + y1 + '-' + x1_5 + '-' + y2] = createLine(x1_5, y1, x1_5, y2));
                    }

                    //세로직선 끝에서 원래 dest로 그린다.
                    if(!src.lines.hasOwnProperty(x1_5 + '-' + y2 + '-' + x2 + '-' + y2))
                    {
                        svg.append(src.lines[x1_5 + '-' + y2 + '-' + x2 + '-' + y2] = createLine(x1_5, y2, x2, y2));
                    }
                }
                else
                {
                    //직선인 경우 그냥 그림.
                    if(!src.lines.hasOwnProperty(x1 + '-' + y1 + '-' + x2 + y2))
                    {
                        var line = createLine(x1, y1, x2, y2);
                        svg.append(src.lines[x1 + '-' + y1 + '-' + x2 + y2] = line);
                    }
                }
            }
        };

        Rayde.prototype.drawLines = function(children)
        {
            for(var i=0, l=children.length; i<l; i++)
            {
                var child = children[i];
                this.drawLine(child.children[0], child.children[1].children);
            }
        };

        if(!instance)
            instance = new Rayde();

        return instance;
    });
})();
