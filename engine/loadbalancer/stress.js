var request = require('request');

var errCount = 0;
setInterval(function()
{
    for(var i=0; i<30; i++)
    {
        (function(index)
        {
            request.post({ url: 'http://13.124.32.125:3000/chat/demo/message', json: { user: 'test', text: '안녕', bot: 'test', channel: 'rest'}}, function(err, response, body)
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
