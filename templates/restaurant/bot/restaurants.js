var path = require('path');
var bot = require(path.resolve('engine/bot')).getTemplateBot('restaurant');
var mongo = require(path.resolve('./engine/bot/action/common/mongo'));
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var mongoose = require('mongoose');
var type = require(path.resolve('./engine/bot/action/common/type'));
var restaurantmenu= mongo.getModel('restaurant-menus');
var globals = require(path.resolve('engine/bot/engine/common/globals'));
var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));
var botUser= require(path.resolve('engine/bot-users/server/controllers/bot-users.server.controller'));
var dateformat = require('dateformat');
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./config/lib/logger'));
var restaurantreservation= mongo.getModel('restaurant-reservations');
var request = require('request');
var _ = require('lodash');
var async = require('async');
var utils = require(path.resolve('engine/bot/action/common/utils'));
var typelib = require(path.resolve('engine/bot/action/common/type'));

const IN_TAG_START = '{';
const IN_TAG_END = '}';


var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var startTask = {
    name:'startTask',
    action: function (task, context, callback) {
        // if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
        //     context.botUser.isOwner = true;
        //     // context.bot.authKey = null;
        // }
        context.botUser.isOwner = false;
        //console.log('context.bot.authKey: '+ context.bot.authKey);
       // console.log('context.botUser.options: '+ context.botUser.options);
       // console.log('context.bot.authKey: '+ context.bot.authKey);
       // console.log('context.botUser.options.authKey: '+ context.botUser.options.authKey);
        //console.log('context.botUser.isOwner: '+ context.botUser.isOwner);
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

bot.setTask("startTask", startTask);
exports.startTask = startTask;

// var startTask = {
//     action: function (task, context, callback) {
//         if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
//             context.botUser.isOwner = true;
//             // context.bot.authKey = null;
//         }
//
//         task.result = {smartReply: ['예약', '위치', '영업시간', '메뉴']};
//
//         context.dialog.날짜입력최초 = undefined;
//         context.dialog.시간입력최초 = undefined;
//         context.dialog.인원선택최초 = undefined;
//
//         if(context.botUser.isOwner) {
//             reserveCheck.action(task, context, function(_task, context) {
//                 callback(task, context);
//             })
//         } else {
//             callback(task, context);
//         }
//     }
// };
//
// globals.setGlobalTask('startTask', startTask);
// bot.setTask("startTask", startTask);


var eventCategoryAction = {
    name: 'eventCategoryAction',
    action: function(task, context, callback) {
        var model;
        context.dialog.eventcategorylength=[];
        model = mongoModule.getModel('restaurant-events');
        //query = {botId: context.bot.id};
        //sort = {'_id': -1};

        model.find({ botId: context.bot.id }).lean().exec(function(err,docs)
        {
            if(!docs)
            {
                context.dialog.events = undefined;
                callback(task, context);
            }
            else
            {
               // console.log('ㅑㅐ너랴ㅐㄴ어래쟈 결과 : ', list);
                context.dialog.events = docs;

                //console.log('context.dialog.events.length : ', context.dialog.events.length);
                //task.doc = docs;
                callback(task,context);
            }
        });
    }
};

bot.setTask("eventCategoryAction", eventCategoryAction);


var eventlistType = {
    name: "events",
    listName: "events",
    typeCheck: "listTypeCheck"
};
bot.setType("eventlistType", eventlistType);


var dateTypeCheck = {
    name: "date",
    listName: "date",
    typeCheck: function dateRangeTypeCheck(text, type, task, context, callback) {
    dateTypeCheck1(text, type, task, context, function(text, task, _matched) {
        if(_matched) {
            var _dateType = '(' + typelib.IN_TAG_START + 'date' + typelib.IN_TAG_END + ')';
            var reText = _dateType + '\\s*(?:부터|에서|이후)\\s*' + _dateType + '\\s*(?:까지|이전|사이|동안)';
            var re = new RegExp(reText, 'g');

            var matched = false;
            text.replace(re, function(match, p1, p2) {
                task['from'] = task['date'][0];
                task['to'] = task['date'][1];

                if(task['date'][1].unit == 'y') {
                    task['to'].setMonth(11);
                }

                if(task['date'][1].unit == 'y' || task['date'][1].unit == 'm') {
                    task['to'].setMonth(task['to'].getMonth() + 1);
                    task['to'].setDate(0);
                }

                matched = true;
                return match;
            });

            if(!matched) {
                reText = _dateType + '\\s*(?:사이|동안)';
                re = new RegExp(reText, 'g');

                text.replace(re, function(match, p1, p2) {
                    task['from'] = task['date'];
                    task['to'] = utils.clone(task['date']);

                    if(task['date'].unit == 'y') {
                        task['to'].setMonth(11);
                    }

                    if(task['date'].unit == 'y' || task['date'].unit == 'm') {
                        task['to'].setMonth(task['to'].getMonth() + 1);
                        task['to'].setDate(0);
                    }

                    matched = true;
                    return match;
                });
            }

            if(!matched) {
                reText = _dateType + '\\s*(?:부터|이후)';
                re = new RegExp(reText, 'g');

                text.replace(re, function(match, p1, p2) {
                    task['from'] = task['date'][0];

                    matched = true;
                    return match;
                });
            }

            if(!matched) {
                reText = _dateType + '\\s*(?:까지|이전)';
                re = new RegExp(reText, 'g');

                text.replace(re, function(match, p1, p2) {
                    task['to'] = task['date'];

                    if(task['date'].unit == 'y') {
                        task['to'].setMonth(11);
                    }

                    if(task['date'].unit == 'y' || task['date'].unit == 'm') {
                        task['to'].setMonth(task['to'].getMonth() + 1);
                        task['to'].setDate(0);
                    }

                    matched = true;
                    return match;
                });
            }

            if(!matched) {
                reText = _dateType;
                re = new RegExp(reText, 'g');

                text.replace(re, function(match, p1) {
                    task['from'] = task['date'];
                    task['to'] = utils.clone(task['date']);

                    if(task['date'].unit == 'y') {
                        task['to'].setMonth(11);
                    }

                    if(task['date'].unit == 'y' || task['date'].unit == 'm') {
                        task['to'].setMonth(task['to'].getMonth() + 1);
                        task['to'].setDate(0);
                    }

                    matched = true;
                    return match;
                });
            }
        }

        callback(text, task, matched);
    });
}
};

bot.setType("dateTypeCheck", dateTypeCheck);

function dateTypeCheck1(text, type, task, context, callback) {
    var name = 'date';
    var re = /(?:(올해|이번 년|작년|내년|20[12]\d{1}\s*[-/.년]?)?\s?(이번달|저번달|다음달|(?:0[1-9]|1[012]|[1-9])\s*[-/.월 ])\s?(오늘|어저께|그저께|어제|내일|모레|글피|(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])\s*[일]?)|(올해|이번 년|작년|내년|\d{4}\s*[-/.년])?\s?(이번달|저번달|다음달|(?:0[1-9]|1[012]|[1-9])\s*월)|(?:(?:(오늘|어저께|그저께|어제|내일|모레|글피|(?:0[1-9]|[12][0-9]|3[0-1]|[1-9]))\s*일)|((?:[0-9]+|일|이|삼|사|오|육|칠|팔|구|십))\s*[년해]|((?:[0-9]+|한|두|세|네|다섯|여섯|일곱|여덟|아홉|열|열한|열두))\s*(?:개월|달)|((?:[0-9]+|일|이|삼|사|오|육|칠|팔|구|십))\s*주[일]?|(하루|이틀|며칠|(?:[0-9]+|삼|사|오|육|칠|팔|구|십)\s*일))\s*(전|후|뒤)?)|(오늘|어저께|그저께|어제|내일|모레|글피)|(이\s?번\s?주|저\s?번\s?주|지\s?난\s?주|다\s?음\s?주|다\s?다\s?음\s?주)\s*([월화수목금토일])요?일?/g;
    var matched = false;
    var date;
    var matchDate = function(_name, _task, _date) {
        if(_task[_name]) {
            if(Array.isArray(_task[_name])) _task[_name].push(_date);
            else _task[_name] = [_task[_name], _date];
        } else {
            _task[_name] = _date;
        }

        return typelib.IN_TAG_START + _name + typelib.IN_TAG_END;
    };

    var getYear = function (_yearStr) {
        var _year;
        var _date = new Date();

        if (_yearStr === '올해' || _yearStr === '이번 년') {
            _year = _date.getFullYear();
        } else if (_yearStr === '작년') {
            _date.setYear(_date.getYear() - 1);
            _year = _date.getFullYear();
        } else if (_yearStr === '내년') {
            _date.setYear(_date.getYear() + 1);
            _year = _date.getFullYear();
        } else {
            _yearStr = _yearStr.replace(/[-\/\.년해]/g, '');
            _year = Number(_yearStr);
        }

        return _year;
    };

    var getMonth = function (_monthStr) {
        var _month;
        var _date = new Date();

        if (_monthStr === '이번달') {
            task.range = '이번달';
            _month = _date.getMonth();
        } else if (_monthStr === '저번달') {
            _date.setMonth(_date.getMonth() - 1);
            _month = _date.getMonth();
        } else if (_monthStr === '다음달') {
            _date.setMonth(_date.getMonth() + 1);
            _month =  _date.getMonth();
        } else if (_monthStr === '한' || _monthStr === '일') {
            _date.setMonth(0);
            _month =  _date.getMonth();
        } else if (_monthStr === '두' || _monthStr === '이') {
            _date.setMonth(1);
            _month =  _date.getMonth();
        } else if (_monthStr === '세' || _monthStr === '삼') {
            _date.setMonth(2);
            _month =  _date.getMonth();
        } else if (_monthStr === '네' || _monthStr === '사') {
            _date.setMonth(3);
            _month =  _date.getMonth();
        } else if (_monthStr === '다섯' || _monthStr === '오') {
            _date.setMonth(4);
            _month =  _date.getMonth();
        } else if (_monthStr === '여섯' || _monthStr === '육') {
            _date.setMonth(5);
            _month =  _date.getMonth();
        } else if (_monthStr === '일곱' || _monthStr === '칠') {
            _date.setMonth(6);
            _month =  _date.getMonth();
        } else if (_monthStr === '여덟' || _monthStr === '팔') {
            _date.setMonth(7);
            _month =  _date.getMonth();
        } else if (_monthStr === '아홉' || _monthStr === '구') {
            _date.setMonth(8);
            _month =  _date.getMonth();
        } else if (_monthStr === '열' || _monthStr === '십') {
            _date.setMonth(9);
            _month =  _date.getMonth();
        } else if (_monthStr === '열한' || _monthStr === '십일') {
            _date.setMonth(10);
            _month =  _date.getMonth();
        } else if (_monthStr === '열두' || _monthStr === '십이') {
            _date.setMonth(11);
            _month =  _date.getMonth();
        } else {
            _monthStr = _monthStr.replace(/[-\/\.개월달]/g, '');
            _month = Number(_monthStr) - 1;
        }

        return _month;
    };


    var getDay = function (_dayStr) {
        var _day;
        var _date = new Date();

        if (_dayStr === '오늘') {
            _day = _date.getDate();
        } else if (_dayStr === '그저께' || _dayStr === '그제' ) {
            _date.setDate(_date.getDate() - 2);
            _day = _date.getDate();
        } else if (_dayStr === '어저께' || _dayStr === '어제') {
            _date.setDate(_date.getDate() - 1);
            _day = _date.getDate();
        } else if (_dayStr === '내일') {
            _date.setDate(_date.getDate() + 1);
            _day = _date.getDate();
        } else if (_dayStr === '모레') {
            _date.setDate(_date.getDate() + 2);
            _day = _date.getDate();
        } else if (_dayStr === '글피') {
            _date.setDate(_date.getDate() + 3);
            _day = _date.getDate();
        } else {
            _dayStr = _dayStr.replace(/[-\/\.일]/g, '');
            _day = Number(_dayStr);
        }
        return _day;
    };


    text = text.replace(re, function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14){
        matched = true;
        var year, month, day;
        var unit;
        var today = new Date();

        if(p1 || p2 || p3) {
            unit = 'd';

            if(p1) year = getYear(p1);
            else year = today.getFullYear();
            if(p2) month = getMonth(p2);
            else month = today.getMonth();
            if(p3) day = getDay(p3);
            else day = today.getDate();
        } else if(p4 && p5) {
            unit = 'm';

            if(p4) year = getYear(p4);
            else year = today.getFullYear();
            if(p5) month = getMonth(p5);
            else month = today.getMonth();
        } else if (p5) {
            month = getMonth(p5);
            year = today.getFullYear();
            today.setMonth(month + 1);
            today.setDate(0);
            day = today.getDate();
            // } else if (p6) {
            //   if(p6 === '이번주') {
            //     task.range = '이번주';
            //     var first = today.getDate() - today.getDay() + 7;
            //     today.setDate(first);
            //     day = today.getDate();
            //     year = today.getFullYear();
            //     month = today.getMonth();
            //   } else if (p6 === '저번주') {
            //     var first = today.getDate() - today.getDay() - 6;
            //     today.setDate(first);
            //     day = today.getDate();
            //     year = today.getFullYear();
            //     month = today.getMonth();
            //   } else if (p6 === '다음주'){
            //     task.range = '다음주';
            //     var first = today.getDate() - today.getDay() + 14;
            //     today.setDate(first);
            //     day = today.getDate();
            //     year = today.getFullYear();
            //     month = today.getMonth();
            //   } else if (p6 === '다다음주') {
            //     var first = today.getDate() - today.getDay() + 21;
            //     today.setDate(first);
            //     day = today.getDate();
            //     year = today.getFullYear();
            //     month = today.getMonth();
            //   }
        } else if (p11) {

            if(p11 === '전') {
                if(p6) {
                    if (p6 === '오늘' || p6 === '그저께' || p6 === '어제' || p6 === '어저께' || p6 === '내일' || p6 === '모레' || p6 === '글피') {
                        year = today.getFullYear();
                        month = today.getMonth();
                        if(p6) day = getDay(p6);
                        else day = today.getDate();
                    } else {
                        p6 = Number(p6);
                        today.setDate(today.getDate() - p6);
                        day = today.getDate();
                        year = today.getFullYear();
                        month = today.getMonth();
                    }
                } else if (p8) {
                    today.setMonth(today.getMonth() - getMonth(p8));
                    year = today.getFullYear();
                    month = today.getMonth();
                    day = today.getDate();
                } else if (p10) {
                    if (p10 === '일') {
                        today.setDate(today.getDate() - 7);
                        day = today.getDate();
                    } else if (p10 === '이') {
                        today.setDate(today.getDate() - 14);
                        day = today.getDate();
                    } else if (p10 === '삼') {
                        today.setDate(today.getDate() - 21);
                        day = today.getDate();
                    } else if (p10 === '사') {
                        today.setDate(today.getDate() - 28);
                        day = today.getDate();
                    } else if (p10 === '오') {
                        today.setDate(today.getDate() - 35);
                        day = today.getDate();
                    } else if (p10 === '육') {
                        today.setDate(today.getDate() - 42);
                        day = today.getDate();
                    } else if (p10 === '칠') {
                        today.setDate(today.getDate() - 49);
                        day = today.getDate();
                    } else if (p10 === '팔') {
                        today.setDate(today.getDate() - 56);
                        day = today.getDate();
                    } else if (p10 === '구') {
                        today.setDate(today.getDate() - 63);
                        day = today.getDate();
                    } else if (p10 === '십') {
                        today.setDate(today.getDate() - 70);
                        day = today.getDate();
                    } else {
                        p10 = Number(p10);
                        today.setDate(today.getDate() - p10*7);
                        day = today.getDate();
                    }
                    year = today.getFullYear();
                    month = today.getMonth();
                }
            } else if (p11 === '후' || p11 === '뒤') {
                if(p6) {
                    if (p6 === '오늘' || p6 === '그저께' || p6 === '어제' || p6 === '어저께' || p6 === '내일' || p6 === '모레' || p6 === '글피') {
                        year = today.getFullYear();
                        month = today.getMonth();
                        if(p6) day = getDay(p6);
                        else day = today.getDate();
                    } else {
                        p6 = Number(p6);
                        today.setDate(today.getDate() + p6);
                        day = today.getDate();
                        year = today.getFullYear();
                        month = today.getMonth();
                    }
                } else if (p8) {
                    today.setMonth(today.getMonth() + getMonth(p8));
                    day = today.getDate();
                    year = today.getFullYear();
                    month = today.getMonth();
                } else if (p10) {
                    if (p10 === '일') {
                        today.setDate(today.getDate() + 7);
                        day = today.getDate();
                    } else if (p10 === '이') {
                        today.setDate(today.getDate() + 14);
                        day = today.getDate();
                    } else if (p10 === '삼') {
                        today.setDate(today.getDate() + 21);
                        day = today.getDate();
                    } else if (p10 === '사') {
                        today.setDate(today.getDate() + 28);
                        day = today.getDate();
                    } else if (p10 === '오') {
                        today.setDate(today.getDate() + 35);
                        day = today.getDate();
                    } else if (p10 === '육') {
                        today.setDate(today.getDate() + 42);
                        day = today.getDate();
                    } else if (p10 === '칠') {
                        today.setDate(today.getDate() + 49);
                        day = today.getDate();
                    } else if (p10 === '팔') {
                        today.setDate(today.getDate() + 56);
                        day = today.getDate();
                    } else if (p10 === '구') {
                        today.setDate(today.getDate() + 63);
                        day = today.getDate();
                    } else if (p10 === '십') {
                        today.setDate(today.getDate() + 70);
                        day = today.getDate();
                    } else {
                        p10 = Number(p10);
                        today.setDate(today.getDate() + p10*7);
                        day = today.getDate();
                    }
                    year = today.getFullYear();
                    month = today.getMonth();
                }
            }

        } else if(p6) {
            unit = 'd';

            year = today.getFullYear();
            month = today.getMonth();
            if(p6) day = getDay(p6);
            else day = today.getDate();
        } else if(p7) {
            unit = 'y';

            if(p7) year = getYear(p7);
            else year = today.getFullYear();
        } else if(p8) {
            unit = 'm';

            year = today.getFullYear();
            if(p8) month = getMonth(p8);
            else month = today.getMonth();
        } else if(p10) {
            unit = 'd';

            if (p10 === '일') {
                task.range = '이번주';
                today.setDate(today.getDate() + 7);
                day = today.getDate();
            } else if (p10 === '이') {
                today.setDate(today.getDate() + 14);
                day = today.getDate();
            } else if (p10 === '삼') {
                today.setDate(today.getDate() + 21);
                day = today.getDate();
            } else if (p10 === '사') {
                today.setDate(today.getDate() + 28);
                day = today.getDate();
            } else if (p10 === '오') {
                today.setDate(today.getDate() + 35);
                day = today.getDate();
            } else if (p10 === '육') {
                today.setDate(today.getDate() + 42);
                day = today.getDate();
            } else if (p10 === '칠') {
                today.setDate(today.getDate() + 49);
                day = today.getDate();
            } else if (p10 === '팔') {
                today.setDate(today.getDate() + 56);
                day = today.getDate();
            } else if (p10 === '구') {
                today.setDate(today.getDate() + 63);
                day = today.getDate();
            } else if (p10 === '십') {
                today.setDate(today.getDate() + 70);
                day = today.getDate();
            } else {
                p10 = Number(p10);
                today.setDate(today.getDate() + p10*7);
                day = today.getDate();
            }
            year = today.getFullYear();
            month = today.getMonth();
        } else if (p12) {
            year = today.getFullYear();
            month = today.getMonth();
            if(p12) day = getDay(p12);
            else day = today.getDate();
        } else if (p13) {
            year = today.getFullYear();
            month = today.getMonth();
            var weekDay;
            if(p14 == "월") weekDay = 1;
            if(p14 == "화") weekDay = 2;
            if(p14 == "수") weekDay = 3;
            if(p14 == "목") weekDay = 4;
            if(p14 == "금") weekDay = 5;
            if(p14 == "토") weekDay = 6;
            if(p14 == "일") weekDay = 7;

            var week;
            if(p13.replace(/ /g, "") == "이번주") week = 0;
            if(p13.replace(/ /g, "") == "지난주" || p13 == "저번주") week = -7;
            if(p13.replace(/ /g, "") == "다음주") week = 7;
            if(p13.replace(/ /g, "") == "다다음주") week = 14;

            today.setDate(today.getDate() + week - today.getDay() + weekDay);
            day = today.getDate();
        }

        if(!month) month = 0;
        if(!day) day = 1;

        date = new Date(year, month, day);
        date.unit = unit;


        return matchDate(name, task, date);
    });
    context.dialog.date=date;
   // console.log(date+'====================0');
   // console.log(matched+'====================0');
    callback(text, task, matched);
}

