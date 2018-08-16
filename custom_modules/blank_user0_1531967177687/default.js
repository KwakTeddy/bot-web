module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        action: function(dialog, context, callback)
        {
            callback();
        }
    });
  
  	bot.setTask("resultTask",
    {
        action: function(dialog, context, callback)
        {
            console.log();
          	var list = context.session.history.slice(0,3);
          	var tpl = [];
          	list.forEach((e)=>{
              	var s = e.card.name+ ' : ' + e.userInput.text + '\n';
            	tpl.unshift(s);	
            });

          	dialog.result = tpl.join("")
            callback();
        }
    });
};
