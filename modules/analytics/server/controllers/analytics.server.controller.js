'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bot = mongoose.model('Bot'),
  BotUser = mongoose.model('BotUser'),
  UserDialogLog = mongoose.model('UserDialogLog'),
  UserDialog = mongoose.model('UserDialog'),
  BotIntentFail = mongoose.model('BotIntentFail'),
  Intent = mongoose.model('Intent'),
  FactLink = mongoose.model('FactLink'),
  botLib = require(path.resolve('config/lib/bot')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  utils = require(path.resolve('modules/bot/action/common/utils')),
  XLSX = require('xlsx');

var async = require('async');
var BotFile = mongoose.model('BotFile');

var util = require('util');
var clear = function(d) {
  if(d.context) d.context = {name: d.context.name};
  if (d.children) {
    d.children.forEach(clear);
  }
};

exports.senarioExelDownload = function (req, res) {
  UserDialog.aggregate(
    [

    ]
  ).exec(function (err, senarioUsageStatistics) {

  });




  function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  }
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
  function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }

  var data = [];
  req.body.data.columnOrder.forEach(function (doc) {
    data.push([doc]);
  });
  req.body.data.orderedData.forEach(function (doc) {
    data.forEach(function (_doc) {
      _doc.push(doc[_doc[0]])
    });
  });

  var wb = new Workbook();
  var ws = sheet_from_array_of_arrays(data);
  var ws_name = req.body.data.sheetName;
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var fileName = req.params.bId + '_' + req.body.data.filename + '_' + new Date().getFullYear() + '_' + new Date().getMonth() + '_' + new Date().getDate() + '.xlsx';
  XLSX.writeFile(wb, './public/files/' + fileName );
  res.json(fileName);
};

exports.exelDownload = function (req, res) {
  function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  }
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
  function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }

  var data = [];
  req.body.data.columnOrder.forEach(function (doc) {
    data.push([doc]);
  });
  req.body.data.orderedData.forEach(function (doc) {
    data.forEach(function (_doc) {
      _doc.push(doc[_doc[0]])
    });
  });

  var wb = new Workbook();
  var ws = sheet_from_array_of_arrays(data);
  var ws_name = req.body.data.sheetName;
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var day = new Date().getDate();

  var fileName = req.params.bId + '_' + req.body.data.filename + '_' + year + '_' + month + '_' + day + '.xlsx';
  XLSX.writeFile(wb, './public/files/' + fileName );
  res.json(fileName);
};


/**
 * List of User count
 */
exports.list = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;
  var botId = req.params.bId;

  var cond = {};
  if (kind == 'year')
    cond = {year: parseInt(arg)};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1 };

  cond.botId = botId;
  cond.channel = {$ne: "socket"};

  console.log(JSON.stringify(cond));
  UserDialogLog.aggregate(
    [
      {$match: cond},
      {$group: {_id: {year: '$year', month: '$month', date: '$date'}, date: {$first: '$date'}, count: {$sum: 1}}},
      {$sort: {_id:-1,  date: -1}},
      {$limit: 31}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

exports.failDailogs = function (req, res) {
  var cond = {botId: req.params.bId, inOut: true, fail: true, channel : {$ne: "socket"}};
  var startYear =  parseInt(req.body.date.start.split('/')[0]);
  var startMonth = parseInt(req.body.date.start.split('/')[1]);
  var startDay =   parseInt(req.body.date.start.split('/')[2]);
  var endYear =  parseInt(req.body.date.end.split('/')[0]);
  var endMonth = parseInt(req.body.date.end.split('/')[1]);
  var endDay =   parseInt(req.body.date.end.split('/')[2]);
  cond['created'] = {$gte: new Date(startYear, startMonth - 1, startDay), $lte: new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)};

  var query = [
    {$match: cond},
    {$group: {_id: {dialog: "$dialog"}, count: {$sum: 1}}},
    {$sort: {count: -1}}
  ];

  if(req.body.limit) query.push({$limit: req.body.limit});
  UserDialog.aggregate(query).exec(function (err, failDialog) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(failDialog);
    }
  });
};

