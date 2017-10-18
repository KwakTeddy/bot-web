var mongoose = require('mongoose');

var BotFile = mongoose.model('BotFile');

exports.listFile = function (req, res)
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