var timeTypeCheck = {
    name: 'time',
    typeCheck: timeTypeCheck1
};
bot.setType("timeTypeCheck", timeTypeCheck);

function timeTypeCheck1(text, type, task, context, callback) {
    var name = 'time';
    var re = /(오전|오후|새벽|아침|낮|저녁|밤|am|pm|a.m|p.m)?\s*(\d{1,2})\s*(?:시|:)\s*(?:(\d{1,2}|반)\s*분?)?/g;
    var matched = false;


    text = text.replace(re, function(match, g1, g2, g3){
        matched = true;
        var time;
        // var timeform = ':00';

        var matchTime = function(_name, _task, _time) {
            if(_task[_name]) {
                if(Array.isArray(_task[_name])) _task[_name].push(_time);
                else _task[_name] = [_task[_name], _time];
            } else {
                _task[_name] = _time;
            }
        };

        var hour = parseInt(g2);
        var min = parseInt(g3) || g3 || 0;
        if (min=='반') min = 30;

        var am = (g1 == '오전' || g1 == '새벽' || g1 == '아침' || g1 == 'am' || g1 == 'a.m');
        var pm = (g1 == '오후' || g1 == '낮' || g1 == '저녁' || g1 == '밤' || g1 == 'pm' || g1 == 'p.m');

        if(hour<23 && min <60) {
            if(hour > 12) {
                time = hour.toString() + ':' + min;
            } else if(am) {
                if(hour==12) hour = 0;
                time = hour.toString() + ':' + min;
            } else if(pm) {
                if(hour==12) hour = 0;
                time = (hour+12) + ':' + min;
            } else time = 're';
        } else {
            time = 'out';
        }

        time = time.replace(/(.*):(.*)/, function(match, g1, g2) {
            if (g1.length == 1) g1 = '0'+g1;
            if (g2.length == 1) g2 = '0'+g2;
            return g1 + ":" + g2;
        });
       // console.log(time+"===================99");
        context.dialog.time=time;
        return matchTime(name, task, time);
    });

    callback(text, task, matched);
}


