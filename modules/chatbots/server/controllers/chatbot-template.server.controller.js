var path = require('path');
var fs = require('fs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Template = mongoose.model('Template');

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

    // fs.readdir(path.resolve('./templates'), function(err, dirs)
    // {
    //     if(err)
    //     {
    //         console.error(err);
    //         return res.status(400).send({ error : err });
    //     }
    //
    //     var result = [];
    //
    //     for(var i=0; i<dirs.length; i++)
    //     {
    //         if(fs.lstatSync(path.resolve('./templates') + '/' + dirs[i]).isDirectory())
    //         {
    //             result.push(dirs[i]);
    //         }
    //     }
    //
    //     res.jsonp(result);
    // });
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
        fs.readFile(path.resolve('./templates') + '/' + template.name + '/views/html/basic.html', function(err, data)
        {
            template.createHtml = data.toString();

            res.jsonp(template);
        });
    });
};

exports.saveData = function(req, res)
{
    var data = req.body.data;
    var templateName = req.body.templateName;

    // 컬렉션정보를 생성하기 위해 data-schema 파일을 가져온다.
    fs.readFile(path.resolve('./templates') + '/' + templateName + '/data-schema.json', function(err, jsonData)
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

        var name = templateName + '-data';

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