exports.userCount = function (req, res) {
  var cond = {botId: req.params.bId, inOut: true};
  var startYear =  parseInt(req.body.date.start.split('/')[0]);
  var startMonth = parseInt(req.body.date.start.split('/')[1]);
  var startDay =   parseInt(req.body.date.start.split('/')[2]);
  var endYear =  parseInt(req.body.date.end.split('/')[0]);
  var endMonth = parseInt(req.body.date.end.split('/')[1]);
  var endDay =   parseInt(req.body.date.end.split('/')[2]);
  cond['created'] = {$gte: new Date(startYear, startMonth - 1, startDay), $lte: new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)};

  switch (req.body.channel){
    case "facebook": cond.channel = "facebook"; break;
    case "kakao": cond.channel = "kakao"; break;
    case "navertalk": cond.channel = "navertalk"; break;
    default : cond.channel = {$ne: "socket"}; break;
  }
  switch (req.body.userType){
    case  "new": console.log(1); break;
    case  "revisit": console.log(1); break;
  }

  UserDialog.aggregate(
    [
      {$match: cond},
      {$project:
        {
          _id: 0,
          botId:1,
          inOut: 1,
          channel: 1,
          userId: 1,
          created: {$add:["$created", 9*60*60*1000]}
        }
      },
      {$group:
        {
          _id: {
            year: { $year: "$created" },
            month: { $month: "$created" },
            day: { $dayOfMonth: "$created" },
            userId: '$userId',
            channel: "$channel"
          }
        }
      },
      {$project:
        {
          _id: 1,
          kakao: {$cond:[{$eq: ["$_id.channel", "kakao"]}, 1,0]},
          facebook: {$cond:[{$eq: ["$_id.channel", "facebook"]}, 1,0]},
          navertalk: {$cond:[{$eq: ["$_id.channel", "navertalk"]}, 1,0]}
        }
      },
      {$group:
        {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          },
          total: {$sum: 1},
          kakao: {$sum: "$kakao"},
          facebook: {$sum: "$facebook"},
          navertalk: {$sum: "$navertalk"}
        }
      },
      {$sort: {_id:-1,  date: -1}}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userCounts);
    }
  });

  // UserDialogLog.aggregate(
  //   [
  //   {$project: {_id: 0, botId:1, inOut: 1, channel: 1, year: 1, month: 1,date: 1, kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]}, facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]}, navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]}}},
  //   {$match: cond},
  //   {$group: {_id: {year: '$year', month: '$month', day: '$date'}, total: {$sum: 1},kakao: {$sum: "$kakao"}, facebook: {$sum: "$facebook"}, navertalk: {$sum: "$navertalk"}}},
  //   {$sort: {_id:-1,  date: -1}}
  //   ]
  // ).exec(function (err, userCounts) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(userCounts);
  //   }
  // });
};

exports.userDialogCumulativeCount = function (req, res) {
  var cond = {};
  cond.botId = req.params.bId;
  cond.channel = {$ne: "socket"};
  UserDialog.count(cond).exec(function (err, dialogTotalCount) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialogTotalCount);
    }
  });
};

