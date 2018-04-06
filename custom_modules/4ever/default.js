
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
            var modelname = 'dermatology_moneybrain_event';
            var options = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            if (dialog.userInput.text.indexOf("성형") >= 0 || dialog.userInput.text==="1" ) {
                options.qs = {
                    company: "포에버성형외과",
                    month:"4",
                    year:"2018",
                    category:"성형"
                };
               // dialog.output[0].text = "가슴 성형 이벤트 아래와 같습니다.";
            }
            else if (dialog.userInput.text.indexOf("피부") >= 0 || dialog.userInput.text==="2" ) {
                options.qs = {
                    company: "포에버성형외과",
                    month:"4",
                    year:"2018",
                    category:"피부"
                };
              // dialog.output[0].text = "지방 흡입 다이어트 이벤트 아래와 같습니다.";
            }
            else if (dialog.userInput.text.indexOf("한정") >= 0  || dialog.userInput.text==="3" ) {
                options.qs = {
                    company: "포에버성형외과",
                    month:"4",
                    year:"2018",
                    category:"한정 이벤트"
                };
               // dialog.output[0].text = "애플힙 이벤트 아래와 같습니다.";
            }
            else if (dialog.userInput.text.indexOf("그 외") >= 0  || dialog.userInput.text==="4") {
                options.qs = {
                    company: "포에버성형외과",
                    month:"4",
                    year:"2018",
                    category:"그 외 4월 이벤트"
                };
              //  dialog.output[0].text = "그 외 3월 이벤트 아래와 같습니다.";
            }

            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                    callback();
                }
                else {
                    body = JSON.parse(body);
                    context.session.body=body;
                    console.log(response.statusCode);

                    dialog.output[1].buttons = [];


                        for (var i = 0; i < body.length; i++) {
                            var ss = "" + (i + 1) + ". " + body[i].name;
                            dialog.output[1].buttons.push({text: ss});
                        }

                    dialog.output[1].buttons.push(
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


    bot.setType("eventlist", {
        typeCheck: function (dialog, context, callback) {
            var modelname = 'dermatology_moneybrain_event';
            var options = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            options.qs = {
                company: "포에버성형외과",
                month:"3",
                year:"2018"
            };

            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                    callback();
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);
                    for(var i=0;i<body.length;i++){
                        if(dialog.userInput.text.indexOf(body[i].name)!==-1){
                        context.session.event=body[i];
                            callback(true);
                        }
                    }
                    callback(false);
                }
            });
        }
    });

    bot.setTask('showevent',
        {
            action: function (dialog, context, callback) {
                var modelname = 'dermatology_moneybrain_event';
                var options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                var name=dialog.userInput.text.split('.');
                if( name[1])
                {
                    name[1] = name[1].trim();
                }
                else
                {
                    name[1]=context.session.body[dialog.userInput.text-1].name;
                }

                    options.qs = {
                        company: "포에버성형외과",
                        month:"4",
                        year:"2018",
                        name:name[1]
                    };

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                        callback();
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);
                        context.session.event=body[0];
                        if(context.session.event.price!=="") {
                            if (context.session.event.image !== undefined || context.session.event.image !== "") {
                                dialog.output[0].image = {url: context.session.event.image}
                            }
                            dialog.output[0].buttons = [
                                {
                                    text: "자세히 보기",
                                    url: (context.session.event.imagebig? context.session.event.imagebig : context.session.event.image)
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
                        else {
                            if (context.session.event.image !== undefined || context.session.event.image !== "") {
                                dialog.output[1].image = {url: context.session.event.image}
                            }
                            dialog.output[1].buttons = [
                                {
                                    text: "자세히 보기",
                                    url: (context.session.event.imagebig? context.session.event.imagebig : context.session.event.image)
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
                    }
                });

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
                            dialog.output[0].image = {url: (body[0].image2.startsWith('http') ? body[0].image2 : config.host + body[0].image2)}
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
                    department: "성형",
                    company: "포에버성형외과"
                };
                dialog.output[0].text = "성형 파트 의료진을 소개합니다.";
            }
            else if (dialog.userInput.text.indexOf("다이어트") >= 0 || dialog.userInput.text.indexOf("몸무게") >= 0) {
                options.qs = {
                    department: "다이어트",
                    company: "포에버성형외과"
                };
                dialog.output[0].text = "다이어트 파트 의료진을 소개합니다.";
            }
            else if (dialog.userInput.text.indexOf("피부") >= 0) {
                options.qs = {
                    department:{ $in:["피부","피부(+성형실리프팅)"]},
                    company: "포에버성형외과"
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
