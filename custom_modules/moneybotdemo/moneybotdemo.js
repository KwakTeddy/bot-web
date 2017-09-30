var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('csdemo');
var async = require('async');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('modules/bot/action/common/type'));
var dates = {
  convert:function(d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return (
        d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                    d.constructor === String ? new Date(d) :
                        typeof d === "object" ? new Date(d.year,d.month,d.date) :
                            NaN
    );
  },
  compare:function(a,b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
        isFinite(a=this.convert(a).valueOf()) &&
        isFinite(b=this.convert(b).valueOf()) ?
        (a>b)-(a<b) :
            NaN
    );
  },
  inRange:function(d,start,end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return (
        isFinite(d=this.convert(d).valueOf()) &&
        isFinite(start=this.convert(start).valueOf()) &&
        isFinite(end=this.convert(end).valueOf()) ?
        start <= d && d <= end :
            NaN
    );
  }
}

function searchBranch(task, context, callback) {
  task.query=context.dialog.address.시군구명 + ' ' + context.dialog.address.법정읍면동명 + ' ' + '은행';

  address.naverGeoSearch(task, context, function(task, context) {
    context.dialog.item=[];
    for(var i = 0; i < task.doc.length; i++) {
      var item = task.doc[i];
      item.title = item.title.replace(/<[^>]+>/, '');
      item.title = item.title.replace(/<\/[^>]+>/, '');
      context.dialog.item.push(task.doc[i]);
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    callback(task, context);
  });
}

exports.searchBranch = searchBranch;

function naverGeocode(task, context, callback) {
  // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};
  var query = {query: context.dialog.bank.address};
  var request = require('request');

  request({
    url: 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coord=latlng&output=json',
    method: 'GET',
    qs: query,
    headers: {
      'Host': 'openapi.naver.com',
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': context.bot.naver.clientId,
      'X-Naver-Client-Secret': context.bot.naver.clientSecret
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      var doc = JSON.parse(body);
      task.lng=doc.result.items[0].point.x;
      task.lat=doc.result.items[0].point.y;
      console.log('lat: ' + task.lat + ', lng: ' + task.lng);
    }
    callback(task, context);
  });
}

exports.naverGeocode = naverGeocode;


function daumgeoCode (task, context, callback) {
  if (context.dialog.bank == undefined) {
    callback(false);
  } else {
    naverGeocode(task, context, function(task, context) {
      context.dialog.bank.lat = context.dialog.lat = task.lat;
      context.dialog.bank.lng = context.dialog.lng = task.lng;

      // if(context.dialog.address) {
      //   address = context.dialog.address;
      //   lng = context.dialog.lng;
      //   lat = context.dialog.lat;
      // } else if(context.user.address) {
      //   address = context.user.address;
      //   lng = context.user.lng;
      //   lat = context.user.lat;
      // }
      var request = require('request');
      var query = {q: context.dialog.bank.address, output: "json"};
      task._doc = {
        lng: '',
        lat: '',
        link_find: '',
        link_map: '',
        address: ''
      };
      request({
        url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
        method: 'GET',
        qs: query
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body);
          var doc = JSON.parse(body);
          // task._doc.lng = doc.channel.item[0].lng;
          // task._doc.lat = doc.channel.item[0].lat;
          // task._doc.link_find = 'http://map.daum.net/link/to/' + query.q + ',' + task._doc.lat + ',' + task._doc.lng;
          task._doc.link_map = 'http://map.daum.net/link/map/' + context.dialog.bank.title + ',' + context.dialog.bank.lat + ',' + context.dialog.bank.lng;
          // console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
          // console.log('link: ' + task._doc.link_find);
          // console.log('link: ' + task._doc.link_map);

          task.url = task._doc.link_map;
          task.urlMessage = '지도에서 위치보기';
        }
        callback(task, context);

      });
    })
  }
}
exports.daumgeoCode = daumgeoCode;