var mobile = {
    name: 'mobile',
    raw: true,
    context: true,
    typeCheck: regexpTypeCheck,
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    checkRequired: function(text, type, inDoc, context) {
        if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
        else if(text.length < 13) return '자리수가 맞지 않습니다';
        else return '휴대폰전화번호 형식으로 입력해 주세요';
    }
};

bot.setType("mobile", mobile);

function regexpTypeCheck (text, type, task, context, callback) {
    var re = type.regexp;
    var matched = false;

    logger.debug('');
    logger.debug('type.js:regexpTypeCheck: START ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    text = text.replace(re, function (match, p1, offset, string) {
        matched = true;

        // if(task[type.name]) {
        //   if(Array.isArray(task[type.name])) task[type.name].push(p1);
        //   else task[type.name] = [task[type.name], p1];
        // } else {
        task[type.name] = p1;
        // }

        return IN_TAG_START + type.name + IN_TAG_END;
    });

    if (matched)
        logger.debug('type.js:regexpTypeCheck: MATCHED ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    callback(text, task, matched);
}

var inforpark = {
    name: 'inforpark',
    action: function(task, context, callback) {


        // console.log(typeof JSON.stringify(context.bot.parks[0]));
        // console.log(typeof JSON.parse(JSON.stringify(context.bot.parks[0])));
        if(context.bot.parks[0]===undefined){context.dialog.parkno=undefined;callback(task,context);}
        else if(context.bot.parks[0].parkornot==="false"){context.dialog.parkno=1; callback(task,context);}
        else {context.dialog.parkno=0;
            context.dialog.parkaddress=context.bot.parks[0].parkaddress;
            context.dialog.parkdetails=context.bot.parks[0].parkdetails;
            context.dialog.parksize=context.bot.parks[0].parksize;
            context.dialog.parkname=context.bot.parks[0].parkname;
            context.dialog.parkornot=context.bot.parks[0].parkornot;

            task.result = {
                buttons : [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.dialog.parkaddress}]
            };


            callback(task,context);}
    }
};

bot.setTask("inforpark", inforpark);

var checkTime= {
    name: 'checkTime',
    action: function (task, context, callback) {


        var day = new Date().getDay();
        var holiday = dateStringToNumber(context.bot.holiday);
        var str = context.bot.endTime;
        var str1 = context.bot.startTime;
        var str0 = str.substring(3, 5);
        var str10 = str1.substring(3, 5);
       // console.log('context.dialog.time==========='+context.dialog.time);
        var xx = Number(context.dialog.time.substring(0, 1));
        if (((str.indexOf('오전') >= 0) && (str1.indexOf('오전')>=0))){
           // console.log('===================111');

            context.dialog.endTime1 = Number(str0);
            context.dialog.startTime1 = Number(str10);
            //console.log('context.dialog.startTime1==========='+context.dialog.startTime1);
           // console.log('context.dialog.endTime1==========='+context.dialog.endTime1);
           // console.log('xx==========='+xx);
            if (day == holiday) {
                context.dialog.check = true;
                callback(task, context);
            } else {
                if (context.dialog.time == 're') {
                    context.dialog.check = 're';
                } else if (xx < context.dialog.endTime1 && xx > 0 || xx >= context.dialog.startTime1 && xx < 24) {
                  //  console.log('===================333');
                    context.dialog.check = true;
                } else {

                    context.dialog.check = false;
                }
                callback(task, context);
            }

        }
        else if((str.indexOf('오후') >= 0) && (str1.indexOf('오후')>=0)) {
           // console.log('===================222');
            context.dialog.endTime1 = Number(str0) + 12;
            context.dialog.startTime1 = Number(str10) + 12;
            if (day == holiday) {
                context.dialog.check = true;
                callback(task, context);
            } else {
                if (context.dialog.time == 're') {
                    context.dialog.check = 're';
                } else if (xx < context.dialog.endTime1 && xx > 0 || xx > context.dialog.startTime1 && xx < 24) {
                   // console.log('===================333');
                    context.dialog.check = true;
                } else {

                    context.dialog.check = false;
                }
                callback(task, context);
            }
        }
        else {
          //  console.log('===================333');
            if (str.indexOf('오후') >= 0) {
                context.dialog.endTime1 = Number(str0) + 12;
            }
            if (str1.indexOf('오전') >= 0) {
                context.dialog.startTime1 = Number(str10);
            }

            if (day == holiday) {
                context.dialog.check = true;
                callback(task, context);
            } else {
                if (context.dialog.time == 're') {
                    context.dialog.check = 're';
                } else if (xx < context.dialog.endTime1 && xx > context.dialog.startTime1) {
                  //  console.log('===================333');
                    context.dialog.check = true;
                } else {

                    context.dialog.check = false;
                }
                callback(task, context);
            }

        }
    }
};
bot.setTask("checkTime", checkTime);



