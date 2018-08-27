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

    var page = req.query.page || 1;
    var countPerPage = parseInt(req.query.countPerPage) || 10;

    var query = { botId: botId };
    if(req.query.query)
    {
        var q = JSON.parse(req.query.query);
        for(var key in q)
        {
            query[key] = q[key];
        }
    }

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

    if(req.query.page!==undefined) {
    model.find(query).skip(countPerPage * (page - 1)).limit(countPerPage).exec(function (err, list) {
        if (err) {
            console.error(err);
            return res.status(400).send({error: err});
        }

        res.jsonp(list);
    });
    }
    else{
    model.find(query).exec(function (err, list) {
        if (err) {
            console.error(err);
            return res.status(400).send({error: err});
        }
        res.jsonp(list);
    });
}
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
    var botId = req.params.botId;
    var templateId = req.params.templateId;
    var datasKey = req.params.datas;
    var datas = req.body;

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

        model.findById(req.body._id, function(err, doc){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!doc) return res.status(404).json({ error: 'data not found' });


            for(var prop in datas) {
                doc[prop] = datas[prop];
            }

            doc.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            });
        });
    });
}

module.exports.sendSMS = function(req, res) {
    request.post(
        'https://bot.moneybrain.ai/api/messages/sms/send',
        {json: {callbackPhone: "02-858-5683", phone: req.body.mobile.replace(/-/g, ""), message: req.body.message}},
        function (error, response, body) {
            console.log('sms send');
        }
    );
    res.end();
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

