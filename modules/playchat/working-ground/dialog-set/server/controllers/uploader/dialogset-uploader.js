var fs = require('fs');
var async = require('async');
var path = require('path');
var fileutil = require(path.resolve('./engine/bot/action/common/fileutil.js'));
var mongoModule = require(path.resolve('./engine/bot/action/common/mongo.js'));
// var type = require(path.resolve('./bot-engine/action/common/type'));
var mongoose = require('mongoose');
var utils = require(path.resolve('./engine/bot/action/common/utils'));

var XLSX = require('xlsx');

var _ = require('lodash');

var commonWords = ['하나요', '경우', '에서', '어디', '무엇', '까지', '뭔가', '언제', '알다', '확인', '얼마나', '얼마', '자도', '누가'];

var dialogsetKakao = require('./dialogset-kakao');

var NLPManager = require(path.resolve('./engine/bot/engine/nlp/nlp-manager.js'));

var Dialogset = mongoose.model('Dialogset');
var DialogsetDialog = mongoose.model('DialogsetDialog');

(function()
{
    function processInput(language, rawText, done)
    {
        var language = 'ko'; //temporary
        NLPManager.getNlpedText(rawText, language, function(err, result)
        {
            if(err)
            {
                return res.status(400).send({ message: err.stack || err });
            }

            done(result);
        });

        // nlpManager.tokenize(language, rawText, function(result)
        // {
        //     var processed = result.processed;
        //     var nlp = [];
        //     for(var i in processed)
        //     {
        //         if(processed[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && processed[i].pos !== 'Punctuation') nlp.push(processed[i].text);
        //     }
        //
        //     done(nlp.join(' '));
        // });
    };

    function insertDatasetFile1(infile, dialogset, callback)
    {
        var input, output, count = 0;

        fileutil.streamLineSequence(infile, function(result, line, cb)
        {
            if(isNaN(result) == false)
            {
                var re = /"([^"]*)","([^"]*)"/g;
                var array = re.exec(line);

                if(array == null)
                {
                    var re2 = /([^,]*),([^,]*)/g;
                    array = re2.exec(line);
                }

                if(array !== null)
                {
                    var next = function()
                    {
                        if(array[1] && array[1] != '')
                        {
                            if(input == null) input = array[1];
                            else if(Array.isArray(input)) input.push(array[1]);
                            else input = [input, array[1]];
                        }
                        if(array[2] && array[2] != '')
                        {
                            if(output == null) output = array[2];
                            else if(Array.isArray(output)) output.push(array[2]);
                            else output = [output, array[2]];
                        }

                        setTimeout(function(){cb();}, 10);
                    }

                    if(input != null && output != null && array[1] != '' &&
                       ((Array.isArray(input) && input[input.length-1] != array[1]) || input != array[1])
                       && ((Array.isArray(output) && output[output.length-1] != array[2]) || output != array[2]))
                    {
                        count++;
                        insertDailogsetDialog(dialogset, count.toString(), input, output, null, function()
                        {
                            input = null; output = null;
                            next();
                        });
                    }
                    else
                    {
                        next();
                    }

                }
                else
                {
                    var next = function()
                    {
                        if(line != '')
                        {
                            line = line.replace(/^"/, '');
                            if(input == null) input = line;
                            else if(Array.isArray(input)) input.push(line);
                            else input = [input, line];
                        }

                        setTimeout(function(){cb();}, 10);
                    };

                    if(input != null && output != null && line != '')
                    {
                        count++;
                        insertDailogsetDialog(dialogset, count.toString(), input, output, null, function()
                        {
                            input = null; output = null;
                            next();
                        });
                    }
                    else
                    {
                        next();
                    }
                }
            }
            else
            {
                console.log(infile + ' 완료');
                callback(result);
            }
        });
    }

    function insertDialogsetContext(dialogset, contexts, callback)
    {
        var parent = null;
        var CustomContext = mongoose.model('CustomContext');
        async.eachSeries(contexts, function(context, cb)
        {
            async.waterfall([
                function(cb2)
                {
                    var parentName = null;
                    if(parent)
                    {
                        if(parent.name != context)
                        {
                            parentName = parent;
                        }
                    }

                    CustomContext.update({ dialogset: dialogset._id, name: context }, { dialogset: dialogset._id, parent: parentName, name: context }, { upsert: true }, function(err, doc)
                    {
                        parent = null;
                        cb2(null);
                    });
                },

                function(cb2)
                {
                    if(parent == null)
                    {
                        CustomContext.findOne({ dialogset: dialogset._id, name: context }, function(err3, doc)
                        {
                            if(doc) parent = doc;
                            cb2(null);
                        });
                    }
                    else
                    {
                        cb2(null);
                    }
                }

            ], function(err2)
            {
                cb(null);
            });
        },
        function(err)
        {
            if(callback)
            {
                callback(parent);
            }
        })
    };

    function insertDailogsetDialog(language, dialogset, countId, input, output, context, callback)
    {
        if(Array.isArray(input))
        {
            var inputRaw = [];
            async.eachSeries(input, function(i, cb)
            {
                processInput(language, i, function(result)
                {
                    inputRaw.push(result);
                    cb();
                });
            },
            function(err)
            {
                var dialogsetDialog = new DialogsetDialog({
                    dialogset: dialogset,
                    id: countId,
                    tag: [],
                    inputRaw: input,
                    input: inputRaw,
                    output: output,
                    context: context
                });

                dialogsetDialog.save(function(err)
                {
                    if (err)
                    {
                        console.log(err);
                    }

                    callback();
                });
            });
        }
        else
        {
            processInput(language, input, function(result)
            {
                var dialogsetDialog = new DialogsetDialog({
                    dialogset: dialogset,
                    id: countId,
                    tag: [],
                    inputRaw: [input],
                    input: [result],
                    output: [output],
                    context: context
                });

                dialogsetDialog.save(function(err)
                {
                    if (err)
                    {
                        console.log(err);
                    }

                    callback();
                });
            });
        }
    };

    module.exports.insertDailogsetDialog = insertDailogsetDialog;

    function insertExcelFile(language, infile, dialogset, callback)
    {
        var workbook = XLSX.readFile(infile);
        var first_sheet_name = workbook.SheetNames[0];
        var ws = workbook.Sheets[first_sheet_name];

        var range = XLSX.utils.decode_range(ws['!ref']);
        var endOfCol = range.e.c;

        for(var i = range.e.c; i >= 0; i--)
        {
            if(ws[XLSX.utils.encode_cell({c:i, r:0})] != undefined && ws[XLSX.utils.encode_cell({c:i, r:0})].v != undefined && ws[XLSX.utils.encode_cell({c:i, r:0})].v != '')
            {
                endOfCol = i;
                break;
            }
        }

        var contexts = [], input, output, values = [], context = null;
        var R = range.s.r, count = 0;
        async.whilst(
            function()
            {
                ++R;
                return R <= range.e.r;
            },

            function(cbr)
            {
                async.waterfall([
                    function(cb2)
                    {
                        if(ws[XLSX.utils.encode_cell({c:endOfCol, r:R})])
                        {
                            for(var i = 0; i <= endOfCol; i++)
                            {
                                if(ws[XLSX.utils.encode_cell({c:i, r:R})])
                                {
                                    values[i] = ws[XLSX.utils.encode_cell({c:i, r:R})].v;
                                }
                                else
                                {
                                    values[i] = '';
                                }
                            }

                            if(values[endOfCol - 1] && values[endOfCol] && values[endOfCol - 1].trim().toLowerCase() == 'question' && values[endOfCol].trim().toLowerCase() == 'answer')
                            {  // header row pass
                                cb2(true);
                            }
                            else
                            {
                                cb2(null);
                            }
                        }
                        else
                        {
                            cb2(true);
                        }
                    },

                    function(cb2)
                    {
                        if(R == 1)
                        {
                            var CustomContext = mongoose.model('CustomContext');
                            CustomContext.remove({ dialogset: dialogset._id }, function(err, result)
                            {
                                cb2(null);
                            })
                        }
                        else
                        {
                            cb2(null);
                        }
                    },

                    function(cb2)
                    {
                        console.log('인풋 : ' + input);
                        if(input != null && output != null && (values[endOfCol - 1] != '' && values[endOfCol] != '') &&  ((Array.isArray(input) && input[input.length-1] != values[endOfCol - 1]) || input != values[endOfCol - 1]) && ((Array.isArray(output) && output[output.length-1] != values[endOfCol]) || output != values[endOfCol]))
                        {
                            count++;
                            insertDailogsetDialog(language, dialogset, count.toString(), input, output, context, function()
                            {
                                input = null; output = null;
                                cb2(null);
                            });

                        } else {
                            cb2(null);
                        }
                    },

                    function(cb2) {
                        var bContext = false;
                        for(var i = endOfCol - 2; i >= 0; i--)
                        {
                            if(values[i] != '' && values[i] != contexts[i])
                            {
                                bContext = true;
                                break;
                            }
                        }

                        for(var i = 0; i < endOfCol - 1; i++)
                        {
                            if(values[i] != '') contexts[i] = values[i];
                        }

                        if(bContext)
                        {
                            insertDialogsetContext(dialogset, contexts, function(_context)
                            {
                                context = _context;
                                for(var i = endOfCol - 2; i >= 0; i--)
                                {
                                    if(values[i] != '' && values[i] != contexts[i])
                                        contexts[i] = null;
                                }

                                cb2(null);
                            });
                        }
                        else
                        {
                            cb2(null);
                        }
                    },

                    function(cb2)
                    {
                        if(values[endOfCol - 1] != '')
                        {
                            input = values[endOfCol - 1];
                            // if(input == null)
                            // {
                            //     input = values[endOfCol - 1];
                            // }
                            // else if(Array.isArray(input))
                            // {
                            //     input.push(values[endOfCol - 1]);
                            // }
                            // else
                            // {
                            //     input = [input, values[endOfCol - 1]];
                            // }
                        }

                        if(values[endOfCol] != '')
                        {
                            output = values[endOfCol];

                            // if(output == null)
                            // {
                            //     output = values[endOfCol];
                            // }
                            // else if(Array.isArray(output))
                            // {
                            //     output.push(values[endOfCol]);
                            // }
                            // else
                            // {
                            //     output = [output, values[endOfCol]];
                            // }
                        }

                        cb2(null);
                    },
                    function(cb)
                    {
                        // knowledge fact (dsyoon)
                        var language = "en";
                        var context = {};
                        var bot_name = 'demo';
                        var bot_id = 'demo';
                        NLPManager.processInput(context, output, language, function(err, res)
                        {
                            if (res.botUser.nlu["nlp"] && res.botUser.nlu["nlp"] != undefined) {

                                var nlp = res.botUser.nlu["nlp"];
                                var nlu = res.botUser.nlu;
                                var node1, node2, link;
                                var allPronoun = 0;
                                var context = null;
                                console.log("analysisDoc >> " + nlu.sentence);
                                console.log("nlp >> " + JSON.stringify( nlp ));

                                var language = "en";
                                if (nlu.sentenceInfo == 0) {
                                    // 평서문이라면 확인
                                    if (language == "en") {
                                        var index = -1, mode = 0; // 1: the first noun, 2: verb, 3: the second noun
                                        for (var i = 0; i < nlp.length; i++) {
                                            var token = nlp[i];

                                            if (isNaN(token.text) != true) continue;
                                            if (node1 == token.text) continue;
                                            if (token.text == "the" || token.text == "a" || token.text == "an") continue;

                                            // 초기화
                                            if (mode==1) {
                                                if (token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                                    mode = 0;
                                                    node1 = "";
                                                    allPronoun = 0;
                                                }
                                            }

                                            if (mode == 0) {
                                                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                                    node1 = token.text;
                                                    mode = 1;
                                                    index = i;
                                                    if (token.pos == 'Pronoun') allPronoun = 1;
                                                }
                                            } else if (mode == 1) {
                                                if (token.pos == 'Adjective' || token.pos == 'Verb') {
                                                    link = token.text;
                                                    mode = 2;
                                                    index = i;
                                                }
                                            } else if (mode == 2) {
                                                if (token.pos == 'Noun' || token.pos == 'Foreign') {
                                                    node2 = token.text;
                                                    if (token.pos == 'Pronoun') allPronoun = 1;
                                                    break;
                                                }
                                            }
                                        }
                                    } else if (language == "zh") {
                                        var mode = 0; // 1: the first noun, 2: verb, 3: the second noun
                                        for (var i = 0; i < nlp.length - 1; i++) {
                                            var token = nlp[i];
                                            if (isNaN(token.text) != true) continue;
                                            if ((token.text.indexOf("年") >= 0) ||
                                                (token.text.indexOf("月") >= 0) ||
                                                (token.text.indexOf("日") >= 0)) continue;
                                            if (node1 == token.text) continue;

                                            if (NUMBER_PTN.test(token)) continue;
                                            if (mode == 0) {
                                                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                                    node1 = token.text;
                                                    mode = 1;
                                                }
                                            } else if (mode == 1) {
                                                if (token.pos == 'Adjective' || token.pos == 'Verb') {
                                                    link = token.text;
                                                    mode = 2;
                                                }
                                            } else if (mode == 2) {
                                                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                                    node2 = token.text;
                                                    break;
                                                }
                                            }
                                        }
                                    } else {
                                        for (var i = 0; i < nlp.length; i++) {
                                            if (nlp[i].pos == 'Noun') {
                                                node1 = nlp[i].text;
                                                break;
                                            }
                                        }

                                        if (node1) {
                                            for (var i = nlp.length - 1; i >= 0; i--) {
                                                if (node2 && link) break;
                                                if (nlp[i].pos == 'Noun' && nlp[i].text != node1) {
                                                    node2 = nlp[i].text;
                                                } else if (nlp[i].pos == 'Verb' || nlp[i].pos == 'Adjective') {
                                                    link = nlp[i].text;
                                                }
                                            }
                                        }
                                    }

                                    if (node1 && node2 && link) {
                                        var tempNode1 = node1.toLowerCase();
                                        var tempNode2 = node2.toLowerCase();
                                        if (tempNode1=='it' || tempNode1=='that' || tempNode1=="I've" || tempNode2=="my") {
                                            node1 = ''; node2 = ''; link = '';
                                        }
                                        if (tempNode2=='it' || tempNode2=='that' || tempNode2=="I've" || tempNode2=="my") {
                                            node1 = ''; node2 = ''; link = '';
                                        }
                                        node1 = node1.replace(/,/,"");
                                        node2 = node2.replace(/,/,"");
                                        link = link.replace(/,/,"");
                                        console.log("factLink (dialogset.js)>> " + node1 + ', ' + node2 + ' <-> ' + link + ' | ' + nlu.sentence);
                                        var task = {
                                            doc: {
                                                bot_id: bot_name,
                                                botUser: bot_id,
                                                node1: node1,
                                                node2: node2,
                                                link: link,
                                                created: new Date()
                                            },

                                            mongo: {
                                                model: 'FactLink',
                                                query: {node1: '', node2: '', link: ''},
                                                options: {upsert: true}
                                            }
                                        };

                                        mongoModule.update(task, null, function (_task, _context) {
                                            cb();
                                        })
                                    } else {
                                        cb();
                                    }
                                } else {
                                    cb();
                                }
                            } else {
                                cb();
                            }
                        })
                    }
                ],
                function(err2)
                {
                    cbr(null);
                });
            },
            function(err)
            {
                async.waterfall([
                    function(cb2)
                    {
                        var bContext = false;
                        for(var i = endOfCol - 2; i >= 0; i--)
                        {
                            if(contexts[i] != null)
                            {
                                bContext = true;
                                break;
                            }
                        }

                        if(bContext)
                        {
                            insertDialogsetContext(dialogset, contexts, function(_context)
                            {
                                context = _context;
                                cb2(null);
                            });
                        }
                        else
                        {
                            cb2(null);
                        }
                    },

                    function(cb2)
                    {
                        if(input != null && output != null)
                        {
                            count++;
                            insertDailogsetDialog(language, dialogset, count.toString(), input, output, context, function()
                            {
                                input = null; output = null;
                                cb2(null);
                            });
                        }
                        else
                        {
                            cb2(null);
                        }
                    }
                ],
                function(err2)
                {
                    console.log('insertExcelFile: 완료');
                    callback();
                })
            }
        );
    };

    module.exports.importFile = function(language, dialogset, done)
    {
        var dialogType = dialogset.type;
        var dir = path.resolve('public/files/');
        var filepath = path.join(dir, dialogset.filename);

        var info = path.parse(dialogset.filename);

        if(info.ext == '.xls' || info.ext == '.xlsx')
        {
            dialogType = 'xlsx';
            insertExcelFile(language, filepath, dialogset, function()
            {
                done();
            });
        }
        else if (info.ext == '.csv')
        {
            dialogType = "csv";
            async.waterfall([
                function(next)
                {
                    utils.readFirstLine(filepath).then(function(head)
                    {
                        if (head === "Date,User,Message")
                        {
                            dialogType = "kakao";
                        }
                        next(null);
                    },
                    function(err)
                    {
                        dialogType = 'csv';
                        next(null);
                    });
                },
                function(next)
                {
                    if (dialogType == "kakao")
                    {
                        dialogsetKakao.convertDialogset(filepath, dialogset, analysis);
                    }
                    else
                    {
                        insertDatasetFile1(filepath, dialogset, function()
                        {
                            next(null);
                        });
                    }

                    next(null);
                }
            ],
            function(err)
            {
                done();
            });
        }
    };

})();
