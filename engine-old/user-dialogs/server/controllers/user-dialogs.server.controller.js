'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserDialog = mongoose.model('UserDialog'),
  UserDialogLog = mongoose.model('UserDialogLog'),
  Bank = mongoose.model('Bank'),
  _ = require('lodash'),
  XLSX = require('xlsx');


var util = require('util');
exports.download = function (req, res) {
  function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  }

  // function sheet_from_array_of_arrays(data, opts) {
  //   var ws = {};
  //   var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  //   for(var C = 0; C != data.length; ++C) {
  //     for(var R = 0; R < data[C].length; ++R) {
  //       if(range.s.r > R) range.s.r = R;
  //       if(range.s.c > C) range.s.c = C;
  //       if(range.e.r < R) range.e.r = R;
  //       if(range.e.c < C) range.e.c = C;
  //       var cell = {v: data[C][R] };
  //       if(cell.v == null) continue;
  //       var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
  //
  //       if(typeof cell.v === 'number') cell.t = 'n';
  //       else if(typeof cell.v === 'boolean') cell.t = 'b';
  //       else if(cell.v instanceof Date) {
  //         cell.t = 'n';
  //         cell.z = XLSX.SSF._table[14];
  //         cell.v = datenum(cell.v);
  //       }
  //       else cell.t = 's';
  //
  //       ws[cell_ref] = cell;
  //     }
  //   }
  //   if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  //   return ws;
  // }

  function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
      for(var C = 0; C != data[R].length; ++C) {
        if(range.s.r > R) range.s.r = R;
        if(range.s.c > C) range.s.c = C;
        if(range.e.r < R) range.e.r = R;
        if(range.e.c < C) range.e.c = C;
        var cell = {v: data[R][C] };
        if(cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else if(cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[22];
          cell.v = datenum(cell.v);
        }
        else cell.t = 's';

        ws[cell_ref] = cell;
      }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  }

  /* original data */
  var data = [];
  var ws_name = "LiveTalk";
  function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }
  var query = {};
  query['botId'] = req.body.botId;
  query['liveChat'] = true;
  query['channel'] = {$ne: "socket"};
  UserDialog.aggregate(
    [
      {$match: query},
      {$group: {
        _id: {userKey: "$userId", channel: "$channel"},
        dialogDatas: {$push: {dialog: "$dialog", created: "$created", inOut: "$inOut"}},
        count: {$sum: 1},
        maxDate: {$max: "$created"}
      }
      }
    ]
  ).exec(function (err, dialogs) {
    if(err) console.log(err);
    else {
      // dialogs.forEach(function (dialog) {
      //   data.push([dialog._id.channel, dialog._id.userKey, dialog.count, dialog.maxDate]);
      //   data.push([" ", " ", " ", " "]);
      //   data.push([" ", " ", " ", " "]);
      //   dialog.dialogDatas.forEach(function (dialogData) {
      //     data[data.length - 3].push(dialogData.dialog)
      //     data[data.length - 2].push(dialogData.inOut)
      //     data[data.length - 1].push(dialogData.created)
      //   })
      // });
      dialogs.forEach(function (dialog) {
        data.push(['channel', dialog._id.channel]);
        data.push(['userKey', dialog._id.userKey]);
        data.push(['dialogNum', dialog.count]);
        data.push(['recent', dialog.maxDate]);
        data.push(['dialog', '사용자', '관리자', '시간']);
        dialog.dialogDatas.forEach(function (dialogData) {
          if(dialogData.dialog){
            if(dialogData.inOut){
              data.push([" ", dialogData.dialog, " ", dialogData.created])
            }else {
              data.push([" ", " ", dialogData.dialog, dialogData.created])
            }
          }
        });
      });

      console.log(util.inspect(data));
      var wb = new Workbook();
      var ws = sheet_from_array_of_arrays(data);
      var fileName = req.body.botId + '_liveChat_' + Date.now() + '.xlsx';
      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;

      var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
      var wbout = XLSX.write(wb, wopts);
      res.json(wbout);
    }
  });

};


exports.liveChat = function (req, res) {
  console.log(util.inspect(req.body))
  var query = {};
  query['botId'] = req.body.botId;
  query['liveChat'] = true;
  query['channel'] = {$ne: "socket"};
  var currentPage = 0;
  var perPage = 10;
  var sort = {created : 1};
  // if(req.query.role && (req.query.role == 'admin')){
  //   query = {};
  // }
  if(req.query.currentPage) currentPage = req.query.currentPage;
  if(req.query.perPage) perPage = req.query.perPage;
  if(req.query.sortDir && req.query.sortCol) {
    if (req.query.sortDir == 'asc') req.query.sortDir = 1;
    else req.query.sortDir = -1;
    sort[req.query.sortCol] = req.query.sortDir;
  }
  if(req.query.search){
    var searchQuery = {};
    searchQuery['$and'] = [];
    searchQuery.$and.push(query);
    searchQuery.$and.push({
      $or : [
        {channel: { $regex: req.query.search}},
        {userId: { $regex: req.query.search}}
      ]
    });
    query = searchQuery;
  };
  console.log(util.inspect(query, {showHidden: false}))
  UserDialog.aggregate(
    [
      {$match: query},
      {$group: {
          _id: {userKey: "$userId", channel: "$channel", botId: "$botId"},
        count: {$sum: 1},
        maxDate: {$max: "$created"}
        }
      },
      {$sort: sort},
      {$skip: currentPage*perPage},
      {$limit: perPage}
    ]
  ).exec(function (err, data) {
    if(err) console.log(err);
    else {
      UserDialog.aggregate(
        [
          {$match: query},
          {$group: {
            _id: {userKey: "$userId", channel: "$channel", botId: "$botId"}
          }
          }
        ]
      ).exec(function (err, data2) {
        if(err) console.log(err);
        else {


          var result = {data: data, recordsTotal: data2.length};
          res.jsonp(result);
        }
      });
    }
  })
};


