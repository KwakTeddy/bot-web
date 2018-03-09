module.exports = function(options)
{
    options.version = 1.0;
    options.use = true;
    options.globalSearch = {
        use: true
    };
  options.hybrid = {
        use: true
    };
    options.kakao={
        keyboard: {
            type:"buttons",buttons:["대화 시작"]
        }
    };
};
