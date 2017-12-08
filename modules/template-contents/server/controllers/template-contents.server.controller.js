var fs = require('fs');
var multer = require('multer');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var request = require('request');

module.exports.findDatas = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.params.templateId;
    var datasKey = req.params.datas;

    fs.readFile(path.resolve('./templates/' + templateId + '/' + datasKey + '-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            console.log("!!!!!!!!!!!!");
            return res.status(400).send({ error: err });
        }

        var json = JSON.parse(data.toString());
        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-' + datasKey;

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        console.log('모델명 : ', name, botId);

        model.find({ botId: botId }).exec(function(err, list)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            res.jsonp(list);
        });
    });
};

module.exports.createDatas = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.params.templateId;
    var datasKey = req.params.datas;
    var datas = req.body.datas;

    fs.readFile(path.resolve('./templates/' + templateId + '/' + datasKey + '-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        var json = JSON.parse(data.toString());
        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-' + datasKey;

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.remove({ botId: botId }).exec(function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            async.eachSeries(datas, function(data, next)
            {
                data = new model(data);
                data.botId = botId;

                data.save(function(err)
                {
                    if(err)
                    {
                        console.error(err);
                    }

                    next();
                })
            },
            function()
            {
                res.end();
            })
        });
    });
};

module.exports.updateData = function(req, res)
{
    //
    res.end();
}

module.exports.sendSMS = function(req, res) {
    // console.log(JSON.stringify(req.params));
    // console.log(JSON.stringify(req.body));
    request.post(
        'https://bot.moneybrain.ai/api/messages/sms/send',
        {json: {callbackPhone: "02-858-5683", phone: req.body.mobile.replace(/-/g, ""), message: req.body.message}},
        function (error, response, body) {
            if(error) console.log("!!!"+error);
            console.log(body);
            console.log('sms send');
        }
    );
}

module.exports.findMenus = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.params.templateId;

    fs.readFile(path.resolve('./templates/' + templateId + '/menus-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        var json = JSON.parse(data.toString());
        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-menu';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.find({ botId: botId }).exec(function(err, list)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            res.jsonp(list);
        });
    });
};

module.exports.saveMenus = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.params.templateId;
    var menus = req.body.menus;

    fs.readFile(path.resolve('./templates/' + templateId + '/menus-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        var json = JSON.parse(data.toString());

        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-menu';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.remove({ botId: botId }).exec(function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            async.eachSeries(menus, function(menu, next)
            {
                menu = new model(menu);
                menu.botId = botId;
                menu.save(function(err)
                {
                    if(err)
                    {
                        console.error(err);
                    }

                    next();
                })
            },
            function()
            {
                res.end();
            })
        });
    });
};



module.exports.findEvents = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.params.templateId;

    fs.readFile(path.resolve('./templates/' + templateId + '/events-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        var json = JSON.parse(data.toString());
        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-event';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.find({ botId: botId }).exec(function(err, list)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            res.jsonp(list);
        });
    });
};

module.exports.saveEvents = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.params.templateId;
    var events = req.body.events;

    fs.readFile(path.resolve('./templates/' + templateId + '/events-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        var json = JSON.parse(data.toString());

        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-event';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.remove({ botId: botId }).exec(function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            async.eachSeries(events, function(event, next)
            {
                event = new model(event);
                event.botId = botId;
                event.save(function(err)
                {
                    if(err)
                    {
                        console.error(err);
                    }

                    next();
                })
            },
            function()
            {
                res.end();
            })
        });
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

    var upload = multer({ storage: storage, fileFilter: fileFilter }).single('uploadImage');

    upload(req, res, function (uploadError)
    {
        if (uploadError)
        {
            console.error(uploadError); return res.status(400).send({ message: uploadError.message });
        }
        else
        {
            var botId = req.params.botId;

            res.jsonp({ url : '/files/' + botId + '-' + now});
        }
    });
};