exports.dailyDialogUsage = function (req, res) {
  var cond = {botId: req.body.botId, inOut: true};
  var startYear =  parseInt(req.body.date.start.split('/')[0]);
  var startMonth = parseInt(req.body.date.start.split('/')[1]);
  var startDay =   parseInt(req.body.date.start.split('/')[2]);
  var endYear =  parseInt(req.body.date.end.split('/')[0]);
  var endMonth = parseInt(req.body.date.end.split('/')[1]);
  var endDay =   parseInt(req.body.date.end.split('/')[2]);
  cond['created'] = {$gte: new Date(startYear, startMonth - 1, startDay), $lte: new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)};
  switch (req.body.channel){
    case "facebook": cond.channel = "facebook"; break;
    case "kakao": cond.channel = "kakao"; break;
    case "navertalk": cond.channel = "navertalk"; break;
    default : cond.channel = {$ne: "socket"}; break;
  }
  UserDialog.aggregate(
    [
      {$match: cond},
      {$project:
        {
          _id: 0,
          created: {$add:["$created", 9*60*60*1000]},
          fail: {$cond:[{$eq: ["$fail", true]}, 1,0]},
          kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
          facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
          navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]}
        }
      },
      {$group:
        {
          _id: {year: { $year: "$created" }, month: { $month: "$created" }, day: { $dayOfMonth: "$created" }},
          total: {$sum: 1},
          fail: {$sum: "$fail"},
          kakao: {$sum: "$kakao"},
          facebook: {$sum: "$facebook"},
          navertalk: {$sum: "$navertalk"}
        }
      },
      {$sort: {_id:-1,  day: -1}}
    ]
  ).exec(function (err, dailyDialog) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // replace ";reset user" to 시작
      // dailyDialog.forEach(function(item) {
      //   if (item._id == ":reset user")
      //     item._id = "시작";
      // });
      res.jsonp(dailyDialog);
    }
  });
};

exports.senarioUsage = function (req, res) {
  var query;
  var cond = {inOut: true, dialogName: {$nin: ["시작", "답변없음"]}, botId: req.params.bId};
  var startYear =  parseInt(req.body.date.start.split('/')[0]);
  var startMonth = parseInt(req.body.date.start.split('/')[1]);
  var startDay =   parseInt(req.body.date.start.split('/')[2]);
  var endYear =  parseInt(req.body.date.end.split('/')[0]);
  var endMonth = parseInt(req.body.date.end.split('/')[1]);
  var endDay =   parseInt(req.body.date.end.split('/')[2]);
  cond['created'] = {$gte: new Date(startYear, startMonth - 1, startDay), $lte: new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)};
  switch (req.body.channel){
    case "facebook": cond.channel = "facebook"; break;
    case "kakao": cond.channel = "kakao"; break;
    case "navertalk": cond.channel = "navertalk"; break;
    default : cond.channel = {$ne: "socket"}; break;
  }
  query = [
    {$match: cond},
    {$project:
      {
        _id: 0,
        channel: 1,
        dialogName:1,
        year: { $year: "$created" },
        month: { $month: "$created" },
        day: { $dayOfMonth: "$created" },
        kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
        facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
        navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]}
      }
    },
    {$group:
      {
        _id: {dialogName: '$dialogName'},
        total: {$sum: 1},
        kakao: {$sum: "$kakao"},
        facebook: {$sum: "$facebook"},
        navertalk: {$sum: "$navertalk"}
      }
    },
    {$sort: {total: -1}}
  ];
  if(req.body.limit) query.push({$limit: req.body.limit});
  UserDialog.aggregate(query).exec(function (err, senarioUsage) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var result = {};
      if(global._bot && global._bot[req.params.bId]){
        result["senarioUsage"] = senarioUsage;
        result["botSenario"] = global._bot[req.params.bId];
        res.jsonp(result);
      }else {
        botLib.loadBot(req.params.bId, function (realbot) {
          result["senarioUsage"] = senarioUsage;
          result["botSenario"] = realbot.dialogs;
          res.jsonp(result);
        })
      }
    }
  });
};

