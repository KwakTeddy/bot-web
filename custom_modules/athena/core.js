var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('./engine/core/bot')).getBot('athena');
var util = require('util');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');
var smtpTransport = nodemailer.createTransport(config.mailer.options);
var command = require(path.resolve('./modules/bot/action/common/command'));

function userCheck (task, context, callback) {
    var channel = context.user.channel;
    var User = mongoose.model('User');
    var userKey = context.user.userKey;
    var query = {};
    query['messengerIds'] = {};
    query['messengerIds'][channel] = {userId: userKey};
    User.find(query).lean().exec(function (err,docs) {
        // console.log(docs);
        if (docs.length != 0) {
            context.user.check = true;
        } else {
            context.user.check = false;
        }
        callback(task,context);
    })
}

exports.userCheck = userCheck;

function emailTypeCheck(text, type, task, context, callback) {
    var re = /([0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3})/ig;
    var matched = false;
    var User = mongoose.model('User');

    text = text.match(re);
    if (text) {
        var email = text[0];
        User.find({'email': email}).lean().exec(function(err,docs) {
            if (docs.length != 0) {
                matched = true;
                context.dialog.emailcheck = email;
                context.dialog.emailusercheck = true;
                callback(text, task, context, matched)
            } else {
                context.dialog.emailusercheck = false;
                callback(text, task, context, matched)
            }
        });

    } else {
        callback(text, task, matched);
    }


}

exports.emailTypeCheck = emailTypeCheck;

function authemail (task, context, callback) {
    if (context.dialog.emailusercheck == true) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(2, function (err, buffer) {
                    var token = buffer.toString('hex');
                    context.dialog.localEmailConfirmToken = token;
                    context.dialog.localEmailConfirmExpires = Date.now() + 3600000; // 1 hour
                    done(err, token);
                });
            }, function (token, done) {
                var mailTemplate =
                    '<!DOCTYPE html>' +
                    '<html lang="en" xmlns="http://www.w3.org/1999/xhtml">' +
                    '' +
                    '    <head>' +
                    '    <title>Play Chat 인증 메일</title>' +
                    '    </head>' +
                    '' +
                    '    <body>' +
                    '<p>Play Chat의 사용자 인증을 위해서 아래 코드를 접속하신 메신저 창에 입력해주세요.</p>' +
                    '<p>'+ token + '</p>' +
                    '<strong>회원님이 요청한 인증 내용이 아니면, 이 이메일을 무시하시기 바랍니다. 위의 인증 링크는 한시간 동안 유효합니다.</strong>' +
                    '<br />' +
                    '<br />' +
                    '</body>' +
                    '' +
                    '</html>';

                var mailOptions = {
                    to: context.dialog.emailcheck,
                    from: config.mailer.from,
                    subject: 'Play Chat 인증 메일입니다.',
                    html: mailTemplate
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    done(err);
                });
            }]);
        callback(task,context);
    } else {
        callback(false);
    }
}

exports.authemail = authemail;

function codeTypeCheck(text, type, task, context, callback) {
    var re = /([a-z]|[0-9]){4}/g;
    var matched = false;
    var User = mongoose.model('User');

    text = text.match(re);
    if (text) {
        task.code = text[0];
        matched = true;
        callback (text,task,matched);
    } else {
        callback(text, task, matched);
    }
}

exports.codeTypeCheck = codeTypeCheck;

function authcode (task, context, callback) {
    if(context.dialog.code == context.dialog.localEmailConfirmToken) {
        context.dialog.codecheck = true;
        var email = context.dialog.emailcheck;
        var channel = context.user.channel;
        var userKey = context.user.userKey;
        var User = mongoose.model('User');
        var _doc = {};
        _doc[channel] = {};
        _doc[channel].userId = userKey;
        User.update({'email': email}, {messengerIds : _doc}, function (err) {
        });
        User.find({'email': email}).exec(function (err, docs) {
            context.user.playchatId = docs[0]._id;
            callback(task,context);
        });
    } else {
        context.dialog.codecheck = false;
        callback(task,context);
    }
}

exports.authcode = authcode;



function mybotlist (task,context,callback) {
    var query = {};
    var sort = '-created';
    var UserBot = mongoose.model('Bot');
    query['user'] = context.user.playchatId;
    UserBot.find(query).sort(sort).populate('user').lean().exec(function (err, docs) {
        context.dialog.mybot = docs;
        callback(task,context);
    })
}

exports.mybotlist = mybotlist;

function popularbotlist (task,context,callback) {
    var query = {public:true};
    var sort = '-followed';
    var UserBot = mongoose.model('Bot');
    UserBot.find(query).sort(sort).limit(5).lean().exec(function (err, docs) {
        context.dialog.popularbot = docs;
        callback(task,context);
    })
}

exports.popularbotlist = popularbotlist;

function newbotlist (task,context,callback) {
    var query = {public:true};
    var sort = '-created';
    var UserBot = mongoose.model('Bot');
    UserBot.find(query).sort(sort).limit(5).lean().exec(function (err, docs) {
        context.dialog.newbot = docs;
        callback(task,context);
    })
}

exports.newbotlist = newbotlist;

function followbotlist (task,context,callback) {
    var query = {};
    var UserBotFollow = mongoose.model('BotFollow');
    query['botUserId'] = context.user.playchatId;
    query['followed'] = true;
    UserBotFollow.find(query).populate('Bot').sort('-created').lean().exec(function (err, docs) {
        // console.log(docs);
        context.dialog.followbot = [];
        for (var i in docs) {
            var doc = docs[i];
            if (doc.userBot) {
                context.dialog.followbot.push(doc.userBot);
            }
        }
        callback(task,context);
    });
}

exports.followbotlist = followbotlist;

function connectBot (task,context,callback) {
    task.botName = context.dialog.selectbot.id;
    command.changeBot(task, context, function(_task, _context) {
        callback(_task, _context);
    });
}

exports.connectBot = connectBot;

function callBot (task, context, callback) {
    var command = require(path.resolve('./modules/bot/action/common/command'));
    var query = {};
    var UserBot = mongoose.model('Bot');
    task.botName = task['1'];
    UserBot.find(query).sort(sort).limit(5).lean().exec(function (err, docs) {
        context.dialog.newbot = docs;
        callback(task,context);
    });
    command.changeBot(task, context, function(_task, _context) {
        callback(_task, _context);
    });
}

exports.callBot = callBot;
