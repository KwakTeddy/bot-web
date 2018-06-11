module.exports = function(bot)
{
    var answer_lst = [
        ["1. 19세이하", "2. 20대", "3. 30대", "4. 40대", "5. 50대", "6. 60대이상"]
    ];

    bot.setType("nextFlow",
        {
            typeCheck: function(dialog, context, callback)
            {
                var is_true = true;
                //console.log('============== answer line ===============');
                //console.log(answer_lst);
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