exports.userInputStatistics = function (req, res) {
  var cond = {inOut: true, dialog: {$ne: null}, botId: req.params.bId};
  var startYear =  parseInt(req.body.date.start.split('/')[0]);
  var startMonth = parseInt(req.body.date.start.split('/')[1]);
  var startDay =   parseInt(req.body.date.start.split('/')[2]);
  var endYear =  parseInt(req.body.date.end.split('/')[0]);
  var endMonth = parseInt(req.body.date.end.split('/')[1]);
  var endDay =   parseInt(req.body.date.end.split('/')[2]);
  cond['created'] = {$gte: new Date(startYear, startMonth - 1, startDay), $lte: new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)};
  switch (req.body.channel){
    case "facebook": cond.channel = "facebook"; break;
    case "kakao": cond.channel = "kakao"; break;
    case "navertalk": cond.channel = "navertalk"; break;
    default : cond.channel = {$ne: "socket"}; break;
  }

  var query = [
    {$match: cond},
    {$group:
      {
        _id: {
          dialog: '$dialog'}, count: {$sum: 1}
      }
    },
    {$sort: {count: -1}}
  ];

  if(req.body.limit) query.push({$limit: req.body.limit});

  UserDialog.aggregate(query).exec(function (err, userInputCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userInputCounts);
    }
  });
};

exports.dialogIsFail = function (req, res) {
  var cond = { inOut: true, channel: {$ne: "socket"}};
  var year = 2017;
  var month = 7;
  var date = 20;
  cond.botId = req.params.bId;
  cond.$or = [{year: year, month: month, date: {$lte: date}}, {year: year, month: month -1, date: {$gt: date}}];
  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },date: { $dayOfMonth: "$created" }, channel: 1,inOut: 1, botId: 1, fail: {$cond:[{$eq:["$fail", true]}, 1, 0]}}},
      {$match: cond},
      {$group: {_id: {isFail: "$fail"}, count: {$sum: 1}, isFail: {$sum: "$fail"}}},
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userCounts)
    }
  });
};

exports.dialogSuccessList = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;
  var botId = req.params.bId;

  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true};
  cond.botId = botId;
  // console.log(JSON.stringify(cond));
  async.waterfall([
    function(cb) {
      UserDialog.aggregate(
        [
          {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', botId: '$botId'}},
          {$match: cond},
          {$group: {_id: {year: '$year', month: '$month', date: '$day'}, date: {$first: '$date'}, count: {$sum: 1}}},
          {$sort: {_id:-1, date: -1}}
        ]
      ).exec(function (err, userCounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          cb(null, userCounts);
        }
      });
    },
    function(userCounts, cb) {
      cond.fail = true;
      UserDialog.aggregate(
        [
          {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', fail:'$fail', botId:'$botId'}},
          {$match: cond},
          {$group: {_id: {year: '$year', month: '$month', date: '$day'}, date: {$first: '$date'}, count: {$sum: 1}}},
          {$sort: {_id:1, date: -1}}
        ]
      ).exec(function(err, failCounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var result = [];
          for (var i = 0; i < userCounts.length; ++i)
          {
            result.push(userCounts[i]);
            result[i].rate = 100.0;
            result[i].fail_count = 0;
            result[i].success_count =  userCounts[i].count;
            for (var j=0; j < failCounts.length; ++j)
            {
              if (
                userCounts[i]._id.year == failCounts[j]._id.year &&
                userCounts[i]._id.month == failCounts[j]._id.month &&
                userCounts[i]._id.date == failCounts[j]._id.date
                )
              {
                result[i].fail_count = failCounts[j].count;
                result[i].rate = ((userCounts[i].count - failCounts[j].count) / userCounts[i].count * 100.0).toFixed(2);
              }
            }
          }
          res.jsonp(result);
        }
      });
    }
  ]);
};

exports.sessionSuccessList = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;
  var botId = req.params.bId;

  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true};
  cond.botId = botId;
  // console.log(JSON.stringify(cond));
  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', fail:'$fail', botId:"$botId"}},
      {$match: cond},
      {$group: {_id: '$dialog', count: {$sum: 1}}},
      {$sort: {count: -1}}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

