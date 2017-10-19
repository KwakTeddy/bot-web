var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');

var BotFile = mongoose.model('BotFile');

exports.find = function (req, res)
{
    BotFile.find({ bot: req.params.botId }).populate('user', 'displayName').populate('bot').exec(function (err, files)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.json(files);
    });
};

exports.fileFile = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.params.fileName);

    fs.readFile(filePath, function(err, data)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        var data = data.toString();
        res.json({ data : data });
    });
};
