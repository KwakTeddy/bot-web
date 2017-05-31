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
	action: function(task, context, callback) {
		if (context.user.channel == 'naver' || context.user.channel == 'socket') {
			task.result = {
				buttons: [
					{
						text: "바로가입하기",
						url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=naver"
					}
					]
			}
		} else if (context.user.channel == 'facebook') {
			task.result = {
				buttons: [
					{
						text: "바로가입하기",
						url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=facebook"
					}
				]
			}
		} else if (context.user.channel == 'kakao') {
			task.result = {
				buttons: [
					{
						text: "바로가입하기",
						url: "https://newm.shinhancard.com/event/2015/pt06.jsp?prm=kakao"
					}
				]
			}
		}
		callback(task, context);
	}
};
bot.setTask("task1", task1);
