var fs = require('fs');
var async = require('async');
var path = require('path');
var fileutil = require(path.resolve('engine/bot/action/common/fileutil.js'));
var mongoModule = require(path.resolve('engine/bot/action/common/mongo.js'));
var type = require(path.resolve('engine/bot/action/common/type'));
var mongoose = require('mongoose');
var utils = require(path.resolve('engine/bot/action/common/utils'));

// var bot = require(path.resolve('./engine/bot.js')).getBot('private_bot');
var dialogsetKakao = require('./dialogset-kakao');
var dialogsetSmi = require('./dialogset-smi');
var dialogsetKdrama = require('./dialogset-kdrama');

var DialogsetDialog = mongoose.model('DialogsetDialog');
var XLSX = require('xlsx');

var _ = require('lodash');

var koNLP = require(path.resolve('./engine/bot/engine/nlp/processor_ko'));
var enNLP = require(path.resolve('./engine/bot/engine/nlp/processor_en'));
var jaNLP = require(path.resolve('./engine/bot/engine/nlp/processor_ja'));
var zhNLP = require(path.resolve('./engine/bot/engine/nlp/processor_zh'));

var commonWords = ['하나요', '경우', '에서', '어디', '무엇', '까지', '뭔가', '언제', '알다', '확인', '얼마나', '얼마', '자도', '누가'];

//TODO: should be replace with convertDialogset1
function convertDialogset(original, callback) {
    var dialogType = 'kakao';

    var info = path.parse(original);
    if(info.ext == '.txt') {dialogType = 'kakao';}
    else if(info.ext == '.csv') {dialogType = 'kakao';}
    else if(info.ext == '.smi') {dialogType = 'smi';}

    var dir = path.resolve('public/files/');
    insertDatasetFile(path.join(dir, original), function() {
        callback();
    });

    // analyzeKnowledge('quibble', callback);

    // nlpTest(path.join(dir, original), callback);

    // if(dialogType == 'kakao') dialogsetKakao.convertDialogset(original, callback);
    // else if(dialogType == 'smi') dialogsetSmi.convertDialogset(original, callback);
    // else if(dialogType == 'kdrama') dialogsetKdrama.convertDialogset(original, callback);
}

exports.convertDialogset = convertDialogset;

function convertDialogset1(dialogset, bot_id, bot_name, callback) {
    var dialogType = dialogset.type;
    var dir = path.resolve('public/files/');
    var filepath = path.join(dir, dialogset.filename);

    // 봇 id 추가 by dsyoon (2017. 09. 28)
    dialogset._doc["bot_id"] = bot_id;
    dialogset._doc["bot_name"] = bot_name;
    async.waterfall([
        function(cb) {
            var info = path.parse(dialogset.originalFilename);
            if (info.ext == '.txt') {
                dialogType = 'kakao';
                dialogsetKakao.convertDialogset(filepath, dialogset, function() {
                    cb(null);
                });
            } else if(info.ext == '.xls' || info.ext == '.xlsx') {
                dialogType = 'xlsx';
                insertExcelFile(filepath, dialogset, function() {
                    cb(null);
                });

            } else if (info.ext == '.csv') {
                dialogType = "csv";

                async.waterfall([
                    function(cb2) {
                        utils.readFirstLine(filepath).then(function(head) {
                            if (head === "Date,User,Message") {
                                dialogType = "kakao";
                            }
                            cb2(null);
                        }, function(err) {
                            dialogType = 'csv';
                            cb2(null);
                        });
                    },
                    function(cb2) {
                        if (dialogType == "kakao") {
                            dialogsetKakao.convertDialogset(filepath, dialogset, analysis);
                        } else {
                            insertDatasetFile1(filepath, dialogset, function() {
                                cb2(null);
                            });
                        }
                        cb2(null);
                    }
                ], function(err) {
                    cb(null);
                });
            } else if(info.ext == '.smi') {
                dialogType = 'smi';
                dialogsetSmi.convertDialogset(filepath, dialogset, function() {
                    cb(null);
                });
            }

            console.log(dialogType);
        },

        function(cb) {
            preProcessDialog(dialogset, function() {
                cb(null);
            })
        },

        function(cb) {
            if (bot_id != null) {
                analyzeKnowledge(dialogset, bot_id, bot_name, 'result', function() {
                    cb(null);
                });
            } else {
                cb(null);
            }
        }
    ], function(err) {
        if(callback) callback();
    })

}

exports.convertDialogset1 = convertDialogset1;

function insertDailogsetDialog(dialogset, countId, input, output, context, callback) {

    if(Array.isArray(input)) {
        var inputRaw = [];
        async.eachSeries(input, function(i, cb) {
            processInput(null, i, function(_input, _nlu, _json) {
                inputRaw.push(_input);
                console.log(countId + ">> " + input + ' || ' + _input + ' || ' + output);
                cb(null);
            });
        }, function(err) {
            console.log(countId + ">> " + input + ' || ' + inputRaw + ' || ' + output);

            var dialogsetDialog = new DialogsetDialog({
                dialogset: dialogset,
                id: countId,
                tag: [],
                inputRaw: input,
                input: inputRaw,
                output: output,
                context: context
            });

            dialogsetDialog.save(function(err) {
                if (err) console.log(err);
                callback();
            });
        });
    } else {
        processInput(null, input, function(_input, _nlu, _json) {
            console.log(countId + ">> " + input + ' || ' + _input + ' || ' + output);

            var dialogsetDialog = new DialogsetDialog({
                dialogset: dialogset,
                id: countId,
                tag: [],
                inputRaw: input,
                input: _input,
                output: output,
                context: context
            });

            dialogsetDialog.save(function(err) {
                if (err) console.log(err);
                callback();
            });
        });
    }

}

exports.insertDailogsetDialog = insertDailogsetDialog;

function insertDialogsetContext(dialogset, contexts, callback) {
    var parent = null;
    var CustomContext = mongoose.model('customcontext');
    async.eachSeries(contexts, function(context, cb) {
        async.waterfall([

            function(cb2) {
                if (context != "") {
                    CustomContext.update({
                            // bot: dialogset.bot,
                            dialogset: dialogset._id,
                            name: context
                        },
                        {
                            // bot: dialogset.bot,
                            dialogset: dialogset._id,
                            parent: parent, //(parent ? parent._id : null),
                            name: context
                        },
                        {
                            upsert: true
                        },
                        function(err, doc) {
                            // if(doc.upserted && doc.upserted[0]) parent = doc.upserted[0];
                            // else parent = null;
                            parent = null;
                            cb2(null);
                        }
                    );
                } else {
                    cb2(null);
                }
            },

            function(cb2) {
                if(parent == null) {
                    CustomContext.findOne({
                        // bot: dialogset.bot,
                        dialogset: dialogset._id,
                        name: context
                    }, function(err3, doc) {
                        if(doc) parent = doc;
                        cb2(null);
                    })
                } else {
                    cb2(null);
                }
            }

        ], function(err2) {
            cb(null);
        });

        // var customContext = new CustomContext({
        //   bot: dialogset.bot,
        //   dialogset: dialogset,
        //   parent: context.parent,
        //   name: context.name
        // })
        //
        // customContext.save(function(err) {
        //   if(callback) callback();
        // })
    }, function(err) {
        if(callback) callback(parent);
    })
}

