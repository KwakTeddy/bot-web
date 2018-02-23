
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


    bot.setType("deanlist2", {
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
                   if (context.session.membername.indexOf(dialog.userInput.text) !== -1) {
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

	bot.setTask('event2month1',
	{
		action: function (dialog, context, callback)
		{
            if (dialog.userInput.text.indexOf("1") >= 0) {
                dialog.output[0].text = "다이어트 부위별 집중 + 3kg,  감량제 프로그램과 비만패키지 다이어트 관리 가 있습니다";
            }
            else if (dialog.userInput.text.indexOf("2") >= 0) {
                dialog.output[0].text = "감량제는 부가세 별도 19만원과 39만원이 있으며 비만pck은 30만원대부터 100만원대까지 다양하게 있습니다";
            }
            else if (dialog.userInput.text.indexOf("3") >= 0) {
                dialog.output[0].text = "감량제는 4주프로그램 3kg 입니다 개인차마다 틀리지만 식단과 생활적인 습관 등 잘지켜주신다면 만족하는 효과를 기대할수 있습니다";
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
    bot.setTask('event2month2',
        {
            action: function (dialog, context, callback)
            {
                if (dialog.userInput.text.indexOf("1") >= 0) {
                    dialog.output[0].text = "상태를 봐야하지만 보통 1-2주부터 가능하십니다 ";
                }
                else if (dialog.userInput.text.indexOf("2") >= 0) {
                    dialog.output[0].text = "3max고주파와 엔더몰로지 관리를  추천합니다 ";
                }
                else if (dialog.userInput.text.indexOf("3") >= 0) {
                    dialog.output[0].text = "부가세 별도 1회 20만원 입니다 본원에 이벤트 중인 관리도 있으니 자세한 내용은 전화상담으로 안내해드리겠습니다";
                }
                else if (dialog.userInput.text.indexOf("4") >= 0) {
                    dialog.output[0].text = "당연히 효과가 있습니다 지방흡인후 생길수 있는 피부의 유착 울퉁불퉁 탄력 저하등 전후 관리를 통해 확실하게 케어해드립니다";
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

	bot.setTask('start', 
	{
		action: function (dialog, context, callback)
		{
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
                        if (body[0].image2 !== "" || body[0].image2 !== undefined) {
                            dialog.output[0].image = {url: body[0].image2}
                        }
                        callback();
                    }
                });
            }
        });

	bot.setTask('nlp_원장',
	{
		action: function (dialog, context, callback)
		{
            var modelname = 'dermatology_moneybrain_member';
            var options = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            if (dialog.userInput.text.indexOf("성형") >= 0) {
                options.qs = {
                    department: "성형"
                };
                dialog.output[0].text = "성형 파트 의료진을 소개합니다.";
            }
            else if (dialog.userInput.text.indexOf("다이어트") >= 0 || dialog.userInput.text.indexOf("몸무게") >= 0) {
                options.qs = {
                    department: "다이어트"
                };
                dialog.output[0].text = "다이어트 파트 의료진을 소개합니다.";
            }
            else if (dialog.userInput.text.indexOf("피부") >= 0) {
                options.qs = {
                    department:{ $in:["피부","피부(+성형실리프팅)"]}
                };
                dialog.output[0].text = "피부 파트 의료진을 소개합니다.";
            }

            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                    callback();
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    dialog.output[0].buttons = [];
                    for (var i = 0; i < body.length; i++) {
                        var ss = "" + (i + 1) + ". " + body[i].name + " 원장";
                        dialog.output[0].buttons.push({text: ss});
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
};
