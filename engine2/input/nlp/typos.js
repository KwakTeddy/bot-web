var fs = require('fs');
var path = require('path');

(function()
{
    var Typos = function (language)
    {
        // (declarative, 평서문), (exclamation, 감탄문), (interrogative, 의문문), (imperative, 명령문), (lets, 청유문)
        this.dictionary = {};
        this.read(language);

        return this;
    };

    Typos.prototype.read = function (language)
    {
        var dicFileName = path.resolve('./engine2/input/nlp/resources/' + language + '/typos.dic');

        var data = fs.readFileSync(path.resolve(dicFileName), 'utf8');
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
        }
    }

    Typos.prototype.checkAndReplace = function (language, str)
    {
        var result = '';
        if(str)
        {
            if(this.dictionary.hasOwnProperty(str))
            {
                result = this.dictionary[str];
            }
        }

        return result;
    }

    module.exports = Typos;
})();
