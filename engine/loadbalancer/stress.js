var request = require('request');

for(var i=0; i<1500; i++)
{
    (function(index)
    {
        request.post({ url: 'http://13.125.132.231:3000/chat/demo/message', json: { user: 'test', text: '안녕', bot: 'blank_com2best_1513904643771', channel: 'rest'}}, function(err, response, body)
        {
            console.log('[' + index + ']', body);
        });
    })(i);
}