var config = require(path.resolve('./config/config'));
var dialogCache = [];
var dialoglogCache = [];
var dialogCacheLock = false;
var MAX_CACHE_DIALOG = 500;
var LIMIT_CACHE_DIALOG = 1000000;
var DIALOG_CACHE_INTERVAL = 60;

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  var query = {};
  if(req.params.botName && req.params.botName != '') query.botId = req.params.botName;
  if(req.query.liveChat) query['liveChat'] = req.query.liveChat;
  // if(req.params.botName && req.params.botName == '') query.botId = 'csdemo';
  query.userId = req.params.userKey;

  UserDialog.find(query).sort({created: 1}).exec(function (err, userDialogs) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(userDialogs);
    }
  });
};

function addDialog(inText, outText, isFail, dialog, context, callback)
{
    var dialogId, dialogName, preDialogId, preDialogName;

    if(dialog != undefined)
    {
        dialogId = dialog.id;
        dialogName = dialog.name;

        if(context.botUser.lastDialog != undefined) {
          preDialogId = context.botUser.lastDialog.id;
          preDialogName = context.botUser.lastDialog.name;
        }
    }

  var inQuery = {
    botId: context.bot.botName,
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: true,
    fail: isFail,
    dialog: inText,
    dialogId: dialogId,
    dialogName: dialogName,
      dialogType: dialog.dialogType || 'graph',
    preDialogId: preDialogId,
    preDialogName: preDialogName,
      nlpDialog: context.dialog.inNLP,
      clear: '',
    created: new Date()
  };

  var outQuery = {
    botId: context.bot.botName,
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: false,
    fail: isFail,
    dialog: outText,
    dialogId: dialogId,
    dialogName: dialogName,
      dialogType: dialog.dialogType || 'graph',
    preDialogId: preDialogId,
    preDialogName: preDialogName,
      clear: '',
    created: new Date()
  };

  if(dialog.dialogType == 'qna')
  {
      inQuery.dialogId = undefined;
      inQuery.dialogName = undefined;
      inQuery.preDialogId = undefined;
      inQuery.preDialogName = undefined;
      outQuery.dialogId = undefined;
      outQuery.dialogName = undefined;
      outQuery.preDialogId = undefined;
      if(dialog.task)
      {
          outQuery.dialogId = dialog.task.typeDoc._id;
      }

      outQuery.preDialogName = inText; // 대화학습입력 통계를 위한 데이터
  }

  if(context.user.liveChat >= 1){
    inQuery['liveChat'] = true;
    outQuery = {};
  }

    if(dialogCache.length < LIMIT_CACHE_DIALOG) {
      dialogCache.push(inQuery);
      dialogCache.push(outQuery);
    }

    var query = {
        botId: context.bot.botName,
        userId: context.user.userKey,
        channel: context.channel.name,
        year: (new Date()).getYear() + 1900,
        month: (new Date()).getMonth() + 1,
        date: (new Date()).getDate(),
        created: new Date()
    };

    if(dialoglogCache.length < LIMIT_CACHE_DIALOG) {
      dialoglogCache.push(query);
    }

    if(!dialogCacheLock &&
      (dialogCache.length >= MAX_CACHE_DIALOG || dialoglogCache.length >= MAX_CACHE_DIALOG)) {
      updateCacheLog();
    }

    // var m = process.memoryUsage();
    // console.log('Memory: ' + m.heapUsed + '/' + m.heapTotal + '=' + m.heapUsed/m.heapTotal);

    callback();
}

exports.addDialog = addDialog;

function updateCacheLog() {
  if(dialogCacheLock) return;

  dialogCacheLock = true;

  try {
    UserDialog.collection.insert(dialogCache, function(err, docs) {

      if(docs && docs.insertedCount) {
        dialogCache.splice(0, docs.insertedCount);
        console.log('userdialogs: ' + docs.insertedCount + ' inserted')
      }

      var bulk = UserDialogLog.collection.initializeOrderedBulkOp();
      for(var i = 0; i < dialoglogCache.length; i++) {
        bulk.find(dialoglogCache[i]).upsert().updateOne(dialoglogCache[i]);
      }
      bulk.execute(function(err, data) {
        dialogCacheLock = false;

        if(!err) {
          dialoglogCache.splice(0, data.nMatched);
          console.log('userdialoglogs: ' + data.nMatched + ' updated')
        }

      })

    });
  } catch(e) {
    dialogCacheLock = false;
  }
}

// insert userdialog cache every minute
setInterval(function() {
  // console.log('processing userdialogs cache check: ' + (new Date()));

  if (!dialogCacheLock && dialogCache.length > 0) {
    console.log('processing userdialogs cache: ' + dialogCache.length);

    updateCacheLog();
  }
}, DIALOG_CACHE_INTERVAL*1000);

exports.update = function (req, res) {
  UserDialog.update({preDialogId : req.body._id.preDialogId, dialog : req.body._id.dialog, fail: true, inOut: true}, {clear: true}, {multi: true}, function (err, result) {
    if(err){
      console.log(err)
    }else {
      console.log(result)
      res.json(result)
    }
  });
};
