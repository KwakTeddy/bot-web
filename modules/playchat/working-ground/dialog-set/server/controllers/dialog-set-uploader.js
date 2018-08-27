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


        if(range.e.c <= 0)
        {
            return callback('The format does not match');
        }

        var dialogsetList = [];
        var lastData = undefined;


        for(var r=1; r<=range.e.r; r++)
        {
            var q = ws[XLSX.utils.encode_cell({ c: range.e.c-1, r: r })];
            var a = ws[XLSX.utils.encode_cell({ c: range.e.c, r: r })];

            if(!a)
            {
                lastData = { q: [], a: [] };
                dialogsetList.push(lastData);
                continue;
            }

            try{
                q = q.v;
                a = a.v;
            }catch(e){
                return callback('The format does not match');
                break;
            }

            var category = '';

            for(var c=0; c<range.e.c-1; c++)
            {
                if(category)
                {
                    category += '@@@';
                };

                var target = ws[XLSX.utils.encode_cell({ c: c, r: r })];
                try{
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

                            // for safety code. if it has problem, fix it!
                            if(i>10){
                                return callback('The format does not match');
                                break;
                            }
                        }

                        category += target.v.trim();
                    }
                }catch(e){
                    console.log(e);
                    return callback('The format does not match');
                    break;
                }

            }

            if(q && a)
            {
                lastData = { q: [], a: [] };
                dialogsetList.push(lastData);
            }

            if(lastData)
            {
                lastData.category = category;

                if(q)
                {
                    lastData.q.push(q.trim());
                }

                if(a)
                {
                    lastData.a.push(a.trim());
                }
            }
        }

        async.eachSeries(dialogsetList, function(item, next)
        {
            if(item.q.length == 0 || item.a.length == 0)
            {
                return next();
            }

            var dialogsetDialog = new DialogsetDialog();
            dialogsetDialog.dialogset = dialogsetId;
            dialogsetDialog.inputRaw = item.q;
            dialogsetDialog.input = [];
            dialogsetDialog.output = item.a;
            dialogsetDialog.category = item.category;

            async.eachSeries(item.q, function(q, next)
            {
                NLPManager.getNlpedText(language, q, function(err, lastChar, nlpText, nlp)
                {
                    dialogsetDialog.input.push(nlpText);
                    next();
                });
            },
            function()
            {
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

        data = data.toString();

        var list = [];
        var split = data.split('\r\n');
        for(var i=1; i<split.length; i++)
        {
            var line = split[i];
            var matched = line.match(/,"[^"]*"/gi);

            if(matched)
            {
                for(var j=0; j<matched.length; j++)
                {
                    line = line.replace(matched[j], '');
                }
            }

            line = line.trim();

            var obj = [];
            var subSplit = line.split(',');

            var j = 0;
            for(; j<subSplit.length; j++)
            {
                obj.push(subSplit[j]);
            }

            if(matched)
            {
                for(var k=0; k<matched.length; k++)
                {
                    var s = matched[k].replace(/"/gi, '').substring(1);
                    if(s.trim())
                    {
                        obj.push(s);
                    }
                }
            }

            list.push(obj);
        }

        var dialogsetList = [];
        var lastData = undefined;
        for(var i=0; i<list.length; i++)
        {
            var item = list[i];

            var category = '';
            for(var j=0; j<item.length-2; j++)
            {
                if(category)
                {
                    category += '@@@';
                }

                category += item[j];
            }

            var q = item[item.length-2];
            var a = item[item.length-1];

            if(q && a)
            {
                lastData = { q: [], a: [] };
                dialogsetList.push(lastData);
            }

            if(lastData)
            {
                lastData.category = category;

                if(q)
                {
                    lastData.q.push(q);
                }

                if(a)
                {
                    lastData.a.push(a);
                }
            }
        }

        async.eachSeries(dialogsetList, function(item, next)
        {
            var dialogsetDialog = new DialogsetDialog();
            dialogsetDialog.dialogset = dialogsetId;
            dialogsetDialog.inputRaw = item.q;
            dialogsetDialog.input = [];
            dialogsetDialog.output = item.a;
            dialogsetDialog.category = item.category;

            async.eachSeries(item.q, function(q, next)
            {
                NLPManager.getNlpedText(language, q, function(err, lastChar, nlpText, nlp)
                {
                    dialogsetDialog.input.push(nlpText);
                    next();
                });
            },
            function()
            {
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

        // var data = fs.readFileSync(filePath);
        // if(data)
        // {
        //     data = data.toString();
        // }
        // else
        // {
        //     return callback();
        // }
        //
        // var lines = data.split('\r\n');
        //
        // var dialogsetList = [];
        // for(var i=1; i<lines.length; i++)
        // {
        //     var split = lines[i].split(',');
        //
        //     var category = '';
        //     for(var j=0; j<split.length-2; j++)
        //     {
        //         if(category)
        //         {
        //             category += '@@@';
        //         }
        //
        //         category += split[j];
        //     }
        //
        //     dialogsetList.push({ q: split[split.length-2], a: split[split.length-1], category: category });
        // }
        //
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