exports.dialogFailureList = function (req, res) {
  var botId = req.params.bId;
  var kind = req.params.kind;
  var arg = req.params.arg;

  _dialogFailureList(botId, kind, arg, function(userCounts, err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

function _dialogFailureList(botId, kind, arg, callback) {
  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true}
  cond.fail = true;
  //TODO: change this to regexp
  cond.dialog = {$ne: null, $nin: [":reset user", ":build " + botId + " reset"]};
  cond.preDialogId = {$ne: 0};
  cond.botId = botId;
  cond.clear = {$ne: true};

  // console.log(JSON.stringify(cond));

  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" },
        inOut: '$inOut', dialog: '$dialog', fail:'$fail', preDialogId:'$preDialogId', preDialogName:'$preDialogName', botId:'$botId', clear:'$clear'}},
      {$match: cond},
      {$match:{ preDialogId: { $exists:true, $ne: null } } },
      {$group: {_id: {dialog:'$dialog', preDialogId: '$preDialogId'}, id: {$first: '$_id'}, count: {$sum: 1}}},
      // {$group: {_id: {_id: '$_id', dialog:'$dialog', preDialogId: '$preDialogId'}, count: {$sum: 1}}},
      {$sort: {count: -1}},
      {$limit: 300}
    ]
  ).exec(function (err, userCounts) {
    callback(userCounts, err);
  });
}

exports._dialogFailureList = _dialogFailureList;
var dialogs_data;

var searchDialog = function(dialogs, dialogId, action, res, data) {
  for(var i = 0; i < dialogs.length; i++){
    if (dialogs[i].id == dialogId){
      return action(dialogs[i], res, data);
    }else if (dialogs[i].children) {
      searchDialog(dialogs[i].children, dialogId, action, res, data);
    }
  }
};

var findOne = function(o, res, data) {
  var dialog = {};
  dialog.name = o.name != undefined ? o.name : "dialog" + o.id;
  dialog.inputs = o.input;
  dialog.outputs = o.output;

  // console.log(JSON.stringify(dialog));
  res.jsonp(dialog);
};

var findChildren = function(object, res, data) {
  var dialogChildren = [];
  if (object.children){
    // dialogs_data.forEach(function(obj) {
    object.children.forEach(function(obj) {
      var dialog = {};
      dialog.dialogId = obj.id;
      dialog.name = obj.name != undefined ? obj.name : "dialog"+obj.id;
      dialog.outputs = obj.output;
      if (Array.isArray(obj.input)){
        for(var i = 0; i < obj.input.length; i++){
          if (obj.input[i].text){
            obj.input[i] = obj.input[i].text
          }
        }
      }else if(typeof obj.input == 'Object'){
        obj.input = obj.input.text
      }

      dialog.inputs = obj.input;

      dialogChildren.push(dialog);
    });
    data['actionCall'] = true
    // res.end();
    // console.log(JSON.stringify(dialogChildren));
    res.jsonp(dialogChildren);
  }else {
    // console.log(util.inspect(object))
    if (!Array.isArray(object)){
      object = [object];
    }
    object.forEach(function(obj) {
    // dialogs_data.forEach(function(obj) {
      var dialog = {};
      dialog.dialogId = obj.id;
      dialog.name = obj.name != undefined ? obj.name : "dialog"+obj.id;
      dialog.outputs = obj.output;
      if (Array.isArray(obj.input)){
        for(var i = 0; i < obj.input.length; i++){
          if (obj.input[i].text){
            obj.input[i] = obj.input[i].text
          }
        }
      }else if(typeof obj.input == 'Object'){
        obj.input = obj.input.text
      }
      dialog.inputs = obj.input;
      dialogChildren.push(dialog);
    });
    data['actionCall'] = true;

    res.jsonp(dialogChildren);
  }
};

