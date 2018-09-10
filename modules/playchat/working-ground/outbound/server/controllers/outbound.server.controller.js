var fs = require('fs');
var path = require('path');
var multer = require('multer');

var request = require('request');
var async = require('async');
var mongoose = require('mongoose');

var utils = require(path.resolve('./engine2/utils/utils.js'));
var outboundUploader = require('./outbound-uploader.js');

var TeleBook = mongoose.model('TeleBook');
var TeleBookData = mongoose.model('TeleBookData');
var Scheduler = mongoose.model('Scheduler');

module.exports.check = (req, res) => {
    var options = {
        method : 'POST',
        url : 'https://biz-api.moneybrain.ai/bot',
        //url : 'http://localhost:8080/bot',
        form : req.body
    };

    request(options,(err, response, body)=>{
        if(err){
            res.send(err);
        }else{
            console.log('get date result =================>>>>>>>>')
            if(body.status){
                var logDt = body.data;
                var schedulerLog = {
                    botId : logDt.botId,
                    userId : req.body.user,
                    registerSeq : logDt.regsterSeq,
                    sender : logDt.number,
                    totalReceiver : req.body.totalReceiver,
                    sendDate : logDt.startTime
                };

                var sclog = new Scheduler(schedulerLog);
                sclog.save();
            };

            res.send(body);
        }
    })

};

module.exports.getTeleBook = (req, res) => {
    var query = {
        userId:req.params.userId,
        tag:req.params.tag,
        useYN:1
    };

    var result = {
        status:true
    };

    TeleBook.find(query).exec((err,rs) => {
        if(err){
            result.status = false;
        }else{
            result.data = rs;
        }
        res.send(result);
    })
};

module.exports.deleteTeleBook = (req,res) => {
    var query = {
        userId:req.params.userId,
        tag:req.params.tag
    };

    var result = {
        status:true
    };
    if(req.query.id && req.query.id != ''){
        query._id = req.query.id;
    }

    TeleBook.find(query).then((rs)=>{
        async.eachSeries(rs,(item,next) => {
            TeleBookData.remove({
                bookId:item._id
            },()=>{
                next();
            })
        },() => {
            TeleBook.remove(query,(err) => {
                console.log(err);
                if(err){
                    result.status = false;
                }
                res.send(result);
            })
        })
    })
};

module.exports.uploadFile = (req,res) => {
    var storage = multer.diskStorage(
        {
            destination: function (req, file, cb)
            {
                cb(null, './public/files/')
            },
            filename: function (req, file, cb)
            {
                cb(null, file.originalname);
            }
        });

    var upload = multer({ storage: storage }).single('uploadFile');

    upload.fileFilter = function (req, file, cb)
    {
        if (file.mimetype !== 'text/plain' && file.mimetype !== 'text/csv')
        {
            return cb(new Error('Only txt/csv files are allowed!'), false);
        }

        cb(null, true);
    };

    upload(req, res, function (uploadError)
    {
        if(uploadError)
        {
            console.error(uploadError);
            return res.status(400).send({ message: 'Error occurred while uploading file' });
        }
        else
        {
            var info = path.parse(req.file.filename);
            if (info.ext === ".csv" || info.ext === ".txt" || info.ext === ".xls" || info.ext === ".xlsx")
            {
                var filepath = req.file.destination + req.file.filename;

                async.waterfall([
                    function(cb)
                    {
                        var data = fs.readFileSync(filepath);
                        var head = data.toString().split('\n')[0];
                        if (head === "Date,User,Message" || head.startsWith("Talk_"))
                        {
                            // kakao file
                            return res.status(400).send({ message: '카카오 대화파일은 현재 지원되지 않습니다' });
                        }
                        else if ( (head.match(/,/g) || []).length == 1)
                        {
                            cb(null);
                        }
                        else
                        {
                            //FIXME: sample inputs are not in the correct format
                            //return res.status(400).send({ message: '대화파일이 아닙니다' });
                            cb(null);
                        }
                    },
                    function()
                    {
                        _registerTelebook({
                            filename: req.file.filename,
                            path: req.file.destination,
                            userId: req.params.userId,
                            tag: req.params.tag
                        },(result) => {
                            res.send(result);
                            fs.unlinkSync(filepath);
                        });
                    }
                ]);
            }
            else
            {
                //TODO: need to check other types
                res.status(400).send({ message: '지원되지 않는 파일 입니다' });
            }
        }
    });
};

var _registerTelebook = (data,cb) => {
    var result = {status:false};
    if(data.filename && data.path && data.userId && data.tag){
        outboundUploader.upload(data.userId, data.tag, data.filename, data.path, (result) => {
            cb(result)
        })
    }else{
        result.message = 'error : required parameters are missing!';
        cb(result)
    }
};


/*
 dialogsetUploader.upload(req.params.botId, req.body.language || 'ko', dialogset._id, dialogset.filename, function(err)
 {
 dialogset.importState = err || '';
 dialogset.save(function()
 {

 });
 });

 */
