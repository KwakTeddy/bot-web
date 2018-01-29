module.exports = function(globals)
{
    var amountType = {
        name: 'account',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /([\d,]+[십백천만억원]+)/g
    };

    globals.setTypes('amountType', amountType);

    var mobileType = {
        name: 'mobile',
        raw: true,
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g,
        checkRequired: function(text, type, inDoc, context) {
            if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
            else if(text.length < 13) return '자리수가 맞지 않습니다';
            else return '휴대폰전화번호 형식으로 입력해 주세요';
        }
    };

    globals.setTypes('mobileType', mobileType);

    var phoneType = {
        name: 'phone',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g
    };

    globals.setTypes('phoneType', phoneType);

    var dateType = {
        name: 'date',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
    };

    globals.setTypes('dateType', dateType);

    var timeType = {
        name: 'time',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /((?:[01][0-9]|2[0-3]|[1-9])[:시][ ]?(?:[0-5][0-9]|[1-9])[분]?)/g
    };

    globals.setTypes('timeType', timeType);

    var accountType = {
        name: 'account',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\b[\d-]+-[\d-]+\b)/g
    };

    globals.setTypes('accountType', accountType);

    var countType = {
        name: 'count',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\d)\s?(?:개)/g
    };

    globals.setTypes('countType', countType);

    var addressType = {
        name: 'address',
        typeCheck: globals.typeChecks.addressTypeCheck,
        raw: true,
        context: true
    };

    globals.setTypes('address', addressType);


    var stringType = {
        name: 'string',
        typeCheck: globals.typeChecks.stringTypeCheck
    }

    exports.stringType= stringType;


    var numberType = {
        name: 'number',
        typeCheck: globals.typeChecks.numberTypeCheck
    }

    globals.setTypes('number', numberType);

    var amountType = {
        name: 'account',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /([\d,]+[십백천만억원]+)/g
    };

    globals.setTypes('amount', amountType);

    var mobileType = {
        name: 'mobile',
        raw: true,
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
        checkRequired: function(text, type, inDoc, context) {
            if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
            else if(text.length < 13) return '자리수가 맞지 않습니다';
            else return '휴대폰전화번호 형식으로 입력해 주세요';
        }
    };

    globals.setTypes('mobile', mobileType);

    var phoneType = {
        name: 'phone',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g
    };

    globals.setTypes('phone', phoneType);

    var dateType = {
        name: 'date',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
    };

    globals.setTypes('date', dateType);

    var timeType = {
        name: 'time',
        typeCheck: globals.typeChecks.timeTypeCheck
    };

    globals.setTypes('timeType', timeType);

    var accountType = {
        name: 'account',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\b[\d-]+-[\d-]+\b)/g
    };

    globals.setTypes('account', accountType);

    var countType = {
        name: 'count',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\d)\s?(?:개)/g
    };

    globals.setTypes('count', countType);

    var faqType = {
        typeCheck: globals.typeChecks.mongoDbTypeCheck,
        limit: 5,
        mongo: {
            model: 'faq',
            queryFields: ['title'],
            fields: 'title content created' ,
            taskFields: ['_id', 'title', 'content'],
            taskSort: function(a, b) {
                if(b.matchCount > a.matchCount) return 1;
                else if(b.matchCount < a.matchCount) return -1;
                else {
                    if(b.created.getTime() < a.created.getTime()) return 1;
                    else if(b.created.getTime() > a.created.getTime()) return -1;
                    else return 0;
                }
            },
            //query: {},
            // sort: "-created",
            // limit: 5,
            minMatch: 1,
            checkRequired: function(text, type, inDoc, context) {
                return '학습되어 있지 않은 질문 입니다.';
            }
        }
    }

    globals.setTypes('faqType', faqType);
};
