var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('Shinhancard');
var mongoose = require('mongoose');
var async = require('async');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var type = require(path.resolve('./modules/bot/action/common/type'));

var listType = {
    name: "faq",
    listName: "faqDoc",
    typeCheck: "listTypeCheck"
};

bot.setType("listType", listType);

var fanfaqType = {
    typeCheck: type.mongoDbTypeCheck,
    limit: 5,
    raw: true,
    context: true,
    mongo: {
        model: 'fan_faq',
        queryFields: ['title'],
        fields: 'title content created' ,
        taskFields: ['_id', 'title', 'content'],
        taskSort: function(a, b) {
            if(b.matchCount > a.matchCount) return 1;
            else if(b.matchCount < a.matchCount) return -1;
            else {
                return 0;
            }
        },
        //query: {},
        // sort: "-created",
        // limit: 5,
        minMatch: 1,
        checkRequired: function(text, type, inDoc, context) {
            return '학습되어 있지 않은 질문 입니다.';
        }
    }
}

bot.setType('fanfaqType',fanfaqType);


var faqSchema = {
    title: {
        type: String
    },
    content: {
        type: String
    }
};

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var te = {
    name: 'te',
    action: function (task,context,callback) {
        //Converter Class
        var Converter = require("csvtojson").Converter;

        var fs=require("fs");
//CSV File Path or CSV String or Readable Stream Object
        var csvFileName="./fan_faq.csv";

//new converter instance
        var csvConverter=new Converter({});

//end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed",function(jsonObj){
            var fan_faq = mongo.getModel('fan_faqs', faqSchema);
            var docs = jsonObj;
            var count =0;
            var _doc = {
                title: String,
                content: String
            };
            console.log(jsonObj); //here is your result json object

            if (docs) {
                async.eachSeries(docs, function(doc, cb) {
                    _doc.title = doc.Question;
                    _doc.content = doc.Answer;
                    fan_faq.update({title: _doc.title}, _doc, {upsert: true}, function (err) {
                        if (err) {
                            return err;
                        }
                    });
                    count += 1;
                    console.log('done: '+count);
                    cb(null)
                }, function (err) {
                    callback(task,context);
                });
            }
        });

//read from file
        fs.createReadStream(csvFileName).pipe(csvConverter);
    }
};
bot.setTask("te", te);

var task1 = {
    name: 'task1',
    action: function (task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가입하기",
                    url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=naver"
                }
            ]
        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가입하기",
                    url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=facebook"
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가입하기",
                    url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=kakao"
                }
            ]

        }
        callback(task, context);
    }
}

bot.setTask("task1", task1);

var YOLO = {
    name: 'YOLO',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=563&datakey&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=562&datakey&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=561&datakey&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("YOLO", YOLO);

var NANOf = {
    name: 'NANOf',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C05.shc?EntryLoc=2445&tmEntryLoc=TM2516&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C05.shc?EntryLoc=2445&tmEntryLoc=TM2516&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C05.shc?EntryLoc=2445&tmEntryLoc=TM2516&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("NANOf", NANOf);

var mirae = {
    name: 'mirae',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2727&empSeq=563&datakey&agcCd="
                }
            ]
        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2727&empSeq=562&datakey&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2727&empSeq=561&datakey&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("mirae", mirae);

var AlwaysFAN = {
    name: 'AlwaysFAN',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2831&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2831&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2831&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("AlwaysFAN", AlwaysFAN);

var O2O = {
    name: 'O2O',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2808&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2808&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2808&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("O2O", O2O);

var Shopping = {
    name: 'Shopping',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2797&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2797&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2797&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Shopping", Shopping);

var YOLOTasty = {
    name: 'YOLOTasty',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2777&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2777&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2777&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("YOLOTasty", YOLOTasty);

var MrLife = {
    name: 'MrLife',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2774&empSeq=524&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2774&empSeq=523&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2774&empSeq=522&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("MrLife", MrLife);

var BBig = {
    name: 'BBig',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2739&empSeq=561&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2739&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2739&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("BBig", BBig);

var TheLadyClassic = {
    name: 'TheLadyClassic',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=563&datakey&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=562&datakey&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=561&datakey&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("TheLadyClassic", TheLadyClassic);

var TheClassicY = {
    name: 'TheClassicY',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2733&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2733&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2733&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("TheClassicY", TheClassicY);

var GSShine = {
    name: 'GSShine',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2453&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2453&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2453&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("GSShine", GSShine);

var Main = {
    name: 'Main',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2778&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2778&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2778&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Main", Main);

var HiPoint = {
    name: 'HiPoint',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2111&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2111&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2111&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("HiPoint", HiPoint);

var TheClassicL = {
    name: 'TheClassicL',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2686&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2686&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2686&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("TheClassicL", TheClassicL);

var RPM = {
    name: 'RPM',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("RPM", RPM);

var Air = {
    name: 'Air',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=561&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=563&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Air", Air);

var BESTT = {
    name: 'BESTT',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("BESTT", BESTT);

var BESTF = {
    name: 'BESTF',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2648&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2648&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2648&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("BESTF", BESTF);

var TheClassicplus = {
    name: 'TheClassicplus',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2770&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2770&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2770&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("TheClassicplus", TheClassicplus);

var Edu = {
    name: 'Edu',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2845&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2845&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2845&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Edu", Edu);

var Noon = {
    name: 'Noon',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2841&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2841&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2841&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Noon", Noon);


var Tune = {
    name: 'Tune',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C07.shc?EntryLoc=2764&tmEntryLoc=&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C07.shc?EntryLoc=2764&tmEntryLoc=&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C07.shc?EntryLoc=2764&tmEntryLoc=&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Tune", Tune);

var S20 = {
    name: 'S20',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2527&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2527&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2527&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("S20", S20);

var S20Pink = {
    name: 'S20Pink',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2528&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2528&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2528&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("S20Pink", S20Pink);

var hypass = {
    name: 'hypass',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2747&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2747&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2747&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("hypass", hypass);

var kakao = {
    name: 'kakao',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=4294&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=4294&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=4294&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("kakao", kakao);

var coupang = {
    name: 'coupang',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2833&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2833&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2833&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("coupang", coupang);

var MainCheck = {
    name: 'MainCheck',
    action: function(task, context, callback) {
        if (context.user.channel == 'naver' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2779&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2779&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2779&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("MainCheck", MainCheck);
