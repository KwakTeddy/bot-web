// var path = require('path');
// var botlib = require(path.resolve('./engine/bot.js'));
//
// var flower = {
//     use: true,
//     naver: {
//         clientId: 'Aqi_RlMlLRlJnmJptMhD',
//         clientSecret: '0AKq2NoNgn'
//     },
//     kakao:{
//         keyboard: {
//             type:"buttons",buttons:["대화 시작"]
//         }
//     }
//
// };
//
// botlib.makeTemplateBot('flower', flower);

module.exports = function(options)
{
    options.use = true;
    // options.naver= {
    //     clientId: 'Aqi_RlMlLRlJnmJptMhD',
    //         clientSecret: '0AKq2NoNgn'
    // };
    options.kakao={
         keyboard: {
             type:"buttons",buttons:["Start"]
         }
    };
};
