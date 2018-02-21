module.exports = function(options)
{
    options.use = true;
    options.kakao={
        keyboard: {
            type:"buttons",buttons:["대화 시작"]
        }
    };

    options.quibbles = {
        use: true,
        data: require('./quibbles.js')
    }
};