var checkDate= {
    name: 'checkDate',
    action: function (task, context, callback) {
      //  console.log('====================1');
       // console.log(context.dialog.date+'====================2');
        var day = context.dialog.date.getDay();

        var holiday = dateStringToNumber(context.bot.holiday);
        if (holiday == 7) {
            context.dialog.check = false;
            callback(task, context);
        }
        else {
            if (day == holiday) {
                context.dialog.check = true;
            } else {
                context.dialog.check = false;
            }

            callback(task, context);
        }
    }
};
bot.setTask("checkDate", checkDate);

function dateStringToNumber(dateString) {
    if(dateString == '일요일' || dateString == '일') return 0;
    else if(dateString == '월요일' || dateString == '월') return 1;
    else if(dateString == '화요일' || dateString == '화') return 2;
    else if(dateString == '수요일' || dateString == '수') return 3;
    else if(dateString == '목요일' || dateString == '목') return 4;
    else if(dateString == '금요일' || dateString == '금') return 5;
    else if(dateString == '토요일' || dateString == '토') return 6;
    else if(dateString == '365일 영업' || dateString == '휴일 없다' || dateString == '없다' || dateString == '휴일없음') return 7;
    else return dateString;
}

var menuCategoryAction= {
    name: 'menuCategoryAction',
    action: function (task, context, callback) {
        context.dialog.categoryisone=undefined;
        context.dialog.categorylength=[];
      //  console.log(context.bot.image+'+++++++++++++++++++++++++++++11');

        if (context.bot.image!==undefined) {
            var img = context.bot.image.startsWith('http') ? context.bot.image : config.host + context.bot.image;
            task.result = {
                image: {url: context.bot.image},
                buttons: [
                    {text: '메뉴판 사진 보기', url: img}
                ]
            };
        }
        //console.log(context.bot.menus[0]+'+++++++++++++++++++++++++++++');
        if(context.bot.menus.length===0){context.dialog.restaurantno=1;callback(task,context);}
        else {
            restaurantmenu.find({botId: context.bot.id}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;
                    for(i=0;i<context.dialog.categorys.length;i++){
                        var count1=0;
                        for(j=0;j<context.dialog.categorylength.length;j++){

                            if(context.dialog.categorylength.length!==0)
                            {
                                if(context.dialog.categorys[i].category!==context.dialog.categorylength[j].category){count1++;}
                            }
                           // console.log(count1+'======================count1');
                        }
                        if(count1==context.dialog.categorylength.length)
                        {context.dialog.categorylength.push(context.dialog.categorys[i]);}
                    // console.log(JSON.stringify(context.dialog.categorylength)+'======================');

                    }
                    if(context.dialog.categorylength.length>1){
                        context.dialog.categoryisone=0;
                        context.dialog.restaurantno = 0;
                        var ss = 0;
                        for (i = 0; i < context.dialog.categorys.length; i++) {
                            if (context.dialog.categorys[i].price !== " ") {ss++;}
                        }
                        if (ss == context.dialog.categorys.length) {
                            context.dialog.menuprice = 1;
                            callback(task, context);
                        }
                        else{context.dialog.menuprice = 0;
                            callback(task, context);
                        }
                    }
                    else if(context.dialog.categorylength.length===1)
                    {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++3');
                        context.dialog.categoryisone = 1;
                        context.dialog.restaurantno = 0;
                        restaurantmenu.find({
                            botId: context.bot.id,
                            category: context.dialog.categorylength
                        }).lean().exec(function (err, docs) {

                            context.dialog.menuss = docs[0];
                           // console.log(JSON.stringify(context.dialog.menuss)+'+++++++++++++++++++++++++++++++3');
                            callback(task, context);
                        });
                    }
                    else {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++2');
                        context.dialog.restaurantno = 1;callback(task, context);
                    }
                }
            });
        }
    }
};

bot.setTask("menuCategoryAction", menuCategoryAction);

var categorymenu = {
    action: function (task, context, callback) {
        if(context.dialog.category!==undefined){
            context.user.category=[];
            context.user.category=context.dialog.category;
        }
        //console.log(context.dialog.category+'++++++++++++++++888+++++++++');
        restaurantmenu.find({
            botId: context.bot.id,
            category: context.user.category.category
        }).lean().exec(function (err, docs) {

            if (err) {
                console.log(err);
                callback(task, context);
            } else {
                task.doc = docs;
                context.dialog.categorymenus = docs;
                context.dialog.categoryss=context.dialog.categorymenus[0].category;
               // console.log(context.dialog.categorymenus+'++++++++++++++++888+++++++++');
                callback(task, context);
            }
        });
    }
};

bot.setTask("categorymenu", categorymenu);


function menuAction(task, context, callback) {
    var model, query, sort;
    if (context.dialog.categorys.length == 1) {
        context.dialog.category = context.dialog.categorys[0];
    }

    model = mongoose.model('restaurant-menus');
    query = {botId: context.bot.id,
        category: context.dialog.category.category};
    sort = {'_id': +1};

    model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
        task.doc = docs;
        context.dialog.menus = docs;

        var result = [];
        async.eachSeries(task.doc, function(doc, cb) {
            var _doc = {};
            if (doc.name) {
                _doc.title = doc.name;
            }
            if (doc.description) {
                _doc.text = doc.description;
            } else {
                _doc.text = '';
            }
            if (doc.price) {
                _doc.text = _doc.text + ' ' + doc.price + '원';
            }
            if (doc.image) {
                _doc.imageUrl = doc.image;
            }
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    });
}


var categoryrestaurantlist= {
    name: 'categoryrestaurantlist',
    action:function(task, context, callback) {

      //  console.log('+++++++++++++++++++++++++++++');
        if(context.bot.menus.length===0){context.dialog.restaurantno=undefined;callback(task,context);}
        else {
            restaurantmenu.find({botId: context.bot.id,hotmenus:"true"}).lean().exec(function (err, docs) {

                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {

                    context.dialog.categorys = docs;
                    if(context.dialog.categorys.length!==0){

                        context.dialog.restaurantno = 0;
                        var ss = 0;
                        for (i = 0; i < context.dialog.categorys.length; i++) {
                            if (context.dialog.categorys[i].price !== "") {ss++;}
                        }
                        if (ss == context.dialog.categorys.length) {
                            context.dialog.menuprice = 1;
                            callback(task, context);
                        }
                        else{context.dialog.menuprice = 0;
                            callback(task, context);
                        }
                    }
                    else{context.dialog.restaurantno = 1;callback(task, context);}
                }
            });
        }
    }
};
bot.setTask("categoryrestaurantlist", categoryrestaurantlist);




var categoryrestaurantlistisornot= {
    name: 'categoryrestaurantlistisornot',
    action:function(task, context, callback) {
        var str=context.dialog.inCurRaw;
        context.dialog.menucategory=[];
            restaurantmenu.find({botId: context.bot.id,hotmenus:"true"}).lean().exec(function (err, docs) {

                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;

                        for (i = 0; i < context.dialog.categorys.length; i++) {
                            var ll=i+1;
                            if ((str.indexOf(context.dialog.categorys[i].name)>0)||str==ll) { context.dialog.menucategory.push(context.dialog.categorys[i]);}
                        }
                      //console.log(context.dialog.menucategory.length+'+++++++++++++++++++++++++++++');
                        if (context.dialog.menucategory.length) {
                            context.dialog.menuprice = 1;
                            // if(context.dialog.menucategory.image) {
                            //     var img = context.dialog.menucategory.image.startsWith('http') ? context.dialog.menucategory.imagee : config.host + context.dialog.menucategory.image;
                            //     task.result = {
                            //         image: {url: img},
                            //         buttons: [
                            //             {text: '자세히보기', url: img}
                            //         ]
                            //     };
                            // }
                            callback(task, context);
                        }
                        else{context.dialog.menuprice = 0;
                            callback(task, context);
                        }
                }
            });
        }
};
bot.setTask("categoryrestaurantlistisornot", categoryrestaurantlistisornot);



