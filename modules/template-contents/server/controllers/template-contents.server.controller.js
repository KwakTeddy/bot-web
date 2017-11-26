var fs = require('fs');
var multer = require('multer');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

module.exports.findMenus = function(req, res)
{
    var botId = req.params.botId;
    var templateName = req.params.templateName;

    fs.readFile(path.resolve('./templates/' + templateName + '/menu-schema.json'), function(err, data)
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

        var name = templateName + '-menu';

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
    var templateName = req.params.templateName;
    var menus = req.body.menus;

    fs.readFile(path.resolve('./templates/' + templateName + '/menu-schema.json'), function(err, data)
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

        var name = templateName + '-menu';

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
    var templateName = req.params.templateName;

    fs.readFile(path.resolve('./templates/' + templateName + '/event-schema.json'), function(err, data)
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

        var name = templateName + '-event';

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
    var templateName = req.params.templateName;
    var events = req.body.events;

    fs.readFile(path.resolve('./templates/' + templateName + '/event-schema.json'), function(err, data)
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

        var name = templateName + '-event';

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
