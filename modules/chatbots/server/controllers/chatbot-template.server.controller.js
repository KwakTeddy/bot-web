var path = require('path');
var fs = require('fs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Template = mongoose.model('Template');
var cheerio = require('cheerio');

exports.find = function(req, res)
{
    Template.find().sort('-created').populate('user', 'displayName').populate('category').exec(function(err, templates)
    {
        if (err)
        {
            console.log(err);
            return res.status(400).send({ error: err });
        }
        else
        {
            res.jsonp(templates);
        }
    });
};

exports.findOne = function(req, res)
{
    Template.findOne({ _id: req.params.templateId }).populate('user', 'displayName').populate('category').exec(function(err, template)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err.stack || err });
        }

        template = JSON.parse(JSON.stringify(template));
        fs.readFile(path.resolve('./templates') + '/' + template.id + '/client/views/html/basic.html', function(err, data)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err.stack || err });
            }

            var $ = cheerio.load(data.toString());
            template.createHtml = $('form').parent().html().replace(/ng-controller/gi, 'data-controller').replace(/ng-model/gi, 'name');
            // template.createHtml = $('form').parent().parent().html();

            res.jsonp(template);
        });
    });
};

exports.findTemplateData = function(req, res)
{
    var botId = req.params.botId;
    var templateId = req.query.templateId;

    fs.readFile(path.resolve('./templates') + '/' + templateId + '/data-schema.json', function(err, jsonData)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        //JSON 객체로 만들고
        var json = JSON.parse(jsonData.toString());

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-data';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.findOne({ botId: botId }).exec(function(err, item)
        {
            if(err)
            {
                return res.status(400).send({ error: err });
            }

            res.jsonp(item);
        });
    });
};

exports.updateData = function(req, res)
{
    var data = req.body.data;
    var templateId = req.body.templateId;
    var _id = req.body._id;

    // 컬렉션정보를 생성하기 위해 data-schema 파일을 가져온다.
    fs.readFile(path.resolve('./templates') + '/' + templateId + '/data-schema.json', function(err, jsonData)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        //JSON 객체로 만들고
        var json = JSON.parse(jsonData.toString());

        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-data';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        model.update({ _id: _id }, {$set: data}).exec(function(err, result)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            res.jsonp(result);
        });
    });
};


exports.saveData = function(req, res)
{
    var data = req.body.data;
    var templateId = req.body.templateId;
    var botId = req.params.botId;

    // 컬렉션정보를 생성하기 위해 data-schema 파일을 가져온다.
    fs.readFile(path.resolve('./templates') + '/' + templateId + '/data-schema.json', function(err, jsonData)
    {
        if(err)
        {
            console.error(err.stack || err);
            return res.status(400).send({ error: err });
        }

        //JSON 객체로 만들고
        var json = JSON.parse(jsonData.toString());
        json.botId = 'String';

        //몽고디비 스키마 생성
        var schema = new Schema(json);

        var name = templateId + '-data';

        var model = undefined;

        if(mongoose.models[name])
            model = mongoose.model(name);
        else
            model = mongoose.model(name, schema);

        // Collection 이름을 templateName-data 로 만들어서 모델을 생성.
        var object = new model();
        for(var key in data)
        {
            object[key] = data[key];
        }

        object.botId = botId;

        // 실제 데이터를 데이터베이스에 저장한다.
        object.save(function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            res.jsonp(object);
        });
    });
};
