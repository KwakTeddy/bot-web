module.exports = function(options)
{
    options.use = true;
    options.useGlobalDialogs = false;
    options.kakao = { keyboard: { type : "buttons", buttons: ["반갑습니다. 신한카드입니다."]} };
    options.intentOption = { matchRate: 0.3, matchCount: 3, matchRateChildOffset: 0.2, matchCountChildOffest: 2 },
    options.dialogsetOption = {
        useBotDialog: false,
        useDialogset: false,
        useContext: false,
        useTopic: false,
        matchRate: 0.3, matchCount: 3,
        matchList: true, matchOneRate: 0.5, matchOneCount: 7,
        contentOutput: '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요\n'
    };
};
