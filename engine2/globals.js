var path = require('path');
var fs = require('fs');

(function()
{
    var Globals = function()
    {
        this.tasks = {};
        this.concepts = {};
        this.messages = {};
        this.typeChecks = {};
        this.types = {};
        this.dialogs = {};
        this.quibbles = {};
    };

    Globals.prototype.setTasks = function(name, task)
    {
        task.name = name;
        this.tasks[name] = task;
    };

    Globals.prototype.setConcepts = function(concepts)
    {
        for (var key in concepts)
        {
            this.concepts[key] = concepts[key];
        }
    };

    Globals.prototype.setMessages = function(messages)
    {
        for (var key in messages)
        {
            this.messages[key] = messages[key];
        }
    };

    Globals.prototype.setTypeChecks = function(name, f)
    {
        this.typeChecks[name] = f;
    };

    Globals.prototype.setTypes = function(name, type)
    {
        type.name = name;
        this.types[name] = type;
    };

    Globals.prototype.setDialogs = function(name, dialogs)
    {
        this.dialogs[name] = dialogs;
    };

    Globals.prototype.setQuibbles = function(name, quibbles)
    {
        this.quibbles[name] = quibbles;
    };

    Globals.prototype.loadDirs = function(dir)
    {
        var dirs = fs.readdirSync(dir);
        for(var i=0; i<dirs.length; i++)
        {
            var files = fs.readdirSync(dir + '/' + dirs[i]);
            for(var j=0; j<files.length; j++)
            {
                if(files[j].endsWith('.js'))
                {
                    require(dir + '/' + dirs[i] + '/' + files[j])(this);
                }
            }
        }
    };

    Globals.prototype.init = function()
    {
        this.loadDirs(path.resolve('./engine2/globals'));
    };

    module.exports = new Globals();
})();

function setGlobalDialogs(dialogs) {
  global._context.dialogs = global._context.dialogs.concat(dialogs);
}

exports.setGlobalDialogs = setGlobalDialogs;


function setGlobalCommonDialogs(dialogs) {
  global._context.commonDialogs = global._context.commonDialogs.concat(dialogs);
}

exports.setGlobalCommonDialogs = setGlobalCommonDialogs;

function setGlobalAction(actionName, action) {
  global._context.actions[actionName] =  action;
}

exports.setGlobalAction = setGlobalAction;