var dialogId;
var originalDialog;
var targetPreDialog;
var save = function(o, res, data) {
  // console.log(JSON.stringify(data));

  var nlp = require(path.resolve('modules/bot/engine/nlp/processor'));
  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: true     // (optional default: false)
  });

  nlpKo.tokenize/*ToStrings*/(data.inputs[data.inputs.length-1], function(err, result) {

    var _nlp = [], _in;
    for (var i = 0; i < result.length; i++) {

      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    data.inputs[data.inputs.length - 1] = _in;


    if (Array.isArray(data.inputs)){
      for(var i = 0; i < data.inputs.length; i++){
        if (data.inputs[i].text){
          data.inputs[i] = data.inputs[i].text
        }
      }
    }else if(typeof data.inputs == 'Object'){
      if (data.inputs.text){
        data.inputs = data.inputs.text
      }
    }

    if (!Array.isArray(o.input)){

      o.input = [];
      for(var i = 0; i < data.inputs.length; i++){
        o.input.push({'text': data.inputs[i]})
      }
    }else{
      for(var i = 0; i < o.input.length; i++){
        if (o.input[i].text){
          o.input[i].text = data.inputs[i]
        }
      }
      for(var j = o.input.length; j < data.inputs.length;j++){
        o.input.push({'text': data.inputs[j]});
      }
    }

    if (Array.isArray(o.output)){
      for(var i = 0; i < o.output.length; i++){
        o.output[i] = data.outputs[i]
      }
      for(var j = o.output.length; j < data.outputs.length;j++){
        o.output.push(data.outputs[j]);
      }
    }else {
      if (data.outputs.length == 1){
        o.output = data.outputs[0];
      }else {
        o.output = data.outputs;
      }
    }


    var userDialogIds = [];

    UserDialog.update({preDialogId : targetPreDialog, dialog : originalDialog, fail: true, inOut: true}, {clear: true}, {multi: true}, function (err, result) {
      if(err){
        console.log(err)
      }else {
        // console.log(result)
        res.json(result)
      }
    });
  });

};

exports.dialog = function (req, res) {
  var botId = req.params.bId;
  var dialogId = req.params.dialogId;
  isCyclic(global._bots[botId].dialogs)
  global._bots[botId].dialogs.forEach(clear);
  dialogs_data = utils.cloneWithoutCycle(global._bots[botId].dialogs);
  var data = {};

  // console.log("dialog:" + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, findOne, res, data);

};


exports.dialogChildren = function (req, res) {
  var botId = req.params.bId;
  var dialogId = req.params.dialogId;
  isCyclic(global._bots[botId].dialogs);
  global._bots[botId].dialogs.forEach(clear);
  dialogs_data = utils.cloneWithoutCycle(global._bots[botId].dialogs);
  var data = {};
  // console.log(util.inspect(dialogs_data))

  // console.log("dialogChildren: " + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, findChildren, res, data);
  // console.log(util.inspect(data));
  // console.log('----------------');
  if (!data.actionCall){
    var filteredDialog = [];
    for(var i = 0; i < dialogs_data.length; i++){
      if (dialogs_data[i].filename){
        filteredDialog.push(dialogs_data[i])
      }
    }
    // console.log(util.inspect(filteredDialog));
    findChildren(filteredDialog, res, data);
    res.end()
  }
};

exports.save_dialog = function(req, res) {
  var botId = req.body.botId;
  dialogId = req.body.dialogId;
  originalDialog = req.body.originalDialog;
  targetPreDialog = req.body.targetPreDialog;
  var dialog = {inputs: req.body.inputs, outputs: req.body.outputs};
  // console.log(util.inspect(req.body.outputs));

  dialogs_data = global._bots[botId].dialogs;

  // console.log("save: " + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, save, res, dialog);
};

exports.load_bot = function(req, res) {
  var botId = req.params.bId;
  var fileName = req.params.fileName;
  botLib.buildBot(botId, null, fileName);
  botLib.loadBot(botId, function(bot) {
    // console.log("loadBot: " + botId);
    res.status(200).send(bot);
  });
};

