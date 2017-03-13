var path = require('path');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var typelib = require(path.resolve('modules/bot/action/common/type'));
var globals = require(path.resolve('modules/bot/engine/common/globals'));

function dateRangeTypeCheck(text, type, task, context, callback) {
  dateTypeCheck(text, type, task, context, function(text, task, _matched) {
    if(_matched) {
      var _dateType = '(' + typelib.IN_TAG_START + 'date' + typelib.IN_TAG_END + ')';
      var reText = _dateType + '\\s*(?:부터|에서|이후)\\s*' + _dateType + '\\s*(?:까지|이전|사이|동안)';
      var re = new RegExp(reText, 'g');

      var matched = false;
      text.replace(re, function(match, p1, p2) {
        task['from'] = task['date'][0];
        task['to'] = task['date'][1];

        if(task['date'][1].unit == 'y') {
          task['to'].setMonth(11);
        }

        if(task['date'][1].unit == 'y' || task['date'][1].unit == 'm') {
          task['to'].setMonth(task['to'].getMonth() + 1);
          task['to'].setDate(0);
        }

        matched = true;
        return match;
      });

      if(!matched) {
        reText = _dateType + '\\s*(?:사이|동안)';
        re = new RegExp(reText, 'g');

        text.replace(re, function(match, p1, p2) {
          task['from'] = task['date'];
          task['to'] = utils.clone(task['date']);

          if(task['date'].unit == 'y') {
            task['to'].setMonth(11);
          }

          if(task['date'].unit == 'y' || task['date'].unit == 'm') {
            task['to'].setMonth(task['to'].getMonth() + 1);
            task['to'].setDate(0);
          }

          matched = true;
          return match;
        });
      }

      if(!matched) {
        reText = _dateType + '\\s*(?:부터|이후)';
        re = new RegExp(reText, 'g');

        text.replace(re, function(match, p1, p2) {
          task['from'] = task['date'][0];

          matched = true;
          return match;
        });
      }

      if(!matched) {
        reText = _dateType + '\\s*(?:까지|이전)';
        re = new RegExp(reText, 'g');

        text.replace(re, function(match, p1, p2) {
          task['to'] = task['date'];

          if(task['date'].unit == 'y') {
            task['to'].setMonth(11);
          }

          if(task['date'].unit == 'y' || task['date'].unit == 'm') {
            task['to'].setMonth(task['to'].getMonth() + 1);
            task['to'].setDate(0);
          }

          matched = true;
          return match;
        });
      }

      if(!matched) {
        reText = _dateType;
        re = new RegExp(reText, 'g');

        text.replace(re, function(match, p1) {
          task['from'] = task['date'];
          task['to'] = utils.clone(task['date']);

          if(task['date'].unit == 'y') {
            task['to'].setMonth(11);
          }

          if(task['date'].unit == 'y' || task['date'].unit == 'm') {
            task['to'].setMonth(task['to'].getMonth() + 1);
            task['to'].setDate(0);
          }

          matched = true;
          return match;
        });
      }
    }

    callback(text, task, matched);
  });
}

globals.setGlobalTypeCheck('dateRangeTypeCheck', dateRangeTypeCheck);