function insertDatasetCSVFile(infile, dialogset, callback) {
    const csv = require('csvtojson');

    var csvFile = infile;
    var input, output, count = 0, saveInput, saveOutput, saveCount;

    csv({noheader:true})
        .fromFile(csvFile)
        .on('csv',  function(csvRow) {
            var next = function() {
                if(csvRow[0] && csvRow[0] != '') {
                    if(input == null) input = csvRow[0];
                    else if(Array.isArray(input)) input.push(csvRow[0]);
                    else input = [input, csvRow[0]];
                }
                if(csvRow[1] && csvRow[1] != '') {
                    if(output == null) output = csvRow[1];
                    else if(Array.isArray(output)) output.push(csvRow[1]);
                    else output = [output, csvRow[1]];
                }
            };

            if(input != null && output != null && csvRow[1] != '' &&
                ((Array.isArray(input) && input[input.length-1] != csvRow[0]) || input != csvRow[0])
                && ((Array.isArray(output) && output[output.length-1] != csvRow[1]) || output != csvRow[1])) {

                saveCount = count++;
                saveInput = input;
                saveOutput = output;
                input = null; output = null;

                insertDailogsetDialog(dialogset, saveCount.toString(), saveInput, saveOutput, null, function() {
                    // input = null; output = null;
                });
                next();
            } else {
                next();
            }
        })
        .on('done', function(error) {
        });
}


exports.insertDatasetCSVFile = insertDatasetCSVFile;

function insertDatasetLg(infile, dialogset, callback) {
    var input, output, count = 0;

    var model = mongoModule.getModel('lgfaqs');
    var count = 0;
    model.find({}).lean().exec(function(err, docs) {
        docs.forEach(function(doc) {
            var input = doc.title;
            var output = doc.body;
            ++count;
            insertDailogsetDialog(dialogset, count.toString(), input, output, null, function() {});
        });
        console.log(' 완료');
        callback("OK");
    });
}

exports.insertDatasetLg = insertDatasetLg;


function insertExcelFile(infile, dialogset, callback) {
    var workbook = XLSX.readFile(infile);
    var first_sheet_name = workbook.SheetNames[0];
    var ws = workbook.Sheets[first_sheet_name];

    var range = XLSX.utils.decode_range(ws['!ref']);
    var endOfCol = range.e.c;

    for(var i = range.e.c; i >= 0; i--) {
        if(ws[XLSX.utils.encode_cell({c:i, r:0})] != undefined
            && ws[XLSX.utils.encode_cell({c:i, r:0})].v != undefined
            && ws[XLSX.utils.encode_cell({c:i, r:0})].v != '') {
            endOfCol = i;
            break;
        }
    }

    var contexts = [], input, output, values = [], context = null;
    var R = range.s.r, count = 0;
    async.whilst(
        function() {++R; return R <= range.e.r},

        function(cbr) {
            async.waterfall([
                function(cb2) {
                    // find the cell in the first row
                    if(ws[XLSX.utils.encode_cell({c:endOfCol, r:R})]) {
                        for(var i = 0; i <= endOfCol; i++) {
                            if(ws[XLSX.utils.encode_cell({c:i, r:R})]) values[i] = ws[XLSX.utils.encode_cell({c:i, r:R})].v;
                            else values[i] = '';
                        }

                        if(values[endOfCol - 1] && values[endOfCol] &&
                            values[endOfCol - 1].trim().toLowerCase() == 'question' && values[endOfCol].trim().toLowerCase() == 'answer') {  // header row pass
                            cb2(true);
                        } else {
                            cb2(null);
                        }
                    } else {
                        cb2(true);
                    }
                },

                function(cb2) {
                    if(R == 1) {
                        var CustomContext = mongoose.model('customcontext');
                        CustomContext.remove({dialogset: dialogset._id}, function(err, result) {
                            cb2(null);
                        })
                    } else {
                        cb2(null);
                    }
                },

                function(cb2) {
                    console.log(R + ', ' + range.e.r);
                    if(input != null && output != null &&
                        (values[endOfCol - 1] != '' && values[endOfCol] != '') &&
                        ((Array.isArray(input) && input[input.length-1] != values[endOfCol - 1]) || input != values[endOfCol - 1])
                        && ((Array.isArray(output) && output[output.length-1] != values[endOfCol]) || output != values[endOfCol])) {

                        count++;
                        insertDailogsetDialog(dialogset, count.toString(), input, output, context, function() {
                            input = null; output = null;
                            cb2(null);
                        });

                        (dialogset, callback);

                    } else {
                        cb2(null);
                    }
                },

                function(cb2) {
                    var bContext = false;
                    for(var i = endOfCol - 2; i >= 0; i--) {
                        if(values[i] != '' && values[i] != contexts[i]) {
                            bContext = true;
                            for (var j = i+1; i<=endOfCol - 2; i++) {
                                if (values[j] == "") {
                                    contexts[j] = "";
                                }
                            }
                            break;
                        }
                    }

                    for(var i = 0; i < endOfCol - 1; i++) {
                        if(values[i] != '') contexts[i] = values[i];
                    }

                    if(bContext) {
                        insertDialogsetContext(dialogset, contexts, function(_context) {
                            context = _context;
                            for(var i = endOfCol - 2; i >= 0; i--) {
                                if(values[i] != '' && values[i] != contexts[i]) contexts[i] = null;
                            }
                            cb2(null);
                        });
                    } else {
                        cb2(null);
                    }
                },

                function(cb2) {
                    if(values[endOfCol - 1] != '') {
                        if(input == null) input = values[endOfCol - 1];
                        else if(Array.isArray(input)) input.push(values[endOfCol - 1]);
                        else input = [input, values[endOfCol - 1]];
                    }

                    if(values[endOfCol] != '') {
                        if(output == null) output = values[endOfCol];
                        else if(Array.isArray(output)) output.push(values[endOfCol]);
                        else output = [output, values[endOfCol]];
                    }

                    cb2(null);
                }

            ], function(err2) {
                cbr(null);
            });
        },

        function(err) {

            async.waterfall([
                function(cb2) {
                    var bContext = false;
                    for(var i = endOfCol - 2; i >= 0; i--) {
                        if(contexts[i] != null) {
                            bContext = true;
                            break;
                        }
                    }

                    if(bContext) {
                        insertDialogsetContext(dialogset, contexts, function(_context) {
                            context = _context;
                            cb2(null);
                        });
                    } else {
                        cb2(null);
                    }
                },

                function(cb2) {
                    if(input != null && output != null) {
                        count++;
                        insertDailogsetDialog(dialogset, count.toString(), input, output, context, function() {
                            input = null; output = null;
                            cb2(null);
                        });
                    } else {
                        cb2(null);
                    }
                }
            ], function(err2) {
                console.log('insertExcelFile: 완료');
                callback();
            })
        }
    );

    // for(var R = range.s.r; R <= range.e.r; ++R) {
    //   for(var C = range.s.c; C <= range.e.c; ++C) {
    //     var address = XLSX.utils.encode_cell({c:C, r:R});
    //     var cell = ws[address];
    //
    //     console.log('insertExcelFile: '  + address + '=' + cell.v);
    //   }
    // }

}

