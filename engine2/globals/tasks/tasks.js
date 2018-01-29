var path = require('path');
var http = require(path.resolve('./engine2/utils/http'));

module.exports = function(globals)
{
    var httpRequest = {
        action: http.simpleRequest,
        url: '',
        params: {}
    };

    globals.setTasks('httpRequest', httpRequest);
};