var mapButton = {
    "name":"mapButton",
    action: function (task,context,callback) {
        task.buttons = [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.bot.address}];
        callback(task,context);
    }
};
bot.setTask("mapButton", mapButton);


var categoryrestaurantisornot = {
    name: 'categoryrestaurantisornot',
    action: function(task, context, callback) {
        context.dialog.menuis=undefined;
        context.dialog.menumatch=[];
        context.dialog.categorymatch=[];
        //var ss=0;
        //var ll='ㄴㅁㅇㄹㅎㄴㅇㄹㅎㅇㅌㄹㅎdddd';
        //console.log(JSON.stringify(context.bot)+"pppppppppppppppppp");
        //console.log(task.text+"2222222222222222");
        if(context.bot.menus[0]===undefined){context.dialog.menuis=0;callback(task,context);}
        else {
            restaurantmenu.find({botId: context.bot.id}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;

                    for(i=0;i<context.dialog.categorys.length;i++)
                    {
                        var str=context.dialog.inRaw;
                        //console.log(str.indexOf(context.dialog.categorys[i].name)+"2222222222222222");

                        //var regDate =/[context.dialog.inRaw]/;
                        //if (regDate.test(context.dialog.categorys[i].name)) {context.dialog.menumatch.push(context.dialog.categorys[i]);}
                        if(str.indexOf(context.dialog.categorys[i].name)>=0){context.dialog.menumatch.push(context.dialog.categorys[i]);}
                        if(str.indexOf(context.dialog.categorys[i].category)>=0){context.dialog.categorymatch.push(context.dialog.categorys[i].category);}
                        //console.log(context.dialog.categorymatch+"2222222222222222");
                    }
                    if(context.dialog.menumatch.length!==0)
                    {
                        context.dialog.menuis=1;
                        callback(task, context);
                    }
                    //console.log(context.dialog.categorymatch[0]+"2222222222222222");
                    if(context.dialog.categorymatch.length!==0)
                    {
                        restaurantmenu.find({botId: context.bot.id,category:context.dialog.categorymatch[0]}).lean().exec(function (err, docs) {
                            context.dialog.categoryis=1;
                            context.dialog.categorymatchmenu=docs;
                            callback(task, context);
                        });
                    }
                }
            });
        }
    }
};
bot.setTask("categoryrestaurantisornot", categoryrestaurantisornot);


var menuImageTask3 = {
    name: 'menuImageTask3',
    action: function(task, context, callback) {
        context.dialog.categorymenu=[];
       // var inCurRaw=context.dialog.inCurRaw;
        restaurantmenu.find({botId: context.bot.id,category:context.dialog.categorymatch[0]}).lean().exec(function (err, docs) {
            context.dialog.categorys=docs;
            for (i = 0; i < context.dialog.categorys.length; i++) {
                var str = context.dialog.inCurRaw;
                var ll=i+1;
                if (str==ll) {
                    context.dialog.categorymenu.push(context.dialog.categorys[i]);
                    if (context.dialog.categorymenu[0].image!==undefined) {
                        var img = context.dialog.categorymenu[0].image.startsWith('http') ? context.dialog.categorymenu[0].imagee : config.host + context.dialog.categorymenu[0].image;
                        task.result = {
                            image: {url: context.dialog.categorymenu[0].image},
                            buttons: [
                                {text: '자세히보기', url: img}
                            ]
                        };
                    }
                }
            }
            callback(task, context);
        });
    }
};
bot.setTask("menuImageTask3", menuImageTask3);


var menuimagedisplay = {
    name: 'menuimagedisplay',
    action: function(task, context, callback) {
        //console.log(context.dialog.categorymenu.image+'---------------------');
                if (context.dialog.categorymenu[0].image!==undefined){
                    var img = context.dialog.categorymenu[0].image.startsWith('http') ? context.dialog.categorymenu[0].imagee : config.host + context.dialog.categorymenu[0].image;
                    task.result = {
                        image: {url: context.dialog.categorymenu[0].image},
                        buttons: [
                            {text: '자세히보기', url: img}
                        ]
                    };
                }
        callback(task, context);
    }
};
bot.setTask("menuimagedisplay", menuimagedisplay);




var categorymenuisornot= {
    action: function(task, context, callback)
    {
        //console.log("++++++++++++++++++++++++++++++");
        context.dialog.menuis = 0;
        context.dialog.categorymenu=[];
        restaurantmenu.find({
            botId: context.bot.id,
            category: context.user.category.category
        }).lean().exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback(task, context);
            } else {
                context.dialog.categorys = docs;

                for (i = 0; i < context.dialog.categorys.length; i++) {
                    var str = context.dialog.inCurRaw;
                    var ll=i+1;
                    //console.log(str.indexOf(context.dialog.categorys[i].name)+"2222222222222222");

                    //var regDate =/[context.dialog.inRaw]/;
                    //if (regDate.test(context.dialog.category
                    // s[i].name)) {context.dialog.menumatch.push(context.dialog.categorys[i]);}
                    if ((str.indexOf(context.dialog.categorys[i].name)>0)||str==ll) {
                        context.dialog.categorymenu.push(context.dialog.categorys[i]);
                        //console.log(JSON.stringify(context.dialog.categorymenu)+"2222222222222222");
                    }
                }
               // console.log(context.dialog.categorymenu.length+"2222222222222222666");
                if (context.dialog.categorymenu.length !== 0) {
                    context.dialog.menuis = 1;
                }
                if(context.dialog.categorymenu[0].hotmenus===true){context.dialog.hot='인기';}
                else{context.dialog.hot='';}
                callback(task, context);
            }
        });
    }
};


bot.setTask("categorymenuisornot", categorymenuisornot);



var menuisornot= {
    action: function(task, context, callback)
    {
       // console.log("1111111111");

        context.dialog.menuis = 0;
        context.dialog.categorymenu=[];
        restaurantmenu.find({
            botId: context.bot.id,
            category: context.dialog.categorylength
        }).lean().exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback(task, context);
            } else {

                context.dialog.menus = docs;
               // console.log(JSON.stringify(context.dialog.menus)+"22222222223333333333");
                var ll=0;
                for (i = 0; i < context.dialog.menus.length; i++) {
                    var str = context.dialog.inCurRaw;
                    ll=i+1;
                    if ((str.indexOf(context.dialog.menus[i].name)>=0)|| str==ll) {
                        context.dialog.categorymenu.push(context.dialog.menus[i]);
                    }
                   // console.log(JSON.stringify(context.dialog.categorymenu)+"3333333333");
                }
                if (context.dialog.categorymenu.length !== 0) {
                    context.dialog.menuis = 1;
                }
                if(context.dialog.categorymenu.hotmenus===true){context.dialog.hot='인기';}
                else{context.dialog.hot='';}
                callback(task, context);
            }
        });
    }
};


bot.setTask("menuisornot", menuisornot);

var action2 = {
    name:"action2",
    action: function(task, context, callback)
    {
        //console.log('+++++++++++++++++');
        context.dialog.날짜입력최초 = true; callback(task, context);
    }
};
bot.setTask("action2", action2);

var action3 = {
    name:"action3",
    action: function(task, context, callback)
    {
        //console.log('++++++++++++++++++++++++++++++++action3');
        context.dialog.시간입력최초 = true; callback(task, context);
    }
};
bot.setTask("action3", action3);

var numOfPersonTypeCheck1 = {
    name: "numOfPersonTypeCheck1",
    action: function (task, context, callback) {
        context.dialog.numOfPersonis=undefined;
        var inRaw=context.dialog.inRaw;
        var inCurRaw=context.dialog.inCurRaw;
       // console.log('++++++++++++++++++++++++++++++++');
        //console.log(inRaw+'++++++++++1111111');
       // console.log(inCurRaw+'++++++++++1111111');
        var x = /[ ]?명/g;

        //search(x);
        //var str='2017-12-15부터 5명 4555박5일 reserve';
        var count1 = inRaw.search(x);
        var count2;
        if(count1<0 && inCurRaw!==undefined){
           // console.log("count1:"+count1+'++++++++++1111111');
            count1 = inCurRaw.search(x);
            if (count1 >= 0) {
                context.dialog.numOfPersonis=1;
                context.dialog.numOfPerson = '';
                //console.log(str.search(x));
                //console.log(str[count1]);

                for (i = 0; i < count1; i++) {
                    context.dialog.numOfPerson = context.dialog.numOfPerson + inCurRaw[i];

                }
                context.dialog.numOfPerson = Number(context.dialog.numOfPerson);
              //  console.log(context.dialog.numOfPersonis+'++++++++++2222222');
                callback(task, context);
            }
            else {
                context.dialog.numOfPersonis=0;
               // console.log(context.dialog.numOfPersonis+'++++++++++333333');
                callback(task, context);
            }
        }
        else {
           // console.log("count1:"+count1+'++++++++++222222');
           // console.log("count1:" + count1 + '++++++++++1111111');
            count2 = 0;
            if (count1 >= 0) {
                context.dialog.numOfPersonis = 1;
                context.dialog.numOfPerson = '';
                //console.log(str.search(x));
                //console.log(str[count1]);
                for (i = count1 - 1; i >= 0; i--) {
                    if (inRaw[i] === ' ') {
                        count2 = i;
                        break
                    }
                }
                var count3 = count2 + 1;
                for (i = count3; i < count1; i++) {
                    context.dialog.numOfPerson = context.dialog.numOfPerson + inRaw[i];
                }
                context.dialog.numOfPerson = Number(context.dialog.numOfPerson);
               // console.log(context.dialog.numOfPersonis + '++++++++++2222222');
                callback(task, context);
            }
            else {
                context.dialog.numOfPersonis = 0;
               // console.log(context.dialog.numOfPersonis + '++++++++++333333');
                callback(task, context);
            }
        }
    }
};
bot.setTask("numOfPersonTypeCheck1", numOfPersonTypeCheck1);