exports.insertExcelFile = insertExcelFile;

function insertDatasetFile1(infile, dialogset, callback) {
    var input, output, count = 0;

    fileutil.streamLineSequence(infile, function(result, line, cb) {
        if(isNaN(result) == false) {
            // console.log(line);

            var re = /"([^"]*)","([^"]*)"/g;
            var array = re.exec(line);

            if(array == null) {
                var re2 = /([^,]*),([^,]*)/g;
                array = re2.exec(line);
            }

            if(array !== null) {
                var next = function() {
                    if(array[1] && array[1] != '') {
                        if(input == null) input = array[1];
                        else if(Array.isArray(input)) input.push(array[1]);
                        else input = [input, array[1]];
                    }
                    if(array[2] && array[2] != '') {
                        if(output == null) output = array[2];
                        else if(Array.isArray(output)) output.push(array[2]);
                        else output = [output, array[2]];
                    }

                    // if(array[2] && array[2] != '') input = array[2].trim();
                    // if(array[4] && array[4] != '') output = array[4].trim();

                    setTimeout(function(){cb();}, 10);
                }

                if(input != null && output != null && array[1] != '' &&
                    ((Array.isArray(input) && input[input.length-1] != array[1]) || input != array[1])
                    && ((Array.isArray(output) && output[output.length-1] != array[2]) || output != array[2])) {
                    count++;
                    insertDailogsetDialog(dialogset, count.toString(), input, output, null, function() {
                        input = null; output = null;
                        next();
                    });
                } else {
                    next();
                }

            } else {
                var next = function() {
                    if(line != '') {
                        line = line.replace(/^"/, '');
                        if(input == null) input = line;
                        else if(Array.isArray(input)) input.push(line);
                        else input = [input, line];
                    }

                    setTimeout(function(){cb();}, 10);
                };

                if(input != null && output != null && line != '') {
                    count++;
                    insertDailogsetDialog(dialogset, count.toString(), input, output, null, function() {
                        input = null; output = null;
                        next();
                    });
                } else {
                    next();
                }
            }
        } else {
            console.log(infile + ' 완료');
            callback(result);
            // console.log(result);
        }
    });
}

exports.insertDatasetFile1 = insertDatasetFile1;


function insertDatasetFile(infile, callback, dialogset) {
    var info = path.parse(infile);
    var input, output, count = 0;
    fileutil.streamLineSequence(infile, function(result, line, cb) {
        if(isNaN(result) == false) {
            // console.log(line);

            var re = /"([^"]*)","([^"]*)"/g;
            var array = re.exec(line);

            if(array == null) {
                var re2 = /([^,]*),([^,]*)/g;
                array = re2.exec(line);
            }

            if(array !== null) {
                count++;
                if(array[1] && array[1] != '') input = array[1].trim();
                if(array[2] && array[2] != '') output = array[2].trim();

                // if(array[2] && array[2] != '') input = array[2].trim();
                // if(array[4] && array[4] != '') output = array[4].trim();

                var outputs = [];
                // var re2 = /\[([^\]]*)\]/g;
                // output.replace(re2, function(match, p1) {
                //   outputs.push(p1);
                // });

                processInput(null, input, function(_input, _nlu, _json) {
                    console.log(count + ">> " + input + ' || ' + _input + ' || ' + (outputs.length > 0 ? outputs: output));

                    var dialogsetDialog = new DialogsetDialog({
                        dialogset: dialogset,
                        id: count.toString(),
                        tag: [],
                        inputRaw: input,
                        input: _input,
                        output: (outputs.length > 0 ? outputs: output)
                    });

                    dialogsetDialog.save(function(err) {
                        if (err) console.log(err);
                        setTimeout(function(){cb();}, 10);
                    });
                });

            } else {
                setTimeout(function(){cb();}, 10);
                // cb();
            }
        } else {
            console.log(infile + ' 완료');
            callback(result);
            // console.log(result);
        }
    });
}

exports.insertDatasetFile = insertDatasetFile;

function analysisDoc(doc, bot_id, bot_name, cb) {
    if(Array.isArray(doc.output)) {
        async.eachSeries(doc.output, function(input, _cb) {
            // 엑셀의 답변으로 학습되도록 수정
            //processInput(null, doc.input, function(_input, _nlu, _json) {
            processInput(null, input, function (_input, _nlu, _json) {
                console.log("analysisDoc (dialogset.js) >> " + _input);

                var nlp = _json._nlp;
                var nlu = _nlu._nlu;
                var node1, node2, link;
                var context = null;
                var NUMBER_PTN=/\[.+?\]/g;

                if (context == null || context == undefined) context = {};
                context.botUser = context.botUser || {};
                context.bot.language = context.bot.language || {};

                // context.bot.language = "ko";

                if (nlu.sentenceInfo == 0) {
                    // 평서문이라면 확인
                    if (context.bot.language == "en") {
                        var index = -1, mode = 0; // 1: the first noun, 2: verb, 3: the second noun
                        for (var i = 0; i < nlp.length; i++) {
                            var token = nlp[i];
                            if (isNaN(token.text) != true) continue;
                            if (node1 == token.text) continue;
                            if (token.text == "the" || token.text == "a" || token.text == "an") continue;

                            var lastChar = token.text.charAt(token.text.length-1);
                            if (lastChar == "." || lastChar == "!" || lastChar == "?") {
                                if (mode == 0 || mode == 1) {
                                    mode = 0;
                                    node1 = ""; node2 = ""; link = "";
                                }
                                continue;
                            }

                            // 초기화
                            if (mode==1) {
                                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                    mode = 0;
                                    node1 = ""; node2 = ""; link = "";
                                }
                            }

                            if (mode == 0) {
                                if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                    node1 = token.text;
                                    mode = 1;
                                    index = i;
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
                                    break;
                                }
                            }
                        }
                    } else if (context.bot.language == "zh") {
                        var mode = 0; // 1: the first noun, 2: verb, 3: the second noun
                        for (var i = 0; i < nlp.length - 1; i++) {
                            var token = nlp[i];
                            if(isNaN(token.text) != true) continue;
                            if ((token.text.indexOf("年") >= 0) ||
                                (token.text.indexOf("月") >= 0) ||
                                (token.text.indexOf("日") >= 0)) continue;
                            if (node1==token.text) continue;

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
                        console.log("factLink (dialogset.js)>> " + node1 + ', ' + node2 + ' <-> ' + link);
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
                            _cb();
                        })
                    } else {
                        _cb();
                    }
                } else {
                    _cb();
                }
            })
        }, function(err) {
            cb();
        })
    } else {
        // 엑셀의 답변으로 학습되도록 수정
        //processInput(null, doc.input, function(_input, _nlu, _json) {
        processInput(null, doc.output, function (_input, _nlu, _json) {
            console.log("analysisDoc (dialogset.js) >> " + doc.output);

            var nlp = _json._nlp;
            var nlu = _nlu._nlu;
            var node1, node2, link;
            var context = null;

            if (context == null || context == undefined) context = {};
            context.botUser = context.botUser || {};
            context.bot.language = context.bot.language || {};

            if (nlu.sentenceInfo == 0) {
                // 평서문이라면 확인
                if (context.bot.language == "en") {
                    var index = -1, mode = 0; // 1: the first noun, 2: verb, 3: the second noun
                    var allPronoun = 0;
                    for (var i = 0; i < nlp.length; i++) {
                        var token = nlp[i];
                        if (isNaN(token.text) != true) continue;
                        if (node1 == token.text) continue;
                        if (token.text == "the" || token.text == "a" || token.text == "an") continue;

                        var lastChar = token.text.charAt(token.text.length-1);
                        if (lastChar == "." || lastChar == "!" || lastChar == "?") {
                            if (mode == 0 || mode == 1) {
                                mode = 0;
                                node1 = ""; node2 = ""; link = "";
                                allPronoun = 0;
                            }
                            continue;
                        }

                        // 초기화
                        if (mode==1) {
                            if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                mode = 0;
                                node1 = ""; node2 = ""; link = "";
                                allPronoun = 0;
                            }
                        }

                        if (mode == 0) {
                            if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                                node1 = token.text;
                                mode = 1;
                                index = i;
                                if (token.pos = 'Pronoun') allPronoun = 1;
                            }
                        } else if (mode == 1) {
                            if (token.pos == 'Adjective' || token.pos == 'Verb') {
                                link = token.text;
                                mode = 2;
                                index = i;
                            }
                        } else if (mode == 2) {
                            if (token.pos == 'Noun' || token.pos == 'Foreign' || token.pos == 'Pronoun') {
                                node2 = token.text;
                                if (token.pos = 'Pronoun') allPronoun = 2;
                                break;
                            }
                        }
                    }
                    if (allPronoun == 2) {
                        node1 = ""; node2 = ""; link = "";
                    }
                } else if (context.bot.language == "zh") {
                    var mode = 0; // 1: the first noun, 2: verb, 3: the second noun
                    for (var i = 0; i < nlp.length - 1; i++) {
                        var token = nlp[i];
                        if(isNaN(token.text) != true) continue;
                        if ((token.text.indexOf("年") >= 0) ||
                            (token.text.indexOf("月") >= 0) ||
                            (token.text.indexOf("日") >= 0)) continue;
                        if (node1==token.text) continue;

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
                    console.log("factLink (dialogset.js)>> " + node1 + ', ' + node2 + ' <-> ' + link);
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
        })
    }
}

