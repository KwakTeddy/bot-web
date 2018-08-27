var path = require('path');
var XLSX = require('xlsx');
var async = require('async');
var fs = require('fs');

var mongoose = require('mongoose');

var TeleBook = mongoose.model('TeleBook');
var TeleBookData = mongoose.model('TeleBookData');

(function()
{
    var Uploader = function()
    {

    };

    const match = /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g;

    var replacePhone = (numb) => {
        numb = numb.toString().replace(/[^0-9]/g,'');
        numb = numb.length == 10 ? '0' + numb : numb;

        if(numb.match(match)){
            return numb
        }else{
            return null
        }

    };

    var _dbSetProcess = (userId, tag, filename, list, cb) => {
        var teleBook = new TeleBook({
            userId : userId,
            tag : tag,
            fileName : filename,
            total : list.length
        });

        teleBook.save((err,rs) => {
            if(err){
                cb({status:false})
            }else{
                var bookId = rs._id;
                async.eachSeries(list,(item,next)=>{
                    var teleBookData = new TeleBookData(item);
                    teleBookData.bookId = bookId;
                    teleBookData.save(() => {
                        next();
                    })
                },() => {
                    cb({
                        status:true,
                        data : rs
                    })
                });
            }
        });
    }

    Uploader.prototype.uploadFromExcel = function(userId, tag, filename, filePath, callback)
    {
        var workbook = XLSX.readFile(filePath);
        var first_sheet_name = workbook.SheetNames[0];
        var ws = workbook.Sheets[first_sheet_name];

        var range = XLSX.utils.decode_range(ws['!ref']);

        if(range.e.c < 0)
        {
            throw 'The format does not match';
        }

        var teleBookList = [];

        for(var r=1;r<=range.e.r;r++){
            var name = ws[XLSX.utils.encode_cell({ c: 0, r: r })];
            var number = ws[XLSX.utils.encode_cell({ c: 1, r: r })];

            if(name&&number){
                var item = {};
                item.name = name.v;
                item.number = replacePhone(number.v);


                if(item.number){
                    teleBookList.push(item)
                }
            }

        }

        if(teleBookList.length>0){
            _dbSetProcess(userId, tag, filename, teleBookList, (result) => {
                callback(result)
            })
        }else{
            callback({status:false,message:'no data in file'})
        }
    };

    Uploader.prototype.uploadFromCsv = function(userId, tag, filename, filePath, callback)
    {
        var data = fs.readFileSync(filePath);

        data = data.toString();


        var teleBookList = [];
        var split = data.split('\r\n');


        split.forEach((e)=>{
            var item = {};

            var col = e.split(',');
            if(col[0]&&col[1]&&col[0]!=''&&col[1]!=''){
                item.name = col[0];
                item.number = replacePhone(col[1]);

                if(item.number){
                    teleBookList.push(item)
                }
            }

        });

        if(teleBookList.length>0){
            _dbSetProcess(userId, tag, filename, teleBookList, (result) => {
                callback(result)
            })
        }else{
            callback({status:false,message:'no data in file'})
        }
    };

    Uploader.prototype.upload = function(userId, tag, filename, filepath, callback)
    {
        var dir = path.resolve(filepath);
        var filePath = path.join(dir, filename);
        var info = path.parse(filename);

        if(info.ext == '.xls' || info.ext == '.xlsx')
        {
            this.uploadFromExcel(userId, tag, filename, filePath, callback);
        }
        else if(info.ext == '.csv')
        {
            this.uploadFromCsv(userId, tag, filename, filePath, callback);
        }
    };

    module.exports = new Uploader();

    //var upload = new Uploader();
    //upload.upload('leon@moneybrain.ai', 'temp', 'Telebook.csv',(res)=>{
    //    TeleBook.findOne({_id:res.data},(err,teleBook)=>{
    //        console.log(err)
    //        console.log(teleBook)
    //        process.exit()
    //    })
    //
    //});

})();
