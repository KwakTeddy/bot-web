var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

(function()
{
    var TurnTaking = function(language)
    {
        // (declarative, 평서문), (exclamation, 감탄문), (interrogative, 의문문), (imperative, 명령문), (lets, 청유문)
        this.type = {"not" : 0, "taking" : 1};
        this.dictionary = {};

        this.parse(language);
    };

    TurnTaking.prototype.parse = function (language)
    {
        var dicFileName = path.resolve('./engine2/input/nlp/resources/' + language + '/turnTaking.dic');

        try
        {
            var data = fs.readFileSync(dicFileName, 'utf8');
            var entries = data.split('\n');
            for (var i in entries)
            {
                var entry = entries[i].split('\t');
                if (entry.length == 2)
                {
                    if (entry[0] != '' && entry[1] != '')
                    {
                        this.dictionary[entry[0]] = entry[1];
                    }
                }
                else
                {
                    if (entry[0] != '' && entry[3] != '')
                    {
                        this.dictionary[entry[0]] = entry[3];
                    }
                }
            }
        }
        catch(e)
        {
            console.error(chalk.red(language + '\'s TurnTaking.dic is not found'));
        }
    };

    TurnTaking.prototype.analyze = function (sentence)
    {
        if (sentence)
        {
            var str = sentence;
            if (str in this.dictionary)
            {
                return this.dictionary[str];
            }

            return this.type.taking;
        }
        else
        {
            return this.type.taking.not;
        }
    };

    module.exports = {
        ko: new TurnTaking('ko'),
        en: new TurnTaking('en'),
        zh: new TurnTaking('zh'),
        ja: new TurnTaking('ja')
    };
})();
