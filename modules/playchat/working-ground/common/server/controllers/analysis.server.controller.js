var XLSX = require('xlsx');

module.exports.exelDownload = function (req, res) {
    function datenum(v, date1904) {
        if(date1904) v+=1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function sheet_from_array_of_arrays(data, opts) {
        var ws = {};
        var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
        if(opts){
            for(var C = 0; C != data.length; ++C) {
                for(var R = 0; R != data[C].length; ++R) {
                    if(range.s.r > R) range.s.r = R;
                    if(range.s.c > C) range.s.c = C;
                    if(range.e.r < R) range.e.r = R;
                    if(range.e.c < C) range.e.c = C;
                    var cell = {v: data[C][R] };
                    if(cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                    if(typeof cell.v === 'number') cell.t = 'n';
                    else if(typeof cell.v === 'boolean') cell.t = 'b';
                    else if(cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[22];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
        }else {
            for(var R = 0; R != data.length; ++R) {
                for(var C = 0; C != data[R].length; ++C) {
                    if(range.s.r > R) range.s.r = R;
                    if(range.s.c > C) range.s.c = C;
                    if(range.e.r < R) range.e.r = R;
                    if(range.e.c < C) range.e.c = C;
                    var cell = {v: data[R][C] };
                    if(cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                    if(typeof cell.v === 'number') cell.t = 'n';
                    else if(typeof cell.v === 'boolean') cell.t = 'b';
                    else if(cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[22];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
        }
        if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    }
    function Workbook() {
        if(!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }

    var data = [];
    req.body.data.columnOrder.forEach(function (doc) {
        data.push([doc]);
    });
    req.body.data.orderedData.forEach(function (doc) {
        data.forEach(function (_doc) {
            _doc.push(doc[_doc[0]])
        });
    });
    var wb = new Workbook();
    var ws = sheet_from_array_of_arrays(data, req.body.transpose);
    var ws_name = req.body.data.sheetName;
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    var wbout = XLSX.write(wb, wopts);
    res.json(wbout);
};

module.exports.scenarioExelDownload = function (req, res) {
    var startYear =  parseInt(req.body.date.start.split('/')[0]);
    var startMonth = parseInt(req.body.date.start.split('/')[1]);
    var startDay =   parseInt(req.body.date.start.split('/')[2]);
    var endYear =  parseInt(req.body.date.end.split('/')[0]);
    var endMonth = parseInt(req.body.date.end.split('/')[1]);
    var endDay =   parseInt(req.body.date.end.split('/')[2]);
    var cond = {
        inOut: true,
        botId: req.params.bId,
        // channel: {$ne: "socket"},
        created: {$gte: moment.utc([startYear, startMonth - 1, startDay]).subtract(9*60*60, "seconds").toDate(), $lte: moment.utc([endYear, endMonth - 1, endDay,  23, 59, 59, 999]).subtract(9*60*60, "seconds").toDate()},

    };
    UserDialog.aggregate([
        {$match: cond},
        {$project:
            {
                _id: 0,
                dialogName:1,
                created: {$add:["$created", 9*60*60*1000]},
                kakao: {$cond:[{$eq: ["$channel", "kakao"]}, 1,0]},
                facebook: {$cond:[{$eq: ["$channel", "facebook"]}, 1,0]},
                navertalk: {$cond:[{$eq: ["$channel", "navertalk"]}, 1,0]}
            }
        },
        {$group:
            {
                _id: {
                    dialogName: '$dialogName',
                    year: { $year: "$created" },
                    month: { $month: "$created" },
                    day: { $dayOfMonth: "$created" }
                },
                total: {$sum: 1},
                kakao: {$sum: "$kakao"},
                facebook: {$sum: "$facebook"},
                navertalk: {$sum: "$navertalk"}
            }
        },
        {$sort: {_id: -1, day: -1}}
    ]).exec(function (err, scenarioUsage) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            async.waterfall([
                function (cb) {
                    if(global._bot && global._bot[req.params.bId]) {
                        var botScenario = global._bot[req.params.bId];
                        cb(null, botScenario)
                    }else {
                        botLib.loadBot(req.params.bId, function (realbot) {
                            var botScenario = realbot.dialogs;
                            cb(null, botScenario)
                        });
                    }
                }, function (botScenario, cb) {
                    var maxDepth = 0;
                    var scenarioIndex = {};
                    var depth = "1";
                    var indexing = function (scenario, depth, index) {
                        var newDepth;
                        newDepth = depth + "-" + index;
                        scenarioIndex[newDepth] = scenario.name;
                        if(newDepth.match(/-/g).length > maxDepth) maxDepth = newDepth.match(/-/g).length;
                        if(scenario.children){
                            scenario.children.forEach(function (child, index) {
                                index++;
                                index = index.toString();
                                var prefix = "";
                                for(var i = 0; i < index.length-1; i++){
                                    prefix = prefix + "a"
                                }
                                indexing(child, newDepth, prefix + index)
                            })
                        }
                    };

                    for(var i = 0; i < botScenario.length; i++){
                        if(!botScenario[i].name) {
                            continue;
                        }else{
                            var prefix = "";
                            for(var j = 0; j < depth.length-1; j++){
                                prefix = prefix + "a"
                            }
                            scenarioIndex[prefix + depth] = botScenario[i].name;
                        }
                        if(botScenario[i].children){
                            botScenario[i].children.forEach(function (child, index) {
                                index++;
                                index = index.toString();
                                var prefix2 = "";
                                for(var k = 0; k < index.length-1; k++){
                                    prefix2 = prefix2 + "a"
                                }
                                indexing(child, depth, prefix2 + index)
                            });
                        }
                        depth = parseInt(depth.replace(prefix, "")) + 1;
                        depth = depth.toString();
                    }

                    var orderedScenarioDialogName = [];
                    var indexArray = [];
                    Object.keys(scenarioIndex).forEach(function (index) {
                        indexArray.push(index);
                    });
                    indexArray.sort();
                    indexArray.forEach(function (index) {
                        orderedScenarioDialogName.push(scenarioIndex[index]);
                    });



                    var dateObj = {};
                    var dateArray = [];

                    var year = startYear;
                    var month = startMonth;
                    var day = startDay;

                    for(var i = startDay;((day != endDay) || (month != endMonth) ||  (year != endYear)) && i<100; i++){
                        var date = new Date(startYear, startMonth - 1, i);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();

                        dateObj[year + '-'+ month + '-' + day] = {};
                        dateArray.push(year + '-'+ month + '-' + day);
                    }

                    scenarioUsage.forEach(function (doc) {
                        dateObj[doc._id.year + '-' + doc._id.month + '-' + doc._id.day][doc._id.dialogName] =
                            {
                                kakao: doc.kakao,
                                facebook: doc.facebook,
                                navertalk: doc.navertalk
                            };
                    });

                    var exelData = [];

                    var channelMenu = ["채널"];
                    for(var i = 0; i < maxDepth + 1; i ++){
                        channelMenu.push(null);
                    }
                    var kakao = [];
                    var facebook = [];
                    var navertalk = [];
                    for(var i = 0; i < dateArray.length; i++){
                        kakao.push("kakao");
                        facebook.push("facebook");
                        navertalk.push("navertalk");
                    }
                    exelData.push(channelMenu.concat(kakao, facebook, navertalk));

                    var dateMenu = ["날짜"];
                    for(var i = 0; i < maxDepth + 1; i ++){
                        dateMenu.push(null);
                    }
                    exelData.push(dateMenu.concat(dateArray, dateArray, dateArray));

                    orderedScenarioDialogName.forEach(function (dialogName, index) {
                        var scenarioDailyData = [];
                        var depth = (indexArray[index].match(/-/g) || []).length;
                        for(var i = 0; i < depth; i ++){
                            scenarioDailyData.push(null);
                        }
                        scenarioDailyData.push(indexArray[index] + '.' + dialogName);
                        for(var i = 0; i < maxDepth - depth; i ++){
                            scenarioDailyData.push(null);
                        }
                        scenarioDailyData.push(null);

                        var kakaoArray = [];
                        var facebookArray = [];
                        var navertalkArray = [];
                        dateArray.forEach(function (date) {
                            if(dateObj[date][dialogName]){
                                kakaoArray.push(dateObj[date][dialogName].kakao);
                                facebookArray.push(dateObj[date][dialogName].facebook);
                                navertalkArray.push(dateObj[date][dialogName].navertalk);
                            }else {
                                kakaoArray.push(0);
                                facebookArray.push(0);
                                navertalkArray.push(0);
                            }
                        });
                        scenarioDailyData = scenarioDailyData.concat(kakaoArray, facebookArray, navertalkArray);
                        exelData.push(scenarioDailyData);
                    });

                    function datenum(v, date1904) {
                        if(date1904) v+=1462;
                        var epoch = Date.parse(v);
                        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
                    }
                    function sheet_from_array_of_arrays(data, opts) {
                        var ws = {};
                        var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                        for(var R = 0; R != data.length; ++R) {
                            for(var C = 0; C != data[R].length; ++C) {
                                if(range.s.r > R) range.s.r = R;
                                if(range.s.c > C) range.s.c = C;
                                if(range.e.r < R) range.e.r = R;
                                if(range.e.c < C) range.e.c = C;
                                var cell = {v: data[R][C] };
                                if(cell.v == null) continue;
                                var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                                if(typeof cell.v === 'number') cell.t = 'n';
                                else if(typeof cell.v === 'boolean') cell.t = 'b';
                                else if(cell.v instanceof Date) {
                                    cell.t = 'n'; cell.z = XLSX.SSF._table[22];
                                    cell.v = datenum(cell.v);
                                }
                                else cell.t = 's';

                                ws[cell_ref] = cell;
                            }
                        }
                        if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                        return ws;
                    }
                    function Workbook() {
                        if(!(this instanceof Workbook)) return new Workbook();
                        this.SheetNames = [];
                        this.Sheets = {};
                    }

                    var wb = new Workbook();
                    var ws = sheet_from_array_of_arrays(exelData);
                    var ws_name = "시나리오별 사용량";
                    wb.SheetNames.push(ws_name);
                    wb.Sheets[ws_name] = ws;

                    var merges = wb.Sheets[ws_name]['!merges'] = [];
                    var alphabetIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                    var alphabetFunc = function (index) {
                        var result = "";
                        var quotient = Math.floor((index - 1) / 26);
                        var remainder = (index - 1) % 26;
                        if(quotient) result = alphabetIndex[quotient - 1];
                        if(remainder) result = result + alphabetIndex[remainder];
                        return result;
                    };
                    var menuLength = maxDepth+2;
                    var dateLength = dateArray.length - 1;

                    merges.push({ s: 'A1', e: alphabetFunc(menuLength) + '1' });
                    merges.push({ s: 'A2', e: alphabetFunc(menuLength) + '2' });

                    var kakaoLength = menuLength + 1 + dateLength;
                    var facebookLength = kakaoLength + 1 + dateLength;
                    var navertalkLength = facebookLength + 1 + dateLength;

                    merges.push({ s: alphabetFunc(menuLength + 1) + '1', e: alphabetFunc(kakaoLength) + '1' });
                    merges.push({ s: alphabetFunc(kakaoLength + 1) + '1', e: alphabetFunc(facebookLength) + '1' });
                    merges.push({ s: alphabetFunc(facebookLength + 1) + '1', e: alphabetFunc(navertalkLength) + '1' });

                    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
                    var wbout = XLSX.write(wb, wopts);
                    res.json(wbout);
                    cb(null)
                }
            ], function (err) {
            });
        }
    });
};