function analyzeKnowledgeDialog(dialogs, bot_id, bot_name, result, callback) {
    var model = mongoModule.getModel('DialogsetDialog');
    var docs = [];
    for (var i=0; i < dialogs.length; ++i) {
        if (typeof dialogs[i].input == "string") {
            docs.push({input: dialogs[i].input});
        }
        else if (Array.isArray(dialogs[i].input)) {
            for (var j=0; j < dialogs[i].input.length; ++j) {
                if (typeof dialogs[i].input[j] == "string") {
                    docs.push({input: dialogs[i].input[j]});
                }
            }
        }
        if (typeof dialogs[i].output == "string") {
            docs.push({input: dialogs[i].output});
        }
        else if (Array.isArray(dialogs[i].output)) {
            for (var j=0; j < dialogs[i].output.length; ++j) {
                if (typeof dialogs[i].output[j] == "string") {
                    docs.push({input: dialogs[i].output[j]});
                }
            }
        }
    }

    async.eachSeries(docs, function(doc, cb) {
        analysisDoc(doc,bot_id, bot_name, cb);
    } , function(err) {
        callback(result);
    });
}
exports.analyzeKnowledgeDialog = analyzeKnowledgeDialog;


function analyzeKnowledge(dialogset, bot_id, bot_name, result, callback) {
    var model = mongoModule.getModel('DialogsetDialog');

    model.find({dialogset: dialogset}).lean().exec(function(err, docs) {
        async.eachSeries(docs, function(doc,cb) {
            analysisDoc(doc, bot_id, bot_name, cb);
        }, function(err) {
            callback(result);
        });
    });
}
exports.analyzeKnowledge = analyzeKnowledge;


// var insertDatasetTask = {
//   action: function (task, context, callback) {
//     insertDatasetFile('/Users/com2best/Workspace/bot-web/custom_modules/test/_data/en/chatscript/eliza_what_en_ja_ko.csv', function(result) {
//       callback(task, context);
//     });
//   }
// };
//
// bot.setTask('insertDatasetTask', insertDatasetTask);

var nlp = require(path.resolve('engine/bot/engine/nlp/processor'));


// translateFile('/Users/com2best/Workspace/bot-data/data/en/chatscript/eliza_can_en.csv',
//   '/Users/com2best/Workspace/bot-data/data/en/chatscript/eliza_can_ko.csv',
//   'en', 'ko',
//   function(result) {});

