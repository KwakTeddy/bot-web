var path = require('path');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Report = mongoose.model('Report');

var nodemailer = require('nodemailer');
var config = require(path.resolve('./config/config'));
var smtpTransport = nodemailer.createTransport(config.mailer.options);

var fs = require('fs');

module.exports.core = function(req, res, next)
{
    if(req.user.roles.indexOf('admin') == -1)
      return res.status(401).end();

    next();
};

module.exports.findCloseBetaUser = function(req, res, next)
{
    User.find({ username: /user/ }, {username: true, email: true, displayName: true, created: true, state: true}).sort({ state: -1, created: -1 }).lean().exec(function(err, list)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.jsonp(list);
    });
};

module.exports.approveCloseBetaUser = function(req, res, next)
{
    User.findOne({ email: req.body.email }).exec(function(err, user)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }


        if(user)
        {
            user.state = true;
            user.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                var subject = {
                    ko: "클로즈베타 승인 완료",
                    en: "Play Chat Closed Beta Approved",
                    zh: "PlayChat封闭测试版批准",
                    jp: "PlayChatクローズドベータ承認済み"
                }

                var mailOptions = {
                    to: user.email,
                    from: config.mailer.from,
                    subject: subject[req.user.language],
                    html: fs.readFileSync(path.resolve('./modules/admin/server/controllers/template/approve.' + req.user.language + '.server.view.html')).toString()
                };

                smtpTransport.sendMail(mailOptions, function (err)
                {
                    if (!err)
                    {
                        return res.status(200).send({ message: 'An email has been sent to the provided email with further instructions.' });
                    }
                    else
                    {
                        console.log(err);
                        return res.status(400).send({ message: 'Failure sending email' });
                    }
                });
            });
        }
        else
        {
            res.status(404).send();
        }
    });
};


module.exports.saveReporting = function(req, res)
{
    var report = new Report();

    report.content = req.body.content;
    report.email = req.user.email;

    report.save(function(err)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.jsonp(report);
    });
};
