var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('bot_exp5');






var entityToImage = {
    "ceme1" : "빈소1 url",
    "ceme2" : "빈소2 url"
}

function findUrl(str) {
    // console.log(window[str]);
    var url='';
    eval('url = entityToImage.' + str);
    console.log(url);
    return url;
    // return entityToImage.ceme1;
}


var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        console.log(context.bot.entities[context.bot.entities.length -1].name.split("@")[1]);
        var url = findUrl(  context.bot.entities[context.bot.entities.length -1].name.split("@")[1]  );
        // var urltest = findUrl("ceme1");
        // var urltest = entityToImage.ceme1;
        console.log(url);
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var struct = {
  name: "kk",
  list : [
            {name:"aa", content:'aaa'},
            {name:'bb', content:'bbb'}
		 ]
}

var options = [
  {name:"color", kind:[{content:'white'}, {content:'grey'}, {content:'black'}]},
  {name:"width", kind:[{content:'30'}, {content:'32'}, {content:'34'}]},
  {name:"length", kind:[{content:'90'}, {content:'95'}, {content:'100'}]},
];

var testTask = {
  action: function (task,context,callback) {
    //if(!context.dialog.index) context.dialog.index = 0;
    context.dialog.optionStr += context.dialog.listType.content + ', ';
    //if (context.dialog.index == options.length) { 
    //  context.dialog.done = true; 
    //} else {
    //  context.dialog.index++;
    //};
    //context.dialog.option = options[context.dialog.index].kind;
    //context.dialog.option = options[0].kind;
    //context.dialog.option = struct.list;
    callback(task,context);
	}
};

bot.setTask('testTask', testTask);

var listType = {
  typeCheck: "listTypeCheck",
  listName: "option"
};

bot.setType('listType', listType);

var optionStart = {
  action: function (task,context,callback) {
    if(!context.dialog.index) 
    {
      context.dialog.index = 0;
      context.dialog.optionStr = '';
      //context.dialog.option = options[0];
    };    
    context.dialog.option = options[context.dialog.index].kind;
    callback(task,context);
	}
};

bot.setTask('optionStart', optionStart);

