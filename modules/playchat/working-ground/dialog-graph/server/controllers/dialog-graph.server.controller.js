var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');

var logger = require(path.resolve('./config/lib/logger.js'));

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
    res.jsonp({ text: req.params.text });
};
