var path = require('path');
var fs = require('fs');

module.exports.getTemplateGnb = function(req, res)
{
    fs.readFile(path.resolve('./templates/' + req.params.templateId + '/playchat-menu-schema.json'), function(err, data)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.jsonp(JSON.parse(data.toString()));
    });
};
