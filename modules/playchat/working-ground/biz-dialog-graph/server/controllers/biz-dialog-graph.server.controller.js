var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');

var NLPManager = require(path.resolve('./engine2/input/nlp.js'));

var utils = require(path.resolve('./engine2/utils/utils.js'));

var S3 = require(path.resolve('./modules/common/s3.js'));

var Sentences = mongoose.model('Sentences');

var Scripts = mongoose.model('Scripts');

exports.find = function (req, res)
{
    var botsPath = path.resolve('./custom_modules/' + req.params.botId);

    if(!fs.existsSync(botsPath))
    {
        return res.status(404).end();
    }

    fs.readdir(botsPath, function(err, list)
    {
        if(err)
        {
            console.error(err.stack || err); return res.status(400).send({ message: err.stack || err });
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

exports.checkFile = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.params.fileName);

    res.jsonp({ exist: fs.existsSync(filePath) });
};

// for dialog graph
exports.getGraphFile = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.params.fileName);


    fs.stat(filePath, function(err, stat)
    {
        if(err || !stat)
        {
            return res.status(404).end();
        }

        var bot = {};
        bot.setDialogs = function(dialogs)
        {
            this.dialogs = dialogs;
        };

        bot.setCommonDialogs = function(commonDialogs)
        {
            this.commonDialogs = commonDialogs;
        };

        try
        {
            utils.requireNoCache(filePath, true)(bot);
            res.json({ dialogs: bot.dialogs, commonDialogs: bot.commonDialogs });
        }
        catch(err)
        {
            res.json({ });
        }
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
                console.error(err.stack || err); return res.status(400).send({ message: err.stack || err });
            }

            var data = data.toString();
            res.json({ data : data });
        });
    });
};

exports.saveFile = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.body.fileName);


    if(req.params.fileName && req.body.path)
    {
        fs.rename(req.body.path + '/' + req.body.fileName, filePath, function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({error: err});
            }

            res.jsonp({ fileName: req.params.fileName });
        });
    }
    else
    {
        if(process.env.NODE_ENV == 'production')
        {
            S3.uploadFile('playchat-custom-modules', req.params.botId, req.body.fileName, filePath, function(err, url)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ message: err });
                }

                fs.writeFile(filePath, req.body.data, function(err)
                {
                    if(err)
                    {
                        console.error(err.stack || err); return res.status(400).send({ message: err.stack || err });
                    }

                    res.jsonp({ fileName: req.params.fileName });
                });
            });
        }
        else
        {
            fs.writeFile(filePath, req.body.data, function(err)
            {
                if(err)
                {
                    console.error(err.stack || err); return res.status(400).send({ message: err.stack || err });
                }

                res.jsonp({ fileName: req.params.fileName });
            });
        }
    }
};

exports.deleteFile = function(req, res)
{
    var fileName = req.params.fileName;
    if(fileName == 'default.graph.js' || fileName == 'default.js' || fileName.endsWith('.bot.js'))
    {
        return res.status(400).send({ error: 'Can\'t delete' });
    }

    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + req.params.fileName);

    try
    {
        fs.unlinkSync(filePath);
        res.end();
    }
    catch(err)
    {
        console.error(err.stack || err);
        res.status(400).send({ error: err });
    }
};

exports.uploadFile = function(req, res)
{
    var storage = multer.diskStorage(
    {
        destination: function (req, file, cb)
        {
            cb(null, './public/files/');
        },
        filename: function (req, file, cb)
        {
            cb(null, file.originalname);
        }
    });

    var fileFilter = function (req, file, cb)
    {
        if (!file.mimetype.startsWith('text/javascript'))
        {
            return cb(new Error('Only Javascript files are allowed!'), false);
        }

        cb(null, true);
    };

    var upload = multer({ storage: storage, fileFilter: fileFilter }).single('uploadFile');

    upload(req, res, function (uploadError)
    {
        if (uploadError)
        {
            console.error(uploadError);
            return res.status(400).send({ message: uploadError.message });
        }
        else
        {
            res.json({ path: req.file.destination, fileName: req.file.filename, originalFilename: req.file.originalname });
        }
    });
};

exports.uploadImage = function(req, res)
{
    var now = new Date().getTime();

    var originalname = '';

    var storage = multer.diskStorage(
    {
        destination: function (req, file, cb)
        {
            cb(null, './public/files/');
        },
        filename: function (req, file, cb)
        {
            originalname = file.originalname;
            cb(null, req.params.botId + '-' + now + '-' + file.originalname);
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
            console.error(uploadError); return res.status(400).send({ message: uploadError.message });
        }
        else
        {
            var botId = req.params.botId;

            if(process.env.NODE_ENV == 'production')
            {
                S3.uploadFile('playchat-files', req.user._id.toString(), botId + '-' + now + '-' + originalname, path.resolve('./public/files/' + botId + '-' + now + '-' + originalname), function(err, url)
                {
                    if(err)
                    {
                        console.error(err);
                        return res.status(400).send({ message: err });
                    }

                    res.jsonp({ url : url });
                });
            }
            else
            {
                res.jsonp({ url : '/files/' + botId + '-' + now + '-' + originalname });
            }
        }
    });
};

module.exports.getNlp = function(req, res)
{
    var language = req.query.language;
    NLPManager.getNlpedText(language, req.params.text, function(err, lastChar, nlpText, nlp)
    {
        if(err)
        {
            console.error(err.stack || err);
            return res.status(400).send({ error: err});
        }

        res.jsonp({ text: nlpText });
    });
};

module.exports.getDefaultTemplate = function(req, res)
{
    var language = req.query.language? req.query.language : 'ko';
    var templateId = req.params.fileName;

    var data = fs.readFileSync(path.resolve('./modules/chatbots/server/controllers/'+templateId+'/blank/graph.' + language + '.template'));
    res.send({ data: data.toString() });
};


exports.getSentences = function(req, res){
    var type = req.params.type;
    var query = { templateId: req.params.bizchatId, type:type, useYN: 1 };
    Sentences.find(query)
        .sort('-created')
        .exec((err, sentences) => {
            if(err){
                return res.status(400).send({ message: err.stack || err });
            }else{
                res.jsonp({data:sentences});
            }
        })

};


exports.getScript = function(req, res){
    var type = req.params.type;
    var query = { useYN: 1,type:type };
    Scripts.find(query)
        .sort('-created')
        .exec((err, script) => {
            if(err){
                return res.status(400).send({ message: err.stack || err });
            }else{
                res.jsonp({data:script});
            }
        })
};

exports.editScript = function(req, res){
    var name = req.params.name;
    var type = req.params.type;
    var code = req.body.code;
    if(!code)
        return res.status(400).send({ message: 'Code does not exist' });

    Scripts.findOne({name: name, type: type, useYN: 1}).exec(function(err, script){
        if(err){
            return res.status(400).send({ message: err.stack || err });
        }

        if(script){
            script.code = code;
        }else{
            script = new Scripts();
            script.name = name;
            script.type = type;
            script.code = code;
        }

        script.save(function(err){
            if(err){
                return res.status(400).send({ message: err.stack || err });
            }

            res.jsonp(script)
        })
    })
};