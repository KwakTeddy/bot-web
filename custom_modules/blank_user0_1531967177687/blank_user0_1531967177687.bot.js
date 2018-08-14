module.exports = function(options)
{
    options.version = 1.0;
    options.use = true;
  	options.similarQuestionSearch = true;
  	options.hybrid = {use:true};
    options.dialogsetMinMatchRate = 0.38;
    options.kakao={
        keyboard: {
            type:"buttons",buttons:["시작"]
        }
    };
};
