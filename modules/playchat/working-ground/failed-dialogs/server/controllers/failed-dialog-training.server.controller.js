var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var Dialogset = mongoose.model('Dialogset');
var DialogsetDialog = mongoose.model('DialogsetDialog');

var NLPManager = require(path.resolve('./engine/bot/engine/nlp/nlp-manager.js'));

var stripArray = function(docs)
{
    var result = [];
    for (var i=0; i<docs.length; i++) {
        var answer = docs[i];
        if (Array.isArray(answer.inputRaw)) {
            for (var j=0; j<answer.inputRaw.length; j++) {
                //var tempAnswer = docs[i];
                var tempAnswer = Object.assign({}, docs[i]);
                tempAnswer.input = docs[i].input[j];
                tempAnswer.inputRaw = docs[i].inputRaw[j];
                tempAnswer.output = docs[i].output[j];
                result.push(tempAnswer);
            }
        } else {
            result.push(answer);
        }
    }
    return result;
};

var unionArray = function(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) tmp[b[i]]=1;
    for(var k in tmp) res.push(k);
    return res;
}

var intersectArray = function(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) if(tmp[b[i]]) res.push(b[i]);
    return res;
}

var getJarccardScore = function(question, answer) {
    var questionArray = question.split(' ');
    var answerArray = answer.split(' ');
    var intersection = intersectArray(questionArray, answerArray);
    var union = unionArray(questionArray, answerArray);
    return (parseFloat(intersection.length) / parseFloat(union.length));
}

module.exports.findSimiliars = function(req, res)
{
    var query = undefined;

    if(req.query.type == 'inputRaw')
    {
        query = { inputRaw: new RegExp(req.query.text) };
    }
    else if(req.query.type == 'output')
    {
        query = { output: new RegExp(req.query.text) };
    }

    DialogsetDialog.find(query).exec(function (err, result)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            result = stripArray(result);
            for (var i=0; i<result.length; i++)
            {
                var distance = getJarccardScore(req.query.text, result[i].inputRaw.toLowerCase());
                result[i]["distance"] = distance;
            }

            result.sort(function(a, b)
            {
                return b.distance - a.distance;
            });

            result.splice(10, result.length - 10);

            res.jsonp(JSON.parse(JSON.stringify(result)));
        }
    });
};

module.exports.create = function(req, res)
{
    var dialog = new DialogsetDialog();
    dialog.inputRaw = req.body.inputRaw;
    dialog.output = req.body.output;

    Dialogset.findOne({ bot: req.params.botId, title: 'default' }).exec(function(err, dialogset)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: err.stack || err });
        }

        DialogsetDialog.find({ dialogset: dialogset._id }).sort('-id').limit(1).exec(function(err, dialogs)
        {
            if (err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: err.stack || err });
            }

            dialog.id = dialogs && dialogs.length > 0 ? dialogs[0].id + 1 : 0;

            var inputList = [];

            async.eachSeries(dialog.inputRaw, function(inputRaw, done)
            {
                inputRaw = inputRaw.trim();

                var language = 'ko'; //temporary
                NLPManager.getNlpedText(inputRaw, language, function(err, result)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    inputList.push(result);
                    done();
                });
            },
            function()
            {
                dialog.input = inputList;
                dialog.save(function(err)
                {
                    if (err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }
                    else
                    {
                        res.jsonp(dialog);
                    }
                });
            });
        });
    });
};
