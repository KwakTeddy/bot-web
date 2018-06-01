module.exports = function(bot)
{
    bot.setType("nextFlow",
        {
            typeCheck: function(dialog, context, callback)
            {
                var is_true = true;
                callback(is_true);
            }
        });

    bot.setType("lastFlow",
        {
            typeCheck: function(dialog, context, callback)
            {
                console.log('Successfully checked!');

                var result_arr = [];
                var hist = context.session.history;
                var last_answer = dialog.userInput.text;

                for(var idx in hist){
                    var his = hist[idx];
                    if(his.id != 'startDialog' && his.card){
                        var answer = {
                            key : his.card.name,
                            value : his.userInput.text
                        };
                        result_arr.push(answer);
                    }
                }

                result_arr.push({
                    key : 'last',
                    value : last_answer
                });

                console.log(result_arr);

                callback(true);
            }
        });
  
    bot.setTask("defaultTask",
        {
            action: function(dialog, context, callback)
            {
                callback();
            }
        });
};
