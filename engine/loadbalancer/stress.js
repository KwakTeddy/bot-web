var request = require('request');

var errCount = 0;
setInterval(function()
{
    for(var i=0; i<50; i++)
    {
        (function(index)
        {
            request.post({ url: 'http://13.125.132.231:3000/chat/demo/message', json: { user: 'test', text: '안녕', bot: 'blank_com2best_1513904643771', channel: 'rest'}}, function(err, response, body)
            {
                if(body.indexOf('그래') != -1)
                {
                    console.log('마스터가 처리함');
                }
                else
                {
                    if(err)
                    {
                        console.log('에러[' + errCount + '] : ', err);
                        errCount++;
                    }
                }
            });
        })(i);
    }
}, 1000);