exports.save_dialogs = function(req, res) {
  var botId = req.body.botId;
  var fileName = req.body.fileName;
  var dialogs = req.body.dialogs;
  var commons = req.body.commons;
  // var dialogs = JSON.parse(req.body.dialogs, function(key, value){
  //   console.log(key + "," + value);
  //   if(typeof value != 'string') return value;
  //   return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
  // });

  // save to dialog.js , buildBot and loadBot
  botLib.buildBot(botId, null, fileName, JSON.stringify(dialogs, null, "\t"),JSON.stringify(commons, null, '\t'));
  botLib.loadBot(botId, function(bot) {
    // console.log("saveAll: " + botId+","+fileName);
    res.status(200).send(bot);
  });
};


var isCyclic = function(obj) {
  var keys = [];
  var stack = [];
  var stackSet = new Set();
  var detected = false;

  function detect(obj, key) {
    if (!(obj instanceof Object)) {
      return;
    } // Now works with other
      // kinds of object.

    if (stackSet.has(obj)) { // it's cyclic! Print the object and its locations.
      var oldindex = stack.indexOf(obj);
      var l1 = keys.join('.') + '.' + key;
      var l2 = keys.slice(0, oldindex + 1).join('.');
      // console.log('CIRCULAR: ' + l1 + ' = ' + l2 + ' = ' + obj);
      // console.log(obj);
      detected = true;
      return;
    }

    keys.push(key);
    stack.push(obj);
    stackSet.add(obj);
    for (var k in obj) { //dive on the object's children
      if (obj.hasOwnProperty(k)) {
        detect(obj[k], k);
      }
    }

    keys.pop();
    stack.pop();
    stackSet.delete(obj);
    return;
  }
  detect(obj, 'obj');
  return detected;
};

exports.dialogs = function (req, res) {
  var botId = req.params.bId;
  var fileId = req.params.fileId;

  var result = {};
  var dialogs_data;
  var common_dialogs;
  async.waterfall([
    function (cb) {
      BotFile.findById(fileId).exec(function (err, file) {
        result.fileName= file.name.split(".")[0];
        cb(null);
      });
    },
    function (cb) {
      Bot.findOne({_id: botId}).exec(function (err, doc) {
        result.botId = doc.id;
        if (!global._bots[doc.id]) {
          botLib.loadBot(doc.id, function (bot) {
            dialogs_data = (bot.dialogs);
            common_dialogs = (global._bots[doc.id].commonDialogs);
            cb(null, doc.id);
          });
        } else {
          dialogs_data = (global._bots[doc.id].dialogs);
          common_dialogs = (global._bots[doc.id].commonDialogs);
          cb(null, doc.id);
        }
      });
    },
    function (cb) {
      result.data = [];

      var _dialogs_data = utils.cloneWithoutCycle(dialogs_data);
      _dialogs_data.forEach(clear);

      _dialogs_data.forEach(function (d) {
        if (d.filename === result.fileName) {
          result.data.push(d);
        }
      });

      result.common = [];

      var _common_dialogs = utils.cloneWithoutCycle(common_dialogs);
      _common_dialogs.forEach(clear);
      _common_dialogs.forEach(function (d) {
        if (d.filename === result.fileName + "common") {
          result.common.push(d);
        }
      });
      result.common.forEach(function(d) {
        delete d.task;
      });

      // console.log("dialog:" + result.botId + "(" + botId + "), " + result.fileName);
      // var json = JSON.stringify(result, function(key, value) {
      //       return (typeof value === 'function' ) ? value.toString() : value;
      //   });

      isCyclic(result);
      return res.jsonp(result);
    }
  ]);
};

