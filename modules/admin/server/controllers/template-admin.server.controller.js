var mongoose = require('mongoose');
var Template = mongoose.model('Template');
var TemplateCategories = mongoose.model('TemplateCategory');

var path = require('path');
var fs = require('fs');

module.exports.findTemplateCategories = function(req, res)
{
    TemplateCategories.find({}).exec(function(err, list)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.jsonp(list);
    });
};

module.exports.createTemplate = function(req, res)
{
    Template.findOne({ id: req.body.id }).exec(function(err, item)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        if(item)
        {
            return res.status(400).send({ message: 'duplicated' });
        }

        var template = new Template(req.body);
        template.save(function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ error: err });
            }

            fs.mkdirSync(path.resolve('./templates/' + template.id));
            fs.mkdirSync(path.resolve('./templates/' + template.id + '/bot'));
            fs.mkdirSync(path.resolve('./templates/' + template.id + '/client'));
            fs.mkdirSync(path.resolve('./templates/' + template.id + '/client/controllers'));
            fs.mkdirSync(path.resolve('./templates/' + template.id + '/client/views'));
            fs.mkdirSync(path.resolve('./templates/' + template.id + '/client/html'));

            fs.writeFileSync(path.resolve('./templates/' + template.id + '/data-schema.json'), JSON.stringify({}, null, 4));
            fs.writeFileSync(path.resolve('./templates/' + template.id + '/playchat-menu-schema.json'), JSON.stringify({ menus: [{ "name" : "sample", "url" : "/templates/sample", "icon" : "" }] }, null, 4));

            res.jsonp(template);
        });
    });
};
