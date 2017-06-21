var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('Shinhancard');
var mongoose = require('mongoose');
var async = require('async');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var ObjectId = mongoose.Types.ObjectId;

var dialogsType1 = {
    name: 'dialogsType1',
    typeCheck: type.dialogTypeCheck, //type.mongoDbTypeCheck,
    preType: function(task, context, type, callback) {
        // if(context.bot.dialogsets) {
        //     if(type.mongo.queryStatic.$or.length == 0) type.mongo.queryStatic = {dialogset: ''};
        // } else {
        //     type.mongo.queryStatic = {dialogset: ''};
        // }
        callback(task, context);
    },
    // limit: 8,
    matchRate: 0.3,
    matchCount: 3,
    exclude: ['하다', '이다'],
    mongo: {
        model: 'dialogsetdialogs',
        queryStatic: {dialogset: ObjectId("59474590df0c859b48a6e86f")}, //ObjectId("59474590df0c859b48a6e86f") //ObjectId("59478cf17a294c58195c9cf2") local
        queryFields: ['input'],
        fields: 'dialogset input inputRaw output context id' ,
        taskFields: ['input', 'inputRaw', 'output', 'matchCount', 'matchRate', 'dialogset', 'context'],
        minMatch: 1,
        schema: {
            dialogset: {
                type: mongoose.Schema.ObjectId,
                ref: 'Dialogset'
            },
            id: Number,
            input: mongoose.Schema.Types.Mixed,
            inputRaw: mongoose.Schema.Types.Mixed,
            output: mongoose.Schema.Types.Mixed,
            tag: [String],
            parent: mongoose.Schema.Types.Mixed,
            context: {
                type: mongoose.Schema.ObjectId,
                ref: 'CustomContext'
            }
        }
    }
};

bot.setType("dialogsType1", dialogsType1);

var faqTask = {
  action: function(task, context, callback) {
    task.dialogsType1 = context.dialog.dialogsType1;

    if(Array.isArray(task.dialogsType1)) {
      if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList &&
        (context.bot.dialogsetOption.matchOneRate == undefined || context.bot.dialogsetOption.matchOneRate > task.dialogsType1[0].matchRate) &&
        (context.bot.dialogsetOption.matchOneCount == undefined || context.bot.dialogsetOption.matchOneCount > task.dialogsType1[0].matchCount)) {
        context.dialog.dialogsType1 = task.dialogsType1;
        // if (context.bot.dialogsetOption.listOutput) {
        //   context.dialog.output = context.bot.dialogsetOption.listOutput;
        // } else {
        context.dialog.output = "아래 중에 궁금하신 내용이 있나요?\n\n#dialogsType1#+index+. +inputRaw+\n\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n처음으로 돌아가시려면 '시작'이라고 말씀해주세요";
        // }

        // context.dialog.children = [
        //   {
        //     input: {types: [{name: 'doc1', listName: 'dialogsType1', typeCheck: 'listTypeCheck'}]},
        //     output: (context.bot.dialogsetOption.contentOutput ?
        //       context.bot.dialogsetOption.contentOutput
        //       : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
        //   }
        // ];
      } else if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList && task.dialogsType1.length > 1 &&
        (task.dialogsType1[0].matchCount == task.dialogsType1[1].matchCount)) {

        var dialogs = [];
        for(var i = 0; i < task.dialogsType1.length; i++) {
          if(i == 0) dialogs.push(task.dialogsType1[i]);
          else if(dialogs[dialogs.length - 1].matchCount != task.dialogsType1[i].matchCount) break;
          else dialogs.push(task.dialogsType1[i]);
        }
        task.dialogsType1 = dialogs;

        context.dialog.dialogsType1 = task.dialogsType1;
        // if (context.bot.dialogsetOption.listOutput) {
        //   context.dialog.output = context.bot.dialogsetOption.listOutput;
        // } else {
        context.dialog.output = "아래 중에 궁금하신 내용이 있나요?\n\n#dialogsType1#+index+. +inputRaw+\n\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n처음으로 돌아가시려면 '시작'이라고 말씀해주세요";
        // }

        // context.dialog.children = [
        //   {
        //     input: {types: [{name: 'doc1', listName: 'dialogsType1', typeCheck: 'listTypeCheck'}]},
        //     output: (context.bot.dialogsetOption.contentOutput ?
        //       context.bot.dialogsetOption.contentOutput
        //       : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
        //   }
        // ];
      } else {
        if(task.dialogsType1.length > 1) {
          task._output = task.dialogsType1[0].output;
          context.dialog.listType = task.dialogsType1[0];
        } else {
          task._output = task.dialogsType1.output;
          context.dialog.listType = task.dialogsType1;
        }

        if(Array.isArray(task._output)) {
          task._output = task._output[Math.floor(Math.random() * task._output.length)];
        }

        context.dialog.output = "[+listType.inputRaw+]\n\n답변: +listType.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n처음으로 돌아가시려면 '시작'이라고 말씀해주세요"
        // context.dialog.output = '+_output+';
        // context.dialog.children = null;
        //
        // console.log(task.dialogsType1[0].inputRaw + ', ' + task.dialogsType1[0].input + '(' + task.dialogsType1[0].matchCount + ', ' + task.dialogsType1[0].matchRate + ')');
      }

    } else if(task.dialogsType1) {
      task._output = task.dialogsType1.output;

      if(Array.isArray(task._output)) {
        task._output = task._output[Math.floor(Math.random() * task._output.length)];
      }

      context.dialog.output = '+_output+';
      // context.dialog.children = null;
      // console.log(task.dialogsType1.inputRaw + ', ' + task.dialogsType1.input + '(' + task.dialogsType1.matchCount + ', ' + task.dialogsType1.matchRate + ')');
    }

    callback(task, context);
  }
}

