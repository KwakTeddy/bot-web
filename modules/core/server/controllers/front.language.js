module.exports = function(code)
{
    var lan = {
        ko: {
            test: '안녕하시렵니까'
        },
        en: {},
        zh: {},
        jp: {}
    };


    return lan[code];
};
