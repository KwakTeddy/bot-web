var path = require('path');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var dateformat = require('dateformat');

var startTask = {
    action: function (task, context, callback) {
        if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
            context.botUser.isOwner = true;
            // context.bot.authKey = null;
        }

        task.result = {smartReply: ['예약', '위치', '영업시간', '메뉴']};

        context.dialog.날짜입력최초 = undefined;
        context.dialog.시간입력최초 = undefined;
        context.dialog.인원선택최초 = undefined;

        if(context.botUser.isOwner) {
            reserveCheck.action(task, context, function(_task, context) {
                callback(task, context);
            })
        } else {
            callback(task, context);
        }
    }
};

exports.startTask = startTask;

var reserveCheck = {
    action: function (task, context, callback) {

        if(context.botUser.isOwner) {
            var TemplateReservation = mongoModule.getModel('TemplateReservation');
            TemplateReservation.find({
                upTemplateId: context.bot.templateDataId,
                status: '예약요청중',
                date: {$gte: new Date()}
            }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
                if(docs && docs.length > 0) {
                    for(var i in docs) {
                        docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
                    }
                    context.dialog.reserves = docs;
                    context.dialog.reserve = undefined;
                } else {
                    context.dialog.reserves = undefined;
                    context.dialog.reserve = undefined;
                }
                callback(task, context);
            });
        } else {
            var TemplateReservation = mongoModule.getModel('TemplateReservation');
            TemplateReservation.find({
                upTemplateId: context.bot.templateDataId,
                userKey: context.user.userKey,
                status: {$ne: '취소'},
                date: {$gte: new Date()}
            }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
                if(docs && docs.length > 1) {
                    for(var i in docs) {
                        docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
                    }
                    context.dialog.reserves = docs;
                    context.dialog.reserve = undefined;
                } else if(docs && docs.length > 0) {
                    docs[0].dateStr = dateformat(docs[0].date + 9 * 60 * 60, 'mm월dd일');
                    context.dialog.reserve = docs[0];
                    context.dialog.reserves = undefined;
                } else {
                    context.dialog.reserves = undefined;
                    context.dialog.reserve = undefined;
                }
                callback(task, context);
            })
        }
    }
};

// bot.setTask('reserveCheck', reserveCheck);
exports.reserverCheck = reserveCheck;