bot.setTask('faqTask', faqTask);

var numType = {
  name: 'num',
  typeCheck: numTypeCheck
}

bot.setType("numType", numType);

var faqTest = {
    action: function (task, context, callback) {
      callback(task, context);
    }
};

bot.setTask("faqTest", faqTest);

function numTypeCheck(text, type, task, context, callback) {
  if(text.search(/^(\d)+$/g) != -1) {
    console.log('text: '+text);
    if (text < 50) {
      context.dialog.numstep = 1;
    } else if (50 <= text && text < 90) {
      context.dialog.numstep = 2;
    } else if (90 <= text && text < 100) {
      context.dialog.numstep = 3;
    } else {
      context.dialog.numstep = 4;
    }
    console.log('context.dialog.numstep: '+context.dialog.numstep);
    callback(text, task, true);
  } else {
    callback(text, task, false);
  }
}


var listType = {
    name: "faq",
    listName: "dialogsType1",
    typeCheck: "listTypeCheck"
};

bot.setType("listType", listType);

var faqtype1 = {
    name: 'typeDoc',
    typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
    preType: function(task, context, type, callback) {
        type.mongo.queryStatic.botId = context.bot.botName;
        callback(task, context);
    },
    limit: 5,
    matchRate: 0.7,
    matchCount: 4,
    mongo: {
        model: 'fan_faq',
        queryStatic: {botId: undefined},
        queryFields: ['title'],
        fields: 'title content' ,
        taskFields: ['_id', 'title', 'content'],
        minMatch: 1
    }
};

bot.setType('faqtype1',faqtype1);

var faqtype2 = {
    name: 'typeDoc',
    typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
    preType: function(task, context, type, callback) {
        type.mongo.queryStatic.botId = context.bot.botName;
        callback(task, context);
    },
    limit: 5,
    matchRate: 0.3,
    matchCount: 4,
    mongo: {
        model: 'fan_faq',
        queryStatic: {botId: undefined},
        queryFields: ['title'],
        fields: 'title content' ,
        taskFields: ['_id', 'title', 'content'],
        minMatch: 1
    }
};

bot.setType('faqtype2',faqtype2);


