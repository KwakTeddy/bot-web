module.exports = function(options)
{
    options.version = 1.0;
    options.use = true;
    options.kakao = { keyboard: { type : "buttons", buttons: ["반갑습니다. 신한카드입니다."]} };
    options.globalSearch = {
        use: true,
        limitOfSimilarAnswer: 1
    };
    options.hybrid = true;
    options.dialogsetMinMatchRate = 0.38;
};