function dateTypeCheck(text, type, task, context, callback) {
  var name = 'date';
  var re = /(?:(올해|이번 년|작년|내년|\d{4}\s*[-/.년])?\s?(이번 달|저번 달|다음 달|(?:0[1-9]|1[012]|[1-9])\s*[-/.월])\s?(오늘|어제|내일|(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])\s*[일]?)|(올해|이번 년|작년|내년|\d{4}\s*[-/.년])?\s?(이번 달|저번 달|다음 달|(?:0[1-9]|1[012]|[1-9])\s*월)|(이번 주|저번 주|다음 주)|(오늘|어제|내일|(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])\s*일))|(?:(?:((?:[0-9]+|일|이|삼|사|오|육|칠|팔|구|십))\s*[년해]|((?:[0-9]+|한|두|세|네|다섯|여섯|일곱|여덟|아홉|열|열한|열두))\s*달|((?:[0-9]+|일|이|삼|사|오|육|칠|팔|구|십))\s*주[일]?|(하루|이틀|며칠|(?:[0-9]+|삼|사|오|육|칠|팔|구|십)\s*일))\s*(전|후)?)/g;
  var matched = false;
  var date;

  var matchDate = function(_name, _task, _date) {
    if(_task[_name]) {
      if(Array.isArray(_task[_name])) _task[_name].push(_date);
      else _task[_name] = [_task[_name], _date];
    } else {
      _task[_name] = _date;
    }

    return typelib.IN_TAG_START + _name + typelib.IN_TAG_END;
  };

  var getYear = function (_yearStr) {
    var _year;
    var _date = new Date();

    if (_yearStr === '올해' || _yearStr === '이번 년') {
      _year = _date.getFullYear();
    } else if (_yearStr === '작년') {
      _date.setYear(_date.getYear() - 1);
      _year = _date.getFullYear();
    } else if (_yearStr === '내년') {
      _date.setYear(_date.getYear() + 1);
      _year = _date.getFullYear();
    } else {
      _yearStr = _yearStr.replace(/[-\/\.년해]/g, '');
      _year = Number(_yearStr);
    }

    return _year;
  };

  var getMonth = function (_monthStr) {
    var _month;
    var _date = new Date();

    if (_monthStr === '이번 달') {
      _month = _date.getMonth();
    } else if (_monthStr === '저번 달') {
      _date.setMonth(_date.getMonth() - 1);
      _month = _date.getMonth();
    } else if (_monthStr === '다음 달') {
      _date.setMonth(_date.getMonth() + 1);
      _month =  _date.getMonth();
    } else {
      _monthStr = _monthStr.replace(/[-\/\.월달]/g, '');
      _month = Number(_monthStr) - 1;
    }

    return _month;
  };


  var getDay = function (_dayStr) {
    var _day;
    var _date = new Date();

    if (_dayStr === '오늘') {
      _day = _date.getDate();
    } else if (_dayStr === '어제') {
      _date.setDate(_date.getDate() - 1);
      _day = _date.getDate();
    } else if (_dayStr === '내일') {
      _date.setDate(_date.getDate() + 1);
      _day = _date.getDate();
    } else {
      _dayStr = _dayStr.replace(/[-\/\.일]/g, '');
      _day = Number(_dayStr);
    }

    return _day;
  };


  text = text.replace(re, function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12){
    matched = true;
    var year, month, day;
    var unit;
    var today = new Date();

    if(p1 || p2 || p3) {
      unit = 'd';

      if(p1) year = getYear(p1);
      else year = today.getFullYear();
      if(p2) month = getMonth(p2);
      else month = today.getMonth();
      if(p3) day = getDay(p3);
      else day = today.getDate();
    } else if(p4 || p5) {
      unit = 'm';

      if(p4) year = getYear(p4);
      else year = today.getFullYear();
      if(p5) month = getMonth(p5);
      else month = today.getMonth();
    } else if(p7) {
      unit = 'd';

      year = today.getFullYear();
      month = today.getMonth();
      if(p7) day = getDay(p7);
      else day = today.getDate();
    } else if(p8) {
      unit = 'y';

      if(p8) year = getYear(p8);
      else year = today.getFullYear();
    } else if(p9) {
      unit = 'm';

      year = today.getFullYear();
      if(p9) month = getMonth(p9);
      else month = today.getMonth();
    } else if(p11) {
      unit = 'd';

      year = today.getFullYear();
      month = today.getMonth();
      if(p11) day = getDay(p11);
      else day = today.getDate();
    }

    if(!month) month = 0;
    if(!day) day = 1;

    date = new Date(year, month, day);
    date.unit = unit;

    return matchDate(name, task, date);
  });

  callback(text, task, matched);
}
exports.dateTypeCheck = dateTypeCheck;
globals.setGlobalTypeCheck('dateTypeCheck', dateTypeCheck);

function timeTypeCheck(text, type, task, context, callback) {
  var name = 'time';
  var re = /(?:(오전|오후))\s*(?:(\d{1,2})\s*시)|(?:(am|pm|a.m|p.m))\s*(?:(\d{1,2})\s*시)|(?:(\d{1,2})\s*시)|(?:(\d{2}:\d{2}))/g;
  var matched = false;


  text = text.replace(re, function(match, p1, p2, p3, p4, p5, p6){
    matched = true;
    var time;
    var timeform = ':00';

    var matchTime = function(_name, _task, _time) {
      if(_task[_name]) {
        if(Array.isArray(_task[_name])) _task[_name].push(_time);
        else _task[_name] = [_task[_name], _time];
      } else {
        _task[_name] = _time;
      }
    };

    if (p6) {
      time = p6.toString();
    }
    if (p5) {
      if (p5 >= 13) {
        time = p5.toString() + timeform;
        // console.log(time);
      } else {
        time = 're';
      }
    }
    if (p1 == '오전') {
      time = p2.toString() + timeform;
    } else if (p1 == '오후') {
      var p6 = p2*1 + 12;
      time = p6.toString() + timeform;
    }
    if (p3 == 'am' || p3 == 'a.m') {
      time = p4.toString() + timeform;
    } else if (p3 == 'pm' || p3 == 'p.m') {
      var p6 = p4*1 + 12;
      time = p6.toString() + timeform;
    }



    return matchTime(name, task, time);
  });

  callback(text, task, matched);
}
exports.timeTypeCheck = timeTypeCheck;
globals.setGlobalTypeCheck('timeTypeCheck', timeTypeCheck);
