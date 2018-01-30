module.exports = function(bot)
{
    bot.use = true;
    bot.kakao =  { keyboard: { type :"buttons", buttons:["시작"]} };
    bot.commonButtons = [{"text": "이전"}, {"text": "처음"}];
};
