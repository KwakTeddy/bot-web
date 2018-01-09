var path = require('path');
var bot = require(path.resolve('./engine/bot.js')).getBot('samchully');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var addButton = {
    action: function (task,context,callback) {
        task.buttons = [];
        callback(task,context);
    }
};

bot.setTask('addButton', addButton);


var authentication = {
  action: function (task,context,callback) {
    
    
    callback(task,context);
	}
};

bot.setTask('authentication', authentication);

var getCustomerList = {
  action: function (task,context,callback) {
         var data = [
            {
                customerName: "박준하",
              	address: "서울시 관악구 행운동12",
              	num: "123553"
            },
            {
                customerName: "김지섭",
	            address: "서울시 관악구 행운동123"
              	num: "45344"
            }
        ];
   		
    	context.dialog.customerList = data;
    
    	task.buttons = [];

        for(var i = 0; i < data.length; i++){
           task.buttons.push(data[i])
        }
    
    	callback(task,context);
	}
};

bot.setTask('getCustomerList', getCustomerList);