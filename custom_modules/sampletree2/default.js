var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('sampletree2');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
      console.log('i am a task !!!!!!!!!!!!!!!!!!!!!');
      context.dialog.check='check';
      console.log('------------------'+context.dialog.check);
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var addrType = {
  "name": "address",
  "listName": "address",
  "typeCheck": "listTypeCheck"
};

var dateType = {
  "name": "date",
  "typeCheck": "dateTypeCheck",
  "raw": true,
  "context": true
};

bot.setType("address", addrType);
bot.setType("date", dateType);