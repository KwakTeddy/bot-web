var path = require('path');

var mongoose = require('mongoose');
var DialogsetDialog = mongoose.model('DialogsetDialog');
var async = require('async');
var NLPManager = require(path.resolve('./engine2/input/nlp.js'));

exports.message = function (req, res)
{
    var Engine = require(path.resolve('./engine2/core.js'));

    try
    {
        var userKey = req.body.userKey;
        var text = req.body.text;
        var channel = req.body.channel;

        Engine.process(req.params.bot, channel || 'rest', userKey, text, {}, function (context, out)
        {
            if(channel=='unity'&&out.originalDialogId == 'noanswer')
            {
                console.log('no response')
                return res.end();
            }

            if(channel=='unity'){
                console.log(out);
                res.send(out);
            }else{
                res.send(out.output);
            }

        },
        function(err)
        {
            res.send({ text: JSON.stringify(err) });
        });
    }
    catch(e)
    {
        console.error('에러 : ', e);
        res.write('');
        res.end();
    }
};


exports.dialog = function(req, res)
{
    var data = req.body;
    data.inputRaw = JSON.parse(data.inputRaw);
    data.output = JSON.parse(data.output);
    req.body = data;

    var dialog = new DialogsetDialog(req.body);

    DialogsetDialog.find({ dialogset: req.params.dialogsetId }).sort('-id').limit(1).exec(function(err, dialogs)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        dialog.id = dialogs && dialogs.length > 0 ? dialogs[0].id + 1 : 0;

        var inputList = [];

        async.eachSeries(dialog.inputRaw, function(inputRaw, done)
            {
                inputRaw = inputRaw.trim();

                var language = 'ko'; //temporary
                NLPManager.getNlpedText(language, inputRaw, function(err, lastChar, nlpText, nlp)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    inputList.push(nlpText);
                    done();
                });
            },
            function()
            {
                dialog.input = inputList;
                dialog.save(function(err,result)
                {
                    if (err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }
                    else
                    {
                        dialog._id = result.id;
                        res.jsonp(dialog);
                    }
                });
            });
    });
};
