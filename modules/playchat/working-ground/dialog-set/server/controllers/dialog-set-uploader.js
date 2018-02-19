var path = require('path');
var XLSX = require('xlsx');
var async = require('async');
var fs = require('fs');

var mongoose = require('mongoose');
var CustomContext = mongoose.model('CustomContext');
var DialogsetDialog = mongoose.model('DialogsetDialog');
var Dialogset = mongoose.model('Dialogset');

var NLPManager = require(path.resolve('./engine2/input/nlp.js'));

(function()
{
    var Uploader = function()
    {

    };

    var saveContext = function(botId, dialogsetId, split, index, done)
    {
        if(index < split.length)
        {
            var customcontext = new CustomContext();
            customcontext.bot = botId;
            customcontext.name = split[index];

            if(index-1 >= 0)
            {
                customcontext.parent = split[index-1];
            }

            customcontext.dialogset = dialogsetId;
            customcontext.save(function(err)
            {
                split[index] = customcontext._id;
                saveContext(botId, dialogsetId, split, index+1, done);
            });
        }
        else
        {
            done(split[index-1]);
        }
    };

    var saveWithContext = function(botId, language, dialogsetId, keyList, context, index, done)
    {
        if(index < keyList.length)
        {
            var key = keyList[index];
            var list = context[key];

            var split = key.split('@@@');
            saveContext(botId, dialogsetId, split, 0, function(contextId)
            {
                async.eachSeries(list, function(item, next)
                {
                    var dialogsetDialog = new DialogsetDialog();
                    dialogsetDialog.dialogset = dialogsetId;
                    dialogsetDialog.inputRaw = [item.q];
                    dialogsetDialog.output = [item.a];
                    dialogsetDialog.context = contextId;

                    NLPManager.getNlpedText(language, item.q, function(err, lastChar, nlpText, nlp)
                    {
                        dialogsetDialog.input = [nlpText];

                        console.log('세이브 : ', dialogsetDialog.inputRaw);
                        dialogsetDialog.save(function()
                        {
                            next();
                        });
                    });
                },
                function()
                {
                    saveWithContext(botId, language, dialogsetId, keyList, context, index+1, done);
                });
            });
        }
        else
        {
            done();
        }
    };

    Uploader.prototype.uploadFromExcel = function(botId, language, dialogsetId, filePath, callback)
    {
        var workbook = XLSX.readFile(filePath);
        var first_sheet_name = workbook.SheetNames[0];
        var ws = workbook.Sheets[first_sheet_name];

        var range = XLSX.utils.decode_range(ws['!ref']);

        console.log('레인지 : ', range);

        var dialogsetList = [];
        for(var r=1; r<range.e.r; r++)
        {
            var q = ws[XLSX.utils.encode_cell({ c: range.e.c-1, r: r })].v.trim();
            var a = ws[XLSX.utils.encode_cell({ c: range.e.c, r: r })].v.trim();

            var category = '';
            for(var c=0; c<range.e.c-1; c++)
            {
                if(category)
                {
                    category += '@@@';
                }

                var target = ws[XLSX.utils.encode_cell({ c: c, r: r })];
                if(target)
                {
                    category += target.v.trim();
                }
                else
                {
                    var i = 1;
                    while(!(target = ws[XLSX.utils.encode_cell({ c: c, r: r-i })]))
                    {
                        i++;
                    }

                    category += target.v.trim();
                }
            }

            dialogsetList.push({ q: q, a: a, category: category });
        }

        async.eachSeries(dialogsetList, function(item, next)
        {
            var dialogsetDialog = new DialogsetDialog();
            dialogsetDialog.dialogset = dialogsetId;
            dialogsetDialog.inputRaw = [item.q];
            dialogsetDialog.output = [item.a];
            dialogsetDialog.category = item.category;

            console.log('세이브 : ', item.q);

            NLPManager.getNlpedText(language, item.q, function(err, lastChar, nlpText, nlp)
            {
                dialogsetDialog.input = [nlpText];

                dialogsetDialog.save(function()
                {
                    next();
                });
            });
        },
        function()
        {
            callback();
        });
    };

    Uploader.prototype.uploadFromCsv = function(botId, language, dialogsetId, filePath, callback)
    {
        var data = fs.readFileSync(filePath);
        if(data)
        {
            data = data.toString();
        }
        else
        {
            return callback();
        }

        var lines = data.split('\r\n');

        var dialogsetList = [];
        for(var i=1; i<lines.length; i++)
        {
            var split = lines[i].split(',');

            var category = '';
            for(var j=0; j<split.length-2; j++)
            {
                if(category)
                {
                    category += '@@@';
                }

                category += split[j];
            }

            dialogsetList.push({ q: split[split.length-2], a: split[split.length-1], category: category });
        }

        async.eachSeries(dialogsetList, function(item, next)
        {
            var dialogsetDialog = new DialogsetDialog();
            dialogsetDialog.dialogset = dialogsetId;
            dialogsetDialog.inputRaw = [item.q];
            dialogsetDialog.output = [item.a];
            dialogsetDialog.category = item.category;

            console.log('세이브 : ', item.q);

            NLPManager.getNlpedText(language, item.q, function(err, lastChar, nlpText, nlp)
            {
                dialogsetDialog.input = [nlpText];

                dialogsetDialog.save(function()
                {
                    next();
                });
            });
        },
        function()
        {
            callback();
        });
    };

    Uploader.prototype.upload = function(botId, language, dialogsetId, filename, callback)
    {
        var dir = path.resolve('public/files/');
        var filePath = path.join(dir, filename);
        var info = path.parse(filename);

        if(info.ext == '.xls' || info.ext == '.xlsx')
        {
            this.uploadFromExcel(botId, language, dialogsetId, filePath, callback);
        }
        else if(info.ext == '.csv')
        {
            this.uploadFromCsv(botId, language, dialogsetId, filePath, callback);
        }
    };

    module.exports = new Uploader();

    // var upload = new Uploader();
    // upload.upload('ko', '홈페이지_FAQ(20170609)_키워드분류_v2.3(학습용_키워드제외)_주제제외.xlsx');
})();
