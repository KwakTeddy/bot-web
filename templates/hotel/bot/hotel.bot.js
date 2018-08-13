module.exports = function(options)
{
    options.use = true;
    options.kakao = {
        keyboard: { type :"buttons", buttons:["Start"]}
    };
    options.naver = {
        clientId: 'Aqi_RlMlLRlJnmJptMhD',
        clientSecret: '0AKq2NoNgn'
    };

    options.commonButtons = [{"text": "이전"}, {"text": "처음"}];
    options.commonQuickReplies = [{"text": "이전"}, {"text": "처음"}];
    options.reserveFields = [
        {name: 'numOfPerson', title: '인원수'},
        {name: 'memo', title: '객실명'},
        {name: 'period', title: '기간'}
    ];
};

