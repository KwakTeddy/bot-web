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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
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

var cardlist1 = {
    name: 'cardlist1',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한카드 Always FAN",
                        text: "언제나 FAN으로 혜택을 받을수 있어요.",
                        imageUrl: "/files/Shinhancard1496222904469.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2831&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 O2O",
                        text: "온.오프라인을 뛰어넘은 할인을 제공해드려요.",
                        imageUrl: "/files/Shinhancard1496222925697.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2808&empSeq=563&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 The LADY CLASSIC",
                        text: "실속형 여성 프리미엄 회원을 위한 카드입니다.",
                        imageUrl: "/files/Shinhancard1496222940212.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=563&datakey&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 The CLASSIC-Y",
                        text: "Premium 적립에 Trendy 할인을 맞추었습니다.",
                        imageUrl: "/files/Shinhancard1496222951062.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2733&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한카드 Always FAN",
                        text: "언제나 FAN으로 혜택을 받을수 있어요.",
                        imageUrl: "/files/Shinhancard1496222904469.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2831&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 O2O",
                        text: "온.오프라인을 뛰어넘은 할인을 제공해드려요.",
                        imageUrl: "/files/Shinhancard1496222925697.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2808&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 The LADY CLASSIC",
                        text: "실속형 여성 프리미엄 회원을 위한 카드입니다.",
                        imageUrl: "/files/Shinhancard1496222940212.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C03.shc?EntryLoc=2804&tmEntryLoc=TM2534&empSeq=562&datakey&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 The CLASSIC-Y",
                        text: "Premium 적립에 Trendy 할인을 맞추었습니다.",
                        imageUrl: "/files/Shinhancard1496222951062.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2733&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    }
                ]
            }
        }
      	console.log(JSON.stringify(task.result))
        callback(task, context);
    }
};
bot.setTask("cardlist1", cardlist1);

var cardlist2 = {
    name: 'cardlist2',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한 Hi-Point 카드",
                        text: "포인트를 백화점 상품권으로 돌려받을 수 있어요. 포인트 최고 5% 적립!",
                        imageUrl: "/files/Shinhancard1496222978095.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2111&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 The CLASSIC-L",
                        text: "신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다.",
                        imageUrl: "/files/Shinhancard1496222991777.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2686&empSeq=563&datakey=&agcCd="
                            }
                        ]

                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한 Hi-Point 카드",
                        text: "포인트를 백화점 상품권으로 돌려받을 수 있어요. 포인트 최고 5% 적립!",
                        imageUrl: "/files/Shinhancard1496222978095.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2111&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 The CLASSIC-L",
                        text: "신한카드 레저 맴버가 되고 싶은 고객님을 위한 카드입니다.",
                        imageUrl: "/files/Shinhancard1496222991777.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2686&empSeq=562&datakey=&agcCd="
                            }
                        ]

                    }
                ]
            }
        }
        callback(task, context);
    }
};
bot.setTask("cardlist2", cardlist2);

var cardlist3 = {
    name: 'cardlist3',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한카드 RPM+ Platinum#",
                        text: "모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다.",
                        imageUrl: "/files/Shinhancard1496223034783.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 Air Platinum#",
                        text: "항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요.",
                        imageUrl: "/files/Shinhancard1496223047272.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=561&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 The BEST-T",
                        text: "해외 여행의 든든한 파트너가 되는 프리미엄카드 입니다. ",
                        imageUrl: "/files/Shinhancard1496223060412.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한 THE BEST-F 카드",
                        text: "소중한 사람들과 누리는 생활속 프리미엄카드 입니다.",
                        imageUrl: "/files/Shinhancard1496223074215.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2648&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한카드 RPM+ Platinum#",
                        text: "모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다.",
                        imageUrl: "/files/Shinhancard1496223034783.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 Air Platinum#",
                        text: "항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요.",
                        imageUrl: "/files/Shinhancard1496223047272.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=562&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 The BEST-T",
                        text: "해외 여행의 든든한 파트너가 되는 프리미엄카드 입니다. ",
                        imageUrl: "/files/Shinhancard1496223060412.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한 THE BEST-F 카드",
                        text: "소중한 사람들과 누리는 생활속 프리미엄카드 입니다.",
                        imageUrl: "/files/Shinhancard1496223074215.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2648&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    }
                ]
            }
        }
        callback(task, context);
    }
};
bot.setTask("cardlist3", cardlist3);

