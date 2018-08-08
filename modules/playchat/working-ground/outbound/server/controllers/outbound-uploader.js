var path = require('path');
var XLSX = require('xlsx');
var async = require('async');
var fs = require('fs');

var mongoose = require('mongoose');

(function()
{
    var Uploader = function()
    {

    };

    const match = /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g;

    var replacePhone = (numb) => {
        numb = numb.toString().replace(/[^0-9]/g,'');
        numb = numb.length == 10 ? '0' + numb : numb;

        if(numb.match(match)){
            return numb
        }else{
            return null
        }

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

    Uploader.prototype.uploadFromExcel = function(userId, filePath, callback)
    {
        var workbook = XLSX.readFile(filePath);
        var first_sheet_name = workbook.SheetNames[0];
        var ws = workbook.Sheets[first_sheet_name];

        var range = XLSX.utils.decode_range(ws['!ref']);

        if(range.e.c < 0)
        {
            throw 'The format does not match';
        }



        var teleBookList = [];
        var lastData = undefined;

        for(var r=1;r<=range.e.r;r++){
            var name = ws[XLSX.utils.encode_cell({ c: 0, r: r })];
            var number = ws[XLSX.utils.encode_cell({ c: 1, r: r })];

            if(name&&number){
                var item = {};
                item.name = name.v;
                item.number = replacePhone(number.v);


                if(item.number){
                    teleBookList.push(item)
                }
            }

        }
        console.log(teleBookList)
        process.exit()


        async.eachSeries(teleBookList, function(item, next)
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
    };

    Uploader.prototype.uploadFromCsv = function(userId, filePath, callback)
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

    Uploader.prototype.upload = function(userId, filename, callback)
    {
        var dir = path.resolve('public/files/');
        var filePath = path.join(dir, filename);
        var info = path.parse(filename);

        if(info.ext == '.xls' || info.ext == '.xlsx')
        {
            this.uploadFromExcel(userId, filePath, callback);
        }
        else if(info.ext == '.csv')
        {
            this.uploadFromCsv(userId, filePath, callback);
        }
    };

    module.exports = new Uploader();

    var upload = new Uploader();
    upload.upload('ko', 'Telebook.xlsx');
})();
