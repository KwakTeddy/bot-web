module.exports = function(globals)
{
    function dateTypeCheck(dialog, context, callback)
    {
        var type = this;
        var text = dialog.userInput.text;
        
        var name = 'date';
        var re = /(?:(올해|이번 년|작년|내년|20[12]\d{1}\s*[-/.년]?)?\s?(이번달|저번달|다음달|(?:0[1-9]|1[012]|[1-9])\s*[-/.월 ])\s?(오늘|어저께|그저께|어제|내일|모레|글피|(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])\s*[일]?)|(올해|이번 년|작년|내년|\d{4}\s*[-/.년])?\s?(이번달|저번달|다음달|(?:0[1-9]|1[012]|[1-9])\s*월)|(?:(?:(오늘|어저께|그저께|어제|내일|모레|글피|(?:0[1-9]|[12][0-9]|3[0-1]|[1-9]))\s*일)|((?:[0-9]+|일|이|삼|사|오|육|칠|팔|구|십))\s*[년해]|((?:[0-9]+|한|두|세|네|다섯|여섯|일곱|여덟|아홉|열|열한|열두))\s*(?:개월|달)|((?:[0-9]+|일|이|삼|사|오|육|칠|팔|구|십))\s*주[일]?|(하루|이틀|며칠|(?:[0-9]+|삼|사|오|육|칠|팔|구|십)\s*일))\s*(전|후|뒤)?)|(오늘|어저께|그저께|어제|내일|모레|글피)|(이\s?번\s?주|저\s?번\s?주|지\s?난\s?주|다\s?음\s?주|다\s?다\s?음\s?주)\s*([월화수목금토일])요?일?/g;
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

            if (_monthStr === '이번달') {
                task.range = '이번달';
                _month = _date.getMonth();
            } else if (_monthStr === '저번달') {
                _date.setMonth(_date.getMonth() - 1);
                _month = _date.getMonth();
            } else if (_monthStr === '다음달') {
                _date.setMonth(_date.getMonth() + 1);
                _month =  _date.getMonth();
            } else if (_monthStr === '한' || _monthStr === '일') {
                _date.setMonth(0);
                _month =  _date.getMonth();
            } else if (_monthStr === '두' || _monthStr === '이') {
                _date.setMonth(1);
                _month =  _date.getMonth();
            } else if (_monthStr === '세' || _monthStr === '삼') {
                _date.setMonth(2);
                _month =  _date.getMonth();
            } else if (_monthStr === '네' || _monthStr === '사') {
                _date.setMonth(3);
                _month =  _date.getMonth();
            } else if (_monthStr === '다섯' || _monthStr === '오') {
                _date.setMonth(4);
                _month =  _date.getMonth();
            } else if (_monthStr === '여섯' || _monthStr === '육') {
                _date.setMonth(5);
                _month =  _date.getMonth();
            } else if (_monthStr === '일곱' || _monthStr === '칠') {
                _date.setMonth(6);
                _month =  _date.getMonth();
            } else if (_monthStr === '여덟' || _monthStr === '팔') {
                _date.setMonth(7);
                _month =  _date.getMonth();
            } else if (_monthStr === '아홉' || _monthStr === '구') {
                _date.setMonth(8);
                _month =  _date.getMonth();
            } else if (_monthStr === '열' || _monthStr === '십') {
                _date.setMonth(9);
                _month =  _date.getMonth();
            } else if (_monthStr === '열한' || _monthStr === '십일') {
                _date.setMonth(10);
                _month =  _date.getMonth();
            } else if (_monthStr === '열두' || _monthStr === '십이') {
                _date.setMonth(11);
                _month =  _date.getMonth();
            } else {
                _monthStr = _monthStr.replace(/[-\/\.개월달]/g, '');
                _month = Number(_monthStr) - 1;
            }

            return _month;
        };


        var getDay = function (_dayStr) {
            var _day;
            var _date = new Date();

            if (_dayStr === '오늘') {
                _day = _date.getDate();
            } else if (_dayStr === '그저께' || _dayStr === '그제' ) {
                _date.setDate(_date.getDate() - 2);
                _day = _date.getDate();
            } else if (_dayStr === '어저께' || _dayStr === '어제') {
                _date.setDate(_date.getDate() - 1);
                _day = _date.getDate();
            } else if (_dayStr === '내일') {
                _date.setDate(_date.getDate() + 1);
                _day = _date.getDate();
            } else if (_dayStr === '모레') {
                _date.setDate(_date.getDate() + 2);
                _day = _date.getDate();
            } else if (_dayStr === '글피') {
                _date.setDate(_date.getDate() + 3);
                _day = _date.getDate();
            } else {
                _dayStr = _dayStr.replace(/[-\/\.일]/g, '');
                _day = Number(_dayStr);
            }
            return _day;
        };


        text = text.replace(re, function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14){
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
            } else if(p4 && p5) {
                unit = 'm';

                if(p4) year = getYear(p4);
                else year = today.getFullYear();
                if(p5) month = getMonth(p5);
                else month = today.getMonth();
            } else if (p5) {
                month = getMonth(p5);
                year = today.getFullYear();
                today.setMonth(month + 1);
                today.setDate(0);
                day = today.getDate();
                // } else if (p6) {
                //   if(p6 === '이번주') {
                //     task.range = '이번주';
                //     var first = today.getDate() - today.getDay() + 7;
                //     today.setDate(first);
                //     day = today.getDate();
                //     year = today.getFullYear();
                //     month = today.getMonth();
                //   } else if (p6 === '저번주') {
                //     var first = today.getDate() - today.getDay() - 6;
                //     today.setDate(first);
                //     day = today.getDate();
                //     year = today.getFullYear();
                //     month = today.getMonth();
                //   } else if (p6 === '다음주'){
                //     task.range = '다음주';
                //     var first = today.getDate() - today.getDay() + 14;
                //     today.setDate(first);
                //     day = today.getDate();
                //     year = today.getFullYear();
                //     month = today.getMonth();
                //   } else if (p6 === '다다음주') {
                //     var first = today.getDate() - today.getDay() + 21;
                //     today.setDate(first);
                //     day = today.getDate();
                //     year = today.getFullYear();
                //     month = today.getMonth();
                //   }
            } else if (p11) {

                if(p11 === '전') {
                    if(p6) {
                        if (p6 === '오늘' || p6 === '그저께' || p6 === '어제' || p6 === '어저께' || p6 === '내일' || p6 === '모레' || p6 === '글피') {
                            year = today.getFullYear();
                            month = today.getMonth();
                            if(p6) day = getDay(p6);
                            else day = today.getDate();
                        } else {
                            p6 = Number(p6);
                            today.setDate(today.getDate() - p6);
                            day = today.getDate();
                            year = today.getFullYear();
                            month = today.getMonth();
                        }
                    } else if (p8) {
                        today.setMonth(today.getMonth() - getMonth(p8));
                        year = today.getFullYear();
                        month = today.getMonth();
                        day = today.getDate();
                    } else if (p10) {
                        if (p10 === '일') {
                            today.setDate(today.getDate() - 7);
                            day = today.getDate();
                        } else if (p10 === '이') {
                            today.setDate(today.getDate() - 14);
                            day = today.getDate();
                        } else if (p10 === '삼') {
                            today.setDate(today.getDate() - 21);
                            day = today.getDate();
                        } else if (p10 === '사') {
                            today.setDate(today.getDate() - 28);
                            day = today.getDate();
                        } else if (p10 === '오') {
                            today.setDate(today.getDate() - 35);
                            day = today.getDate();
                        } else if (p10 === '육') {
                            today.setDate(today.getDate() - 42);
                            day = today.getDate();
                        } else if (p10 === '칠') {
                            today.setDate(today.getDate() - 49);
                            day = today.getDate();
                        } else if (p10 === '팔') {
                            today.setDate(today.getDate() - 56);
                            day = today.getDate();
                        } else if (p10 === '구') {
                            today.setDate(today.getDate() - 63);
                            day = today.getDate();
                        } else if (p10 === '십') {
                            today.setDate(today.getDate() - 70);
                            day = today.getDate();
                        } else {
                            p10 = Number(p10);
                            today.setDate(today.getDate() - p10*7);
                            day = today.getDate();
                        }
                        year = today.getFullYear();
                        month = today.getMonth();
                    }
                } else if (p11 === '후' || p11 === '뒤') {
                    if(p6) {
                        if (p6 === '오늘' || p6 === '그저께' || p6 === '어제' || p6 === '어저께' || p6 === '내일' || p6 === '모레' || p6 === '글피') {
                            year = today.getFullYear();
                            month = today.getMonth();
                            if(p6) day = getDay(p6);
                            else day = today.getDate();
                        } else {
                            p6 = Number(p6);
                            today.setDate(today.getDate() + p6);
                            day = today.getDate();
                            year = today.getFullYear();
                            month = today.getMonth();
                        }
                    } else if (p8) {
                        today.setMonth(today.getMonth() + getMonth(p8));
                        day = today.getDate();
                        year = today.getFullYear();
                        month = today.getMonth();
                    } else if (p10) {
                        if (p10 === '일') {
                            today.setDate(today.getDate() + 7);
                            day = today.getDate();
                        } else if (p10 === '이') {
                            today.setDate(today.getDate() + 14);
                            day = today.getDate();
                        } else if (p10 === '삼') {
                            today.setDate(today.getDate() + 21);
                            day = today.getDate();
                        } else if (p10 === '사') {
                            today.setDate(today.getDate() + 28);
                            day = today.getDate();
                        } else if (p10 === '오') {
                            today.setDate(today.getDate() + 35);
                            day = today.getDate();
                        } else if (p10 === '육') {
                            today.setDate(today.getDate() + 42);
                            day = today.getDate();
                        } else if (p10 === '칠') {
                            today.setDate(today.getDate() + 49);
                            day = today.getDate();
                        } else if (p10 === '팔') {
                            today.setDate(today.getDate() + 56);
                            day = today.getDate();
                        } else if (p10 === '구') {
                            today.setDate(today.getDate() + 63);
                            day = today.getDate();
                        } else if (p10 === '십') {
                            today.setDate(today.getDate() + 70);
                            day = today.getDate();
                        } else {
                            p10 = Number(p10);
                            today.setDate(today.getDate() + p10*7);
                            day = today.getDate();
                        }
                        year = today.getFullYear();
                        month = today.getMonth();
                    }
                }

            } else if(p6) {
                unit = 'd';

                year = today.getFullYear();
                month = today.getMonth();
                if(p6) day = getDay(p6);
                else day = today.getDate();
            } else if(p7) {
                unit = 'y';

                if(p7) year = getYear(p7);
                else year = today.getFullYear();
            } else if(p8) {
                unit = 'm';

                year = today.getFullYear();
                if(p8) month = getMonth(p8);
                else month = today.getMonth();
            } else if(p10) {
                unit = 'd';

                if (p10 === '일') {
                    task.range = '이번주';
                    today.setDate(today.getDate() + 7);
                    day = today.getDate();
                } else if (p10 === '이') {
                    today.setDate(today.getDate() + 14);
                    day = today.getDate();
                } else if (p10 === '삼') {
                    today.setDate(today.getDate() + 21);
                    day = today.getDate();
                } else if (p10 === '사') {
                    today.setDate(today.getDate() + 28);
                    day = today.getDate();
                } else if (p10 === '오') {
                    today.setDate(today.getDate() + 35);
                    day = today.getDate();
                } else if (p10 === '육') {
                    today.setDate(today.getDate() + 42);
                    day = today.getDate();
                } else if (p10 === '칠') {
                    today.setDate(today.getDate() + 49);
                    day = today.getDate();
                } else if (p10 === '팔') {
                    today.setDate(today.getDate() + 56);
                    day = today.getDate();
                } else if (p10 === '구') {
                    today.setDate(today.getDate() + 63);
                    day = today.getDate();
                } else if (p10 === '십') {
                    today.setDate(today.getDate() + 70);
                    day = today.getDate();
                } else {
                    p10 = Number(p10);
                    today.setDate(today.getDate() + p10*7);
                    day = today.getDate();
                }
                year = today.getFullYear();
                month = today.getMonth();
            } else if (p12) {
                year = today.getFullYear();
                month = today.getMonth();
                if(p12) day = getDay(p12);
                else day = today.getDate();
            } else if (p13) {
                year = today.getFullYear();
                month = today.getMonth();
                var weekDay;
                if(p14 == "월") weekDay = 1;
                if(p14 == "화") weekDay = 2;
                if(p14 == "수") weekDay = 3;
                if(p14 == "목") weekDay = 4;
                if(p14 == "금") weekDay = 5;
                if(p14 == "토") weekDay = 6;
                if(p14 == "일") weekDay = 7;

                var week;
                if(p13.replace(/ /g, "") == "이번주") week = 0;
                if(p13.replace(/ /g, "") == "지난주" || p13 == "저번주") week = -7;
                if(p13.replace(/ /g, "") == "다음주") week = 7;
                if(p13.replace(/ /g, "") == "다다음주") week = 14;

                today.setDate(today.getDate() + week - today.getDay() + weekDay);
                day = today.getDate();
            }

            if(!month) month = 0;
            if(!day) day = 1;

            date = new Date(year, month, day);
            date.unit = unit;

            return matchDate(name, task, date);
        });

        callback(matched, text);(text, task, matched);
    };

    globals.setTypeChecks('dateTypeCheck', dateTypeCheck);

    globals.setTypeChecks('dateRangeTypeCheck', function(text, type, task, context, callback)
    {
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
    });
};
