// var SyncProcess = require('./utils/sync-process.js');
var SyncProcess = function()
{
    this.index = 0;
    this.queue = [];
    var datas = this.datas = {};
    this.datas.get = function(name)
    {
        return name;
    };

    this.datas.set = function(name, value)
    {
        datas[name] = value;
    };
};

SyncProcess.prototype.next = function()
{
    var target = this.queue[this.index]

    this.index = this.index + 1;

    var args = [];
    for(var i=0; i<target.args.length-1; i++)
    {
        args.push(this.datas[target.args[i]]);
    }

    args.push(target.args[target.args.length-1]);

    target.f.apply(target.f, args);
};

SyncProcess.prototype.execute = function(params)
{
    // 함수 호출시 전달되는 마지막 파라미터에 return 기능을 넣어줌.
    params.args.push(function(params)
    {
        for(var key in params)
        {
            this.datas[key] = params[key];
        }

        this.next();
    }.bind(this));

    // 함수들을 큐에 추가함.
    this.queue.push(params);
    if(this.index == 0)
    {
        this.next();
    }
};

Function.prototype.sync = function()
{
    var scope = arguments[0];

    var args = [];
    for(var i=1; i<arguments.length; i++)
    {
        args.push(arguments[i]);
    }

    scope.execute({ f: this, args: args });
    return scope.datas;
};
























var getArgs = function(_return)
{
    setTimeout(function()
    {
        _return({ a: 1, b: 6 });
    }, 3000);
};

var plus = function(a, b)
{
    console.log(a+b);
};

console.log('시작');

var scope = new SyncProcess();
var result = getArgs.sync(scope);
(function(_return)
{
    _return({ a: 3 });
}).sync(scope);
plus.sync(scope, result.get('a'), result.get('b'));