function searchNaver(task, context, callback) {
  task.query=context.dialog.inCurRaw;

  address.naverGeoSearch(task, context, function(task, context) {
    for(var i = 0; i < task.doc.length; i++) {
      var aditem = task.doc[i];
      aditem.title = aditem.title.replace(/<[^>]+>/, '');
      aditem.title = aditem.title.replace(/<\/[^>]+>/, '');
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    context.dialog.aditem = task.doc[0];
    if (context.dialog.aditem) {
      context.dialog.address = context.dialog.aditem.address.replace(' ', '');
      callback(task,context);
    } else {
      context.dialog.check = 're';
      callback(task, context);
    }
  });

}

exports.searchNaver = searchNaver;

var fssDepositQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'D', 'save_trm': '12'},
    sort: {'intr_rate2': -1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['deposits'] = task.doc;
    callback(task, context);
  }
};

exports.fssDepositQuery = fssDepositQuery;


var fssSavingQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'S', 'save_trm': '12'},
    sort: {'intr_rate2': -1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['savings'] = task.doc;
    callback(task, context);
  }
};
exports.fssSavingQuery = fssSavingQuery;

var fssAnnuitySavingQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'P'},
    sort: {'avg_prft_rate': -1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['annuitysavings'] = task.doc;
    callback(task, context);
  }
};

exports.fssAnnuitySavingQuery = fssAnnuitySavingQuery;

var fssMortgageLoanQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'M'},
    sort: {'lend_rate_min': +1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['mortgageloans'] = task.doc;
    callback(task, context);
  }
};

exports.fssMortgageLoanQuery = fssMortgageLoanQuery;

var fssRentHouseLoanQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'R'},
    sort: {'lend_rate_min': +1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['renthouseloans'] = task.doc;
    callback(task, context);
  }
};

exports.fssRentHouseLoanQuery = fssRentHouseLoanQuery;

var fssCreditLoanQuery = {
  module: 'mongo',
  action: 'find',
  mongo: {
    model: 'fssProduct',
    query: {'prdt_div': 'C'},
    sort: {'crdt_grad_avg': +1}
  },
  postCallback: function (task, context, callback) {
    context.dialog['creditloans'] = task.doc;
    callback(task, context);
  }
};

exports.fssCreditLoanQuery = fssCreditLoanQuery;

function searchBankHistoryweek (task, context, callback) {
  if (context.user.bankaccount == undefined) {
    callback(false);
  } else {
    var account = mongo.getModel(context.user.bankaccount, undefined);
    context.dialog.bankhistory = [];
    account.find({}).lean().exec(function (err, docs) {
      if (err) {
        console.log(err);
        callback(task, context);
      } else {
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          if (doc.출금 == 0) {
            doc.type = '입금'
          } else {
            doc.type = '출금'
          }
          doc.거래일시 = new Date((doc.거래일시 || "").replace(/-/g, "/").replace(/[TZ]/g, " "));
          var week = new Date('2017-02-16');
          console.log('result: '+dates.compare(doc.거래일시,week)+'데이터: '+doc.거래일시+'기준: '+week);
          if (dates.compare(doc.거래일시,week) == 1) {
            context.dialog.bankhistory.push(doc);
          }
        }
        console.log(JSON.stringify(context.dialog.bankhistory));
        callback(task, context)
      }
    });
  }
}

exports.searchBankHistoryweek = searchBankHistoryweek;

function searchBankHistorymonth (task, context, callback) {
  if (context.user.bankaccount == undefined) {
    callback(false);
  } else {
    var account = mongo.getModel(context.user.bankaccount, undefined);
    context.dialog.bankhistory = [];
    account.find({}).lean().exec(function (err, docs) {
      if (err) {
        console.log(err);
        callback(task, context);
      } else {
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          if (doc.출금 == 0) {
            doc.type = '입금'
          } else {
            doc.type = '출금'
          }
          doc.거래일시 = new Date((doc.거래일시 || "").replace(/-/g, "/").replace(/[TZ]/g, " "));
          var week = new Date('2017-01-23');
          // console.log('result: '+dates.compare(doc.거래일시,week)+'데이터: '+doc.거래일시+'기준: '+week);
          if (dates.compare(doc.거래일시,week) == 1) {
            context.dialog.bankhistory.push(doc);
          }

          doc.거래일시1 = doc.거래일시.getFullYear() + '/' + (doc.거래일시.getMonth()+1) + '/' + doc.거래일시.getDate();
          console.log(doc.거래일시1);
        }
        // console.log(JSON.stringify(context.dialog.bankhistory));
        callback(task, context)
      }
    });
  }
}

exports.searchBankHistorymonth = searchBankHistorymonth;