var fanfaqType = {
    typeCheck: type.mongoDbTypeCheck,
    limit: 5,
    raw: true,
    context: true,
    mongo: {
        // model: 'fan_faq',
        // queryFields: ['title'],
        // fields: 'title content created' ,
        // taskFields: ['_id','title','content'],
        model: 'dialogsetdialogs',
        queryFields: ['input'],
        queryStatic: {dialogset: ObjectId("59410b4fbb33920264ee001b")},
        fields: 'dialogset input inputRaw output context' ,
        taskFields: ['input', 'inputRaw', 'output', 'matchCount', 'matchRate', 'dialogset', 'context'],
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

var fanfaq = {
    name: 'faqselect',
    action: function(task, context, callback) {

        if(Array.isArray(context.dialog.dialogsType)) {
            // if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList &&
            //     (context.bot.dialogsetOption.matchOneRate == undefined || context.bot.dialogsetOption.matchOneRate > context.dialog.dialogsType[0].matchRate) &&
            //     (context.bot.dialogsetOption.matchOneCount == undefined || context.bot.dialogsetOption.matchOneCount > context.dialog.dialogsType[0].matchCount)) {
                context.dialog.typeDoc = context.dialog.dialogsType;
                // if(context.bot.dialogsetOption.listOutput) {
                //     context.dialog.output = context.bot.dialogsetOption.listOutput;
                // } else {
                //     context.dialog.output = '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n# 번호를 입력해 주세요.';
                // }

                // context.dialog.children = [
                //     {
                //         input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
                //         output: (context.bot.dialogsetOption.contentOutput ?
                //             context.bot.dialogsetOption.contentOutput
                //             : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
                //     }
                // ];
            // } else {
            //     if(context.dialog.dialogsType.length > 1) task._output = context.dialog.dialogsType[0].output;
            //     else task._output = context.dialog.dialogsType[0].output;
            //
            //     if(Array.isArray(task._output)) {
            //         task._output = task._output[Math.floor(Math.random() * task._output.length)];
            //     }
            //
            //     context.dialog.output = '+_output+';
            //     context.dialog.children = null;
            //     //
            //     // console.log(context.dialog.dialogsType[0].inputRaw + ', ' + context.dialog.dialogsType[0].input + '(' + context.dialog.dialogsType[0].matchCount + ', ' + context.dialog.dialogsType[0].matchRate + ')');
            // }

        } else {
            task._output = context.dialog.dialogsType.output;

            if(Array.isArray(task._output)) {
                task._output = task._output[Math.floor(Math.random() * task._output.length)];
            }

            // context.dialog.output = '+_output+';
            // context.dialog.children = null;
            // console.log(context.dialog.dialogsType.inputRaw + ', ' + context.dialog.dialogsType.input + '(' + context.dialog.dialogsType.matchCount + ', ' + context.dialog.dialogsType.matchRate + ')');
        }

        callback(task, context);
    }

    // postCallback: function(task, context, callback) {
    //   var toneType = context.botUser.tone;
    //   if(toneType == undefined) toneType = '해요체';
    //
    //   tone.toneSentence(task._output, toneType, function(_output) {
    //     task._output = _output;
    //     callback(task, context);
    //   });
    // }
};
bot.setTask("fanfaq", fanfaq);

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var saveFAQ = {
    name: 'saveFAQ',
    action: function(task, context, callback) {
        context.dialog.faqitem = context.dialog.faqDoc;
        callback(task, context);
    }
};
bot.setTask("saveFAQ", saveFAQ);

var setcount = {
    name: 'setcount',
    action: function(task, context, callback) {
      	if (!context.dialog.quizcount) {
          context.dialog.quizcount = 0;
        }
        callback(task, context);
    }
};
bot.setTask("setcount", setcount);

var resetcount = {
    name: 'resetcount',
    action: function(task, context, callback) {
          context.dialog.quizcount = 0;
        callback(task, context);
    }
};
bot.setTask("resetcount", resetcount);

var quizcount = {
    name: 'quizcount',
    action: function(task, context, callback) {
      	context.dialog.quizcount += 1;
      	console.log('quizcount: '+context.dialog.quizcount);
        callback(task, context);
    }
};
bot.setTask("quizcount", quizcount);


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
                    text: "가입하고 경품타자",
                    url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=naver"
                }
            ]
        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "가입하고 경품타자",
                    url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=facebook"
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "가입하고 경품타자",
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
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2767&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2767&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2767&empSeq=561&datakey=&agcCd="
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

