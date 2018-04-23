var request = require('request');
var http = require('http');
var superagent = require('superagent');
var cheerio = require('cheerio');

var coin = [];
var ICO_active = [];
var ICO_upcoming = [];
var Url = "https://coinmarketcap.com/";
var Url1 = "https://icodrops.com/category/active-ico/";
var Url2 = "https://icodrops.com/category/upcoming-ico/";
var SERVER_HOST = 'http://template-dev.moneybrain.ai:8443';

var modelname = '';
var options = {};
module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        action: function(dialog, context, callback)
        {
            callback();
        }
    });

	bot.setTask('ChangeLanguage', 
	{
		action: function (dialog, context, callback)
		{
          if(dialog.userInut.text==='한국어'){
            context.session.language='ko'
          }
          else if(dialog.userInut.text==='中文'){
             context.session.language='ch'
          }
          else{
             context.session.language='en'
          }
			callback();
		}
	});

	bot.setTask('UpdateUser',
	{
		action: function (dialog, context, callback) {
		    console.log("context.session.IsNew:==="+context.session.IsNew);
            if(context.session.IsNew==='not') {
                modelname = 'bitcoinbot_user';
                options = {};

                options.qs = {userKey: context.user.userKey};
                options.json = {
                    updateTime: new Date().toISOString()
                };
                options.url = SERVER_HOST + '/api/' + modelname;
                request.put(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        console.log("updatuser！   response.statusCode=" + response.statusCode);
                        callback();
                    }
                });
            }
            else{
                if(dialog.userInput.text==="Talk now!") {
                    context.session.IsNew = 'not';
                    modelname = 'bitcoinbot_user';
                    options = {};

                    options.json = {
                        Language: context.session.language ? context.session.language : "en",
                        Created: new Date().toISOString(),
                        updateTime: new Date().toISOString(),
                        userKey: context.user.userKey,
                        LoginDays: '0'
                    };
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("newuser！   response.statusCode=" + response.statusCode);
                            callback();
                        }
                    });
                }
                else{
                    callback();
                }
                // context.session.IsNew=undefined;
                // callback();
            }
        }

	});


	bot.setTask('coinprice', 
	{
		action: function (dialog, context, callback)
		{
            modelname = 'bitcoin_coinmarketcap';
            options = {};

            options.qs = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else {
                    // console.log("updatuser！   response.statusCode=" + response.statusCode);
                    dialog.output[0].buttons = [];
                    body = JSON.parse(body);
                    var index = [];
                    for (var j = 0; j < body.length; j++) {
                        // 
                        body[j].updateTime = Number(body[j].updateTime);
                        if (!body[j].rate) {
                            index.push(j);
                        }
                    }

                    for (var s = 0; s < index.length; s++) {
                        delete body[index[s]];
                    }

                    body = body.sort(function (a, b) {
                        return a.rate - b.rate;
                    });

                    var nowtime = new Date().getTime();
                    var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                    crawling(difference,body);
                }

                });

            var crawling = function(difference,body){

                if(difference >= 1) {

                    superagent.get(Url)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kind = $('tbody tr');
                            // console.log('kind=======' + kind);
                            for (var i = 0; i < kind.length; i++) {
                                coin[i] = {};
                                coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                if (!coin[i].image) {
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                }
                                coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                // coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                            }
                            // console.log('coin=======' + JSON.stringify(coin));
                            // console.log('coin.length=======' + coin.length);

                            for (var j = 0; j < coin.length; j++) {
                                update(j)
                            }
                        });
                }
                else {
                    context.session.coinsprice = body;
                    dialog.output[0].buttons = [];
                    for (var i = 0; i < 15; i++) {
                        var name = "" + (i + 1) + ". " + body[i].shortname;
                        var price = body[i].price;
                        dialog.output[0].buttons.push({text: name + " " + price});
                    }
                    dialog.output[0].buttons.push({text: 'MORE'});
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                }
            };

                        var update = function (index) {

                            options = {};
                            options.url = SERVER_HOST + '/api/' + modelname;

                            options.qs = {name: coin[index].name};
                            options.json = {
                                url: coin[index].url,
                                shortname: coin[index].shortname,
                                image: coin[index].image,
                                price: coin[index].price,
                                volume: coin[index].volume,
                                change: coin[index].change,
                                graph: coin[index].graph,
                                graphimage: coin[index].graphimage,
                                updateTime: new Date().getTime(),
                                rate: coin[index].rate
                            };

                            request.put(options, function (err, response, body) {

                                if (err) {

                                    console.log(err);
                                    callback();
                                }
                                else if (body.nModified === '0') {

                                    save1(index);
                                }
                                else {
                                    // console.log("update！   response.statusCode=" + response.statusCode);
                                    if(index===coin.length-1){
                                        show();
                                    }
                                }
                            })
                        };

                        var save1 = function (index) {
                            options = {};
                            options.url = SERVER_HOST + '/api/' + modelname;

                            options.json = {
                                name: coin[index].name,
                                url: coin[index].url,
                                shortname: coin[index].shortname,
                                image: coin[index].image,
                                price: coin[index].price,
                                volume: coin[index].volume,
                                change: coin[index].change,
                                graph: coin[index].graph,
                                graphimage: coin[index].graphimage,
                                created: new Date().toISOString(),
                                updateTime: new Date().getTime(),
                                rate: coin[index].rate
                            };

                            request.post(options, function (err, response, body) {
                                if (err) {
                                    console.log(err);
                                    callback();
                                }
                                else {
                                    // console.log("new！   response.statusCode=" + response.statusCode);
                                    if(index===coin.length-1){
                                        show();
                                    }
                                }
                            })
                        };

                        var show = function () {

                            modelname = 'bitcoin_coinmarketcap';
                            options = {};

                            options.qs = {};
                            options.url = SERVER_HOST + '/api/' + modelname;
                            request.get(options, function (err, response, body) {
                                if (err) {
                                    console.log(err);
                                    callback();
                                }
                                else {

                                    // console.log("updatuser！   response.statusCode=" + response.statusCode);
                                    show2(body);
                                }
                            });

                        };

                        var show2 = function (body) {

                            body = JSON.parse(body);
                            context.session.coinsprice = body;
                            var index = [];
                            for (var j = 0; j < body.length; j++) {
                                // 
                                body[j].updateTime = Number(body[j].updateTime);
                                if (!body[j].rate) {
                                    index.push(j);
                                }
                            }

                            for (var s = 0; s < index.length; s++) {
                                delete body[index[s]];
                            }

                            body = body.sort(function (a, b) {
                                return a.rate - b.rate;
                            });
                            dialog.output[0].buttons = [];
                            for (var i = 0; i < 15; i++) {
                                var name = "" + (i + 1) + ". " + body[i].shortname;
                                var price = body[i].price;
                                dialog.output[0].buttons.push({text: name + " " + price});
                            }
                            dialog.output[0].buttons.push({text: 'MORE'});
                            dialog.output[0].buttons.push({text: 'Back'});
                            dialog.output[0].buttons.push({text: 'Start'});
                            callback();
                        };

		}
	});


    bot.setTask('coinprice1',
        {
            action: function (dialog, context, callback)
            {
                modelname = 'bitcoin_coinmarketcap';
                options = {};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        var index = [];
                        for (var j = 0; j < body.length; j++) {
                            
                            body[j].updateTime = Number(body[j].updateTime);
                            if (!body[j].rate) {
                                index.push(j);
                            }
                        }

                        for (var s = 0; s < index.length; s++) {
                            delete body[index[s]];
                        }

                        body = body.sort(function (a, b) {
                            return a.rate - b.rate;
                        });

                        var nowtime = new Date().getTime();
                        var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                        crawling(difference,body);
                    }

                });

                var crawling = function(difference,body){
                    if(difference >= 1) {
                        superagent.get(Url)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');
                                // console.log('kind=======' + kind);
                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                                }
                                // console.log('coin=======' + JSON.stringify(coin));
                                // console.log('coin.length=======' + coin.length);

                                for (var j = 0; j < coin.length; j++) {
                                    update(j)
                                }
                            });
                    }
                    else {
                        context.session.coinsprice1 = body;
                        dialog.output[0].buttons = [];
                        for (var i = 15; i < 31; i++) {
                            var name = "" + (i + 1) + ". " + body[i].shortname;
                            var price = body[i].price;
                            dialog.output[0].buttons.push({text: name + " " + price});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };

                var update = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.qs = {name: coin[index].name};
                    options.json = {
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.put(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else if (body.nModified === '0') {
                            save1(index);
                        }
                        else {
                            // console.log("update！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var save1 = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin[index].name,
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("new！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function () {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            show2(body);
                        }
                    });

                };

                var show2 = function (body) {
                    body = JSON.parse(body);
                    context.session.coinsprice1 = body;
                    var index = [];
                    for (var j = 0; j < body.length; j++) {
                        
                        body[j].updateTime = Number(body[j].updateTime);
                        if (!body[j].rate) {
                            index.push(j);
                        }
                    }

                    for (var s = 0; s < index.length; s++) {
                        delete body[index[s]];
                    }

                    body = body.sort(function (a, b) {
                        return a.rate - b.rate;
                    });
                    dialog.output[0].buttons = [];
                    for (var i = 15; i < 31; i++) {
                        var name = "" + (i + 1) + ". " + body[i].shortname;
                        var price = body[i].price;
                        dialog.output[0].buttons.push({text: name + " " + price});
                    }
                    dialog.output[0].buttons.push({text: 'MORE'});
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                };

            }
        });

    bot.setTask('coinprice2',
        {
            action: function (dialog, context, callback)
            {
                modelname = 'bitcoin_coinmarketcap';
                options = {};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        var index = [];
                        for (var j = 0; j < body.length; j++) {
                            
                            body[j].updateTime = Number(body[j].updateTime);
                            if (!body[j].rate) {
                                index.push(j);
                            }
                        }

                        for (var s = 0; s < index.length; s++) {
                            delete body[index[s]];
                        }

                        body = body.sort(function (a, b) {
                            return a.rate - b.rate;
                        });

                        var nowtime = new Date().getTime();
                        var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                        crawling(difference,body);
                    }

                });

                var crawling = function(difference,body){
                    if(difference >= 1) {
                        superagent.get(Url)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');
                                // console.log('kind=======' + kind);
                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                                }
                                // console.log('coin=======' + JSON.stringify(coin));
                                // console.log('coin.length=======' + coin.length);

                                for (var j = 0; j < coin.length; j++) {
                                    update(j)
                                }
                            });
                    }
                    else {
                        context.session.coinsprice2 = body;
                        dialog.output[0].buttons = [];
                        for (var i = 31; i < 47; i++) {
                            var name = "" + (i + 1) + ". " + body[i].shortname;
                            var price = body[i].price;
                            dialog.output[0].buttons.push({text: name + " " + price});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };

                var update = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.qs = {name: coin[index].name};
                    options.json = {
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.put(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else if (body.nModified === '0') {
                            save1(index);
                        }
                        else {
                            // console.log("update！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var save1 = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin[index].name,
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("new！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function () {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            show2(body);
                        }
                    });

                };

                var show2 = function (body) {
                    body = JSON.parse(body);
                    context.session.coinsprice2 = body;
                    var index = [];
                    for (var j = 0; j < body.length; j++) {
                        
                        body[j].updateTime = Number(body[j].updateTime);
                        if (!body[j].rate) {
                            index.push(j);
                        }
                    }

                    for (var s = 0; s < index.length; s++) {
                        delete body[index[s]];
                    }

                    body = body.sort(function (a, b) {
                        return a.rate - b.rate;
                    });
                    dialog.output[0].buttons = [];
                    for (var i = 31; i < 47; i++) {
                        var name = "" + (i + 1) + ". " + body[i].shortname;
                        var price = body[i].price;
                        dialog.output[0].buttons.push({text: name + " " + price});
                    }
                    dialog.output[0].buttons.push({text: 'MORE'});
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                };

            }
        });

    bot.setTask('coinprice3',
        {
            action: function (dialog, context, callback)
            {
                modelname = 'bitcoin_coinmarketcap';
                options = {};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        var index = [];
                        for (var j = 0; j < body.length; j++) {
                            
                            body[j].updateTime = Number(body[j].updateTime);
                            if (!body[j].rate) {
                                index.push(j);
                            }
                        }

                        for (var s = 0; s < index.length; s++) {
                            delete body[index[s]];
                        }

                        body = body.sort(function (a, b) {
                            return a.rate - b.rate;
                        });

                        var nowtime = new Date().getTime();
                        var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                        crawling(difference,body);
                    }

                });

                var crawling = function(difference,body){
                    if(difference >= 1) {
                        superagent.get(Url)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');
                                // console.log('kind=======' + kind);
                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                                }
                                // console.log('coin=======' + JSON.stringify(coin));
                                // console.log('coin.length=======' + coin.length);

                                for (var j = 0; j < coin.length; j++) {
                                    update(j)
                                }
                            });
                    }
                    else {
                        context.session.coinsprice3 = body;
                        dialog.output[0].buttons = [];
                        for (var i = 47; i < 63; i++) {
                            var name = "" + (i + 1) + ". " + body[i].shortname;
                            var price = body[i].price;
                            dialog.output[0].buttons.push({text: name + " " + price});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };

                var update = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.qs = {name: coin[index].name};
                    options.json = {
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.put(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else if (body.nModified === '0') {
                            save1(index);
                        }
                        else {
                            // console.log("update！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var save1 = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin[index].name,
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("new！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function () {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            show2(body);
                        }
                    });

                };

                var show2 = function (body) {
                    body = JSON.parse(body);
                    context.session.coinsprice3 = body;
                    var index = [];
                    for (var j = 0; j < body.length; j++) {
                        
                        body[j].updateTime = Number(body[j].updateTime);
                        if (!body[j].rate) {
                            index.push(j);
                        }
                    }

                    for (var s = 0; s < index.length; s++) {
                        delete body[index[s]];
                    }

                    body = body.sort(function (a, b) {
                        return a.rate - b.rate;
                    });
                    dialog.output[0].buttons = [];
                    for (var i = 47; i < 63; i++) {
                        var name = "" + (i + 1) + ". " + body[i].shortname;
                        var price = body[i].price;
                        dialog.output[0].buttons.push({text: name + " " + price});
                    }
                    dialog.output[0].buttons.push({text: 'MORE'});
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                };

            }
        });

    bot.setTask('coinprice4',
        {
            action: function (dialog, context, callback)
            {
                modelname = 'bitcoin_coinmarketcap';
                options = {};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        var index = [];
                        for (var j = 0; j < body.length; j++) {
                            
                            body[j].updateTime = Number(body[j].updateTime);
                            if (!body[j].rate) {
                                index.push(j);
                            }
                        }

                        for (var s = 0; s < index.length; s++) {
                            delete body[index[s]];
                        }

                        body = body.sort(function (a, b) {
                            return a.rate - b.rate;
                        });

                        var nowtime = new Date().getTime();
                        var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                        crawling(difference,body);
                    }

                });

                var crawling = function(difference,body){
                    if(difference >= 1) {
                        superagent.get(Url)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');
                                // console.log('kind=======' + kind);
                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                                }
                                // console.log('coin=======' + JSON.stringify(coin));
                                // console.log('coin.length=======' + coin.length);

                                for (var j = 0; j < coin.length; j++) {
                                    update(j)
                                }
                            });
                    }
                    else {
                        context.session.coinsprice4 = body;
                        dialog.output[0].buttons = [];
                        for (var i = 63; i < 100; i++) {
                            var name = "" + (i + 1) + ". " + body[i].shortname;
                            var price = body[i].price;
                            dialog.output[0].buttons.push({text: name + " " + price});
                        }
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };

                var update = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.qs = {name: coin[index].name};
                    options.json = {
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.put(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else if (body.nModified === '0') {
                            save1(index);
                        }
                        else {
                            // console.log("update！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var save1 = function (index) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin[index].name,
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("new！   response.statusCode=" + response.statusCode);
                            if(index===coin.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function () {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            show2(body);
                        }
                    });

                };

                var show2 = function (body) {
                    body = JSON.parse(body);
                    context.session.coinsprice4 = body;
                    var index = [];
                    for (var j = 0; j < body.length; j++) {
                        body[j].updateTime = Number(body[j].updateTime);
                        if (!body[j].rate) {
                            index.push(j);
                        }
                    }

                    for (var s = 0; s < index.length; s++) {
                        delete body[index[s]];
                    }

                    body = body.sort(function (a, b) {
                        return a.rate - b.rate;
                    });

                    dialog.output[0].buttons = [];
                    for (var i = 63; i < 100; i++) {
                        var name = "" + (i + 1) + ". " + body[i].shortname;
                        var price = body[i].price;
                        dialog.output[0].buttons.push({text: name + " " + price});
                    }
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                };

            }
        });


    bot.setType('coins',
    {
        typeCheck: function (dialog, context, callback)
        {
            if(dialog.userInput.text.indexOf('.')===-1){
                matched = false;
                callback(matched);
            }
            else {
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('.')[1].split('$')[0].trim();
                var matched = false;
                var matchedcoin = "";
                var matchedindex = 0;
                modelname = 'bitcoin_coinmarketcap';
                options = {};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback(matched);
                    }
                    else {
                        body = JSON.parse(body);

                        for (var j = 0; j < body.length; j++) {

                            body[j].updateTime = Number(body[j].updateTime);
                            if (dialog.userInput.text === body[j].shortname) {
                                matchedcoin = body[j].name;
                                matchedindex = j;
                            }
                        }

                        var nowtime = new Date().getTime();
                        var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                        crawling(difference, body, matchedcoin, matchedindex);
                    }

                });

                var crawling = function (difference, body, matchedcoin, matchedindex) {

                    if (difference >= 0.5) {
                        superagent.get(Url)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');
                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    coin[i].graph = 'https://coinmarketcap.com/currencies/' + coin[i].name + '/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                                }

                                for (var j = 0; j < coin.length; j++) {
                                    update(j, matchedcoin)
                                }
                            });
                    }
                    else {
                        if (!matchedcoin) {
                            matched = false;
                            callback(matched);
                        }
                        else {
                            if (body[matchedindex].rate) {
                                context.session.coinsinfo = body[matchedindex];
                                console.log('SHOW!');
                                matched = true;
                                callback(matched);
                            }
                            else {
                                matched = false;
                                callback(matched);
                            }
                        }
                    }
                };

                var update = function (index, matchedcoin) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.qs = {name: coin[index].name};
                    options.json = {
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.put(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback(matched);
                        }
                        else if (body.nModified === '0') {
                            save1(index, matchedcoin);
                        }
                        else {
                            if (index === coin.length - 1) {
                                show(matchedcoin);
                            }
                        }
                    })
                };

                var save1 = function (index, matchedcoin) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin[index].name,
                        url: coin[index].url,
                        shortname: coin[index].shortname,
                        image: coin[index].image,
                        price: coin[index].price,
                        volume: coin[index].volume,
                        change: coin[index].change,
                        graph: coin[index].graph,
                        graphimage: coin[index].graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin[index].rate
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback(matched);
                        }
                        else {
                            if (index === coin.length - 1) {
                                show(matchedcoin);
                            }
                        }
                    })
                };

                var show = function (matchedcoin) {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {name: matchedcoin};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback(matched);
                        }
                        else {
                            matchedcoin = "";
                            matchedindex = 0;
                            body = JSON.parse(body);

                            for (var j = 0; j < body.length; j++) {
                                if (body[j].rate) {
                                    body[j].updateTime = Number(body[j].updateTime);
                                    if (dialog.userInput.text === body[j].shortname) {
                                        matchedcoin = body[j].name;
                                        matchedindex = j;
                                        j = body.length;
                                        show2(body, matchedcoin, matchedindex);

                                    }
                                    else {
                                        if (j === body.length - 1) {
                                            matched = false;
                                            callback(matched);
                                        }
                                    }
                                }
                                else {
                                    if (j === body.length - 1) {
                                        matched = false;
                                        callback(matched);
                                    }
                                }
                            }
                        }
                    });

                };

                var show2 = function (body, matchedcoin, matchedindex) {

                    if (!matchedcoin) {
                        matched = false;
                        callback(matched);
                    }
                    else {
                        if (body[matchedindex].rate) {
                            context.session.coinsinfo = body[matchedindex];
                            console.log('Update!');
                            matched = true;
                            callback(matched);
                        }
                        else {
                            matched = false;
                            callback(matched);
                        }
                    }
                }
            }
        }
    });


    bot.setType('coins2',
        {
            typeCheck: function (dialog, context, callback)
            {
                var matched = false;
                if(dialog.userInput.text==="1" || dialog.userInput.text==="2"){
                    matched = false;
                    return callback(matched);
                }
                else if(dialog.userInput.text.toUpperCase().indexOf('PRICE OF')>=0) {
                    dialog.userInput.text = dialog.userInput.text.toUpperCase().split('PRICE OF')[1].trim();
                }
                else if(dialog.userInput.text.toUpperCase().indexOf('PRICE')>=0){
                    dialog.userInput.text = dialog.userInput.text.toUpperCase().split('PRICE')[0].trim();
                }
                else if(dialog.userInput.text.toUpperCase().indexOf('RATE OF')>=0){
                    dialog.userInput.text = dialog.userInput.text.toUpperCase().split('RATE OF')[1].trim();
                }
                else if(dialog.userInput.text.toUpperCase().indexOf('RATE')>=0){
                    dialog.userInput.text = dialog.userInput.text.toUpperCase().split('RATE')[0].trim();
                }
                else{
                    matched = false;
                    callback(matched);
                }

        var matchedcoin = "";
        var matchedindex = 0;
        modelname = 'bitcoin_coinmarketcap';
        options = {};

        options.qs = {};
        options.url = SERVER_HOST + '/api/' + modelname;
        request.get(options, function (err, response, body) {
            if (err) {
                console.log(err);
                callback();
            }
            else {
                body = JSON.parse(body);

                for (var j = 0; j < body.length; j++) {

                    body[j].updateTime = Number(body[j].updateTime);
                    if(dialog.userInput.text===body[j].name || dialog.userInput.text===body[j].shortname){
                        matchedcoin = body[j].name;
                        matchedindex = j;
                    }
                }

                var nowtime = new Date().getTime();
                var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                crawling(difference,body,matchedcoin,matchedindex);
            }

        });

        var crawling = function(difference,body,matchedcoin,matchedindex){

            if (difference >= 0) {
                superagent.get(Url)
                    .end(function (err, pres) {
                        var $ = cheerio.load(pres.text);
                        var kind = $('tbody tr');
                        for (var i = 0; i < kind.length; i++) {
                            coin[i] = {};
                            coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                            coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                            coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                            coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                            if (!coin[i].image) {
                                coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                            }
                            coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                            coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                            coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                            coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                            coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                            coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                        }

                        for (var j = 0; j < coin.length; j++) {
                            update(j, matchedcoin)
                        }
                    });
            }
            else {
                if(!matchedcoin){
                    matched = false;
                    callback(matched);
                }
                else {
                    if (body[matchedindex].rate) {
                        context.session.coinsinfo = body[matchedindex];
                        console.log('SHOW!');
                        matched = true;
                       return callback(matched);
                    }
                    else {
                        matched = false;
                        callback(matched);
                    }
                }
            }
        };

        var update = function (index,matchedcoin) {
            options = {};
            options.url = SERVER_HOST + '/api/' + modelname;

            options.qs = {name: coin[index].name};
            options.json = {
                url: coin[index].url,
                shortname: coin[index].shortname,
                image: coin[index].image,
                price: coin[index].price,
                volume: coin[index].volume,
                change: coin[index].change,
                graph: coin[index].graph,
                graphimage: coin[index].graphimage,
                updateTime: new Date().getTime(),
                rate: coin[index].rate
            };

            request.put(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else if (body.nModified === '0') {
                    save1(index,matchedcoin);
                }
                else {
                    if(index===coin.length-1){
                        show(matchedcoin);
                    }
                }
            })
        };

        var save1 = function (index,matchedcoin) {
            options = {};
            options.url = SERVER_HOST + '/api/' + modelname;

            options.json = {
                name: coin[index].name,
                url: coin[index].url,
                shortname: coin[index].shortname,
                image: coin[index].image,
                price: coin[index].price,
                volume: coin[index].volume,
                change: coin[index].change,
                graph: coin[index].graph,
                graphimage: coin[index].graphimage,
                created: new Date().toISOString(),
                updateTime: new Date().getTime(),
                rate: coin[index].rate
            };

            request.post(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else {
                    if(index=== coin.length-1){
                        show(matchedcoin);
                    }
                }
            })
        };

        var show = function (matchedcoin) {
            modelname = 'bitcoin_coinmarketcap';
            options = {name: matchedcoin};

            options.qs = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else {
                    matchedcoin = "";
                    matchedindex = 0;
                    body = JSON.parse(body);

                    for (var j = 0; j < body.length; j++) {
                        if(body[j].rate) {
                            body[j].updateTime = Number(body[j].updateTime);
                            if(dialog.userInput.text === body[j].name || dialog.userInput.text===body[j].shortname){
                                matchedcoin = body[j].name;
                                matchedindex = j;
                                j = body.length;
                                show2(body,matchedcoin,matchedindex);
                            }
                            else{
                                if(j === body.length-1){
                                    matched = false;
                                  return  callback(matched);
                                }
                            }
                        }
                        else{
                            if(j === body.length-1) {
                                matched = false;
                              callback(matched);
                            }
                        }
                    }
                }
            });

        };

        var show2 = function (body,matchedcoin,matchedindex) {

            if (!matchedcoin) {
                matched = false;
                callback(matched);
            }
            else {
                if (body[matchedindex].rate) {
                    context.session.coinsinfo = body[matchedindex];
                    console.log('Update!');
                    matched = true;
                   callback(matched);
                }
                else {
                    matched = false;
                    callback(matched);
                }
            }
        }
    // }

}


        });


    bot.setTask('showcoins',
	{
		action: function (dialog, context, callback)
		{
            context.session.coinsinfo.name = context.session.coinsinfo.name.toLowerCase();
            context.session.coinsinfo.name = context.session.coinsinfo.name.charAt(0).toUpperCase()+context.session.coinsinfo.name.slice(1);
		    if(context.session.coinsinfo.graphimage.indexOf('.svg')=== -1) {
                dialog.output[0].image = {url: context.session.coinsinfo.graphimage};
                dialog.output[0].buttons = [
                    {
                        text: 'See price graph',
                        url: context.session.coinsinfo.graph
                    },
                    {
                        text: 'Specific Information',
                        url: context.session.coinsinfo.url
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();
            }
            else {
                dialog.output[0].text = ' Coin: '+context.session.coinsinfo.name+'\n'+
                'Shortname: '+context.session.coinsinfo.shortname+'\n'+
                'Price: '+context.session.coinsinfo.price+'\n'+
                'Volume(24h):  '+context.session.coinsinfo.volume+'\n'+
                'Change(24h): '+context.session.coinsinfo.change+'\n';
                dialog.output[0].buttons = [
                    {
                        text: 'See price graph',
                        url: context.session.coinsinfo.graph
                    },
                    {
                        text: 'Specific Information',
                        url: context.session.coinsinfo.url
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();
            }
		}
	});


	bot.setTask('activeICO', 
	{
        action: function (dialog, context, callback)
        {

            modelname = 'bitcoin_icodrops';
            options = {};
            var difference = 0;

                options.qs = {kind: 'active'};
            options.url = SERVER_HOST + '/api/' + modelname;
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else {
                    // console.log("updatuser！   response.statusCode=" + response.statusCode);
                    dialog.output[0].buttons = [];
                    body = JSON.parse(body);

if(body.length!==0){
    body[0].updateTime = Number(body[0].updateTime);

    var nowtime = new Date().getTime();
    difference = (nowtime - body[0].updateTime) / (60 * 60 * 1000);

    crawling(difference,body);
}
else{
    difference = 5;
    crawling(difference,body);
}
                }

            });

            var crawling = function(difference,body){

                if(difference >= 3) {
                    modelname = 'bitcoin_icodrops';
                    options = {};

                    options.qs = {kind: 'active'};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.delete(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("updatuser！   response.statusCode=" + response.statusCode);
                            console.log("delete!");
                            superagent.get(Url1)
                                .end(function (err, pres) {
                                    var $ = cheerio.load(pres.text);
                                    var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');
                                    // console.log('kind=======' + kind);
                                    for (var i = 0; i < kind.length; i++) {
                                        ICO_active[i] = {};
                                        ICO_active[i].url = kind.eq(i).find('h3 a').attr('href');
                                        ICO_active[i].name = kind.eq(i).find('h3 a').text();
                                        ICO_active[i].category = kind.eq(i).find('.ico-category-name').text();
                                        ICO_active[i].now_percent = kind.eq(i).find('#new_column_categ_invisted span.prec').text();
                                        if (ICO_active[i].now_percent === "") {
                                            ICO_active[i].now_percent = "0";
                                            ICO_active[i].now = "0";
                                        }
                                        else {
                                            ICO_active[i].now = kind.eq(i).find('#new_column_categ_invisted>span').text().split(ICO_active[i].now_percent)[0].replace(/[,]/g, "");
                                        }
                                        var goal = "$" + kind.eq(i).find('#categ_desctop').text().split("$")[1];
                                        ICO_active[i].goal = goal.replace(/[\t\n,]/g, "");
                                        ICO_active[i].date = kind.eq(i).find('div.date').attr('data-date');
                                        if (ICO_active[i].date === "") {
                                            ICO_active[i].date = 'TBA';
                                        }
                                        ICO_active[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                        if (ICO_active[i].rate === "") {
                                            ICO_active[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g, "");
                                            if (ICO_active[i].rate === "") {
                                                ICO_active[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                            }
                                        }
                                    }

                                    for(var j = 0; j < ICO_active.length; j++) {
                                        save1(j);
                                    }
                                });
                        }
                    });
                }
                else {
                    context.session.activeICO = body;
                    dialog.output[0].buttons = [];
                    for (var i = 0; i < 15; i++) {
                        var name = "" + (i + 1) + ". " + body[i].name;
                        var rate = body[i].rate;
                        dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                    }
                    dialog.output[0].buttons.push({text: 'MORE'});
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                }
            };


            var save1 = function (index) {
                modelname = 'bitcoin_icodrops';
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.json = {
                    kind: 'active',
                    url: ICO_active[index].url,
                    name: ICO_active[index].name.toUpperCase(),
                    category: ICO_active[index].category,
                    now_percent: ICO_active[index].now_percent,
                    now: ICO_active[index].now,
                    goal: ICO_active[index].goal,
                    date: ICO_active[index].date,
                    rate: ICO_active[index].rate,
                    created: new Date().toISOString(),
                    updateTime: new Date().getTime()
                };

                request.post(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        console.log("new！");
                        if(index === ICO_active.length-1){
                            show();
                        }
                    }
                })
            };

            var show = function(){

                modelname = 'bitcoin_icodrops';
                options = {};

                options.qs = {kind: 'active'};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        body = JSON.parse(body);

                        context.session.activeICO = body;

                        dialog.output[0].buttons = [];
                        for (var i = 0; i < 15; i++) {
                            var name = "" + (i + 1) + ". " + body[i].name;
                            var rate = body[i].rate;
                            dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                });
            };
        }
	});

    bot.setTask('activeICO1',
        {
            action: function (dialog, context, callback)
            {

                modelname = 'bitcoin_icodrops';
                options = {};
                var difference = 0;
                options.qs = {kind: 'active'};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        if(body.length!==0){
                            body[0].updateTime = Number(body[0].updateTime);

                            var nowtime = new Date().getTime();
                            difference = (nowtime - body[0].updateTime) / (60 * 60 * 1000);

                            crawling(difference,body);
                        }
                        else{
                            difference = 5;
                            crawling(difference,body);
                        }
                    }

                });

                var crawling = function(difference,body){

                    if(difference >= 3) {
                        modelname = 'bitcoin_icodrops';
                        options = {};

                        options.qs = {kind: 'active'};
                        options.url = SERVER_HOST + '/api/' + modelname;
                        request.delete(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                callback();
                            }
                            else {
                                console.log("updatuser！   response.statusCode=" + response.statusCode);
                                console.log("delete!");
                                superagent.get(Url1)
                                    .end(function (err, pres) {
                                        var $ = cheerio.load(pres.text);
                                        var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');
                                        // console.log('kind=======' + kind);
                                        for (var i = 0; i < kind.length; i++) {
                                            ICO_active[i] = {};
                                            ICO_active[i].url = kind.eq(i).find('h3 a').attr('href');
                                            ICO_active[i].name = kind.eq(i).find('h3 a').text();
                                            ICO_active[i].category = kind.eq(i).find('.ico-category-name').text();
                                            ICO_active[i].now_percent = kind.eq(i).find('#new_column_categ_invisted span.prec').text();
                                            if (ICO_active[i].now_percent === "") {
                                                ICO_active[i].now_percent = "0";
                                                ICO_active[i].now = "0";
                                            }
                                            else {
                                                ICO_active[i].now = kind.eq(i).find('#new_column_categ_invisted>span').text().split(ICO_active[i].now_percent)[0].replace(/[,]/g, "");
                                            }
                                            var goal = "$" + kind.eq(i).find('#categ_desctop').text().split("$")[1];
                                            ICO_active[i].goal = goal.replace(/[\t\n,]/g, "");
                                            ICO_active[i].date = kind.eq(i).find('div.date').attr('data-date');
                                            if (ICO_active[i].date === "") {
                                                ICO_active[i].date = 'TBA';
                                            }
                                            ICO_active[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                            if (ICO_active[i].rate === "") {
                                                ICO_active[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g, "");
                                                if (ICO_active[i].rate === "") {
                                                    ICO_active[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                                }
                                            }
                                        }

                                        for(var j = 0; j < ICO_active.length; j++) {
                                            save1(j);
                                        }
                                    });
                            }
                        });
                    }
                    else {
                        context.session.activeICO = body;
                        dialog.output[0].buttons = [];
                        for (var i = 15; i < body.length; i++) {
                            var name = "" + (i + 1) + ". " + body[i].name;
                            var rate = body[i].rate;
                            dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                        }
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };

                var save1 = function (index) {
                    modelname = 'bitcoin_icodrops';
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        kind: 'active',
                        url: ICO_active[index].url,
                        name: ICO_active[index].name.toUpperCase(),
                        category: ICO_active[index].category,
                        now_percent: ICO_active[index].now_percent,
                        now: ICO_active[index].now,
                        goal: ICO_active[index].goal,
                        date: ICO_active[index].date,
                        rate: ICO_active[index].rate,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime()
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("new！");
                            if(index === ICO_active.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function(){

                    modelname = 'bitcoin_icodrops';
                    options = {};

                    options.qs = {kind: 'active'};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            body = JSON.parse(body);

                            context.session.activeICO = body;

                            dialog.output[0].buttons = [];
                            for (var i = 15; i < body.length; i++) {
                                var name = "" + (i + 1) + ". " + body[i].name;
                                var rate = body[i].rate;
                                dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                            }
                            dialog.output[0].buttons.push({text: 'MORE'});
                            dialog.output[0].buttons.push({text: 'Back'});
                            dialog.output[0].buttons.push({text: 'Start'});
                            callback();
                        }
                    });
                };
            }
        });


	bot.setTask('upcomingICO', 
	{
		action: function (dialog, context, callback)
		{
            modelname = 'bitcoin_icodrops';
            options = {};
            var difference = 0;

            options.qs = {kind: 'upcoming'};
            options.url = SERVER_HOST + '/api/' + modelname;
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else {
                    // console.log("updatuser！   response.statusCode=" + response.statusCode);
                    dialog.output[0].buttons = [];
                    body = JSON.parse(body);
                    if(body.length!==0){
                        body[0].updateTime = Number(body[0].updateTime);

                        var nowtime = new Date().getTime();
                        difference = (nowtime - body[0].updateTime) / (60 * 60 * 1000);

                        crawling(difference,body);
                    }
                    else{
                        difference = 5;
                        crawling(difference,body);
                    }
                }

            });

            var crawling = function(difference,body){

                if(difference >= 3) {
                    modelname = 'bitcoin_icodrops';
                    options = {};

                    options.qs = {kind: 'upcoming'};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.delete(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("updatuser！   response.statusCode=" + response.statusCode);
                            console.log("delete!");
                            superagent.get(Url2)
                                .end(function (err, pres) {
                                    var $ = cheerio.load(pres.text);
                                    var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');
                                    // console.log('kind=======' + kind);
                                    for (var i = 0; i < kind.length; i++) {
                                        ICO_upcoming[i] = {};
                                        ICO_upcoming[i].url = kind.eq(i).find('h3 a').attr('href');
                                        ICO_upcoming[i].name = kind.eq(i).find('h3 a').text();
                                        ICO_upcoming[i].category = kind.eq(i).find('.categ_type').text();
                                        ICO_upcoming[i].now_percent = "0";
                                        ICO_upcoming[i].now = "0";
                                        var goal = kind.eq(i).find('#categ_desctop').text();
                                        if(goal.indexOf('$')>=0){
                                            ICO_upcoming[i].goal = goal.replace(/[\t\n,]/g, "");
                                        }
                                        else{
                                            ICO_upcoming[i].goal = "TBA";
                                        }
                                        ICO_upcoming[i].date = kind.eq(i).find('div.date').text().replace(/[\n\t]/g,"").replace(/DATE: /,"");
                                        ICO_upcoming[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                        if(ICO_upcoming[i].rate === ""){
                                            ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g,"");
                                            if(ICO_upcoming[i].rate === ""){
                                                ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                            }
                                        }
                                    }

                                    for(var j = 0; j < ICO_upcoming.length; j++) {
                                        save1(j);
                                    }
                                });
                        }
                    });
                }
                else {
                    context.session.upcomingICO = body;
                    dialog.output[0].buttons = [];
                    for (var i = 0; i < 15; i++) {
                        var name = "" + (i + 1) + ". " + body[i].name;
                        var rate = body[i].rate;
                        dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                    }
                    dialog.output[0].buttons.push({text: 'MORE'});
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                }
            };


            var save1 = function (index) {
                modelname = 'bitcoin_icodrops';
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.json = {
                    kind: 'upcoming',
                    url: ICO_upcoming[index].url,
                    name: ICO_upcoming[index].name.toUpperCase(),
                    category: ICO_upcoming[index].category,
                    now_percent: ICO_upcoming[index].now_percent,
                    now: ICO_upcoming[index].now,
                    goal: ICO_upcoming[index].goal,
                    date: ICO_upcoming[index].date,
                    rate: ICO_upcoming[index].rate,
                    created: new Date().toISOString(),
                    updateTime: new Date().getTime()
                };

                request.post(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        console.log("new！");
                        if(index === ICO_upcoming.length-1){
                            show();
                        }
                    }
                })
            };

            var show = function(){

                modelname = 'bitcoin_icodrops';
                options = {};

                options.qs = {kind: 'upcoming'};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        body = JSON.parse(body);

                        context.session.upcomingICO = body;

                        dialog.output[0].buttons = [];
                        for (var i = 0; i < 15; i++) {
                            var name = "" + (i + 1) + ". " + body[i].name;
                            var rate = body[i].rate;
                            dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                });
            };

		}
	});

    bot.setTask('upcomingICO1',
        {
            action: function (dialog, context, callback)
            {
                modelname = 'bitcoin_icodrops';
                options = {};
var difference = 0;
                options.qs = {kind: 'upcoming'};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        if(body.length!==0){
                            body[0].updateTime = Number(body[0].updateTime);

                            var nowtime = new Date().getTime();
                            difference = (nowtime - body[0].updateTime) / (60 * 60 * 1000);

                            crawling(difference,body);
                        }
                        else{
                            difference = 5;
                            crawling(difference,body);
                        }
                    }

                });

                var crawling = function(difference,body){

                    if(difference >= 3) {
                        modelname = 'bitcoin_icodrops';
                        options = {};

                        options.qs = {kind: 'upcoming'};
                        options.url = SERVER_HOST + '/api/' + modelname;
                        request.delete(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                callback();
                            }
                            else {
                                console.log("updatuser！   response.statusCode=" + response.statusCode);
                                console.log("delete!");
                                superagent.get(Url2)
                                    .end(function (err, pres) {
                                        var $ = cheerio.load(pres.text);
                                        var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');
                                        // console.log('kind=======' + kind);
                                        for (var i = 0; i < kind.length; i++) {
                                            ICO_upcoming[i] = {};
                                            ICO_upcoming[i].url = kind.eq(i).find('h3 a').attr('href');
                                            ICO_upcoming[i].name = kind.eq(i).find('h3 a').text();
                                            ICO_upcoming[i].category = kind.eq(i).find('.categ_type').text();
                                            ICO_upcoming[i].now_percent = "0";
                                            ICO_upcoming[i].now = "0";
                                            var goal = kind.eq(i).find('#categ_desctop').text();
                                            if(goal.indexOf('$')>=0){
                                                ICO_upcoming[i].goal = goal.replace(/[\t\n,]/g, "");
                                            }
                                            else{
                                                ICO_upcoming[i].goal = "TBA";
                                            }
                                            ICO_upcoming[i].date = kind.eq(i).find('div.date').text().replace(/[\n\t]/g,"").replace(/DATE: /,"");
                                            ICO_upcoming[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                            if(ICO_upcoming[i].rate === ""){
                                                ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g,"");
                                                if(ICO_upcoming[i].rate === ""){
                                                    ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                                }
                                            }
                                        }

                                        for(var j = 0; j < ICO_upcoming.length; j++) {
                                            save1(j);
                                        }
                                    });
                            }
                        });
                    }
                    else {
                        context.session.upcomingICO = body;
                        dialog.output[0].buttons = [];
                        for (var i = 15; i < 31; i++) {
                            var name = "" + (i + 1) + ". " + body[i].name;
                            var rate = body[i].rate;
                            dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };


                var save1 = function (index) {
                    modelname = 'bitcoin_icodrops';
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        kind: 'upcoming',
                        url: ICO_upcoming[index].url,
                        name: ICO_upcoming[index].name.toUpperCase(),
                        category: ICO_upcoming[index].category,
                        now_percent: ICO_upcoming[index].now_percent,
                        now: ICO_upcoming[index].now,
                        goal: ICO_upcoming[index].goal,
                        date: ICO_upcoming[index].date,
                        rate: ICO_upcoming[index].rate,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime()
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("new！");
                            if(index === ICO_upcoming.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function(){

                    modelname = 'bitcoin_icodrops';
                    options = {};

                    options.qs = {kind: 'upcoming'};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            body = JSON.parse(body);

                            context.session.upcomingICO = body;

                            dialog.output[0].buttons = [];
                            for (var i = 15; i < 31; i++) {
                                var name = "" + (i + 1) + ". " + body[i].name;
                                var rate = body[i].rate;
                                dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                            }
                            dialog.output[0].buttons.push({text: 'MORE'});
                            dialog.output[0].buttons.push({text: 'Back'});
                            dialog.output[0].buttons.push({text: 'Start'});
                            callback();
                        }
                    });
                };

            }
        });

    bot.setTask('upcomingICO2',
        {
            action: function (dialog, context, callback)
            {
                modelname = 'bitcoin_icodrops';
                options = {};
                 var difference = 0;
                options.qs = {kind: 'upcoming'};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        dialog.output[0].buttons = [];
                        body = JSON.parse(body);
                        if(body.length!==0){
                            body[0].updateTime = Number(body[0].updateTime);

                            var nowtime = new Date().getTime();
                            difference = (nowtime - body[0].updateTime) / (60 * 60 * 1000);

                            crawling(difference,body);
                        }
                        else{
                            difference = 5;
                            crawling(difference,body);
                        }
                    }

                });

                var crawling = function(difference,body){

                    if(difference >= 3) {
                        modelname = 'bitcoin_icodrops';
                        options = {};

                        options.qs = {kind: 'upcoming'};
                        options.url = SERVER_HOST + '/api/' + modelname;
                        request.delete(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                callback();
                            }
                            else {
                                console.log("updatuser！   response.statusCode=" + response.statusCode);
                                console.log("delete!");
                                superagent.get(Url2)
                                    .end(function (err, pres) {
                                        var $ = cheerio.load(pres.text);
                                        var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');
                                        // console.log('kind=======' + kind);
                                        for (var i = 0; i < kind.length; i++) {
                                            ICO_upcoming[i] = {};
                                            ICO_upcoming[i].url = kind.eq(i).find('h3 a').attr('href');
                                            ICO_upcoming[i].name = kind.eq(i).find('h3 a').text();
                                            ICO_upcoming[i].category = kind.eq(i).find('.categ_type').text();
                                            ICO_upcoming[i].now_percent = "0";
                                            ICO_upcoming[i].now = "0";
                                            var goal = kind.eq(i).find('#categ_desctop').text();
                                            if(goal.indexOf('$')>=0){
                                                ICO_upcoming[i].goal = goal.replace(/[\t\n,]/g, "");
                                            }
                                            else{
                                                ICO_upcoming[i].goal = "TBA";
                                            }
                                            ICO_upcoming[i].date = kind.eq(i).find('div.date').text().replace(/[\n\t]/g,"").replace(/DATE: /,"");
                                            ICO_upcoming[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                            if(ICO_upcoming[i].rate === ""){
                                                ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g,"");
                                                if(ICO_upcoming[i].rate === ""){
                                                    ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                                }
                                            }
                                        }

                                        for(var j = 0; j < ICO_upcoming.length; j++) {
                                            save1(j);
                                        }
                                    });
                            }
                        });
                    }
                    else {
                        context.session.upcomingICO = body;
                        dialog.output[0].buttons = [];
                        for (var i = 31; i < body.length; i++) {
                            var name = "" + (i + 1) + ". " + body[i].name;
                            var rate = body[i].rate;
                            dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                };


                var save1 = function (index) {
                    modelname = 'bitcoin_icodrops';
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        kind: 'upcoming',
                        url: ICO_upcoming[index].url,
                        name: ICO_upcoming[index].name.toUpperCase(),
                        category: ICO_upcoming[index].category,
                        now_percent: ICO_upcoming[index].now_percent,
                        now: ICO_upcoming[index].now,
                        goal: ICO_upcoming[index].goal,
                        date: ICO_upcoming[index].date,
                        rate: ICO_upcoming[index].rate,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime()
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("new！");
                            if(index === ICO_upcoming.length-1){
                                show();
                            }
                        }
                    })
                };

                var show = function(){

                    modelname = 'bitcoin_icodrops';
                    options = {};

                    options.qs = {kind: 'upcoming'};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            // console.log("updatuser！   response.statusCode=" + response.statusCode);
                            body = JSON.parse(body);

                            context.session.upcomingICO = body;

                            dialog.output[0].buttons = [];
                            for (var i = 31; i < body.length; i++) {
                                var name = "" + (i + 1) + ". " + body[i].name;
                                var rate = body[i].rate;
                                dialog.output[0].buttons.push({text: name + "\n[" + rate+']'});
                            }
                            dialog.output[0].buttons.push({text: 'Back'});
                            dialog.output[0].buttons.push({text: 'Start'});
                            callback();
                        }
                    });
                };

            }
        });

    bot.setType('activeICO',
    {
        typeCheck: function (dialog, context, callback)
        {
            if(dialog.userInput.text.indexOf('.')===-1){
                matched = false;
                callback(matched);
            }
            else {
                var matched = false;
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('.')[1].split('[')[0].trim();
                for (var i = 0; i < context.session.activeICO.length; i++) {
                    if (dialog.userInput.text === context.session.activeICO[i].name) {
                        context.session.ICOinfo = context.session.activeICO[i];
                        if (context.session.ICOinfo.now === '0') {
                            context.session.ICOinfo.now_percent = '0%';
                        }
                        matched = true;
                       return callback(matched);
                    }
                    else if(i === context.session.activeICO.length - 1){
                            matched = false;
                            callback(matched);
                        }
                }
            }
        }
    });

	bot.setTask('showICO', 
	{
		action: function (dialog, context, callback)
		{

                dialog.output[0].buttons = [

                    {
                        text: 'Specific Information',
                        url: context.session.ICOinfo.url
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();

		}
	});

    bot.setType('upcomingICO',
        {
            typeCheck: function (dialog, context, callback)
            {
                if(dialog.userInput.text.indexOf('.')===-1){
                    matched = false;
                    callback(matched);
                }
                else {
                    var matched = false;
                    dialog.userInput.text = dialog.userInput.text.toUpperCase().split('.')[1].split('[')[0].trim();
                    for (var i = 0; i < context.session.upcomingICO.length; i++) {
                        if (dialog.userInput.text === context.session.upcomingICO[i].name) {
                            context.session.ICOinfo1 = context.session.upcomingICO[i];

                            matched = true;
                            return callback(matched);
                        }
                        else {
                            if (i === context.session.upcomingICO.length-1) {
                                matched = false;
                                callback(matched);
                            }
                        }
                    }
                }
            }
        });

    bot.setTask('showICO1',
        {
            action: function (dialog, context, callback)
            {

                dialog.output[0].buttons = [

                    {
                        text: 'Specific Information',
                        url: context.session.ICOinfo1.url
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();

            }
        });

	bot.setTask('showchart', 
	{
		action: function (dialog, context, callback)
		{
            context.session.coinsinfo3.name = context.session.coinsinfo3.name.toLowerCase();
            context.session.coinsinfo3.name = context.session.coinsinfo3.name.charAt(0).toUpperCase()+context.session.coinsinfo3.name.slice(1);
            if(context.session.coinsinfo3.graphimage.indexOf('.svg')=== -1) {
                dialog.output[0].image = {url: context.session.coinsinfo3.graphimage};
                dialog.output[0].buttons = [
                    {
                        text: 'See price graph',
                        url: context.session.coinsinfo3.graph
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();
            }
            else {
                dialog.output[0].text = ' Coin: '+context.session.coinsinfo3.name+'\n'+
                    'Shortname: '+context.session.coinsinfo3.shortname+'\n'+
                    'Price: '+context.session.coinsinfo3.price+'\n'+
                    'Volume(24h):  '+context.session.coinsinfo3.volume+'\n'+
                    'Change(24h): '+context.session.coinsinfo3.change+'\n';
                dialog.output[0].buttons = [
                    {
                        text: 'See price graph',
                        url: context.session.coinsinfo3.graph
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();
            }
		}
	});
    bot.setType('chart',
    {
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            if(dialog.userInput.text==="1" || dialog.userInput.text==="2"){
                matched = false;
                return callback(matched);
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('PRICE CHART')>=0) {
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('PRICE CHART')[0].trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('CHART')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('CHART')[0].trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('PRICE GRAPH')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('PRICE GRAPH')[0].trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('GRAPH')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('GRAPH')[0].trim();
            }
            else{
                matched = false;
                callback(matched);
            }

            var matchedcoin = "";
            var matchedindex = 0;
            modelname = 'bitcoin_coinmarketcap';
            options = {};

            options.qs = {};
            options.url = SERVER_HOST + '/api/' + modelname;
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    callback();
                }
                else {
                    body = JSON.parse(body);

                    for (var j = 0; j < body.length; j++) {

                        body[j].updateTime = Number(body[j].updateTime);
                        if(dialog.userInput.text===body[j].name || dialog.userInput.text===body[j].shortname){
                            matchedcoin = body[j].name;
                            matchedindex = j;
                        }
                    }

                    var nowtime = new Date().getTime();
                    var difference = (nowtime - body[0].updateTime) / (60 * 1000);

                    crawling(difference,body,matchedcoin,matchedindex);
                }

            });

            var crawling = function(difference,body,matchedcoin,matchedindex){

                if (difference >= 0) {
                    superagent.get(Url)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kind = $('tbody tr');
                            for (var i = 0; i < kind.length; i++) {
                                coin[i] = {};
                                coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text().toUpperCase();
                                coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                if (!coin[i].image) {
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                }
                                coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                coin[i].rate = kind.eq(i).find('td.text-center').text().trim();

                            }

                            for (var j = 0; j < coin.length; j++) {
                                update(j, matchedcoin)
                            }
                        });
                }
                else {
                    if(!matchedcoin){
                        matched = false;
                        callback(matched);
                    }
                    else {
                        if (body[matchedindex].rate) {
                            context.session.coinsinfo3 = body[matchedindex];
                            console.log('SHOW!');
                            matched = true;
                            return callback(matched);
                        }
                        else {
                            matched = false;
                            callback(matched);
                        }
                    }
                }
            };

            var update = function (index,matchedcoin) {
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.qs = {name: coin[index].name};
                options.json = {
                    url: coin[index].url,
                    shortname: coin[index].shortname,
                    image: coin[index].image,
                    price: coin[index].price,
                    volume: coin[index].volume,
                    change: coin[index].change,
                    graph: coin[index].graph,
                    graphimage: coin[index].graphimage,
                    updateTime: new Date().getTime(),
                    rate: coin[index].rate
                };

                request.put(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else if (body.nModified === '0') {
                        save1(index,matchedcoin);
                    }
                    else {
                        if(index===coin.length-1){
                            show(matchedcoin);
                        }
                    }
                })
            };

            var save1 = function (index,matchedcoin) {
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.json = {
                    name: coin[index].name,
                    url: coin[index].url,
                    shortname: coin[index].shortname,
                    image: coin[index].image,
                    price: coin[index].price,
                    volume: coin[index].volume,
                    change: coin[index].change,
                    graph: coin[index].graph,
                    graphimage: coin[index].graphimage,
                    created: new Date().toISOString(),
                    updateTime: new Date().getTime(),
                    rate: coin[index].rate
                };

                request.post(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        if(index=== coin.length-1){
                            show(matchedcoin);
                        }
                    }
                })
            };

            var show = function (matchedcoin) {
                modelname = 'bitcoin_coinmarketcap';
                options = {name: matchedcoin};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        matchedcoin = "";
                        matchedindex = 0;
                        body = JSON.parse(body);

                        for (var j = 0; j < body.length; j++) {
                            if(body[j].rate) {
                                body[j].updateTime = Number(body[j].updateTime);
                                if(dialog.userInput.text === body[j].name || dialog.userInput.text===body[j].shortname){
                                    matchedcoin = body[j].name;
                                    matchedindex = j;
                                    console.log("code: "+ j);
                                    j = body.length;
                                    show2(body,matchedcoin,matchedindex);
                                }
                                else{
                                    if(j === body.length-1){
                                        matched = false;
                                        return  callback(matched);
                                    }
                                }
                            }
                            else{
                                if(j === body.length-1) {
                                    matched = false;
                                    callback(matched);
                                }
                            }
                        }
                    }
                });

            };

            var show2 = function (body,matchedcoin,matchedindex) {

                if (!matchedcoin) {
                    matched = false;
                    callback(matched);
                }
                else {
                    if (body[matchedindex].rate) {
                        context.session.coinsinfo3 = body[matchedindex];
                        console.log('Update!');
                        matched = true;
                        callback(matched);
                    }
                    else {
                        matched = false;
                        callback(matched);
                    }
                }
            }
        }
    });

    bot.setType('ico',
    {
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            if(dialog.userInput.text==="1" || dialog.userInput.text==="2"){
                matched = false;
                return callback(matched);
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('ICO')>=0) {
                dialog.userInput.text = dialog.userInput.text.toUpperCase().replace(/ICO/g,"").trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('ICO INFORMATION')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('ICO INFORMATION')[0].trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('ICO INFO')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('ICO INFO')[0].trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('ICO TIME')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('ICO TIME')[0].trim();
            }
            else if(dialog.userInput.text.toUpperCase().indexOf('WHEN IS THE')>=0 && dialog.userInput.text.toUpperCase().indexOf('ICO')>=0){
                dialog.userInput.text = dialog.userInput.text.toUpperCase().split('WHEN IS THE')[1].split('ICO')[0].trim();
            }
            else{
                matched = false;
                callback(matched);
            }

            modelname = 'bitcoin_icodrops';
            options = {};
            var matchedcoin = '';
            var matchedindex = 0;

            options.qs = {kind: {$ne:'ended'}};
            options.url = SERVER_HOST + '/api/' + modelname;
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                    matched = false;
                    callback(matched);
                }
                else {
                    // console.log("updatuser！   response.statusCode=" + response.statusCode);
                    body = JSON.parse(body);

                    for (var j = 0; j < body.length; j++) {

                        body[j].updateTime = Number(body[j].updateTime);
                        if(body[j].name===dialog.userInput.text){
                            matchedcoin = body[j].name;
                            matchedindex = j;
                        }
                    }

                    var nowtime = new Date().getTime();
                    var difference = (nowtime - body[0].updateTime) / (60 * 60 * 1000);

                  crawling(difference,body,matchedcoin,matchedindex);
                }

            });

            var crawling = function(difference,body,matchedcoin,matchedindex){

                if(difference >= 3) {
                    modelname = 'bitcoin_icodrops';
                    options = {};

                    options.qs = {kind: 'upcoming'};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.delete(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            console.log("updatuser！   response.statusCode=" + response.statusCode);
                            console.log("delete!");
                            superagent.get(Url2)
                                .end(function (err, pres) {
                                    var $ = cheerio.load(pres.text);
                                    var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');
                                    // console.log('kind=======' + kind);
                                    for (var i = 0; i < kind.length; i++) {
                                        ICO_upcoming[i] = {};
                                        ICO_upcoming[i].url = kind.eq(i).find('h3 a').attr('href');
                                        ICO_upcoming[i].name = kind.eq(i).find('h3 a').text();
                                        ICO_upcoming[i].category = kind.eq(i).find('.categ_type').text();
                                        ICO_upcoming[i].now_percent = "0";
                                        ICO_upcoming[i].now = "0";
                                        var goal = kind.eq(i).find('#categ_desctop').text();
                                        if(goal.indexOf('$')>=0){
                                            ICO_upcoming[i].goal = goal.replace(/[\t\n,]/g, "");
                                        }
                                        else{
                                            ICO_upcoming[i].goal = "TBA";
                                        }
                                        ICO_upcoming[i].date = kind.eq(i).find('div.date').text().replace(/[\n\t]/g,"").replace(/DATE: /,"");
                                        ICO_upcoming[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                        if(ICO_upcoming[i].rate === ""){
                                            ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g,"");
                                            if(ICO_upcoming[i].rate === ""){
                                                ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                            }
                                        }
                                    }

                                    for(var j = 0; j < ICO_upcoming.length; j++) {
                                        save1(j);
                                    }
                                });
                        }
                    });
                }
                else {
                    context.session.ICOinfo2 = body[matchedindex];
                    matched = true;
                    callback(matched);
                }
            };


            var save1 = function (index) {
                modelname = 'bitcoin_icodrops';
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.json = {
                    kind: 'upcoming',
                    url: ICO_upcoming[index].url,
                    name: ICO_upcoming[index].name.toUpperCase(),
                    category: ICO_upcoming[index].category,
                    now_percent: ICO_upcoming[index].now_percent,
                    now: ICO_upcoming[index].now,
                    goal: ICO_upcoming[index].goal,
                    date: ICO_upcoming[index].date,
                    rate: ICO_upcoming[index].rate,
                    created: new Date().toISOString(),
                    updateTime: new Date().getTime()
                };

                request.post(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        matched = false;
                        callback(matched);
                    }
                    else {
                        console.log("new！");
                        if(index === ICO_upcoming.length-1){
                            show();
                        }
                    }
                })
            };

            var show = function(){

                modelname = 'bitcoin_icodrops';
                options = {};

                options.qs = {kind: 'upcoming'};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        matched = false;
                        callback(matched);
                    }
                    else {
                        // console.log("updatuser！   response.statusCode=" + response.statusCode);
                        body = JSON.parse(body);

                        for (var j = 0; j < body.length; j++) {

                            body[j].updateTime = Number(body[j].updateTime);
                            if(body[j].name===dialog.userInput.text){
                                context.session.upcomingICO = body[j];
                            }
                        }

                        matched = true;
                        callback(matched);
                    }
                });
            };
        }
    });
	bot.setTask('showico', 
	{
		action: function (dialog, context, callback)
		{
            if (context.session.ICOinfo2.now === '0') {
                context.session.ICOinfo2.now_percent = '0%';
            }
		    if(context.session.ICOinfo2.url==='upcoming') {
                dialog.output[0].buttons = [

                    {
                        text: 'Specific Information',
                        url: context.session.ICOinfo2.url
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();
            }
            else{
                dialog.output[0].text = 'Project: '+context.session.ICOinfo2.name+'\n'+
                'Interest: '+context.session.ICOinfo2.rate+'\n'+
                'Category: '+context.session.ICOinfo2.category+'\n'+
                'Goal: '+context.session.ICOinfo2.goal+'\n'+
                'End Date: '+context.session.ICOinfo2.date+'\n'+
                    'Received: '+context.session.ICOinfo2.now+ ' / '+context.session.ICOinfo2.now_percent;
                dialog.output[0].buttons = [

                    {
                        text: 'Specific Information',
                        url: context.session.ICOinfo2.url
                    },
                    {
                        text: 'Back'
                    },
                    {
                        text: 'Start'
                    }

                ];
                callback();
            }
		}
	});
};