function numOfPersonTypeCheck(inRaw, _type, inDoc, context, callback) {
    var re;
    if(_type.init) re = /(\d)\s*명?/g;
    else re = /(\d)(?:\s*명)?/g;

    var matched = inRaw.match(re);
    if(matched != null) {
        try {
            context.dialog.numOfPerson = parseInt(matched[0]);
            callback(inRaw, inDoc, true);
        } catch(e) {
            console.log(e);
            callback(inRaw, inDoc, false);
        }
    } else {
        var num = type.parseNumber(inRaw);
        if(num != inRaw) {
            try {
                context.dialog.numOfPerson = parseInt(num);
                callback(inRaw, inDoc, true);
            } catch(e) {
                console.log(e);
                callback(inRaw, inDoc, false);
            }
        } else {
            callback(inRaw, inDoc, false);
        }
    }
}

globals.setGlobalTypeCheck('numOfPersonTypeCheck', numOfPersonTypeCheck);




var action4 = {
    name:"action4",
    action: function(task, context, callback)
    {
        context.dialog.인원선택최초 = true; callback(task, context);
    }
};
bot.setTask("action4", action4);


var reserveNameTask = {
    name:"reserveNameTask",
    action: function (task, context, callback) {
        context.dialog.name = task.inRaw;
        callback(task, context);
    }
};
bot.setTask("reserveNameTask", reserveNameTask);

var smsAuth = {
    name:"smsAuth",
    preCallback: function(task, context, callback) {
    //     if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
        context.user.mobile=undefined;
         callback(task, context);
     },

    action: messages.sendSMSAuth
};
bot.setTask("smsAuth", smsAuth);

var smsAuthValid = {
    name: "smsAuthValid",
    action: function (task, context, callback) {

        context.dialog.matched1=false;
        //console.log(context.dialog.smsAuth+'++++++++++++++++++++++++');
        if(context.dialog.inCurRaw==context.dialog.smsAuth) {context.dialog.matched1=true;context.user.mobile=context.dialog.mobile;}
        else{context.dialog.matched1=false;}

        callback(task, context);
    }
};

bot.setTask("smsAuthValid", smsAuthValid);


// var smsAuthinValid = {
//     name: "smsAuthinValid",
//     action: function (dialog, context, callback) {
//         context.dialog.matched1=false;
//         console.log(context.dialog.smsAuth);
//         if(dialog.inCurRaw.replace(/\s*/g, '')!=context.dialog.smsAuth)
//         {context.dialog.matched1=true;}
//         callback(task, context);
//     }
// };
// bot.setTask("smsAuthinValid", smsAuthinValid);


var smsAuthTask = {
    name: "smsAuthTask",
    action: function (task, context, callback) {
        context.user['mobile'] = context.dialog['mobile'];
        context.user.updates = ['mobile'];
        botUser.updateUserContext(context.user, context, function () {
            context.user.updates = null;

            context.dialog.smsAuth == null;

            callback(task, context);
        });
    }
};

bot.setTask("smsAuthTask", smsAuthTask);

var reserveConfirm = {
    name: "reserveConfirm",
    action: function (task, context, callback) {
        context.dialog['dateStr'] = dateformat(context.dialog.date + 9 * 60 * 60, 'mm월dd일');

        callback(task, context);
    }
};

bot.setTask("reserveConfirm", reserveConfirm);

var reserveRequest = {
    name: "reserveRequest",
    action: function (task, context, callback) {

        var doc = {
            name: context.dialog.name,
            mobile: context.dialog.mobile || context.user.mobile,
            date: context.dialog.date,
            time: context.dialog.time,
            numOfPerson: context.dialog.numOfPerson,
            status: '예약요청중',
            botId: context.bot.id,
            userKey: context.user.userKey,
            dateStr:context.dialog.dateStr
        };

        var fields = context.bot.reserveFields || [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            doc[field.name] = context.dialog[field.name];
        }

        var TemplateReservation = mongoModule.getModel('restaurant-reservations');
        var templateReservation = new TemplateReservation(doc);

        templateReservation.save(function (err) {
           // console.log('++++++++++++++++++++++++123');
            if (!context.bot.testMode) {
                var randomNum = '';
                randomNum += '' + Math.floor(Math.random() * 10);
                randomNum += '' + Math.floor(Math.random() * 10);
                randomNum += '' + Math.floor(Math.random() * 10);
                randomNum += '' + Math.floor(Math.random() * 10);

                var url = config.host + '/mobile#/chat/' + context.bot.id + '?authKey=' + randomNum;
                context.bot.authKey = randomNum;

                var query = {url: url};
                var request = require('request');

                request({
                    url: 'https://openapi.naver.com/v1/util/shorturl',
                    method: 'POST',
                    form: query,
                    headers: {
                        'Host': 'openapi.naver.com',
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'X-Naver-Client-Id': context.bot.naver.clientId,
                        'X-Naver-Client-Secret': context.bot.naver.clientSecret
                    }
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var shorturl;
                        try {
                            shorturl = JSON.parse(body).result.url;
                        } catch (e) {
                            console.log(e);
                        }
                        var message = '[플레이챗]' + '\n' +
                            context.dialog.name + '/' +
                            context.dialog.dateStr + '/';
                            //context.dialog.numOfPerson + '명\n';
                        if (context.dialog.time) {
                            messages += context.dialog.time + '/';
                        }

                        for (var i = 0; i < fields.length; i++) {
                            var field = fields[i];
                            if (field.name == 'numOfPerson') {
                                message += context.dialog[field.name] + '명/';
                            } else {
                                message += context.dialog[field.name] + '/';
                            }
                        }

                        message += '\n' + (context.dialog.mobile || context.user.mobile) + '\n' +
                            '예약접수(클릭) ' + shorturl;

                        request.post(
                            'https://bot.moneybrain.ai/api/messages/sms/send',
                            {
                                json: {
                                    callbackPhone: context.bot.phone,
                                    phone: context.bot.mobile.replace(/,/g, ''),
                                    message: message
                                }
                            },
                            function (error, response, body) {
                                callback(task, context);
                            }
                        );
                    } else {
                        callback(task, context);
                    }
                });
            } else {
                callback(task, context);
            }
        });

    }
};

bot.setTask("reserveRequest", reserveRequest);



var reserveCheck = {
    name: "reserveCheck",
    action: function (task, context, callback) {
       // console.log(context.botUser.isOwner+'++++++++++++++++++++++++');
       //context.botUser.isOwner=true;

            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.find({
                botId: context.bot.id,
                status: '예약요청중'
            }).lean().exec(function(err, docs) {
               // console.log(JSON.stringify(docs)+'++++++++++++++++++++++++111');
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

            // var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            // TemplateReservation.find({
            //     botId: context.bot.id,
            //     userKey: context.user.userKey,
            //     status: {$ne: '취소'},
            //     date: {$gte: new Date()}
            // }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
            //     if(docs && docs.length > 1) {
            //         for(var i in docs) {
            //             docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
            //         }
            //         context.dialog.reserves = docs;
            //         context.dialog.reserve = undefined;
            //     } else if(docs && docs.length > 0) {
            //         docs[0].dateStr = dateformat(docs[0].date + 9 * 60 * 60, 'mm월dd일');
            //         context.dialog.reserve = docs[0];
            //         context.dialog.reserves = undefined;
            //     } else {
            //         context.dialog.reserves = undefined;
            //         context.dialog.reserve = undefined;
            //     }
            //     callback(task, context);
            // })
    }
};

bot.setTask("reserveCheck", reserveCheck);



var action1 = {
    name: "action1",
    action: function(task, context, callback)
    {
        context.dialog.ordermenu=[];
        restaurantreservation.find({
            botId: context.bot.id,
            status: '예약요청중'
        }).lean().exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback(task, context);
            } else {
                //console.log(JSON.stringify(docs)+'**');
                context.dialog.ordermenus = docs;
                var ll=0;
                for (i = 0; i < context.dialog.ordermenus.length; i++) {
                    var str = context.dialog.inCurRaw;
                    ll=i+1;
                    if (str==ll) {
                        context.dialog.ordermenu.push(context.dialog.ordermenus[i]);
                    }
                    //console.log(JSON.stringify(context.dialog.ordermenu)+'**');
                }
                //var aa=context.dialog.ordermenu[0].date;
                //console.log(aa+'222222222222222');
                //context.dialog.time1=aa.getTime();
                task.result = {smartReply: ['예약확정', '예약취소']}; callback(task, context);

            }
        });
    }
};
bot.setTask("action1", action1);


