var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('intentbot');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var te = {
    action: function (task,context,callback) {
        //Converter Class
        var Converter = require("csvtojson").Converter;

        var fs=require("fs");
//CSV File Path or CSV String or Readable Stream Object
        var csvFileName="./iso.csv";

//new converter instance
        var csvConverter=new Converter({});

//end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed",function(jsonObj){
            var entity = mongo.getModel('entitycontents');
            var docs = jsonObj;
            var date = new Date();
            var count =0;
            var _doc = {
                name: String,
                entityId: mongoose.Types.ObjectId("591174705bd0362608c0e4f5"),
                user: mongoose.Types.ObjectId("58c63a3a5d3d30ef7e40b873"),
                created: date,
                __v: 0
            };
            console.log(jsonObj); //here is your result json object

            if (docs) {
                async.eachSeries(docs, function(doc, cb) {
                    _doc.name = doc.영문명;
                    entity.update({name: _doc.name}, _doc, {upsert: true}, function (err) {
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



var 건물정보스키마 = {
    법정동코드: String,
    시도명: String,
    시군구명: String,
    법정읍면동명: String,
    법정리명: String,
    산여부: String,
    지번본번: String,
    지번부번: String,
    도로명코드: String,
    도로명: String,
    지하여부: String,
    건물본번: String,
    건물부번: String,
    건축물대장건물명: String,
    상세건물명: String,
    건물관리번호: String,
    읍면동일련번호: String,
    행정동코드: String,
    행정동명: String,
    우편번호: String,
    우편일련번호: String,
    다량배달처명: String,
    이동사유코드: String,
    고시일자: String,
    변경전도로명주소: String,
    시군구용건물명: String,
    공동주택여부: String,
    기초구역번호: String,
    상세주소부여여부: String,
    비고1: String,
    비고2: String
};

var RestaurantSchema = {
    bot: {
        type: Schema.ObjectId,
        ref: 'Bot'
    },

    name: String,
    category: [String],
    post: String,
    address: Object,
    address1: String,
    address2: String,
    lng: Number,
    lat: Number,
    phone: String,
    homepage: String,
    photo: String,
    description: String,
    tag: String,

    isOpen: Boolean,
    minOrder: Number,
    payment: [String],
    businessHours: [
        {
            day: String,
            start: String,
            end: String
        }
    ],

    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    franchise: {
        type: Schema.ObjectId,
        ref: 'Franchise'
    },
    deliverable: Boolean,
    isMenuExist: {
        type: Boolean,
        default: false
    }
};

var MenuSchema = {
    restaurant: {
        type: Schema.ObjectId,
        ref: 'Restaurant'
    },

    name: String,
    category: [String],
    price: Number,

    photo: String,
    description: String,

    options: Object,
    additions: Object,

    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
};

var si = {
    action: function (task,context,callback) {
        var model = mongo.getModel('menus',MenuSchema);
        var entity = mongo.getModel('entitycontents');
        var cursor = model.aggregate([{$group: {_id: '$name'}}]).cursor({ batchSize: 1000 }).exec();
        // model.aggregate([
        //     {$group: {
        //         _id: '$시군구용건물명'
        //     }}]
        // , function(err, docs) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         if (docs == undefined) {
        //             callback(task, context);
        //         } else {
        //             console.log(docs);
        //             callback(task, context);
        //         }
        //     }
        // });
        var count = 0;
        var date = new Date();
        cursor.each(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                if (doc) {
                    if (doc._id) {
                        doc.name = doc._id;
                        delete doc._id;
                        doc.entityId = mongoose.Types.ObjectId("5911729d5bd0362608c0e4d9");
                        doc.user = mongoose.Types.ObjectId("58c63a3a5d3d30ef7e40b873");
                        doc.created = date;
                        doc.__v = 0;

                        entity.update({name: doc.name}, doc, {upsert: true}, function (err) {
                            if (err) {
                                return err;
                            }
                        });
                    }
                    count += 1;
                    console.log('done: ' + count);
                }
            }
        });
        // var _doc = {
        //     name: 'name',
        //     botId: 'Id'
        // };
        // entity.update({name: _doc.name}, _doc, {upsert: true}, function(err) {
        //     if (err) {
        //         return err;
        //     }
        //     console.log('testdone');
        // });
        callback(task,context);
// model.find({시군구용건물명:'우리집'}).lean().exec(function (err,docs) {
// model.count({}).exec(function (err,docs) {
//     console.log('::'+docs);
//     callback(task,context);
// })
    }
};
bot.setTask("si", si);

