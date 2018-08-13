var request = require('request');

var userCount = 30;
var sendCountPerSecond = 1;

var errCount = 0;
setInterval(function()
{
    for(var userIndex=0; userIndex<userCount; userIndex++)
    {
        for(var i=0; i<sendCountPerSecond; i++)
        {
            (function(userIndex, index)
            {
                request.post({ url: 'http://13.124.32.125:3000/chat/test/message', json: { user: 'lbtest' + userIndex, text: '안녕', bot: 'test', channel: 'rest'}, timeout: 10 * 1000}, function(err, response, body)
                {
                    if(err)
                    {
                        console.log('에러[' + errCount + '] : ', err);
                        errCount++;
                    }
                    else
                    {
                    }
                });
            })(userIndex, i);
        }
    }
}, 1000);
