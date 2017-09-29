var path = require('path');
var bot = require(path.resolve('./engine/core/bot')).getBot('Hotel_bot');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


var mynamesave = {
    name: 'mynamesave',
    action: function(task, context, callback){
        context.dialog.myname = 'jiseob';
        callback(task, context);
    }
};
bot.setTask("mynamesave", mynamesave);

// var myname = {
//     name = "myname",
//
// }
