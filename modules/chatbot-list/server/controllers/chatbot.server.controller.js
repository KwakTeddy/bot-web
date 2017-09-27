var mongoose = require('mongoose');
var ChatBot = mongoose.model('Bot');

exports.list = function (req, res)
{
    var sort = req.query.sort || '-created';
    var perPage = req.body.perPage || 10;

    if(req.query.developer)
    {
        perPage = 0;
    }

    var query = {};
    query['public'] = true;

    if(req.body.listType == 'popular')
    {
        sort = '-followed';
    }
    else if(req.body.listType == 'my')
    {
        delete query.public;
        query['user'] = req.body.botUserId;
    }

    if(req.query.my)
    {
        delete query.public;
        query['user'] =  req.user._id;
    }

    if(req.body.query)
    {
        query['name'] = new RegExp(req.body.query, 'i');
    }

    if(req.query.role && (req.query.role == 'admin'))
    {
        query = {};
    }

    ChatBot.find(query).sort(sort).populate('user').skip(req.body.currentPage * perPage).limit(perPage).exec(function (err, bots)
    {
        if(err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.json(bots);
        }
    });
};
