var path = require('path');
var utils = require(path.resolve('./engine/utils/utils.js'));

(function()
{
    var Bot = function(schema)
    {
        utils.merge(this, schema);

        this.dialogs = this.dialogs || [];
        this.commonDialogs = this.commonDialogs || [];
        this.tasks = this.tasks || {};
        this.actions = this.actions || {};
        this.types = this.types || {};
        this.typeChecks = this.typeChecks || {};
        this.concepts = this.concepts || {};
        this.messages = this.messages || {};
        this.patterns = this.patterns || {};
        this.dialogsets = this.dialogsets || [];
    }

    Bot.prototype.setDialogs = function(dialogs)
    {
        this.dialogs = this.dialogs.concat(dialogs);
    };

    Bot.prototype.setCommonDialogs = function(dialogs)
    {
        this.commonDialogs = this.commonDialogs.concat(dialogs);
    };

    Bot.prototype.setTask = function(taskName, task)
    {
        task.name = taskName;
        this.tasks[taskName] = task;
    };

    Bot.prototype.setAction = function(actionName, action)
    {
        this.actions[actionName] = action;
    };

    Bot.prototype.setType = function(typeName, type)
    {
        type.name = typeName;
        this.types[typeName] = type;
    };

    Bot.prototype.setTypeCheck = function(typeCheckName, typeCheck)
    {
        this.typeChecks[typeCheckName] = typeCheck;
    };

    Bot.prototype.setConcepts = function(concepts)
    {
        for (var key in concepts)
        {
            this.concepts[key] = concepts[key];
        }
    };

    Bot.prototype.setMessages = function(messages)
    {
        for (var key in messages)
        {
            this.messages[key] = messages[key];
        }
    };

    Bot.prototype.setDialogPattern = function(patternName, pattern)
    {
        this.patterns[patternName] = pattern;
    };

    module.exports = Bot;
})();
