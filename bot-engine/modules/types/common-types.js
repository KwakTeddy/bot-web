var commonCheckModules = reuqire('./common-check-modules.js');

module.exports.mobileType =
{
    name: 'mobile',
    raw: true,
    typeCheck: commonCheckModules.regexpTypeCheck.bind(this),
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    checkRequired: function(text)
    {
        if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
        else if(text.length < 13) return '자리수가 맞지 않습니다';
        else return '휴대폰전화번호 형식으로 입력해 주세요';
    }
};
