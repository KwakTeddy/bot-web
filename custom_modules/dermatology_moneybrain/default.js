
var path = require('path');
var request = require('request');

var SERVER_HOST = 'http://template-dev.moneybrain.ai:8443';

module.exports = function(bot) {
    bot.setTask("defaultTask",
        {
            name: 'defaultTask',
            action: function (dialog, context, callback) {
                callback();
            }
        });

    bot.setTask('introduction',
        {
            action: function (dialog, context, callback) {
                var modelname = 'dermatology_moneybrain_company';
                var options = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                options.qs = {
                    name: "포에버성형외과"
                };

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                        callback();
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.introduction = body;
                        if (body[0].image !== "" || body[0].image !== undefined) {
                            dialog.output[0].image = {url: body[0].image}
                        }
                        dialog.output[0].buttons = [
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            }
                        ];
                        callback();
                    }
                });
            }
        });

    bot.setTask('transportation',
        {
            action: function (dialog, context, callback) {
                var modelname = 'dermatology_moneybrain_transportation';
                var options = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                options.qs = {
                    company: "포에버성형외과"
                };

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                        callback();
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.transportation = body;
                        if (body[0].image !== "" || body[0].image !== undefined) {
                            dialog.output[0].image = {url: body[0].image}
                        }
                        dialog.output[0].buttons = [
                            {
                                text: "1.버스"
                            },
                            {
                                text: "2.지하철"
                            },
                            {
                                text: "3.자가용"
                            },
                            {
                                text: "지도보기",
                                url: body[0].map
                            },
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            }
                        ];
                        callback();
                    }
                });
            }
        });

    bot.setTask('transportationway',
        {
            action: function (dialog, context, callback) {
                if (dialog.userInput.text.indexOf("버스") >= 0) {
                    dialog.output[0].text = context.session.transportation[0].bus + "\n\n" + context.session.transportation[0].notice;
                }
                else if (dialog.userInput.text.indexOf("지하철") >= 0) {
                    dialog.output[0].text = context.session.transportation[0].subway + "\n\n" + context.session.transportation[0].notice;
                }
                else {
                    dialog.output[0].text = context.session.transportation[0].notice;
                }

                if (context.session.transportation[0].image !== "" || context.session.transportation[0].image !== undefined) {
                    dialog.output[0].image = {url: context.session.transportation[0].image}
                }
                dialog.output[0].buttons = [
                    {
                        text: "지도보기",
                        url: context.session.transportation[0].map
                    },
                    {
                        text: "이전으로 가기"
                    },
                    {
                        text: "처음으로 돌아가기"
                    }
                ];
                callback();
            }
        });

    bot.setTask('dean',
        {
            action: function (dialog, context, callback) {
                var modelname = 'dermatology_moneybrain_member';
                var options = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                options.qs = {
                    company: "포에버성형외과"
                };

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                        callback();
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);
                        context.session.member = body;

                        dialog.output[0].buttons = [];

                        for (var i = 0; i < body.length; i++) {
                            var ss = "" + (i + 1) + ". " + body[i].name + " 원장";
                            dialog.output[0].buttons.push({text: ss})
                        }
                        dialog.output[0].buttons.push(
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            }
                        );
                        callback();
                    }
                });
            }
        });

    bot.setType("deanlist", {
        typeCheck: function (dialog, context, callback) {
            var modelname = 'dermatology_moneybrain_member';
            var options = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            options.qs = {
                company: "포에버성형외과"
            };

            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                    callback();
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);
                    context.session.member = body;

                    context.session.membername = [];
                    for (var ll = 0; ll < context.session.member.length; ll++) {
                        context.session.membername.push(context.session.member[ll].name);
                    }
                    var text = dialog.userInput.text.split(".");
                    if (text[1] !== undefined) {
                        text[1] = text[1].trim();
                        var text1 = text[1].split(" ");

                        for (var i = 0; i < context.session.member.length; i++) {
                            if (context.session.member[i].name.indexOf(text1[0]) !== -1) {
                                dialog.userInput.types.deanlist = context.session.member[i];
                                return callback(true);
                            }
                        }
                    }
                    else if (!isNaN(dialog.userInput.text)) {
                        for (var j = 0; j < context.session.member.length; j++) {
                            var ss = j + 1;
                            if (ss == dialog.userInput.text) {
                                dialog.userInput.types.deanlist = context.session.member[j];
                                return callback(true);
                            }
                        }
                    }
                    else if (context.session.membername.indexOf(dialog.userInput.text) !== -1) {
                        var mm = context.session.membername.indexOf(dialog.userInput.text);
                        dialog.userInput.types.deanlist = context.session.member[mm];
                        return callback(true);
                    }
                    callback(false);
                }
            });
        }
    });

	bot.setTask('showdean',
        {
            action: function (dialog, context, callback) {
                context.session.selecteddean = [];
                for (var i = 0; i < context.session.member.length; i++) {
                    if (context.session.member[i].name.indexOf(dialog.userInput.types.deanlist.name) !== -1) {
                        context.session.selecteddean.push(context.session.member[i]);
                    }
                }
                if (context.session.selecteddean[0].image !== undefined || context.session.selecteddean[0].image !== "") {
                    dialog.output[0].image = {url: context.session.selecteddean[0].image}
                }
                dialog.output[0].buttons = [
                    {
                        text: "이전으로 가기"
                    },
                    {
                        text: "처음으로 돌아가기"
                    }
                ];
                callback();
            }
        });

	bot.setTask('nlp_transportation',
        {
            action: function (dialog, context, callback) {
                var modelname = 'dermatology_moneybrain_transportation';
                var options = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                options.qs = {
                    company: "포에버성형외과"
                };

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                        callback();
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.transportation = body;

                        if (dialog.userInput.text.indexOf("버스") >= 0) {
                            dialog.output[0].text = context.session.transportation[0].bus + "\n\n" + context.session.transportation[0].notice;
                        }
                        else if (dialog.userInput.text.indexOf("지하철") >= 0) {
                            dialog.output[0].text = context.session.transportation[0].subway + "\n\n" + context.session.transportation[0].notice;
                        }
                        else if (dialog.userInput.text.indexOf("자가용") >= 0) {
                            dialog.output[0].text = context.session.transportation[0].notice;
                        }

                        if (context.session.transportation[0].image !== "" || context.session.transportation[0].image !== undefined) {
                            dialog.output[0].image = {url: context.session.transportation[0].image}
                        }
                        dialog.output[0].buttons = [
                            {
                                text: "지도보기",
                                url: context.session.transportation[0].map
                            },
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            }
                        ];
                        callback();
                    }
                });
            }
        });
};