function insertDatasetDir(dir, from, to, callback) {
    var files;

    var transFilter = function(file) {
        return file.endsWith(from +'.csv');
    };

    try {
        files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if(file != file.normalize('NFC')) {
                files[i] = file.normalize('NFC');
            }
        }

        files = files.filter(transFilter);
    } catch(e) {
        console.log(e);
        return;
    }

    console.log(dir + ' 업데이트 시작');

    async.each(files, function(file, cb) {
        var _file = dir + file;
        var info = path.parse(_file);
        var _outfile = path.join(info.dir, info.name + '_' + to + '.csv');

        insertDatasetFile(_file, _outfile, from, to, function(result) {
            cb(null);
        });
    }, function(err) {
        console.log(dir + ' 업데이트 완료');
        callback();
    });
}

exports.insertDatasetDir = insertDatasetDir;


// var insertDatasetDirTask = {
//   action: function (task, context, callback) {
//
//     callback(task, context);
//   }
// };
//
// bot.setTask('insertDatasetDirTask', insertDatasetDirTask);


/*
function processInput(context, inRaw, callback) {
  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: false     // (optional default: false)
  });
  var _in = '';
  var _nlpRaw = [];
  var _nlp = [];
  nlpKo.tokenize(inRaw, function(err, result) {
    for(var i in result) {
      // if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      // if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
      if(result[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      if(result[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
    }
    _in = _nlp.join(' ');
    callback(_in, {_nlp: _nlpRaw});
  });
}
*/

// dsyoon (2017. 09. 26)
// processInput(null, input, function(_input, _json);
function processInput(context, inRaw, callback) {
    var _in = '';
    var _nlpRaw = [];

    var result = {};
    if (context.bot.language=="en") {
        enNLP.processInput(result, inRaw, function(_inTextNLP, _inDoc) {
            if (_inTextNLP != undefined && _inTextNLP != null) {
                _in = result.botUser.inNLP;
                _nlpRaw = result.botUser.nlp;
                callback(_in, {_nlu: result.botUser.nlu}, {_nlp: _nlpRaw});
            } else {
                callback(_in, {_nlu: ""}, {_nlp: ""});
            }
        });
    } else if (context.bot.language=="zh") {
        zhNLP.processInput(result, inRaw, function(_inTextNLP, _inDoc) {
            if (_inTextNLP != undefined && _inTextNLP != null) {
                _in = result.botUser.inNLP;
                _nlpRaw = result.botUser.nlpAll;
                callback(_in, {_nlu: result.botUser.nlu}, {_nlp: _nlpRaw});
            } else {
                callback(_in, {_nlu: ""}, {_nlp: ""});
            }
        });
    } else if (context.bot.language=="ja") {
        jaNLP.processInput(result, inRaw, function(_inTextNLP, _inDoc) {
            if (_inTextNLP != undefined && _inTextNLP != null) {
                _in = result.botUser.inNLP;
                _nlpRaw = result.botUser.nlpAll;
                callback(_in, {_nlu: result.botUser.nlu}, {_nlp: _nlpRaw});
            } else {
                callback(_in, {_nlu: ""}, {_nlp: ""});
            }
        });
    } else {
        koNLP.processInput(result, inRaw, function(_inTextNLP, _inDoc) {
            if (_inTextNLP != undefined && _inTextNLP != null) {
                _in = result.botUser.inNLP;
                _nlpRaw = result.botUser.nlpAll;
                callback(_in, {_nlu: result.botUser.nlu}, {_nlp: _nlpRaw});
            } else {
                callback(_in, {_nlu: ""}, {_nlp: ""});
            }
        });
    }
}

exports.processInput = processInput;

// var nlptest = {
//   action: function (task, context, callback) {
//
//     async.waterfall([
//       function(cb) {
//         var inRaw = '장세영에게 010-6316-5683으로 전화해줘';
//         var nlpKo = new nlp({
//           stemmer: true,      // (optional default: true)
//           normalizer: true,   // (optional default: true)
//           spamfilter: false     // (optional default: false)
//         });
//
//         var sentenceType = [
//           'declarative',    // 평서문
//           'imperative',     // 명령
//           'exclamatory',    // 감탄
//           'interrogative'   // 질문
//         ];
//
//         var _sentenceType = '';
//         var _in = '';
//         var _nlp = [];
//         nlpKo.tokenize(inRaw, function(err, result) {
//           for(var i in result) {
//             // console.log(result[i].text);
//             if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
//           }
//
//           _in = _nlp.join(' ');
//
//           for(var i in result) {
//             if(result[i].text === '?') _sentenceType = 'interrogative';
//             // else if(result[i].text === '!') _sentenceType = 'exclamatory';
//           }
//
//           if(_sentenceType === '') _sentenceType = 'declarative';
//
//           console.log(JSON.stringify(result));
//           console.log(JSON.stringify(_nlp));
//           console.log(_in);
//           console.log(_sentenceType);
//           cb();
//         });
//       }
//     ], function(err) {
//       callback(task, context);
//     })
//
//   }
// };
//
// bot.setTask('nlptest', nlptest);


function nlpTest(callback) {
    // var model = mongoModule.getModel('DialogsetDialog');
    //
    // model.find({}, function(err, docs) {
    //   if(docs != null) {
    //     async.eachSeries(docs, function(doc, cb) {
    //       multiNLP(doc._doc.inputRaw, function(result, result1) {
    //         var info = analyzeSentence(doc._doc.inputRaw, result, result1);
    //         // makeTone(doc._doc.inputRaw, result, result1, info, 0);
    //         console.log('');
    //         cb();
    //       });
    //     })
    //   }
    // });

    async.eachSeries(samples, function(doc, cb) {
        multiNLP(doc, function(result, result1) {
            var info = analyzeSentence(doc, result, result1);
            makeTone(doc, result, result1, info, '합쇼체');
            console.log('');
            cb();
        });
    });

    // var info = path.parse(infile);
    // fileutil.streamLineSequence(infile, function(result, line, cb) {
    //   if(isNaN(result) == false) {
    //     var inRaw = line;
    //     console.log(inRaw);
    //
    //     var nlpKo1 = new nlp({
    //       stemmer: false,      // (optional default: true)
    //       normalizer: true,   // (optional default: true)
    //       spamfilter: false     // (optional default: false)
    //     });
    //
    //     var _in = '';
    //     var _nlpRaw = [];
    //     var _nlp = [];
    //     nlpKo1.tokenize(inRaw, function(err, result) {
    //       for(var i in result) {
    //         if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
    //         /*if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result[i].text);
    //       }
    //
    //       _in = _nlp.join(' ');
    //
    //       console.log(_in);
    //       // console.log(JSON.stringify(result));
    //
    //       var nlpKo = new nlp({
    //         stemmer: true,      // (optional default: true)
    //         normalizer: true,   // (optional default: true)
    //         spamfilter: false     // (optional default: false)
    //       });
    //
    //       _in = '';
    //       _nlpRaw = [];
    //       _nlp = [];
    //       nlpKo.tokenize(inRaw, function(err, result1) {
    //         for (var i in result1) {
    //           if (result1[i].pos !== 'Josa' && result1[i].pos !== 'Punctuation') _nlpRaw.push(result1[i]);
    //           /*if (result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result1[i].text);
    //         }
    //
    //         _in = _nlp.join(' ');
    //
    //         console.log(_in);
    //         // console.log(JSON.stringify(result1));
    //
    //         var info = analyzeSentence(line, result, result1);
    //         makeTone(line, result, result1, info, 0);
    //
    //         console.log('');
    //
    //         cb();
    //       });
    //     });
    //
    //   } else {
    //     console.log(infile + ' 완료');
    //     callback(result);
    //     // console.log(result);
    //   }
    // });
}

