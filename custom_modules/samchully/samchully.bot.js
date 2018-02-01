module.exports = function(options)
{
    options.use = true;
    options.kakao =  { keyboard: { type :"buttons", buttons:["시작"]} };
    options.commonButtons = [{"text": "이전"}, {"text": "처음"}];
};
