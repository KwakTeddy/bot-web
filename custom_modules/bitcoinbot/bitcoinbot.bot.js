module.exports = function(options)
{
    options.version = 1.0;
    options.use = true;
    options.kakao={
        keyboard: {
            type:"buttons",buttons:["Start"]
        }
    };
    options.entitiesMinMatchRate = 0.8;
    options.globalSearch = { use: true };
};
