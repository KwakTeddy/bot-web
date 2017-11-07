var ko = require('./processor_ko.js');
var en = require('./processor_en.js');
var zh = require('./processor_zh.js');
var jp = require('./processor_ja.js');

(function()
{
    module.exports.getNlpedText = function(text, lan, callback)
    {
        if(lan == 'ko')
        {
            ko.processLiveInput(text, callback);
        }
        else if(lan == 'en')
        {
            en.processLiveInput(text, callback);
        }
        else if(lan == 'zh')
        {
            zh.processLiveInput(text, callback);
        }
        else if(lan == 'ja')
        {
            ja.processLiveInput(text, callback);
        }
    };
})();
