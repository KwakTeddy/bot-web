var fs = require('fs');
var path = require('path');

(function()
{
    var UserDictionary = function (language) {
        this.mapUserKeywordOrder = [];
        this.tagDictionary = [];
        this.typosDictionary = [];

        this.init();

        var data1 = fs.readFileSync(path.resolve('./engine2/input/nlp/resources') + '/' + language + '/user.pos', 'utf8');
        var entries = data1.split('\n');
        for (var i in entries) {
            var entry = entries[i].split('\t');
            if (entry[0]!='' && entry[1]!='') {
                this.tagDictionary.push([entry[0], entry[1]]);
            }
        }

        var data2 = fs.readFileSync(path.resolve('./engine2/input/nlp/resources') + '/' + language + '/typos.dic', 'utf8');
        var entries = data2.split('\n');
        for (var i in entries) {
            var entry = entries[i].split('\t');
            if (entry[0]!='' && entry[1]!='') {
                this.typosDictionary.push([entry[0], entry[1]]);
            }
        }

        return this;
    };

    UserDictionary.prototype.init = function() {
        this.mapUserKeywordOrder.push("AA");
        this.mapUserKeywordOrder.push("BB");
        this.mapUserKeywordOrder.push("CC");
        this.mapUserKeywordOrder.push("DD");
        this.mapUserKeywordOrder.push("EE");
        this.mapUserKeywordOrder.push("FF");
        this.mapUserKeywordOrder.push("HH");
        this.mapUserKeywordOrder.push("II");
        this.mapUserKeywordOrder.push("JJ");
        this.mapUserKeywordOrder.push("KK");
        this.mapUserKeywordOrder.push("LL");
        this.mapUserKeywordOrder.push("MM");
        this.mapUserKeywordOrder.push("NN");
        this.mapUserKeywordOrder.push("OO");
        this.mapUserKeywordOrder.push("PP");
        this.mapUserKeywordOrder.push("QQ");
        this.mapUserKeywordOrder.push("RR");
        this.mapUserKeywordOrder.push("SS");
        this.mapUserKeywordOrder.push("TT");
        this.mapUserKeywordOrder.push("UU");
        this.mapUserKeywordOrder.push("VV");
        this.mapUserKeywordOrder.push("WW");
        this.mapUserKeywordOrder.push("XX");
        this.mapUserKeywordOrder.push("YY");
        this.mapUserKeywordOrder.push("ZZ");
    }

    UserDictionary.prototype.applyUserDic = function (lang, text) {
        var mb_user_str = {};
        var mb_user_tag = {};
        var index = 0;

        if (text == undefined || text == null || Array.isArray(text)) {
            return ["", mb_user_str, mb_user_tag];
        }

        for (var i in this.typosDictionary) {
            var str = this.typosDictionary[i][0];
            var replaceStr = this.typosDictionary[i][1];

            text = text.replace(new RegExp(str,'gi'), replaceStr);
        }


        for (var i in this.tagDictionary) {
            var str = this.tagDictionary[i][0];
            var tag = this.tagDictionary[i][1];
            var position = - 1;
            // var position = text.search("(^"+str+"|"+str+" | "+str+"| "+str+"$)");
            if (typeof text.search === "function") {
                position = text.search(str);
            }
            if (position >= 0) {
                if (lang == 'ja') {
                    replaceTag = " " + this.convert(this.mapUserKeywordOrder[index++]) + " ";
                } else {
                    // replaceTag =  " " + this.mapUserKeywordOrder[index++] + " ";
                    replaceTag =  this.mapUserKeywordOrder[index++];
                }

                mb_user_str[replaceTag] = str;
                mb_user_tag[replaceTag] = tag;
                //text = text.replace(new RegExp(str,'gi'), " "+replaceTag+" ");
                text = text.replace(new RegExp(str,'gi'), replaceTag);
            }
        }
        if (lang == 'ja') {
            text = this.convert(text);
        }
        return [text, mb_user_str, mb_user_tag];
    }

    UserDictionary.prototype.getTag = function(str, dicResult) {
        mapReplaceTag = dicResult[1];
        mapMatchedTag = dicResult[2];
        if (mapReplaceTag[str] != '' && typeof mapReplaceTag[str] != 'undefined') {
            temp = mapReplaceTag[str];
            if (mapMatchedTag[str] != '' && typeof mapMatchedTag[str] != 'undefined') {
                return [temp, mapMatchedTag[str]];
            }
        }
        return "";
    }



    UserDictionary.objectReverse = function (o) {
        var r = {};
        for (var p in o) r[o[p]] = p;
        return r;
    };
    UserDictionary.o_hw2fw = (function (o) {
        for (var i = 0x21; i <= 0x7E; i++) {
            o[String.fromCharCode(i)] = String.fromCharCode(i + 0xFF00 - 0x20);
        }
        return o;
    })({
        '\u2985': '\uFF5F', // LEFT WHITE PARENTHESIS
        '\u2986': '\uFF60', // RIGHT WHITE PARENTHESIS
        '\u00A2': '\uFFE0', // CENT SIGN
        '\u00A3': '\uFFE1', // POUND SIGN
        '\u00AC': '\uFFE2', // NOT SIGN
        '\u00AF': '\uFFE3', // MACRON
        '\u00A6': '\uFFE4', // BROKEN BAR
        '\u00A5': '\uFFE5', // YEN SIGN
        '\u20A9': '\uFFE6' // WON SIGN
    });

    UserDictionary.prototype.convert = function (text) {
        var re_h2z = new RegExp('(?:' + [
            '[',
            '\uFF61\uFF62\uFF63\uFF65\uFF66\uFF67\uFF68\uFF69\uFF6A\uFF6B',
            '\uFF6C\uFF6D\uFF6E\uFF6F\uFF70\uFF71\uFF72\uFF74\uFF75\uFF85',
            '\uFF86\uFF87\uFF88\uFF89\uFF8F\uFF90\uFF91\uFF92\uFF93\uFF94',
            '\uFF95\uFF96\uFF97\uFF98\uFF99\uFF9A\uFF9B\uFF9C\uFF9D',
            ']', '|',
            '[',
            '\uFF73\uFF76\uFF77\uFF78\uFF79\uFF7A\uFF7B\uFF7C\uFF7D\uFF7E',
            '\uFF7F\uFF80\uFF81\uFF82\uFF83\uFF84',
            ']', '[\uFF9E]?', '|',
            '[\uFF8A\uFF8B\uFF8C\uFF8D\uFF8E][\uFF9E\uFF9F]?'
        ].join('') + ')', 'g');
        var o_z2h = {
            '\u3002': '\uFF61',
            '\u300C': '\uFF62',
            '\u300D': '\uFF63',
            '\u30FB': '\uFF65',
            '\u30FC': '\uFF70',
            '\u30A1': '\uFF67',
            '\u30A2': '\uFF71',
            '\u30A3': '\uFF68',
            '\u30A4': '\uFF72',
            '\u30A5': '\uFF69',
            '\u30A6': '\uFF73',
            '\u30A7': '\uFF6A',
            '\u30A8': '\uFF74',
            '\u30A9': '\uFF6B',
            '\u30AA': '\uFF75',
            '\u30AB': '\uFF76',
            '\u30AC': '\uFF76\uFF9E',
            '\u30AD': '\uFF77',
            '\u30AE': '\uFF77\uFF9E',
            '\u30AF': '\uFF78',
            '\u30B0': '\uFF78\uFF9E',
            '\u30B1': '\uFF79',
            '\u30B2': '\uFF79\uFF9E',
            '\u30B3': '\uFF7A',
            '\u30B4': '\uFF7A\uFF9E',
            '\u30B5': '\uFF7B',
            '\u30B6': '\uFF7B\uFF9E',
            '\u30B7': '\uFF7C',
            '\u30B8': '\uFF7C\uFF9E',
            '\u30B9': '\uFF7D',
            '\u30BA': '\uFF7D\uFF9E',
            '\u30BB': '\uFF7E',
            '\u30BC': '\uFF7E\uFF9E',
            '\u30BD': '\uFF7F',
            '\u30BE': '\uFF7F\uFF9E',
            '\u30BF': '\uFF80',
            '\u30C0': '\uFF80\uFF9E',
            '\u30C1': '\uFF81',
            '\u30C2': '\uFF81\uFF9E',
            '\u30C3': '\uFF6F',
            '\u30C4': '\uFF82',
            '\u30C5': '\uFF82\uFF9E',
            '\u30C6': '\uFF83',
            '\u30C7': '\uFF83\uFF9E',
            '\u30C8': '\uFF84',
            '\u30C9': '\uFF84\uFF9E',
            '\u30CA': '\uFF85',
            '\u30CB': '\uFF86',
            '\u30CC': '\uFF87',
            '\u30CD': '\uFF88',
            '\u30CE': '\uFF89',
            '\u30CF': '\uFF8A',
            '\u30D0': '\uFF8A\uFF9E',
            '\u30D1': '\uFF8A\uFF9F',
            '\u30D2': '\uFF8B',
            '\u30D3': '\uFF8B\uFF9E',
            '\u30D4': '\uFF8B\uFF9F',
            '\u30D5': '\uFF8C',
            '\u30D6': '\uFF8C\uFF9E',
            '\u30D7': '\uFF8C\uFF9F',
            '\u30D8': '\uFF8D',
            '\u30D9': '\uFF8D\uFF9E',
            '\u30DA': '\uFF8D\uFF9F',
            '\u30DB': '\uFF8E',
            '\u30DC': '\uFF8E\uFF9E',
            '\u30DD': '\uFF8E\uFF9F',
            '\u30DE': '\uFF8F',
            '\u30DF': '\uFF90',
            '\u30E0': '\uFF91',
            '\u30E1': '\uFF92',
            '\u30E2': '\uFF93',
            '\u30E3': '\uFF6C',
            '\u30E4': '\uFF94',
            '\u30E5': '\uFF6D',
            '\u30E6': '\uFF95',
            '\u30E7': '\uFF6E',
            '\u30E8': '\uFF96',
            '\u30E9': '\uFF97',
            '\u30EA': '\uFF98',
            '\u30EB': '\uFF99',
            '\u30EC': '\uFF9A',
            '\u30ED': '\uFF9B',
            '\u30EF': '\uFF9C',
            '\u30F2': '\uFF66',
            '\u30F3': '\uFF9D',
            '\u30F4': '\uFF73\uFF9E'
        };


        var o_h2z = UserDictionary.objectReverse(o_z2h);
        convert1 = text.replace(re_h2z, function (m) {return UserDictionary.o_h2z[m];});

        var re_hw2fw = /[\x21-\x7E\u2985\u2986\xA2\xA3\xAC\xAF\xA6\xA5\u20A9]/g;

        convert2 = convert1.replace(re_hw2fw, function (m) {return UserDictionary.o_hw2fw[m];});
        return convert2.replace(/ /g, '\u3000');
    }

    module.exports = UserDictionary;
})();
