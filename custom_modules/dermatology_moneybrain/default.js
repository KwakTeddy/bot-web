
var path = require('path');
var request = require('request');

var SERVER_HOST = 'http://template-dev.moneybrain.ai:8443';

module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        name: 'defaultTask',
        action: function(dialog, context, callback)
        {
            callback();
        }
    });

	bot.setTask('introduction',
        {
            action: function (dialog, context, callback) {
                var modelname = 'dermatology_moneybrain_company';
                var options = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                options.qs = {
                    name: "포에버성형외과"
                };

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                        callback();
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.introduction=body;
                        if(body[0].image!=="" || body[0].image!==undefined) {
                            dialog.output[0].image = {url:body[0].image}
                        }
                        callback();
                    }
                });
            }
        });
};
