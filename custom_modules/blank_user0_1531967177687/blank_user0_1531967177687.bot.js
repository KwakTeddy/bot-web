module.exports = function(options)
{
    options.version = 1.0;
    options.use = true;
  
	options.dialogsetMinMatchRate = 0.90;
    options.kakao={
        keyboard: {
            type:"buttons",buttons:["시작"]
        }
    };
};
