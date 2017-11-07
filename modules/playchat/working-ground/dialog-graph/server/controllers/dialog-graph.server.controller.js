var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');

var NLPManager = require(path.resolve('./engine/bot/engine/nlp/nlp_manager.js'));

var logger = require(path.resolve('./config/lib/logger.js'));

var BotFile = mongoose.model('BotFile');

exports.find = function (req, res)
{
    // BotFile.find({ bot: req.params.botId }).populate('user', 'displayName').populate('bot').exec(function (err, files)
    // {
    //     if (err)
    //     {
    //         return res.status(400).send({ message: err.stack || err });
    //     }
    //
    //     res.json(files);
    // });

    var botsPath = path.resolve('./custom_modules/' + req.params.botId);
    fs.readdir(botsPath, function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        var result = [];
        for(var i=0; i<list.length; i++)
        {
            if(!list[i].endsWith('.js') || list[i].endsWith('.test.js'))
            {
                continue;
            }

            result.push(list[i]);
        }

        res.jsonp(result);
    });
};

exports.findFile = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.params.fileName);

    fs.stat(filePath, function(err, stat)
    {
        if(err || !stat)
        {
            return res.status(404).end();
        }

        fs.readFile(filePath, function(err, data)
        {
            if(err)
            {
                return res.status(400).send({ message: err.stack || err });
            }

            var data = data.toString();
            res.json({ data : data });
        });
    });
};

exports.saveFile = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.params.fileName);

    fs.writeFile(filePath, req.body.data, function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.end();
    });
};

exports.uploadImage = function(req, res)
{
    var now = new Date().getTime();

    var storage = multer.diskStorage(
    {
        destination: function (req, file, cb)
        {
            cb(null, './public/files/');
        },
        filename: function (req, file, cb)
        {
            cb(null, req.params.botId + '-' + now);
        }
    });

    var fileFilter = function (req, file, cb)
    {
        if (!file.mimetype.startsWith('image'))
        {
            return cb(new Error('Only image files are allowed!'), false);
        }

        cb(null, true);
    };

    var upload = multer({ storage: storage, fileFilter: fileFilter }).single('uploadFile');

    upload(req, res, function (uploadError)
    {
        if (uploadError)
        {
            return res.status(400).send({ message: uploadError.message });
        }
        else
        {
            var botId = req.params.botId;

            res.jsonp({ url : '/files/' + botId + '-' + now});
        }
    });
};

module.exports.getNlp = function(req, res)
{
    var language = 'ko'; //temporary
    NLPManager.getNlpedText(req.params.text, language, function(err, result)
    {
        if(err)
        {
            return res.status(400).send({ message: uploadError.message });
        }

        console.log('결과 : ' + result);
        res.jsonp({ text: result });
    });
};