var reserveOwnerConfirm = {
    name: "reserveOwnerConfirm",
    action: function (task, context, callback) {
        if(context.dialog.reserve!==undefined){
            context.user.reserve=[];
            context.user.reserve=context.dialog.reserve;
        }
        if(context.user.reserve) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.update({_id: context.user.reserve._id}, {$set: {status: '확정'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n' +
                        context.user.reserve.name + '/' +
                        context.user.reserve.dateStr + '/' + context.user.reserve.time + '/';
                    // context.user.reserve.numOfPerson + '명\n' +
                    // '예약확정\n'+
                    // '매장전화: ' + context.bot.phone;

                    var fields = context.bot.reserveFields || [];
                    for(var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if(field.name == 'numOfPerson') {
                            message += context.user.reserve[field.name] + '명/';
                        } else {
                            message += context.user.reserve[field.name] + '/';
                        }
                    }

                    message += '\n예약확정\n'+
                        '매장전화: ' + context.bot.phone;

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.user.reserve.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            reserveCheck.action(task, context, function(_task, context) {
                                callback(task, context);
                            })
                        }
                    );
                } else {
                    callback(task, context);
                }
            });
        } else {
            callback(task, context);
        }
    }
};

bot.setTask("reserveOwnerConfirm", reserveOwnerConfirm);

var reserveOwnerCancel = {
    name: "reserveOwnerCancel",
    action: function (task, context, callback) {
        if(context.dialog.reserve!==undefined){
            context.user.reserve=[];
            context.user.reserve=context.dialog.reserve;
        }
        if(context.user.reserve) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.update({_id: context.user.reserve._id}, {$set: {status: '업주취소'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n' +
                        context.user.reserve.name + '/' +
                        context.user.reserve.dateStr + '/' + context.user.reserve.time + '/';
                    // context.user.reserve.numOfPerson + '명\n' +
                    // '예약취소: '+
                    // task.inRaw + '\n' +
                    // '매장전화: ' + context.bot.phone;

                    var fields = context.bot.reserveFields || [];
                    for(var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if(field.name == 'numOfPerson') {
                            message += context.user.reserve[field.name] + '명/';
                        } else {
                            message += context.user.reserve[field.name] + '/';
                        }s
                    }

                    message += '\n예약취소: '+
                        task.inRaw + '\n' +
                        '매장전화: ' + context.bot.phone;

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.user.reserve.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            reserveCheck.action(task, context, function(_task, context) {
                                callback(task, context);
                            });
                        }
                    );
                } else {
                    callback(task, context);
                }
            });

        } else {
            callback(task, context);
        }
    }
};

bot.setTask("reserveOwnerCancel", reserveOwnerCancel);

var reserveCancel = {
    name: "reserveCancel",
    action: function (task, context, callback) {
        if(context.dialog.reserve!==undefined){
            context.user.reserve=[];
            context.user.reserve=context.dialog.reserve;
        }
        if(context.user.reserve) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.update({_id: context.user.reserve._id}, {$set: {status: '취소'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n' +
                        context.user.reserve.name + '/' +
                        context.user.reserve.dateStr + '/' + context.user.reserve.time + '/'+ context.user.reserve.numOfPerson + '명/';
                    // context.user.reserve.mobile + '\n' +
                    // '예약취소';

                    // console.log(context.bot.reserveFields.numOfPerson+'--------------------------');
                    // var fields = context.bot.reserveFields || [];
                    // for(var i = 0; i < fields.length; i++) {
                    //     var field = fields[i];
                    //     if(field.name == "numOfPerson") {
                    //         message +=  context.dialog[field.name] + '명/';
                    //     } else {
                    //         message += context.dialog[field.name] + '/';
                    //     }
                    // }

                    message += '\n' + context.user.reserve.mobile + '\n' +
                        '예약취소';

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            callback(task, context);
                        }
                    );
                } else {
                    callback(task, context);
                }
            });
        } else {
            callback(task, context);
        }
    }
};

bot.setTask("reserveCancel", reserveCancel);

var previewmenulistType = {
    name: "previews",
    listName: "previews",
    typeCheck: "listTypeCheck"
};
bot.setType("previewmenulistType", previewmenulistType);

var previewAction = {
    name: "previewAction",
    action: function (task, context, callback) {
        if(context.dialog.previewlistType!==undefined){
            context.user.previewlistType=[];
            context.user.previewlistType=context.dialog.previewlistType;
        }
        //console.log(context.user.previewlistType+'----------------');
        model = mongoModule.getModel('restaurant-previews');
        //var inCurRaw=Number(context.dialog.inCurRaw)-1;
        context.dialog.categorys2=[];
        model.find({botId: context.bot.id,category:context.user.previewlistType.category}).lean().exec(function (err, docs) {
            context.dialog.previews=docs;

                callback(task, context);
            });
    }
};
bot.setTask("previewAction", previewAction);


// function previewAction(task, context, callback) {
//         var model, query, sort;
//         if (context.dialog.categorys.length == 1) {
//             context.dialog.category = context.dialog.categorys[0];
//         }
//         model = mongoModule.getModel('restaurant-previews');
//         query = {
//             botId: context.bot.id,
//             category: context.dialog.category.name
//         };
//         sort = {'_id': +1};
//
//         model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function (err, docs) {
//             task.doc = docs;
//             context.dialog.menus = docs;
//             var result = [];
//             async.eachSeries(task.doc, function (doc, cb) {
//                 var _doc = {};
//                 if (doc.name) {
//                     _doc.title = doc.name;
//                 }
//                 if (doc.description) {
//                     _doc.text = doc.description;
//                 }
//                 if (doc.price) {
//                     _doc.text = _doc.text + ' ' + doc.title + '원';
//                 }
//                 if (doc.image) {
//                     _doc.imageUrl = doc.image;
//                 }
//                 result.push(_doc);
//                 cb(null)
//             }, function (err) {
//                 task.result = {items: result};
//                 if (task.result.items.length == 0) {
//                     task.result = null;
//                 }
//                 callback(task, context);
//             });
//         });
//     }



var previewlistType = {
    name: "categorys",
    listName: "categorys",
    typeCheck: "listTypeCheck"
};
bot.setType("previewlistType", previewlistType);

var previewCategoryAction = {
    name: "previewCategoryAction",
    action: function (task, context, callback) {
        var model, query, sort;

        model = mongoModule.getModel('restaurant-previews');
        //query = {botId: context.bot.id};
        //sort = {'_id': +1};
        context.dialog.categorys = undefined;
        context.dialog.previewcategorylength=[];
            model.find({botId: context.bot.id}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;
                    for(i=0;i<context.dialog.categorys.length;i++){
                        var count1=0;
                        for(j=0;j<context.dialog.previewcategorylength.length;j++){

                            if(context.dialog.previewcategorylength.length!==0)
                            {
                                if(context.dialog.categorys[i].category!==context.dialog.previewcategorylength[j].category){count1++;}
                            }
                           // console.log(count1+'======================count1');
                        }
                        if(count1==context.dialog.previewcategorylength.length)
                        {context.dialog.previewcategorylength.push(context.dialog.categorys[i]);}
                        //console.log(JSON.stringify(context.dialog.previewcategorylength)+'======================');

                    }
                    if(context.dialog.previewcategorylength.length>1){
                        context.dialog.categoryisone=0;
                        callback(task, context);
                        var ss = 0;
                    }
                    else if(context.dialog.previewcategorylength.length===1)
                    {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++3');
                        context.dialog.categoryisone = 1;
                        model.find({
                            botId: context.bot.id,
                            category: context.dialog.previewcategorylength
                        }).lean().exec(function (err, docs) {
                            context.dialog.menuss = docs[0];
                           // console.log(JSON.stringify(context.dialog.menuss)+'+++++++++++++++++++++++++++++++3');
                            callback(task, context);
                        });
                    }
                    else {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++2');
                        callback(task, context);
                    }
                }
            });

        // model.aggregate([
        //     {$match: query},
        //     //{$sort: sort},
        //     {
        //         $group: {
        //             _id: '$category',
        //             category: {$first: '$category'}
        //         }
        //     }
        // ], function (err, docs) {
        //     if (docs == undefined) {
        //         callback(task, context);
        //     } else {
        //         var categorys = [];
        //         for (var i = 0; i < docs.length; i++) {
        //             var doc = docs[i];
        //
        //             var category = doc.category;
        //             if (!_.includes(categorys, category)) {
        //                 categorys.push({name: category});
        //             }
        //
        //             // for (var j = 0; j < doc.category.length; j++) {
        //             //   var category = doc.category[j];
        //             //   if(!_.includes(categorys, category)){
        //             //     categorys.push({name: category});
        //             //   }
        //             // }
        //         }
        //         if (categorys.length == 1) {
        //             task.doc = categorys;
        //             context.dialog.categorys = categorys;
        //             previewAction(task, context, function (task, context) {
        //                 callback(task, context);
        //             });
        //         } else if (categorys.length > 1) {
        //             task.doc = categorys;
        //             context.dialog.categorys = categorys;
        //             callback(task, context);
        //         } else {
        //             callback(task, context);
        //         }
        //     }
        // });
    }
};