var cardlist4 = {
    name: 'cardlist4',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한카드 RPM+ Platinum#",
                        text: "모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다.",
                        imageUrl: "/files/Shinhancard1496223034783.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 Air Platinum#",
                        text: "항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요.",
                        imageUrl: "/files/Shinhancard1496223047272.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=561&datakey=&agcCd="
                            }
                        ]

                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한카드 RPM+ Platinum#",
                        text: "모든 주유소 포인트 적립에 생활 맞춤 혜택까지 제공합니다.",
                        imageUrl: "/files/Shinhancard1496223034783.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2795&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 Air Platinum#",
                        text: "항공 마일리지에 포인트, 프리미엄 서비스까지 제공해드려요.",
                        imageUrl: "/files/Shinhancard1496223047272.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2814&empSeq=562&datakey=&agcCd="
                            }
                        ]

                    }
                ]
            }
        }
        callback(task, context);
    }
};
bot.setTask("cardlist4", cardlist4);

var cardlist5 = {
    name: 'cardlist5',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한 S20 체크카드",
                        text: "스무살, 첫 금융특권",
                        imageUrl: "/files/Shinhancard1496223125514.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2527&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한 S20 Pink 체크카드",
                        text: "스무살, 첫 금융특권",
                        imageUrl: "/files/Shinhancard1496223114080.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2528&empSeq=563&datakey=&agcCd="
                            }
                        ]

                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한 S20 체크카드",
                        text: "스무살, 첫 금융특권",
                        imageUrl: "/files/Shinhancard1496223125514.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2527&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한 S20 Pink 체크카드",
                        text: "스무살, 첫 금융특권",
                        imageUrl: "/files/Shinhancard1496223114080.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2528&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    }
                ]
            }
        }
        callback(task, context);
    }
};
bot.setTask("cardlist5", cardlist5);

var cardlist6 = {
    name: 'cardlist6',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "쿠팡 신한카드 체크",
                        text: "쿠팡 이용금액 3% 무제한 적립에 스타벅스 이용금액 캐시백까지!",
                        imageUrl: "/files/Shinhancard1496223141009.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2833&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "카카오페이 신한 체크카드",
                        text: "카카오페이 신한 체크카드로 카카오페이에서 간편하게 결제하고 캐시백 혜택을 누려보세요!",
                        imageUrl: "/files/Shinhancard1496223171927.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=4294&empSeq=563&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "네이버페이 신한카드 체크",
                        text: "이제 오프라인에서도 네이버페이로 결제하고 네이버페이포인트도 적립하세요!",
                        imageUrl: "/files/Shinhancard1496223203051.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/conts/html/card/apply/check/1350254_33660.html"
                            }
                        ]

                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "쿠팡 신한카드 체크",
                        text: "쿠팡 이용금액 3% 무제한 적립에 스타벅스 이용금액 캐시백까지!",
                        imageUrl: "/files/Shinhancard1496223141009.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2833&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "카카오페이 신한 체크카드",
                        text: "카카오페이 신한 체크카드로 카카오페이에서 간편하게 결제하고 캐시백 혜택을 누려보세요!",
                        imageUrl: "/files/Shinhancard1496223171927.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=4294&empSeq=562&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "네이버페이 신한카드 체크",
                        text: "이제 오프라인에서도 네이버페이로 결제하고 네이버페이포인트도 적립하세요!",
                        imageUrl: "/files/Shinhancard1496223203051.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/conts/html/card/apply/check/1350254_33660.html"
                            }
                        ]

                    }
                ]
            }
        }
        callback(task, context);
    }
};
bot.setTask("cardlist6", cardlist6);
