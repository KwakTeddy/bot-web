module.exports = function(options)
{
    options.version = 1.0;
    options.use = true;
    options.kakao={
        keyboard: {
            type:"buttons",buttons:["시작"]
        }
    };
    options.useAutoCorrection = false;
};