exports.nlpTest = nlpTest;

function multiNLP(inRaw, callback) {
    console.log(inRaw);

    var nlpKo1 = new nlp({
        stemmer: false,      // (optional default: true)
        normalizer: true,   // (optional default: true)
        spamfilter: false     // (optional default: false)
    });

    var _in = '';
    var _nlpRaw = [];
    var _nlp = [];
    nlpKo1.tokenize(inRaw, function(err, result) {
        for(var i in result) {
            if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
            /*if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result[i].text);
        }

        _in = _nlp.join(' ');

        // console.log(_in);
        // console.log(JSON.stringify(result));

        var nlpKo = new nlp({
            stemmer: true,      // (optional default: true)
            normalizer: true,   // (optional default: true)
            spamfilter: false     // (optional default: false)
        });

        _in = '';
        _nlpRaw = [];
        _nlp = [];
        nlpKo.tokenize(inRaw, function(err, result1) {
            for (var i in result1) {
                if (result1[i].pos !== 'Josa' && result1[i].pos !== 'Punctuation') _nlpRaw.push(result1[i]);
                /*if (result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result1[i].text);
            }

            _in = _nlp.join(' ');

            console.log(_in);
            // console.log(JSON.stringify(result1));

            callback(result, result1);
        });
    });
}


function analyzeSentence(text, result1, result2) {
    var sentenceType = undefined;                // 0. 평서문 1. 의문문 2. 명령 3. 청유 4. 감탄
    var toneType = undefined;             // 합쇼체 하오체 하게체 해라체 해요체 해체
    var questionWord = undefined;         // 언제 어디 등 yesno
    var verbType = undefined;             // 0. 2. 형식 1. 3형식
    var tenseType = undefined;            // 1. 현재 2. 과거 3. 미래
    var aspectType = undefined;           // 0. 1. 진행 2. 완료 3. 완료진행
    var verbPos = undefined;          // 동사 위치
    var verbEomi = undefined;         // 동사 어미
    var verbToken = undefined;        // 어미 변환이 필요한 동사 token

    for (var i = result2.length - 1; i >= 0; i--) {
        if(sentenceType != undefined && verbToken != undefined) break;

        var token = result2[i];
        var textToken = '';

        if(token.pos == 'Verb' || token.pos == 'Adjective' || token.pos == 'Josa') {
            var textToken = text.substring(token.offset);
            var _offset = textToken.search(/[\s0-9!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/);
            if(_offset != -1) textToken = textToken.substring(0, _offset);
        }

        if (token.pos == 'Punctuation' && token.text == '?') {
            sentenceType = 1;
            if(questionWord == undefined) questionWord = 'yesno';
        } else if(token.text == '누구' || token.text == '언제' ||
            token.text == '어디서' || token.text == '어디' ||
            token.text == '무엇' || token.text == '뭐' ||
            token.text == '어떻게' || token.text == '왜' || token.text == '얼마나') {
            sentenceType = 1;
            questionWord = token.text;
        }

        if(textToken.endsWith('야') || textToken.endsWith('어') || textToken.endsWith('지') || textToken.endsWith('니') || textToken.endsWith('나')) {
            verbToken = token;
            if(sentenceType == undefined)  sentenceType = 0;
            toneType = '해체';
        } else if(textToken.endsWith('해') || textToken.endsWith('하지')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 2;
            toneType = '해체';
            // } else if(textToken.endsWith('해') || textToken.endsWith('하지')) {
            //   verbToken = token;
            //   sentenceType = 3;
            //   toneType = '해체';

        } else if(textToken.endsWith('나요') || textToken.endsWith('해요') || textToken.endsWith('예요')) {
            verbToken = token;
            if(sentenceType == undefined)  sentenceType = 0;
            toneType = '해요체';
        } else if(textToken.endsWith('세요') || textToken.endsWith('셔요') ||textToken.endsWith('해요') ||
            textToken.endsWith('주세요')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 2;
            toneType = '해요체';
            // } else if(textToken.endsWith('하세요') ||textToken.endsWith('하셔요') ||textToken.endsWith('해요')) {
            //   verbToken = token;
            //   sentenceType = 3;
            //   toneType = '해요체';

        } else if(textToken.endsWith('십니다') || textToken.endsWith('니다') || textToken.endsWith('니다') ||
            textToken.endsWith('니다') || textToken.endsWith('소서') ||
            textToken.endsWith('나이다') || textToken.endsWith('올시다')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 0;
            toneType = '합쇼체';

        } else if(textToken.endsWith('니까')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 1;
            toneType = '합쇼체';
        } else if(textToken.endsWith('십시오')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 2;
            toneType = '합쇼체';
        } else if(textToken.endsWith('십시다') || textToken.endsWith('시지요')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 3;
            toneType = '합쇼체';
            // } else if(textToken.endsWith('하시오') || textToken.endsWith('하오') || textToken.endsWith('이오') ||
            //   // textToken.endsWith('소') || textToken.endsWith('오') ||
            //   textToken.endsWith('리다') || textToken.endsWith('디다')) {
            //   verbToken = token;
            //   sentenceType = 0;
            //   toneType = '하오체';
            // } else if(textToken.endsWith('하시오') || textToken.endsWith('하오') || textToken.endsWith('이오')
            //   // textToken.endsWith('소') || textToken.endsWith('오')
            //   ) {
            //   verbToken = token;
            //   sentenceType = 1;
            //   toneType = '하오체';
        } else if(textToken.endsWith('시오') || textToken.endsWith('하오') || textToken.endsWith('하구려')
        // textToken.endsWith('시오')
        ) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 2;
            toneType = '하오체';
        } else if(textToken.endsWith('시다')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 3;
            toneType = '하오체';
        } else if(textToken.endsWith('하네') || textToken.endsWith('이네')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 0;
            toneType = '하게체';
        } else if(textToken.endsWith('하는가') || textToken.endsWith('하나') || textToken.endsWith('이나')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 1;
            toneType = '하게체';
        } else if(textToken.endsWith('하게') || textToken.endsWith('하구려')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 2;
            toneType = '하게체';
        } else if(textToken.endsWith('하세')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 3;
            toneType = '하게체';
        } else if(textToken.endsWith('하다') || textToken.endsWith('한다') || textToken.endsWith('이다')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 0;
            toneType = '해라체';
        } else if(textToken.endsWith('하느냐') || textToken.endsWith('하냐') || textToken.endsWith('하니') ||
            textToken.endsWith('이냐') || textToken.endsWith('이니')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 1;
            toneType = '해라체';
        } else if(textToken.endsWith('해라') || textToken.endsWith('하려무나') || textToken.endsWith('하렴')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 2;
            toneType = '해라체';
        } else if(textToken.endsWith('하자')) {
            verbToken = token;
            if(sentenceType == undefined) sentenceType = 3;
            toneType = '해라체';
        } else if(token.pos == 'Verb' || token.pos == 'Adjective' ||
            token.text == '하다' || token.text == '이다' || token.text == '있다' ||
            token.text == '해주다' || token.text == '줄다') {
            verbToken = token;
        }
    }

    if(verbToken) {
        var _text = text.substring(verbToken.offset);
        var _offset = _text.search(/[\s0-9!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/);
        if(_offset != -1) _text = _text.substring(0, _offset);

        var _pos = -1;
        for(var j = 0; j < Math.min(verbToken.text.length, _text.length); j++) {
            if(verbToken.text.charAt(j) != _text.charAt(j)) {
                _pos = j;
                break;
            }
        }

        if(_pos != -1) verbEomi = _text.substring(_pos);
        else verbEomi = '';

        if(verbToken.text =='이다' ||
            (verbToken.text == '야' && verbToken.pos == 'Josa') ||
            (verbToken.text == '예요' && verbToken.pos == 'Josa')) {

            verbType = 0;
            verbPos = verbToken.offset;

        } else if(verbToken.text == '해주다' ||
            (verbToken.text == '해' && verbToken.pos == 'Josa') ||
            (verbToken.text == '줄다' && verbToken.pos == 'Verb')) {

            verbType = 1;
            verbPos = verbToken.offset + verbToken.text.indexOf('해');

        } else if(verbToken.text.endsWith('하다')) {
            verbType = 1;
            verbPos = verbToken.offset + verbToken.text.indexOf('하다');
        }
    }

    if(sentenceType == undefined) sentenceType = 0;

    var info = {sentenceType: sentenceType, toneType: toneType, questionWord: questionWord, verbType: verbType, tenseType: tenseType, aspectType: aspectType,
        verbPos: verbPos, verbEomi: verbEomi, verbToken: verbToken};

    console.log('analyzeSentence: ' + JSON.stringify(info));

    return info;
}


exports.analyzeSentence = analyzeSentence;

function makeTone(text, result1, result2, info, toneType) {
    var eomi = '';

    if(toneType == '합쇼체') {
        if(info.verbType == 0) {
            if(info.sentenceType == 0) eomi = '입니다';
            else if(info.sentenceType == 1) eomi = '입니까';
            else if(info.sentenceType == 2) eomi = '입시오';
            else if(info.sentenceType == 3) eomi = '입시다';
            else eomi = '입니다';
        } else if(info.verbType == 1) {
            if(info.sentenceType == 0) eomi = '합니다';
            else if(info.sentenceType == 1) eomi = '합니까';
            else if(info.sentenceType == 2) eomi = '하십시오';
            else if(info.sentenceType == 3) eomi = '하십시다';
            else eomi = '합니다';
        }
    } else if(toneType == '하오체') {
        if(info.verbType == 0) {
            if(info.sentenceType == 0) eomi = '이오';
            else if(info.sentenceType == 1) eomi = '이오';
            else if(info.sentenceType == 2) eomi = '입시오';
            else if(info.sentenceType == 3) eomi = '입시다';
            else eomi = '이오';
        } else if(info.verbType == 1) {
            if(info.sentenceType == 0) eomi = '하오';
            else if(info.sentenceType == 1) eomi = '하오';
            else if(info.sentenceType == 2) eomi = '하오';
            else if(info.sentenceType == 3) eomi = '합시다';
            else eomi = '하오';
        }
    } else if(toneType == '하게체') {
        if(info.verbType == 0) {
            if(info.sentenceType == 0) eomi = '이네';
            else if(info.sentenceType == 1) eomi = '인가';
            else if(info.sentenceType == 2) eomi = '이게';
            else if(info.sentenceType == 3) eomi = '이세';
            else eomi = '이오';
        } else if(info.verbType == 1) {
            if(info.sentenceType == 0) eomi = '하네';
            else if(info.sentenceType == 1) eomi = '하는가';
            else if(info.sentenceType == 2) eomi = '하게';
            else if(info.sentenceType == 3) eomi = '하세';
            else eomi = '하네';
        }
    } else if(toneType == '해라체') {
        if(info.verbType == 0) {
            if(info.sentenceType == 0) eomi = '이다';
            else if(info.sentenceType == 1) eomi = '이나';
            else if(info.sentenceType == 2) eomi = '이라';
            else if(info.sentenceType == 3) eomi = '이자';
            else eomi = '이오';
        } else if(info.verbType == 1) {
            if(info.sentenceType == 0) eomi = '한다';
            else if(info.sentenceType == 1) eomi = '하니';
            else if(info.sentenceType == 2) eomi = '해라';
            else if(info.sentenceType == 3) eomi = '하자';
            else eomi = '한다';
        }
    } else if(toneType == '해요체') {
        if(info.verbType == 0) {
            if(info.sentenceType == 0) eomi = '예요';
            else if(info.sentenceType == 1) eomi = '인가요';
            else if(info.sentenceType == 2) eomi = '이요';
            else if(info.sentenceType == 3) eomi = '이요';
            else eomi = '예요';
        } else if(info.verbType == 1) {
            if(info.sentenceType == 0) eomi = '해요';
            else if(info.sentenceType == 1) eomi = '하나요';
            else if(info.sentenceType == 2) eomi = '해주세요';
            else if(info.sentenceType == 3) eomi = '해주세요';
            else eomi = '해요';
        }
    } else if(toneType == '해체') {
        if(info.verbType == 0) {
            if(info.sentenceType == 0) eomi = '야';
            else if(info.sentenceType == 1) eomi = '야';
            else if(info.sentenceType == 2) eomi = '야';
            else if(info.sentenceType == 3) eomi = '야';
            else eomi = '이오';
        } else if(info.verbType == 1) {
            if(info.sentenceType == 0) eomi = '해';
            else if(info.sentenceType == 1) eomi = '해';
            else if(info.sentenceType == 2) eomi = '해';
            else if(info.sentenceType == 3) eomi = '해';
            else eomi = '하오';
        }
    }

    if(info.verbPos != undefined) {
        var _text = text.replace(text.substring(info.verbPos, text.length), eomi);
        console.log(_text);
    }

}

function KorToJaso(str) {
    var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
        cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
        cho, jung, jong;

    var cnt = str.length,
        chars = [],
        cCode;

    for (var i = 0; i < cnt; i++) {
        cCode = str.charCodeAt(i);

        if (cCode == 32) { continue; }

        // 한글이 아닌 경우
        if (cCode < 0xAC00 || cCode > 0xD7A3) {
            chars.push(str.charAt(i));
            continue;
        }

        cCode  = str.charCodeAt(i) - 0xAC00;

        jong = cCode % 28; // 종성
        jung = ((cCode - jong) / 28 ) % 21 // 중성
        cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

        chars.push(cCho[cho], cJung[jung]);
        if (cJong[jong] !== '') { chars.push(cJong[jong]); }
    }

    return chars;
}

var samples = [
    '한국어를 처리하는 예시입니다.',
    '한국어를 처리하는 예시이다.',
    '한국어를 처리하는 예시야.',
    '한국어를 처리하는 예시예요.',
    '한국어를 처리하는 것을 좋아합니다.',
    '한국어를 처리하는 것을 좋아하다.',
    '한국어를 처리하는 것을 좋아해.',
    '한국어를 처리하는 것을 좋아해요.',
    '한국어를 처리하는 것을 좋아하나요?',
    '한국어를 처리 해줄래.',
    '한국어를 처리해.',
    '한국어를 처리해 주세요.',
    '한국어를 처리해 주십시오.',
    '장모님 있어?',
    '도착해서 나한테 전화 해줘.',
    '시간 날때 가보자.',
    '내일 대학원 갔다 오는 거야?',
    '먼데 어떻게 가?',
    '응 뚱 빨리 코자',
    '갑자기?',
    '유치원 체육대회 토요일이야 일요일이야?',
    '주말에 놀러오라구 했는데 괜찮지?',
    '일단해.',
    '왔을때 고쳐.',
    '지윤이 몇호',
    '아가 토니스트래치 오늘 왔나?',
    '장모님 있어?',
    '수정해 달라구 해',
    '응 지윤이가 고민해서 판단해',
    '지윤 뚱이 사봐',
    '누구랑 할꺼야?',
    '언제 할꺼야?',
    '어디서 할꺼야?',
    '어떻게 할꺼야?',
    '왜 할꺼야?',
    '얼마나 할꺼야?'
];


var faqType = {
    name: 'typeDoc',
    typeCheck: type.dialogTypeCheck, //type.mongoDbTypeCheck,
    // preType: function(task, context, type, callback) {
    //   type.mongo.queryStatic.dialogset = bot.dialogset;
    //   callback(task, context);
    // },
    limit: 5,
    matchRate: 0.5,
    mongo: {
        model: 'dialogsetdialogs',
        // queryStatic: {dialogset: ''},
        queryFields: ['input'],
        fields: 'input output' ,
        taskFields: ['input', 'output', 'matchRate'],
        minMatch: 1
    }
};

var faqDialog = {
    input: {types: [faqType]},
    task:   {
        action: function(task, context, callback) {
            console.log(JSON.stringify(task.typeDoc));
            if(Array.isArray(task.typeDoc)) {
                if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
                else task._output = task.typeDoc[0].output;
            } else {
                task._output = task.typeDoc.output;
            }
            callback(task, context);
        }
        // postCallback: function(task, context, callback) {
        //   var toneType = context.botUser.tone;
        //   if(toneType == undefined) toneType = '해요체';
        //
        //   tone.toneSentence(task._output, toneType, function(_output) {
        //     task._output = _output;
        //     callback(task, context);
        //   });
        // }
    },
    output: '+_output+'
};

exports.faqDialog = faqDialog;

function preProcessDialog(dialogset, callback) {
    var wordCount = {};

    async.waterfall([
        function(cb) {
            var wordCountFunc = function(input) {
                if(!input.startsWith(':')) {
                    var words = input.split(' ');
                    for(var i in words) {
                        if(words[i].length > 1) wordCount[words[i]] = wordCount.hasOwnProperty(words[i]) ? wordCount[words[i]] + 1 : 1;
                    }
                }
            };

            var wordCountNLPFunc = function(words) {
                for(var i in words) {
                    if(words[i].text.length > 1 && (words[i].pos == 'Noun'/* || words[i].pos == 'Verb' || words[i].pos == 'Adjective'*/))
                        wordCount[words[i].text] = wordCount.hasOwnProperty(words[i].text) ? wordCount[words[i].text] + 1 : 1;
                }
            };

            var query = {dialogset: dialogset};
            var DialogsetDialog = mongoose.model('DialogsetDialog');
            DialogsetDialog.find(query).lean().exec(function(err, docs) {

                async.eachSeries(docs, function(doc, cb2) {
                    if(Array.isArray(doc.input)) {
                        async.eachSeries(doc.input, function(input, cb3) {
                            processInput(null, input, function(_in, _nlu, result) {
                                wordCountNLPFunc(result._nlp);
                                cb3(null);
                            })
                        }, function(err3) {
                            cb2(null);
                        })

                    } else {
                        processInput(null, doc.input, function(_in, _nlu, result) {
                            wordCountNLPFunc(result._nlp);
                            cb2(null);
                        })
                    }
                }, function(err2) {
                    cb(null);
                });

            })
        },

        function(cb) {
            var wordArray = [];
            for(var i in wordCount) {
                wordArray.push({word: i, count: wordCount[i]});
            }

            wordArray.sort(function(a, b) {
                if(b.count > a.count) return 1;
                else if(b.count < a.count) return -1;
                else return 0;
            });

            dialogset.topicKeywords = [];

            for(var i in wordArray) {
                var w = wordArray[i];

                if(w.count > 10 && !_.includes(commonWords, w.word)) {
                    dialogset.topicKeywords.push(w.word);
                    // console.log(w.word + ' ' + w.count);
                }
            }

            console.log('topics: ' + dialogset.topicKeywords.join(', '));

            // for(var i in wordCount) {
            //   if(wordCount[i] > 5) console.log(i + ':' + wordCount[i]);
            // }

            cb(null);
        },

        function(cb) {
            dialogset.save(function(err) {
                cb(null);
            })
        }

    ], function(err) {
        if(callback) callback(dialogset);
    });
}
