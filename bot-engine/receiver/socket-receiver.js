var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

(function()
{
    var SocketReceiver = function()
    {

    };

    SocketReceiver.prototype.initialize = function(core, io)
    {
        io.on('connection', function (socket)
        {
            logger.systemLog('[BotEngine] User is connected');

            socket.on('disconnect', function()
            {
                logger.systemLog('[BotEngine] User is disconnected');
            });

            socket.on('send_msg', function(requestData)
            {
                console.log();
                logger.systemLog('[BotEngine] User Request : ' + JSON.stringify(requestData));

                var responseCallback = function(responseText)
                {
                    socket.emit('send_msg', responseText);
                };

                core.process(requestData, responseCallback);
            });
        });

        logger.systemLog(' - Socket Receiver loaded');
    };

    module.exports = new SocketReceiver();
})();
