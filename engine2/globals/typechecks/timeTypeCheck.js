module.exports = function(globals)
{
    globals.setTypeChecks('timeTypeCheck', function(text, type, task, context, callback)
    {
        var name = 'time';
        var re = /(오전|오후|새벽|아침|낮|저녁|밤|am|pm|a.m|p.m)?\s*(\d{1,2})\s*(?:시|:)\s*(?:(\d{1,2}|반)\s*분?)?/g;
        var matched = false;


        text = text.replace(re, function(match, g1, g2, g3){
            matched = true;
            var time;
            // var timeform = ':00';

            var matchTime = function(_name, _task, _time) {
                if(_task[_name]) {
                    if(Array.isArray(_task[_name])) _task[_name].push(_time);
                    else _task[_name] = [_task[_name], _time];
                } else {
                    _task[_name] = _time;
                }
            };

            var hour = parseInt(g2);
            var min = parseInt(g3) || g3 || 0;
            if (min=='반') min = 30;

            var am = (g1 == '오전' || g1 == '새벽' || g1 == '아침' || g1 == 'am' || g1 == 'a.m');
            var pm = (g1 == '오후' || g1 == '낮' || g1 == '저녁' || g1 == '밤' || g1 == 'pm' || g1 == 'p.m');

            if(hour<23 && min <60) {
                if(hour > 12) {
                    time = hour.toString() + ':' + min;
                } else if(am) {
                    if(hour==12) hour = 0;
                    time = hour.toString() + ':' + min;
                } else if(pm) {
                    if(hour==12) hour = 0;
                    time = (hour+12) + ':' + min;
                } else time = 're';
            } else {
                time = 'out';
            }

            time = time.replace(/(.*):(.*)/, function(match, g1, g2) {
                if (g1.length == 1) g1 = '0'+g1;
                if (g2.length == 1) g2 = '0'+g2;
                return g1 + ":" + g2;
            });


            return matchTime(name, task, time);
        });

        callback(text, task, matched);
    });
};