var Air15 = {
    name: 'Air15',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2850&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2850&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2850&empSeq=561&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("Air15", Air15);

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

var FourTune = {
    name: 'FourTune',
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
bot.setTask("FourTune", FourTune);

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

var SLine = {
    name: 'SLine',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2695&empSeq=563&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'facebook') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2695&empSeq=562&datakey=&agcCd="
                }
            ]

        } else if (context.user.channel == 'kakao') {
            task.buttons = [
                {
                    text: "바로가기",
                    url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2695&empSeq=564&datakey=&agcCd="
                }
            ]

        }
        callback(task, context);
    }
};
bot.setTask("SLine", SLine);


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
                        title: "신한카드 YOLOTasty",
                        text: "Trendy한 욜로족을 위한 할인!",
                        imageUrl: "/files/Shinhancard1497428689198.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2777&empSeq=563&datakey=&agcCd="
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
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2767&empSeq=563&datakey=&agcCd="
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
                        title: "신한카드 YOLOTasty",
                        text: "Trendy한 욜로족을 위한 할인!",
                        imageUrl: "/files/Shinhancard1497428689198.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2777&empSeq=562&datakey=&agcCd="
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
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2767&empSeq=562&datakey=&agcCd="
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
                        title: "신한카드 Air Platinum#",
                        text: "마일리지와 포인트를 동시에!",
                        imageUrl: "/files/Shinhancard1497430841837.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=561&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 아시아나 Air 1.5",
                        text: "아시아나 마일리지 특화적립",
                        imageUrl: "/files/Shinhancard1497431142371.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2850&empSeq=563&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 The Classic+",
                        text: "매년 최대 12만원 Gift옵션 제공",
                        imageUrl: "/files/Shinhancard1497431214583.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2770&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한카드 Air Platinum#",
                        text: "마일리지와 포인트를 동시에!",
                        imageUrl: "/files/Shinhancard1497430841837.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2753&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 아시아나 Air 1.5",
                        text: "아시아나 마일리지 특화적립",
                        imageUrl: "/files/Shinhancard1497431142371.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2850&empSeq=562&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 The Classic+",
                        text: "매년 최대 12만원 Gift옵션 제공",
                        imageUrl: "/files/Shinhancard1497431214583.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2770&empSeq=562&datakey=&agcCd="
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
                        title: "신한카드 S-Line 체크",
                        text: "할인+적립+금융우대 서비스",
                        imageUrl: "/files/Shinhancard1497433809997.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2695&empSeq=563&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 하이패스(전용) 체크",
                        text: "하이패스 요금 적립",
                        imageUrl: "/files/Shinhancard1497434030857.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2747&empSeq=563&datakey=&agcCd="
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
                        title: "신한카드 S-Line 체크",
                        text: "할인+적립+금융우대 서비스",
                        imageUrl: "/files/Shinhancard1497433809997.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2695&empSeq=562&datakey=&agcCd="
                            }
                        ]

                    },
                    {
                        title: "신한카드 하이패스(전용) 체크",
                        text: "하이패스 요금 적립",
                        imageUrl: "/files/Shinhancard1497434030857.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2747&empSeq=562&datakey=&agcCd="
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

var cardlist7 = {
    name: 'cardlist7',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한카드 Mr.Life",
                        text: "싱글족을 위한 맞춤형 카드",
                        imageUrl: "/files/Shinhancard1497428036946.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2774&empSeq=524&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 B.BIG",
                        text: "직장인의 최적화 할인카드",
                        imageUrl: "/files/Shinhancard1497428142803.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2739&empSeq=561&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 NOON",
                        text: "굿 애프터Noon~!!",
                        imageUrl: "/files/Shinhancard1497428235548.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2841&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 미래설계",
                        text: "생활할인과 금융서비스 혜택까지",
                        imageUrl: "/files/Shinhancard1497428290478.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2727&empSeq=563&datakey&agcCd="
                            }
                        ]
                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한카드 Mr.Life",
                        text: "싱글족을 위한 맞춤형 카드",
                        imageUrl: "/files/Shinhancard1497428036946.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2774&empSeq=523&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 B.BIG",
                        text: "직장인의 최적화 할인카드",
                        imageUrl: "/files/Shinhancard1497428142803.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2739&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 NOON",
                        text: "굿 애프터Noon~!!",
                        imageUrl: "/files/Shinhancard1497428235548.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2841&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 미래설계",
                        text: "생활할인과 금융서비스 혜택까지",
                        imageUrl: "/files/Shinhancard1497428290478.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C01.shc?EntryLoc=2727&empSeq=562&datakey&agcCd="
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
bot.setTask("cardlist7", cardlist7);

var cardlist8 = {
    name: 'cardlist7',
    action: function(task, context, callback) {
        if (context.user.channel == 'navertalk' || context.user.channel == 'socket') {
            task.result = {
                items: [
                    {
                        title: "신한카드 4Tune체크",
                        text: "적립과 할인을 동시에!",
                        imageUrl: "/files/Shinhancard1497432336775.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C07.shc?EntryLoc=2764&tmEntryLoc=&empSeq=563&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 S-Choice체크",
                        text: "한가지 혜택에 All-In",
                        imageUrl: "/files/Shinhancard1497432434674.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://www.moneybrain.ai"
                            }
                        ]
                    }
                ]
            }
        } else if (context.user.channel == 'facebook') {
            task.result = {
                items: [
                    {
                        title: "신한카드 4Tune체크",
                        text: "적립과 할인을 동시에!",
                        imageUrl: "/files/Shinhancard1497432336775.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://m.shinhancard.com/mob/MOBFM038N/MOBFM038C07.shc?EntryLoc=2764&tmEntryLoc=&empSeq=562&datakey=&agcCd="
                            }
                        ]
                    },
                    {
                        title: "신한카드 S-Choice체크",
                        text: "한가지 혜택에 All-In",
                        imageUrl: "/files/Shinhancard1497432434674.jpg",
                        buttons: [
                            {
                                text: "바로가기",
                                url: "https://www.moneybrain.ai"
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
bot.setTask("cardlist8", cardlist8);
