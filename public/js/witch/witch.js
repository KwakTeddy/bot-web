var Witch = (function()
{
    /** 공통 모듈. ----------------------------------------------------------------------------- */
    function forEach(list, callback, done)
    {
        var index = 0

        if(!list || list.length == 0)
        {
            return done();
        }

        var next = function()
        {
            if(++index == list.length)
            {
                return done();
            }
            else
            {
                callback(list[index], next);
            }
        };

        callback(list[index], next);
    };

    function WitchError(message)
    {
        this.message = (message || '');
    };

    WitchError.prototype = Error.prototype;
















    /** Text 객체 ----------------------------------------------------------------------------- */
    var Test = function(name, actions, compareActions)
    {
        this.name = name;
        this.tasks = [];
    };

    Test.prototype.setName = function(name)
    {
        this.name = name;
        return this;
    };

    Test.prototype.addAction = function(selector, event, params)
    {
        this.tasks.push({ type: 'action', selector: selector, event: event, params: params });
        return this;
    };

    Test.prototype.addCompareAction = function(selector, property, compareType, compareValue, expectedValue, options)
    {
        this.tasks.push({ type: 'compare', selector: selector, property: property, compareType: compareType, compareValue: compareValue, expectedValue: expectedValue, options: options });
        return this;
    };

    Test.prototype.execAction = function(element, event, params)
    {
        if(params && typeof params != 'object')
            throw new WitchError('Action parameters is not object.');

        if(event == 'typing')
        {
            var text = params.text;
            if(element.value !== undefined)
                element.value = text;
            else
                element.innerText = text;
        }
        else if(event == 'keydown' || event == 'keyup')
        {
            var e = new CustomEvent(event);
            e.keyCode = params.keyCode;

            element.dispatchEvent(e);
        }
        else
        {
            var e = new CustomEvent(event);
            element.dispatchEvent(e);
        }

        return this;
    };

    Test.prototype.getCompareTargetValue = function(element, property)
    {
        if(/style.[a-zA-Z]*/gi.test(property))
        {
            var split = property.split('.');
            var key = split[1].split(' ');

            var isDeep = (key[1] == 'deep');
            key = key[0];

            var style = element.style;
            if(isDeep)
                style = window.getComputedStyle(element);

            return style[key];
        }
        else if(property == 'text')
        {
            return element.innerText;
        }
        else if(property == 'html')
        {
            return element.innerHTML;
        }
        else
        {
            return element[property];
        }

        return null;
    };

    Test.prototype.getCompareResult = function(compareType, compareTargetValue, compareValue)
    {
        var result = undefined;
        if(compareType == 'equals')
        {
            result = (compareTargetValue == compareValue);
        }
        else if(compareType == 'empty')
        {
            result = (compareTargetValue == null || compareTargetValue == undefined || compareTargetValue == '');
        }
        else if(compareType == 'contains')
        {
            result = (compareTargetValue.indexOf(compareValue) != -1);
        }
        else if(compareType == 'typeof')
        {
            result = (typeof compareTargetValue == compareValue);
        }
        else if(compareType == '>=')
        {
            result = (compareTargetValue >= compareValue);
        }
        else if(compareType == '<=')
        {
            result = (compareTargetValue <= compareValue);
        }
        else if(compareType == '==')
        {
            result = (compareTargetValue == compareValue);
        }
        else if(compareType == '>')
        {
            result = (compareTargetValue > compareValue);
        }
        else if(compareType == '<')
        {
            result = (compareTargetValue > compareValue);
        }

        return result;
    };

    Test.prototype.checkListLength = function(elements, compareType, compareValue, expectedValue)
    {
        var length = elements.length;
        var result = this.getCompareResult(compareType, length, compareValue);

        if(result === undefined)
        {
            throw new WitchError('Type of condition "' + compareType + '" is not supported.');
        }
        else if(result !== expectedValue)
        {
            return { result: false, compareTargetValue: length };
        }

        return { result: true };
    };

    Test.prototype.execCompare = function(elements, property, compareType, compareValue, expectedValue)
    {
        if(property == 'list.length')
        {
            return this.checkListLength(elements, compareType, compareValue, expectedValue);
        }

        for(var i=0, l=elements.length; i<l; i++)
        {
            var element = elements.get(i);

            var compareTargetValue = this.getCompareTargetValue(element, property);

            var result = this.getCompareResult(compareType, compareTargetValue, compareValue);

            if(result === undefined)
            {
                throw new WitchError('Type of condition "' + compareType + '" is not supported.');
            }
            else if(result !== expectedValue)
            {
                return { result: false, compareTargetValue: compareTargetValue };
            }
        }

        return { result: true };
    };

    Test.prototype.startAction = function()
    {
        for(var i=0, l=this.actions.length; i<l; i++)
        {
            var action = this.actions[i];
            var selector = action.selector;
            var event = action.event;
            var params = action.params;

            var element = $(selector).get(0);
            if(!element)
            {
                throw new WitchError(selector + ' is not found any element.');
            }

            if(!event)
            {
                throw new WitchError(event + ' of ' + selector + ' is undefined.');
            }

            this.execAction(element, event, params);
        }
    };

    Test.prototype.exec = function(done)
    {
        var that = this;
        forEach(this.tasks, function(task, next)
        {
            if(task.type == 'action')
            {
                var selector = task.selector;
                var event = task.event;
                var params = task.params;

                var element = $(selector).get(0);
                if(!element)
                {
                    throw new WitchError(selector + ' is not found any element.');
                }

                if(!event)
                {
                    throw new WitchError(event + ' of ' + selector + ' is undefined.');
                }

                that.execAction(element, event, params);
                next();
            }
            else if(task.type == 'compare')
            {
                var selector = task.selector;
                var property = task.property;
                var compareType = task.compareType;
                var compareValue = task.compareValue;
                var expectedValue = task.expectedValue;

                var elements = $(selector);
                if(elements.length <= 0)
                {
                    if(count == 3)
                    {
                        throw new WitchError(selector + ' is not found any element.');
                    }
                    else
                    {
                        setTimeout(function()
                        {
                            that.startCompare(index, count+1, done);
                        }, 1000);

                        return;
                    }
                }

                var execCompare = function(count)
                {
                    var result = that.execCompare(elements, property, compareType, compareValue, expectedValue);
                    if(!result.result)
                    {
                        if(count == 3)
                        {
                            return done(false, { result: result.result, compareTargetValue: result.compareTargetValue, compareType: compareType, compareValue: compareValue, expectedValue: expectedValue });
                        }

                        setTimeout(function()
                        {
                            console.log('%c[Witch] %c' + that.name + ' %c[FAIL AND RETRY]', 'color: #ccc;', 'color: #ccc;', 'color: #ccc;');
                            execCompare(count+1);
                        }, 1000);

                        return;
                    }

                    next();
                };

                execCompare(0);
            }
        }, done);
    };











    /** Witch 메인 모듈 ----------------------------------------------------------------------------- */
    var privateData = {
        scenarios: {
            default: []
        }
    };

    var Witch = function()
    {
        this.Test = Test;
    };

    Witch.prototype.createScenario = function(name, callback)
    {
        if(privateData.scenarios[name] && privateData.scenarios[name].length > 0)
        {
            throw new WitchError(name + ' scenario is already created.');
        }

        callback.call({
            addTest : this.addTest.bind({ scenarioName: name })
        });
    };

    Witch.prototype.addTest = function(name)
    {
        var t = new Test(name);
        (privateData.scenarios[this.scenarioName || 'default'] = privateData.scenarios[this.scenarioName] || []).push(t);

        return t;
    };

    Witch.prototype.start = function(scenarioName)
    {
        scenarioName = scenarioName || 'default';

        var list = privateData.scenarios[scenarioName];
        if(!list || list.length == 0)
        {
            return console.log('%c[Witch] %cTest Scenario ' + '%c' + scenarioName + '%c is empty.', 'color: #ccc;', 'color: blue;', 'color: red;', 'color: blue;');
        }

        console.log('%c[Witch] %cTest Scenario ' + '%c' + scenarioName + '%c is started.', 'color: #ccc;', 'color: blue;', 'color: red;', 'color: blue;');

        var done = function()
        {
            console.log('%c[Witch] %cTest Scenario ' + '%c' + scenarioName + '%c is done.', 'color: #ccc;', 'color: blue;', 'color: red;', 'color: blue;');
        };

        forEach(list, function(test, next)
        {
            test.exec(function(result)
            {
                if(result !== false)
                {
                    console.log('%c[Witch] %c' + test.name + ' %c[SUCCESS]', 'color: #ccc;', 'color: #797979;', 'color: green;');
                    next();
                }
                else
                {
                    console.log('%c[Witch] %cTest Scenario ' + '%c' + scenarioName + '%c is fail.', 'color: #ccc;', 'color: blue;', 'color: red;', 'color: red;');
                }
            });
        }, done);
    };

    return new Witch();
})();
