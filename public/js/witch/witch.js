var Witch = (function()
{
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
                callback(list[index], index, next);
            }
        };

        callback(list[index], index, next);
    }

    function WitchError(message)
    {
        this.message = (message || '');
    }

    WitchError.prototype = Error.prototype;

    function getCompareValue(obj)
    {
        var target = undefined;
        if(/style.[a-zA-Z]*/gi.test(obj.condition.prop))
        {
            var split = obj.condition.prop.split('.');
            var key = split[1].split(' ');

            var isDeep = (key[1] == 'deep');
            key = key[0];

            var style = obj.target.style;
            if(isDeep)
                style = window.getComputedStyle(obj.target);

            target = style[key];
        }
        else if(typeof obj.condition.prop == 'string')
        {
            target = obj.target[obj.condition.prop];
        }

        return target;
    };

    function getSource(source)
    {
        if(typeof source != 'string' && typeof source != 'object')
        {
            throw new WitchError('Type of source must be string or object.');
        }

        if(typeof source == 'string')
        {
            var split = source.split('::');

            if(split.length != 2)
            {
                throw new WitchError('Pattern of source must be selector::event');
            }

            return { element: document.querySelector(split[0]), event: split[1] };
        }
        else if(typeof source == 'object')
        {
            if(source.selector && source.event)
            {
                return { element: document.querySelector(source.selector), event: source.event };
            }

            throw new WitchError('Selector, event of source must be not null.');
        }
    };

    function getTarget(target)
    {
        if(typeof target != 'string')
        {
            return console.error('Type of target must be string.');
        }

        var split = target.split('::');
        var targetElement = document.querySelector(split[0]);
        for(var i=1, l=split.length; i<l; i++)
        {
            if(split[i] == 'prev')
            {
                targetElement = targetElement.previousElementSibling;
            }
            else if(split[i] == 'next')
            {
                targetElement = targetElement.nextElementSibling;
            }
        }

        return targetElement;
    };

    function getCondition(condition)
    {
        if(typeof condition != 'string')
        {
            return console.error('Type of condition must be string.');
        }

        var split = condition.split('::');

        if(split.length != 4)
        {
            throw new WitchError('Pattern of condition must be property::type::value::result');
        }

        var prop = split[0];
        if(prop == 'text')
        {
            prop = 'innerText';
        }
        else if(prop == 'html')
        {
            prop = 'innerHTML';
        }

        return { prop: prop, type: split[1], value: split[2], result: !!split[3] };
    };

    function test(test, done)
    {
        var tryCount = 0;
        var f = function()
        {
            var compareValue = getCompareValue(test);

            var result = undefined;
            if(test.condition.type == 'equals')
            {
                result = (compareValue == test.condition.value);
            }
            else if(test.condition.type == 'contains')
            {
                result = (compareValue.indexOf(test.condition.value) != -1);
            }

            test.result = result;

            if(result === undefined)
            {
                throw new WitchError('Type of condition "' + test.condition.type + '" is not supported.');
            }
            else if(result === test.condition.result)
            {
                pass(test);
                return done();
            }

            if(tryCount == 5)
            {
                fail(test, { compareValue: compareValue, result: result });
                done();
            }
            else if(tryCount > 0)
            {
                setTimeout(f, 1000);
            }
            else
            {
                tryCount++;
                f();
            }
        };

        test.source.element.addEventListener(test.source.event, f);

        var event = new CustomEvent(test.source.event);
        test.source.element.dispatchEvent(event);
        test.source.element.removeEventListener(test.source.event, f);
    };

    function pass(test)
    {
        console.log(test.name + ' - 성공');
    };

    function fail(test, cause)
    {
        console.log(test.name + ' - 실패 : ',  test, cause);
    };

    var privateData = {
        scenarios: {
            default: []
        }
    };

    var Witch = function()
    {
    };

    Witch.prototype.createScenario = function(name, callback)
    {
        if(privateData.scenarios[name] && privateData.scenarios[name].length > 0)
            throw new WitchError(name + ' scenario is already created.');

        callback.call({
            createTest : this.createTest.bind({ scenarioName: name })
        })
    };

    Witch.prototype.createTest = function(name, source, target, condition, options)
    {
        var s = getSource(source);
        if(!s.element)
            throw new WitchError('Source [' + source + '] is undefined.');

        var t = getTarget(target);
        var c = getCondition(condition);

        (privateData.scenarios[this.scenarioName || 'default'] = privateData.scenarios[this.scenarioName] || []).push({ name: name, source: s, target: t, condition: c, options: options || {} });
    };

    Witch.prototype.start = function(scenarioName)
    {
        scenarioName = scenarioName || 'default';

        console.log('%c[Witch] %cTest Scenario ' + '%c' + scenarioName + '%c is started.', 'color: #ccc;', 'color: blue;', 'color: red;', 'color: blue;');

        var list = privateData.scenarios[scenarioName];

        forEach(list, function(item, index, done)
            {
                test(item, done);
            },
            function()
            {
                console.log('%c[Witch] %cTest Scenario ' + '%c' + scenarioName + '%c is done.', 'color: #ccc;', 'color: blue;', 'color: red;', 'color: blue;');
            });
    };

    return new Witch();
})();
