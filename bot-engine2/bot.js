var async = require('async');

var mongoose = require(_botEngineModules.mongoose);
var BotModel = mongoose.model('Bot');
var TemplateModel = mongoose.model('Template');

(function()
{
    var Bot = function(id)
    {
        this.id = id;
    };

    Bot.prototype.merge = function(doc)
    {
        var json = doc.toJSON();

        for(var key in json)
        {
            this[key] = json[key];
        }

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
        this.error = [];
    };

    var getBot = function()
    {
        var that = this;
        BotModel.findOne({ id: this.id }).lean().exec(function(err, doc)
        {
            if(doc != undefined)
            {
                that.merge(doc);
            }

            done();
        });
    };

    var loadBotModule = function()
    {
        var botDir = path.resolve(this.path);

        if(fs.existsSync(botDir))
        {
            var fileFilter = function(file) { return file.endsWith('.bot.js'); };

            var files = undefined;

            try
            {
                files = fs.readdirSync(botDir);
                for (var i = 0; i < files.length; i++)
                {
                    var file = files[i];
                    if(file != file.normalize('NFC'))
                    {
                        files[i] = file.normalize('NFC');
                    }
                }

                files = files.filter(fileFilter);
            }
            catch(e)
            {
                logger.systemError('Loading Bot: ' + botDir + ' 경로 없음');
                this.error.push(e.stack);

                return;
            }

            for (var i = 0; i < files.length; i++)
            {
                var file = files[i];
                var filePath = path.join(botDir, file);

                logger.systemLog('\tLoading Bot file: ' + file);
                utils.requireNoCache(filePath, true);
            }
        }
    };

    // var getTemplate = function()
    // {
    //     var that = this;
    //     TemplateModel.findOne({ _id: this.templateId }).lean().exec(function(err, doc)
    //     {
    //         if(doc)
    //         {
    //             logger.systemLog('Loading Bot\'s Template : ' + JSON.stringify(doc));
    //             that.template = doc;
    //
    //             if(!that.path)
    //             {
    //                 that.path = 'templates/' + doc.id;
    //             }
    //
    //             var templateDataModel = TemplateDataModule.getTemplateDataModel(doc.dataSchema);
    //             templateDataModel.findOne({ _id: bot.templateDataId }).lean().exec(function(err, doc1)
    //             {
    //                 logger.systemLog('Loading Bot\'s Template data : ' + JSON.stringify(doc1));
    //                 utils.merge(bot, doc1);
    //                 cb(null);
    //             });
    //         }
    //         else
    //         {
    //             cb(null);
    //         }
    //     });
    // };

    Bot.prototype.initialize = function(done)
    {
        async
        getBot.call(this);
    };

    module.exports = Bot;
})();
