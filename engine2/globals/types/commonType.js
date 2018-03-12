module.exports = function(globals)
{
    globals.setTypes('amount',
    {
        name: 'account',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /([\d,]+[십백천만억원]+)/g
    });

    globals.setTypes('mobile',
    {
        name: 'mobile',
        raw: true,
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g
    });

    globals.setTypes('phone',
    {
        name: 'phone',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g
    });

    globals.setTypes('date',
    {
        name: 'date',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
    });

    globals.setTypes('time',
    {
        name: 'time',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /((?:[01][0-9]|2[0-3]|[1-9])[:시][ ]?(?:[0-5][0-9]|[1-9])[분]?)/g
    });

    // globals.setTypes('account',
    // {
    //     name: 'account',
    //     typeCheck: globals.typeChecks.regexpTypeCheck,
    //     regexp: /(\b[\d-]+-[\d-]+\b)/g
    // });

    // globals.setTypes('count',
    // {
    //     name: 'count',
    //     typeCheck: globals.typeChecks.regexpTypeCheck,
    //     regexp: /(\d)\s?(?:개)/g
    // });

    globals.setTypes('address',
    {
        name: 'address',
        typeCheck: globals.typeChecks.addressTypeCheck,
        raw: true,
        context: true
    });

    // globals.setTypes('string',
    // {
    //     name: 'string',
    //     typeCheck: globals.typeChecks.stringTypeCheck
    // });

    globals.setTypes('number',
    {
        name: 'number',
        typeCheck: globals.typeChecks.numberTypeCheck
    });

    globals.setTypes('url',
    {
        name: 'url',
        typeCheck: globals.typeChecks.regexpTypeCheck,
        regexp: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi
    })
};