bot.setTask("previewCategoryAction", previewCategoryAction);

var menuDetailTask = {
    name: "menuDetailTask",
    action: function(task, context, callback) {
        //console.log(context.dialog.menu.name+'=============');

        if (context.dialog.previewmenulistType.image !== undefined) {
            task.result = {
                text: '[' + context.dialog.previewmenulistType.name + ']' + '\n' + context.dialog.previewmenulistType.description + '\n\n처음으로 가려면\n "시작"이라고 입력해주세요.',
                image: {url: context.dialog.previewmenulistType.image},
                buttons: [
                    {
                        text: '자세히보기',
                        url: context.dialog.previewmenulistType.image.startsWith('http') ? context.dialog.previewmenulistType.image : config.host + context.dialog.previewmenulistType.image
                    }
                ]
            };

        }
        callback(task, context);
    }
};

bot.setTask("menuDetailTask", menuDetailTask);




var menuImageTask1 = {
    name: "menuImageTask1",
    action: function(task, context, callback) {
       // console.log(context.dialog.menucategory[0].image+'======================');
        if(context.dialog.menucategory[0].image!==undefined) {
            var img = context.dialog.menucategory[0].image.startsWith('http') ? context.dialog.menucategory[0].imagee : config.host + context.dialog.menucategory[0].image;
            task.result = {
                image: {url: context.dialog.menucategory[0].image},
                buttons: [
                    {text: '자세히보기', url: img}
                ]
            };
        }
        callback(task, context);
    }
};

bot.setTask("menuImageTask1", menuImageTask1);

var menuImageTask2 = {
    name: "menuImageTask2",
    action: function(task, context, callback) {
       // console.log(context.dialog.menumatch[0].image+'======================');
        if(context.dialog.menumatch[0].image!==undefined) {
            var img = context.dialog.menumatch[0].image.startsWith('http') ? context.dialog.menumatch[0].imagee : config.host + context.dialog.menumatch[0].image;
            task.result = {
                image: {url: context.dialog.menumatch[0].image},
                buttons: [
                    {text: '자세히보기', url: img}
                ]
            };
        }
        callback(task, context);
    }
};

bot.setTask("menuImageTask2", menuImageTask2);


var menuImageTask = {
    name: "menuImageTask",
    action: function(task, context, callback) {
        context.dialog.categoryisone=undefined;
        context.dialog.categorylength=[];
       // console.log(context.bot.image+'+++++++++++++++++++++++++++++11');

        if (context.bot.image!==undefined) {
            var img = context.bot.image.startsWith('http') ? context.bot.image : config.host + context.bot.image;
            task.result = {
                image: {url: context.bot.image},
                buttons: [
                    {text: '메뉴판 사진 보기', url: img}
                ]
            };
        }
        //console.log(context.bot.menus[0]+'+++++++++++++++++++++++++++++');
        if(context.bot.menus.length===0){context.dialog.restaurantno=1;callback(task,context);}
        else {
            restaurantmenu.find({botId: context.bot.id}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;
                    for(i=0;i<context.dialog.categorys.length;i++){
                        var count1=0;
                        for(j=0;j<context.dialog.categorylength.length;j++){

                            if(context.dialog.categorylength.length!==0)
                            {
                                if(context.dialog.categorys[i].category!==context.dialog.categorylength[j].category){count1++;}
                            }
                           // console.log(count1+'======================count1');
                        }
                        if(count1==context.dialog.categorylength.length)
                        {context.dialog.categorylength.push(context.dialog.categorys[i]);}
                        //console.log(JSON.stringify(context.dialog.categorylength)+'======================');

                    }
                    if(context.dialog.categorylength.length>1){
                        context.dialog.categoryisone=0;
                        context.dialog.restaurantno = 0;
                        var ss = 0;
                        for (i = 0; i < context.dialog.categorys.length; i++) {
                            if (context.dialog.categorys[i].price !== " ") {ss++;}
                        }
                        if (ss == context.dialog.categorys.length) {
                            context.dialog.menuprice = 1;
                            callback(task, context);
                        }
                        else{context.dialog.menuprice = 0;
                            callback(task, context);
                        }
                    }
                    else if(context.dialog.categorylength.length===1)
                    {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++3');
                        context.dialog.categoryisone = 1;
                        context.dialog.restaurantno = 0;
                        restaurantmenu.find({
                            botId: context.bot.id,
                            category: context.dialog.categorylength
                        }).lean().exec(function (err, docs) {

                            context.dialog.menuss = docs[0];
                           // console.log(JSON.stringify(context.dialog.menuss)+'+++++++++++++++++++++++++++++++3');
                            callback(task, context);
                        });
                    }
                    else {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++2');
                        context.dialog.restaurantno = 1;callback(task, context);
                    }
                }
            });
        }
        if(context.bot.menuImage!==undefined) {
            var img = context.bot.menuImage.startsWith('http') ? context.bot.menuImage : config.host + context.bot.menuImage;
            task.result = {
                image: {url: img},
                buttons: [
                    {text: '자세히보기', url: img}
                ]
            };
        }
        callback(task, context);
    }
};

bot.setTask("menuImageTask", menuImageTask);

var eventAction = {
    name: "eventAction",
    action: function (task, context, callback) {
       // console.log(context.dialog.eventlistType.name+'+++++++++++++++++++++++++++');
        context.dialog.events=context.dialog.eventlistType;
        context.user.eventss=context.dialog.events;
        if(context.user.eventss.image!==undefined) {
            task.result = {
                text: '[' + context.user.eventss.name + ']' + '\n' + context.user.eventss.description + '\n' + context.user.eventss.date + '\n\n' + '처음으로 가려면 "시작"이라고 입력해주세요.',
                image: {url: context.user.eventss.image},
                buttons: [
                    {
                        text: '자세히보기',
                        url: context.user.eventss.image.startsWith('http') ? context.user.eventss.image : config.host + context.user.eventss.image
                    }
                ]
            };

        }
        callback(task, context);
    }
};

bot.setTask("eventAction", eventAction);


// var  isDateIn= {
//     name:'date',
//     typeCheck: function (text, type, task, context, callback) {
//         var matched=false;
//         // 判断年、月、日的取值范围是否正确
//         // 先判断格式上是否正确
//         var regDate =/(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
//         if (!regDate.test(text))
//         {
//             matched=false;
//             callback(text, task, matched);
//
//         }
//         else{
//             // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
//             var arr = regDate.exec(text);
//                 var ss =false;
//                 ss = IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
//                 if(ss)
//                 {
//                     matched=true;callback(text, task, matched);
//                 }
//                 else{matched=false;callback(text, task, matched);}
//             }
//     }
// };
//
// bot.setType('isDateIn', isDateIn);

function IsMonthAndDateCorrect(nYear, nMonth, nDay)
{
    // 月份是否在1-12的范围内，注意如果该字符串不是C#语言的，而是JavaScript的，月份范围为0-11
    if (nMonth > 12 || nMonth <= 0)
        return false;

    // 日是否在1-31的范围内，不是则取值不正确
    if (nDay > 31 || nMonth <= 0)
        return false;

    // 根据月份判断每月最多日数
    var bTrue = false;
    switch(nMonth)
    {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            bTrue = true;               // 大月，由于已判断过nDay的范围在1-31内，因此直接返回true
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            bTrue = (nDay <= 30);    // 小月，如果小于等于30日返回true
            break;
    }

    if (!bTrue)

        return true;

    // 2月的情况
    // 如果小于等于28天一定正确
    if (nDay <= 28)
        return true;
    // 闰年小于等于29天正确
    if (IsLeapYear(nYear))
        return (nDay <= 29);
    // 不是闰年，又不小于等于28，返回false
    return false;
}

// 是否为闰年，规则：四年一闰，百年不闰，四百年再闰
function IsLeapYear(nYear)
{
    // 如果不是4的倍数，一定不是闰年
    if (nYear % 4 != 0)
        return false;
    // 是4的倍数，但不是100的倍数，一定是闰年
    if (nYear % 100 != 0)
        return true;

    // 是4和100的倍数，如果又是400的倍数才是闰年
    return (nYear % 400 == 0);
}