exports.dialoginfos = function (req, res) {
  var botId = req.params.bId;
  var fileId = req.params.fileId;

  var result = {};
  async.waterfall([
    function (cb) {
      BotFile.findById(fileId).exec(function (err, file) {
        result.fileName= file.name.split(".")[0];
        cb(null);
      });
    },
    function (cb) {
      Bot.findOne({_id: botId}).exec(function (err, doc) {
        result.botId = doc.id;
        if (!global._bots[doc.id]) {
          botLib.loadBot(doc.id, function (bot) {
            cb(null, doc.id);
          });
        } else {
          cb(null, doc.id);
        }
      });
    },
    function(botName,cb) {
      result.tasks = Object.keys(global._bots[botName].tasks).map(function(key) {return global._bots[botName].tasks[key].name;});
      result.types = Object.keys(global._bots[botName].types).map(function(key) {return global._bots[botName].types[key]});
      result.type_dic = global._bots[botName].types;
      result.commonTypes = Object.keys(global._context.types);

      // console.log("dialoginfos:" + result.botId + "(" + botId + "), " + result.fileName);
      return res.jsonp(result);
    }
  ]);
};

exports.resetDB = function(req, res) {
  console.log('resetDB');
  var cond = { inOut: true};
  cond.fail = true;
  cond.botId = "csdemo";
  UserDialog.find(cond).remove().exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      FactLink.find({botUser: {$ne: null}}).remove().exec(function(err, data) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.status(200).send({message: 'done (factlinks and userdialogs)'});
        }
      });
    }
  });
};

exports.dialogFailureMaintenanceList = function (req, res) {
  BotIntentFail.aggregate(
    [{$match: {botId: req.bot.id, clear: {$ne: true}}},
      {$group: {_id: '$intent'}}
      // {$group: {_id: '$intent', userDialog: {$push: '$userDialog'}}}
    ]
  ).exec(function (err, data) {
    if (err){
      console.log(err)
    }else {
      // console.log(util.inspect(data));
      //
      // UserDialog.populate(data, {path: 'userDialog'}, function (err, result) {
      //   console.log(util.inspect(err))
      //   console.log(util.inspect(result));
      //   if (err){
      //     console.log(err)
      //   }else {
      //     for(var i = 0; i < result.length; i++){
      //       result[i].userDialog
      //     }
      //   }
      //
      // })
      Intent.populate(data, {path: '_id'},function (err, result) {
        if (err){
          console.log(err)
        }else {
          res.json(result)
        }
      });
    }
  })
};

exports.dialogFailureMaintenance = function (req, res) {
  BotIntentFail.find({intent : req.params.intentId, clear: {$ne: true}}).populate('userDialog', null, {clear: {$ne: true}}).exec(function (err, data) {
    if(err){
      console.log(err)
    }else {
      var result = [];
      for(var i = 0; i < data.length; i++){
        if(data[i].userDialog){
          result.push(data[i])
        }
      }
      res.json(result);
    }
  })
};

exports.dialogFailureMaintenanceUpdate = function (req, res) {
  // console.log(util.inspect(req.query.clearList));
  // console.log(util.inspect(typeof req.query.clearList));
  // console.log(util.inspect(JSON.parse(req.query.clearList)));
  // console.log(util.inspect(req.query.clearList.length));
  // console.log('-------------------==--');
  // var intentFailIds = [];
  var userDialogIds = [];

  if (typeof req.query.clearList == 'string'){
    req.query.clearList = JSON.parse(req.query.clearList);
    // intentFailIds.push(req.query.clearList._id)
    userDialogIds.push(req.query.clearList.userDialog._id)
  }else {
    for(var i = 0; i < req.query.clearList.length; i++){
      // intentFailIds.push(JSON.parse(req.query.clearList[i])._id);
      userDialogIds.push(JSON.parse(req.query.clearList[i]).userDialog._id)
    }
  }

  BotIntentFail.update({userDialog : {$in: userDialogIds}}, {clear: true}, {multi: true}, function (err, result) {
    if(err){
      console.log(util.inspect(err))
    }else {
      UserDialog.update({_id: {$in: userDialogIds}}, {clear: true}, {multi: true}, function (err, result2) {
        if(err){
          console.log(err)
        }else {
          // console.log(result2)
          res.json(result2)
        }
      })
    }
  });
};
