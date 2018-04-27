var request = require('request');
var http = require('http');
var superagent = require('superagent');
var cheerio = require('cheerio');

var coin = [];
var news = [];
var ICO_active = [];
var ICO_upcoming = [];
var ICO = [];
var craw = '';
var coinurl = "https://coinmarketcap.com/";
var activeICOurl = "https://icodrops.com/category/active-ico/";
var upcomingICOurl = "https://icodrops.com/category/upcoming-ico/";

var SERVER_HOST = 'http://template-dev.moneybrain.ai:8443';

var COIN = [];
var url = '';
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
//----------------------------------------------------User-----------------------------------------------

	bot.setTask('ChangeLanguage', 
	{
		action: function (dialog, context, callback)
		{
          if(dialog.userInput.text==='한국어'){
            context.session.language='ko';
          }
          else if(dialog.userInput.text==='中文'){
             context.session.language='zh';
          }
          else{
             context.session.language='en';
          }
			callback();
		}
	});

	bot.setTask('UpdateUser',
	{
		action: function (dialog, context, callback) {

            context.session.coinsprice = [];

            if(context.session.IsNew==='not') {
                modelname = 'bitcoinbot_user';
                options = {};

                options.qs = {userKey: context.user.userKey};
                options.json = {
                    updateTime: new Date().toISOString(),
                    Language: context.session.language ?  context.session.language:"en"
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
                modelname = 'bitcoinbot_user';
                options = {};

                options.qs = {userKey: context.user.userKey};
                options.json = {
                    updateTime: new Date().toISOString(),
                    Language: context.session.language ?  context.session.language:"en"
                };
                options.url = SERVER_HOST + '/api/' + modelname;
                request.put(options, function (err, response, body) {
                    console.log('body: ' + JSON.stringify(body));
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else if(body.nModified === 0)  {
                        if(dialog.userInput.text==="Talk now!") {
                            context.session.IsNew = 'not';
                            modelname = 'bitcoinbot_user';
                            options = {};
                            context.session.language = context.session.language ?  context.session.language:"en";
                            options.json = {
                                Language: context.session.language ?  context.session.language:"en",
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
                    }
                    else {
                        context.session.IsNew = 'not';
                        modelname = 'bitcoinbot_user';
                        options = {};

                        options.qs = {userKey: context.user.userKey};
                        options.url = SERVER_HOST + '/api/' + modelname;
                        request.get(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                callback();
                            }
                            else {
                                console.log("updatuser！   response.statusCode=" + response.statusCode);
                                body = JSON.parse(body);
                                context.session.language = body[0].Language;
                                callback();
                            }
                        });

                    }
                });
            }
        }

	});

//----------------------------------------------------Coin_Price && Information-----------------------------------------------
	bot.setTask('coinprice',
        {
            action: function (dialog, context, callback) {
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
                        if (body.length === 0) {
                            coincrawling();
                        }
                        else {
                            body = body.sort(function (a, b) {
                                return a.rate - b.rate;
                            });

                            var nowtime = new Date().getTime();
                            var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                            if (difference >= 1) {
                                coincrawling();
                            }
                            else {
                                context.session.coinsprice = body;
                                dialog.output[0].buttons = [];
                                for (var i = 0; i < 15; i++) {
                                    var name = "" + (i + 1) + ". " + body[i].name;
                                    var price = body[i].price;
                                    dialog.output[0].buttons.push({text: name + " " + price});
                                }
                                dialog.output[0].buttons.push({text: 'MORE'});
                                dialog.output[0].buttons.push({text: 'Back'});
                                dialog.output[0].buttons.push({text: 'Start'});
                                callback();
                            }
                        }
                    }

                });

                function coincrawling() {
                    superagent.get(coinurl)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kind = $('tbody tr');

                            for (var i = 0; i < kind.length; i++) {
                                coin[i] = {};
                                coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text();
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
                            request.delete(options, function (err, response, body) {
                                if (err) {
                                    console.log(err);
                                    callback();
                                }
                                else {
                                    console.log("delete！   response.statusCode=" + response.statusCode);
                                    coin.forEach(newcoin);
                                }
                            })
                        });
                }

                function  newcoin(coin,coindex) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin.name,
                        url: coin.url,
                        shortname: coin.shortname,
                        image: coin.image,
                        price: coin.price,
                        volume: coin.volume,
                        change: coin.change,
                        graph: coin.graph,
                        graphimage: coin.graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin.rate,
                        language: 'en'
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("new！  response.statusCode=" + response.statusCode);
                            if(coindex === 99){
                                showcoin()
                            }
                        }
                    })
                }

                function showcoin() {
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

                            body = body.sort(function (a, b) {
                                return a.rate - b.rate;
                            });

                            context.session.coinsprice = body;
                            dialog.output[0].buttons = [];
                            for (var i = 0; i < 15; i++) {
                                var name = "" + (i + 1) + ". " + body[i].name;
                                var price = body[i].price;
                                dialog.output[0].buttons.push({text: name + " " + price});
                            }
                            dialog.output[0].buttons.push({text: 'MORE'});
                            dialog.output[0].buttons.push({text: 'Back'});
                            dialog.output[0].buttons.push({text: 'Start'});
                            callback();
                        }
                    });
                }
            }
        });

    bot.setType('coins',
        {
            typeCheck: function (dialog, context, callback) {

                var matched = false;
                if (dialog.userInput.text.indexOf('.') === -1) {
                    matched = false;
                    callback(matched);
                }
                else {
                    dialog.userInput.text = dialog.userInput.text.split('.')[1].split('$')[0].trim();

                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            body = JSON.parse(body);
                            if (body.length === 0) {
                                coincrawling();
                            }
                            else {
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });

                                var nowtime = new Date().getTime();
                                var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                                if (difference >= 1) {
                                    coincrawling();
                                }
                                else {
                                    context.session.coinsprice = body;
                                    context.session.coinsinfo = {};
                                    for(var i = 0; i < context.session.coinsprice.length; i++ )
                                    {
                                        if(dialog.userInput.text === context.session.coinsprice[i].name)
                                        {
                                            context.session.coinsinfo = context.session.coinsprice[i];
                                            matched = true;
                                            callback(matched);
                                        }
                                        else if(i === context.session.coinsprice.length -1 && !context.session.coinsinfo){
                                            matched = false;
                                            callback(matched);
                                        }
                                    }
                                }
                            }
                        }

                    });

                    function coincrawling() {
                        superagent.get(coinurl)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');

                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    // coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                    coin[i].graph = 'https://coinmarketcap.com/currencies/' + coin[i].name + '/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();
                                }
                                request.delete(options, function (err, response, body) {
                                    if (err) {
                                        console.log(err);
                                        matched = false;
                                        callback(matched);
                                    }
                                    else {
                                        console.log("delete！   response.statusCode=" + response.statusCode);
                                        coin.forEach(newcoin);
                                    }
                                })
                            });
                    }

                    function newcoin(coin, coindex) {
                        options = {};
                        options.url = SERVER_HOST + '/api/' + modelname;

                        options.json = {
                            name: coin.name,
                            url: coin.url,
                            shortname: coin.shortname,
                            image: coin.image,
                            price: coin.price,
                            volume: coin.volume,
                            change: coin.change,
                            graph: coin.graph,
                            graphimage: coin.graphimage,
                            created: new Date().toISOString(),
                            updateTime: new Date().getTime(),
                            rate: coin.rate,
                            language: 'en'
                        };

                        request.post(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                matched = false;
                                callback(matched);
                            }
                            else {
                                console.log("new！  response.statusCode=" + response.statusCode);
                                if (coindex === 99) {
                                    showcoin()
                                }
                            }
                        })
                    }

                    function showcoin() {
                        modelname = 'bitcoin_coinmarketcap';
                        options = {};

                        options.qs = {};
                        options.url = SERVER_HOST + '/api/' + modelname;
                        request.get(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                matched = false;
                                callback(matched);
                            }
                            else {
                                body = JSON.parse(body);
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });
                                context.session.coinsprice = body;
                                context.session.coinsinfo = {};
                                for(var i = 0; i < context.session.coinsprice.length; i++ )
                                {
                                    if(dialog.userInput.text === context.session.coinsprice[i].name)
                                    {
                                        context.session.coinsinfo = context.session.coinsprice[i];
                                        matched = true;
                                        callback(matched);
                                    }
                                    else if(i === context.session.coinsprice.length -1 && !context.session.coinsinfo){
                                        matched = false;
                                        callback(matched);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });

    bot.setTask('showcoins',
	{
		action: function (dialog, context, callback)
		{
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


    bot.setType('coins2',
        {
            typeCheck: function (dialog, context, callback) {
                var matched = false;
                var coinname = [];
                context.session.seleccoin = [];

                
                var userInput = dialog.userInput.text;

                userInput = userInput.toLowerCase();

                if(dialog.userInput.matchedIntent !== 'price'){
                    matched = false;
                    callback(matched);
                }
                else {

                    userInput = userInput.replace(/price/g, '').replace(/rate/g, '');

                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            body = JSON.parse(body);
                            if (body.length === 0) {
                                coincrawling();
                            }
                            else {
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });

                                var nowtime = new Date().getTime();
                                var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                                if (difference >= 1) {
                                    coincrawling();
                                }
                                else {
                                    getcoin(body);
                                }
                            }
                        }

                    });
                }

                function coincrawling() {
                    superagent.get(coinurl)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kind = $('tbody tr');

                            for (var i = 0; i < kind.length; i++) {
                                coin[i] = {};
                                coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text();
                                coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                if (!coin[i].image) {
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                }
                                coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                // coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                coin[i].graph = 'https://coinmarketcap.com/currencies/' + coin[i].name + '/#charts';
                                coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                coin[i].rate = kind.eq(i).find('td.text-center').text().trim();
                            }
                            request.delete(options, function (err, response, body) {
                                if (err) {
                                    console.log(err);
                                    matched = false;
                                    callback(matched);
                                }
                                else {
                                    console.log("delete！   response.statusCode=" + response.statusCode);
                                    coin.forEach(newcoin);
                                }
                            })
                        });
                }

                function newcoin(coin, coindex,coins) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin.name,
                        url: coin.url,
                        shortname: coin.shortname,
                        image: coin.image,
                        price: coin.price,
                        volume: coin.volume,
                        change: coin.change,
                        graph: coin.graph,
                        graphimage: coin.graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin.rate,
                        language: 'en'
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            console.log("new！  response.statusCode=" + response.statusCode);
                            if (coindex === coins.length - 1) {
                                showcoin()
                            }
                        }
                    })
                }

                function showcoin() {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            body = JSON.parse(body);
                            body = body.sort(function (a, b) {
                                return a.rate - b.rate;
                            });
                            getcoin(body);
                        }
                    });
                }

                function getcoin(body){
                    context.session.coinsprice = body;
                    for (var i = 0; i < body.length; i++) {
                        coinname.push(body[i].name.toLowerCase());
                        coinname.push(body[i].shortname.toLowerCase());
                    }

                    coinname = coinname.sort(function (a, b) {
                        return b.length - a.length;
                    });


                    for (var j = 0; j < coinname.length; j++) {
                        if (userInput.indexOf(' '+coinname[j]+' ') !== -1 || userInput.indexOf(coinname[j]+' ') !== -1 || userInput.indexOf(' '+coinname[j]) !== -1) {
                            context.session.seleccoin.push(coinname[j]);
                            var name = coinname[j];
                            var regexp = new RegExp(name,"g");
                            userInput = userInput.replace(regexp,"");
                            if(j === coinname.length - 1 && context.session.seleccoin.length >=1){
                                matched = true;
                                callback(matched);
                            }
                            else if(j === coinname.length - 1 && context.session.seleccoin.length === 0){
                                matched = false;
                                callback(matched);
                            }
                        }
                        else if(j === coinname.length - 1 && context.session.seleccoin.length >=1){
                            matched = true;
                            callback(matched);
                        }
                        else if(j === coinname.length - 1 && context.session.seleccoin.length === 0){
                            matched = false;
                            callback(matched);
                        }
                    }

                }

            }
        });

    bot.setTask('showcoins2',
        {
            action: function (dialog, context, callback) {
                context.session.coinsinfo = [];

                context.session.seleccoin.forEach(getcoins);

                function getcoins(coinname,index) {
                    for (var i = 0; i < context.session.coinsprice.length; i++) {

                        if (coinname === context.session.coinsprice[i].name.toLowerCase() || coinname === context.session.coinsprice[i].shortname.toLowerCase()) {
                            context.session.coinsinfo.push(context.session.coinsprice[i]);
                        }
                        else if (i === context.session.coinsprice.length - 1 && index === context.session.seleccoin.length -1) {
                            if (context.session.coinsinfo.length === 1) {
                                showcoin();
                            }
                            else {
                                showcoin2();
                            }
                        }
                    }
                }

                function showcoin() {
                    if (context.session.coinsinfo[0].graphimage.indexOf('.svg') === -1) {
                        dialog.output[0].text = ' Coin: ' + context.session.coinsinfo[0].name + '\n' +
                            'Shortname: ' + context.session.coinsinfo[0].shortname + '\n' +
                            'Price: ' + context.session.coinsinfo[0].price + '\n' +
                            'Volume(24h):  ' + context.session.coinsinfo[0].volume + '\n' +
                            'Change(24h): ' + context.session.coinsinfo[0].change + '\n' +
                            'Price Graph: ';
                        dialog.output[0].image = {url: context.session.coinsinfo[0].graphimage};
                        dialog.output[0].buttons = [
                            {
                                text: 'See price graph',
                                url: context.session.coinsinfo[0].graph
                            },
                            {
                                text: 'Specific Information',
                                url: context.session.coinsinfo[0].url
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
                        dialog.output[0].text = ' Coin: ' + context.session.coinsinfo[0].name + '\n' +
                            'Shortname: ' + context.session.coinsinfo[0].shortname + '\n' +
                            'Price: ' + context.session.coinsinfo[0].price + '\n' +
                            'Volume(24h):  ' + context.session.coinsinfo[0].volume + '\n' +
                            'Change(24h): ' + context.session.coinsinfo[0].change + '\n';
                        dialog.output[0].buttons = [
                            {
                                text: 'See price graph',
                                url: context.session.coinsinfo[0].graph
                            },
                            {
                                text: 'Specific Information',
                                url: context.session.coinsinfo[0].url
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

                function showcoin2() {
                    dialog.output[0].text = 'Select the coin you want to see the specify information.';
                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.coinsinfo.length; i++) {
                        var ss = (i+1) + '. ' + context.session.coinsinfo[i].name + ' ' + context.session.coinsinfo[i].price;
                        dialog.output[0].buttons.push({text: ss})
                    }
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                }
            }
        });
//----------------------------------------------------Coin_Chart-----------------------------------------------

    bot.setType('chart',
        {
            typeCheck: function (dialog, context, callback) {
                var matched = false;
                if (dialog.userInput.text.indexOf('.') === -1) {
                    matched = false;
                    callback(matched);
                }
                else {
                    dialog.userInput.text = dialog.userInput.text.split('.')[1].split('$')[0].trim();

                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            body = JSON.parse(body);
                            if (body.length === 0) {
                                coincrawling();
                            }
                            else {
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });

                                var nowtime = new Date().getTime();
                                var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                                if (difference >= 1) {
                                    coincrawling();
                                }
                                else {
                                    context.session.coinsprice = body;
                                    context.session.coinsinfo = {};
                                    for(var i = 0; i < context.session.coinsprice.length; i++ )
                                    {
                                        if(dialog.userInput.text === context.session.coinsprice[i].name)
                                        {
                                            context.session.coinsinfo = context.session.coinsprice[i];
                                            matched = true;
                                            callback(matched);
                                        }
                                        else if(i === context.session.coinsprice.length -1 && !context.session.coinsinfo){
                                            matched = false;
                                            callback(matched);
                                        }
                                    }
                                }
                            }
                        }

                    });

                    function coincrawling() {
                        superagent.get(coinurl)
                            .end(function (err, pres) {
                                var $ = cheerio.load(pres.text);
                                var kind = $('tbody tr');

                                for (var i = 0; i < kind.length; i++) {
                                    coin[i] = {};
                                    coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                    coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text();
                                    coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                    if (!coin[i].image) {
                                        coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                    }
                                    coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                    coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                    coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                    // coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                    coin[i].graph = 'https://coinmarketcap.com/currencies/' + coin[i].name + '/#charts';
                                    coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                    coin[i].rate = kind.eq(i).find('td.text-center').text().trim();
                                }
                                request.delete(options, function (err, response, body) {
                                    if (err) {
                                        console.log(err);
                                        matched = false;
                                        callback(matched);
                                    }
                                    else {
                                        console.log("delete！   response.statusCode=" + response.statusCode);
                                        coin.forEach(newcoin);
                                    }
                                })
                            });
                    }

                    function newcoin(coin, coindex) {
                        options = {};
                        options.url = SERVER_HOST + '/api/' + modelname;

                        options.json = {
                            name: coin.name,
                            url: coin.url,
                            shortname: coin.shortname,
                            image: coin.image,
                            price: coin.price,
                            volume: coin.volume,
                            change: coin.change,
                            graph: coin.graph,
                            graphimage: coin.graphimage,
                            created: new Date().toISOString(),
                            updateTime: new Date().getTime(),
                            rate: coin.rate,
                            language: 'en'
                        };

                        request.post(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                matched = false;
                                callback(matched);
                            }
                            else {
                                console.log("new！  response.statusCode=" + response.statusCode);
                                if (coindex === 99) {
                                    showcoin()
                                }
                            }
                        })
                    }

                    function showcoin() {
                        modelname = 'bitcoin_coinmarketcap';
                        options = {};

                        options.qs = {};
                        options.url = SERVER_HOST + '/api/' + modelname;
                        request.get(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                matched = false;
                                callback(matched);
                            }
                            else {
                                body = JSON.parse(body);
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });
                                context.session.coinsprice = body;
                                context.session.coinsinfo = {};
                                for(var i = 0; i < context.session.coinsprice.length; i++ )
                                {
                                    if(dialog.userInput.text === context.session.coinsprice[i].name)
                                    {
                                        context.session.coinsinfo = context.session.coinsprice[i];
                                        matched = true;
                                        callback(matched);
                                    }
                                    else if(i === context.session.coinsprice.length -1 && !context.session.coinsinfo){
                                        matched = false;
                                        callback(matched);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });


    bot.setTask('showchart',
        {
            action: function (dialog, context, callback)
            {
                if(context.session.coinsinfo.graphimage.indexOf('.svg')=== -1) {
                    dialog.output[0].image = {url: context.session.coinsinfo.graphimage};
                    dialog.output[0].buttons = [
                        {
                            text: 'See price graph',
                            url: context.session.coinsinfo.graph
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
                        'Shortname: '+context.session.coinsinfo.shortname;
                    dialog.output[0].buttons = [
                        {
                            text: 'See price graph',
                            url: context.session.coinsinfo.graph
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



    bot.setType('chart2',
        {
            typeCheck: function (dialog, context, callback) {
                var matched = false;
                var coinname = [];
                context.session.seleccoin = [];
                
                var userInput = dialog.userInput.text;

                userInput = userInput.toLowerCase();

                if(dialog.userInput.matchedIntent !== 'coinchart'){
                    matched = false;
                    callback(matched);
                }
                else {

                    userInput = userInput.replace(/chart/g, '').replace(/graph/g, '');

                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            body = JSON.parse(body);
                            if (body.length === 0) {
                                coincrawling();
                            }
                            else {
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });

                                var nowtime = new Date().getTime();
                                var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                                if (difference >= 1) {
                                    coincrawling();
                                }
                                else {
                                    getcoin(body);
                                }
                            }
                        }

                    });
                }

                function coincrawling() {
                    superagent.get(coinurl)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kind = $('tbody tr');

                            for (var i = 0; i < kind.length; i++) {
                                coin[i] = {};
                                coin[i].shortname = kind.eq(i).find('td.no-wrap.currency-name span a').text().toUpperCase();
                                coin[i].name = kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').text();
                                coin[i].url = "https://coinmarketcap.com" + kind.eq(i).find('td.no-wrap.currency-name a.currency-name-container').attr('href');
                                coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('data-src');
                                if (!coin[i].image) {
                                    coin[i].image = kind.eq(i).find('td.no-wrap.currency-name img').attr('src');
                                }
                                coin[i].price = kind.eq(i).find('td.no-wrap.text-right a.price').text().replace(/[,]/g, "");
                                coin[i].volume = kind.eq(i).find('td.no-wrap.text-right a.volume').text().replace(/[,]/g, "");
                                coin[i].change = kind.eq(i).find('td.no-wrap.percent-change.text-right').text();
                                // coin[i].graph ='https://coinmarketcap.com/currencies/'+coin[i].name+'/#charts';
                                coin[i].graph = 'https://coinmarketcap.com/currencies/' + coin[i].name + '/#charts';
                                coin[i].graphimage = kind.eq(i).find('td a img.sparkline').attr('src');
                                coin[i].rate = kind.eq(i).find('td.text-center').text().trim();
                            }
                            request.delete(options, function (err, response, body) {
                                if (err) {
                                    console.log(err);
                                    matched = false;
                                    callback(matched);
                                }
                                else {
                                    console.log("delete！   response.statusCode=" + response.statusCode);
                                    coin.forEach(newcoin);
                                }
                            })
                        });
                }

                function newcoin(coin, coindex,coins) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        name: coin.name,
                        url: coin.url,
                        shortname: coin.shortname,
                        image: coin.image,
                        price: coin.price,
                        volume: coin.volume,
                        change: coin.change,
                        graph: coin.graph,
                        graphimage: coin.graphimage,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime(),
                        rate: coin.rate,
                        language: 'en'
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            console.log("new！  response.statusCode=" + response.statusCode);
                            if (coindex === coins.length - 1) {
                                showcoin()
                            }
                        }
                    })
                }

                function showcoin() {
                    modelname = 'bitcoin_coinmarketcap';
                    options = {};

                    options.qs = {};
                    options.url = SERVER_HOST + '/api/' + modelname;
                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            body = JSON.parse(body);
                            body = body.sort(function (a, b) {
                                return a.rate - b.rate;
                            });
                            getcoin(body);
                        }
                    });
                }

                function getcoin(body){
                    context.session.coinsprice = body;
                    for (var i = 0; i < body.length; i++) {
                        coinname.push(body[i].name.toLowerCase());
                        coinname.push(body[i].shortname.toLowerCase());
                    }

                    coinname = coinname.sort(function (a, b) {
                        return b.length - a.length;
                    });

                    var mm = coinname.length;
                    for (var j = 0; j < mm; j++) {
                        if (userInput.indexOf(' '+coinname[j]+' ') !== -1 || userInput.indexOf(coinname[j]+' ') !== -1 || userInput.indexOf(' '+coinname[j]) !== -1) {
                            context.session.seleccoin.push(coinname[j]);
                            var name = coinname[j];
                            var regexp = new RegExp(name,"g");
                            userInput = userInput.replace(regexp,"");
                            if(j === coinname.length - 1 && context.session.seleccoin.length >=1){
                                matched = true;
                                callback(matched);
                            }
                            else if(j === coinname.length - 1 && context.session.seleccoin.length === 0){
                                matched = false;
                                callback(matched);
                            }
                        }
                        else if(j === coinname.length - 1 && context.session.seleccoin.length >=1){
                            matched = true;
                            callback(matched);
                        }
                        else if(j === coinname.length - 1 && context.session.seleccoin.length === 0){
                            matched = false;
                            callback(matched);
                        }
                    }
                }
            }
        });


    bot.setTask('showchart2',
        {
            action: function (dialog, context, callback)
            {
                context.session.coinsinfo = [];

                context.session.seleccoin.forEach(getcoins);

                function getcoins(coinname,index) {
                    for (var i = 0; i < context.session.coinsprice.length; i++) {

                        if (coinname === context.session.coinsprice[i].name.toLowerCase() || coinname === context.session.coinsprice[i].shortname.toLowerCase()) {
                            context.session.coinsinfo.push(context.session.coinsprice[i]);
                        }
                        else if (i === context.session.coinsprice.length - 1 && index === context.session.seleccoin.length -1) {
                            if (context.session.coinsinfo.length === 1) {
                                showcoin();
                            }
                            else {
                                showcoin2();
                            }
                        }
                    }
                }

                function showcoin() {
                    if (context.session.coinsinfo[0].graphimage.indexOf('.svg') === -1) {
                        dialog.output[0].text = ' Coin: ' + context.session.coinsinfo[0].name + '\n' +
                            'Shortname: ' + context.session.coinsinfo[0].shortname + '\n' +
                            'Price Graph: ';
                        dialog.output[0].image = {url: context.session.coinsinfo[0].graphimage};
                        dialog.output[0].buttons = [
                            {
                                text: 'See price graph',
                                url: context.session.coinsinfo[0].graph
                            },
                            {
                                text: 'Specific Information',
                                url: context.session.coinsinfo[0].url
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
                        dialog.output[0].text = ' Coin: ' + context.session.coinsinfo[0].name + '\n' +
                            'Shortname: ' + context.session.coinsinfo[0].shortname;
                        dialog.output[0].buttons = [
                            {
                                text: 'See price graph',
                                url: context.session.coinsinfo[0].graph
                            },
                            {
                                text: 'Specific Information',
                                url: context.session.coinsinfo[0].url
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

                function showcoin2() {
                    dialog.output[0].text = 'Select the coin you want to see the specify information.';
                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.coinsinfo.length; i++) {
                        var ss = (i+1) + '. ' + context.session.coinsinfo[i].name;
                        dialog.output[0].buttons.push({text: ss})
                    }
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                }
            }
        });
//----------------------------------------------------ICO-----------------------------------------------

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
                    body = JSON.parse(body);

                    if (body.length === 0) {
                        ICOcrawling();
                    }
                    else {
                        var nowtime = new Date().getTime();
                        difference = (nowtime - Number(body[0].updateTime))/ (60 * 60 * 1000);

                        if(difference >= 3){
                            ICOcrawling();
                        }
                        else{
                            showICO();
                        }
                    }
                }
            });

            function ICOcrawling() {
                superagent.get(activeICOurl)
                    .end(function (err, pres) {
                        var $ = cheerio.load(pres.text);
                        var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');

                        for (var i = 0; i < kind.length; i++) {
                            ICO_active[i] = {};
                            ICO_active[i].url = kind.eq(i).find('h3 a').attr('href');
                            ICO_active[i].name = kind.eq(i).find('h3 a').text();
                            ICO_active[i].category = kind.eq(i).find('.ico-category-name').text();
                            ICO_active[i].now_percent = kind.eq(i).find('#new_column_categ_invisted span.prec').text();
                            if (ICO_active[i].now_percent === "") {
                                ICO_active[i].now_percent = "0%";
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
                        modelname = 'bitcoin_icodrops';
                        options = {};

                        options.qs = {kind: 'active'};
                        options.url = SERVER_HOST + '/api/' + modelname;

                        request.delete(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                matched = false;
                                callback(matched);
                            }
                            else {
                                console.log("delete！   response.statusCode=" + response.statusCode);
                                ICO_active.forEach(newICO);
                            }
                        });
                    });
            }

            function newICO(ICO,index,ICOs) {
                modelname = 'bitcoin_icodrops';
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.json = {
                    kind: 'active',
                    url: ICO.url,
                    name: ICO.name,
                    category: ICO.category,
                    now_percent: ICO.now_percent,
                    now: ICO.now,
                    goal: ICO.goal,
                    date: ICO.date,
                    rate: ICO.rate,
                    created: new Date().toISOString(),
                    updateTime: new Date().getTime()
                };

                request.post(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    else {
                        console.log("new！   response.statusCode=" + response.statusCode);
                        if(index === ICOs.length-1){
                            showICO();
                        }
                    }
                })

            }

            function showICO() {
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
                        console.log("getICO！   response.statusCode=" + response.statusCode);
                        body = JSON.parse(body);

                        context.session.activeICO = body;

                        dialog.output[0].buttons = [];
                        for (var i = 0; i < 15; i++) {
                            var name = "" + (i + 1) + ". " + body[i].name;
                            var rate = body[i].rate;
                            dialog.output[0].buttons.push({text: name + " [" + rate + ']'});
                        }
                        dialog.output[0].buttons.push({text: 'MORE'});
                        dialog.output[0].buttons.push({text: 'Back'});
                        dialog.output[0].buttons.push({text: 'Start'});
                        callback();
                    }
                });
            }
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

                    if(dialog.userInput.text.toLowerCase().split('.')[2]){
                        dialog.userInput.text = dialog.userInput.text.toLowerCase().split('.')[1].trim()+'.'+dialog.userInput.text.toLowerCase().split('.')[2].split('[')[0].trim();
                    }
                    else {
                        dialog.userInput.text = dialog.userInput.text.toLowerCase().split('.')[1].split('[')[0].trim();
                    }
                    for (var i = 0; i < context.session.activeICO.length; i++) {
                        if (dialog.userInput.text === context.session.activeICO[i].name.toLowerCase()) {
                            context.session.ICOinfo = context.session.activeICO[i];
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

    bot.setTask('upcomingICO',
        {
            action: function (dialog, context, callback) {
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
                        body = JSON.parse(body);

                        if (body.length === 0) {
                            ICOcrawling();
                        }
                        else {
                            var nowtime = new Date().getTime();
                            difference = (nowtime - Number(body[0].updateTime)) / (60 * 60 * 1000);

                            if (difference >= 3) {
                                ICOcrawling();
                            }
                            else {
                                showICO();
                            }
                        }
                    }
                });

                function ICOcrawling() {
                    superagent.get(upcomingICOurl)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');

                            for (var i = 0; i < kind.length; i++) {
                                ICO_upcoming[i] = {};
                                ICO_upcoming[i].url = kind.eq(i).find('h3 a').attr('href');
                                ICO_upcoming[i].name = kind.eq(i).find('h3 a').text();
                                ICO_upcoming[i].category = kind.eq(i).find('.categ_type').text();
                                ICO_upcoming[i].now_percent = "0%";
                                ICO_upcoming[i].now = "0";
                                var goal = kind.eq(i).find('#categ_desctop').text();
                                if (goal.indexOf('$') >= 0) {
                                    ICO_upcoming[i].goal = goal.replace(/[\t\n,]/g, "");
                                }
                                else {
                                    ICO_upcoming[i].goal = "TBA";
                                }
                                ICO_upcoming[i].date = kind.eq(i).find('div.date').text().replace(/[\n\t]/g, "").replace(/DATE: /, "");
                                ICO_upcoming[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                                if (ICO_upcoming[i].rate === "") {
                                    ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g, "");
                                    if (ICO_upcoming[i].rate === "") {
                                        ICO_upcoming[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                    }
                                }
                            }
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
                                    console.log("delete！   response.statusCode=" + response.statusCode);
                                    ICO_upcoming.forEach(newICO);
                                }
                            });
                        });
                }

                function newICO(ICO, index, ICOs) {
                    modelname = 'bitcoin_icodrops';
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = {
                        kind: 'upcoming',
                        url: ICO.url,
                        name: ICO.name,
                        category: ICO.category,
                        now_percent: ICO.now_percent,
                        now: ICO.now,
                        goal: ICO.goal,
                        date: ICO.date,
                        rate: ICO.rate,
                        created: new Date().toISOString(),
                        updateTime: new Date().getTime()
                    };

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            callback();
                        }
                        else {
                            console.log("new！   response.statusCode=" + response.statusCode);
                            if (index === ICOs.length - 1) {
                                showICO();
                            }
                        }
                    })

                }

                function showICO() {
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
                            console.log("getICO！   response.statusCode=" + response.statusCode);
                            body = JSON.parse(body);

                            context.session.upcomingICO = body;

                            dialog.output[0].buttons = [];
                            for (var i = 0; i < 15; i++) {
                                var name = "" + (i + 1) + ". " + body[i].name;
                                var rate = body[i].rate;
                                dialog.output[0].buttons.push({text: name + " [" + rate + ']'});
                            }
                            dialog.output[0].buttons.push({text: 'MORE'});
                            dialog.output[0].buttons.push({text: 'Back'});
                            dialog.output[0].buttons.push({text: 'Start'});
                            callback();
                        }
                    });
                }
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

                    if(dialog.userInput.text.toLowerCase().split('.')[2]){
                        dialog.userInput.text = dialog.userInput.text.toLowerCase().split('.')[1].trim()+'.'+dialog.userInput.text.toLowerCase().split('.')[2].split('[')[0].trim();
                    }
                    else {
                        dialog.userInput.text = dialog.userInput.text.toLowerCase().split('.')[1].split('[')[0].trim();
                    }
                    for (var i = 0; i < context.session.upcomingICO.length; i++) {
                        if (dialog.userInput.text === context.session.upcomingICO[i].name.toLowerCase()) {
                            context.session.ICOinfo = context.session.upcomingICO[i];
                            matched = true;
                            return callback(matched);
                        }
                        else if(i === context.session.upcomingICO.length - 1){
                            matched = false;
                            callback(matched);
                        }
                    }
                }
            }
        });


    bot.setType('icos',
    {
        typeCheck: function (dialog, context, callback) {
            var matched = false;
            var difference = 0;
            var iconame = [];
            var ICOkind = ['active', 'upcoming'];
            var ICOurl = "";
            context.session.selecico = [];
            
            var userInput = dialog.userInput.text;

            if(dialog.userInput.matchedIntent !== 'ICO'){
                matched = false;
                callback(matched);
            }
            else {

                userInput = userInput.toLowerCase();

                modelname = 'bitcoin_icodrops';
                options = {};

                options.qs = {};
                options.url = SERVER_HOST + '/api/' + modelname;
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        matched = false;
                        callback(matched);
                    }
                    else {
                        body = JSON.parse(body);

                        if (body.length === 0) {
                            ICOkind.forEach(ICOcrawling);
                        }
                        else {
                            var nowtime = new Date().getTime();
                            difference = (nowtime - Number(body[0].updateTime)) / (60 * 60 * 1000);

                            if (difference >= 3) {
                                ICOkind.forEach(ICOcrawling);
                            }
                            else {
                                getICO(body);
                            }
                        }
                    }
                });
            }

            function ICOcrawling(ICOkind) {
                ICOurl = "https://icodrops.com/category/" + ICOkind + "-ico/";
                superagent.get(ICOurl)
                    .end(function (err, pres) {
                        var $ = cheerio.load(pres.text);
                        var kind = $('.col-lg-6.col-md-12.col-12.all>div>div.category-desk>div.col-md-12.col-12.a_ico');

                        for (var i = 0; i < kind.length; i++) {
                            ICO[i] = {};
                            ICO[i].url = kind.eq(i).find('h3 a').attr('href');
                            ICO[i].name = kind.eq(i).find('h3 a').text();
                            ICO[i].category = kind.eq(i).find('.categ_type').text();
                            ICO[i].now_percent = "0%";
                            ICO[i].now = "0";
                            var goal = kind.eq(i).find('#categ_desctop').text();
                            if (goal.indexOf('$') >= 0) {
                                ICO[i].goal = goal.replace(/[\t\n,]/g, "");
                            }
                            else {
                                ICO[i].goal = "TBA";
                            }
                            ICO[i].date = kind.eq(i).find('div.date').text().replace(/[\n\t]/g, "").replace(/DATE: /, "");
                            ICO[i].rate = kind.eq(i).find('div.interest span.spspan').text();
                            if (ICO[i].rate === "") {
                                ICO[i].rate = kind.eq(i).find('div.interest div.all_site_val').text().replace(/[\t\n]/g, "");
                                if (ICO[i].rate === "") {
                                    ICO[i].rate = kind.eq(i).find('div.interest div.nr').text();
                                }
                            }
                        }
                        modelname = 'bitcoin_icodrops';
                        options = {};

                        options.qs = {kind: ICOkind};
                        options.url = SERVER_HOST + '/api/' + modelname;

                        request.delete(options, function (err, response, body) {
                            if (err) {
                                console.log(err);
                                matched = false;
                                callback(matched);
                            }
                            else {
                                console.log("delete！   response.statusCode=" + response.statusCode);
                                ICO.forEach(newICO);
                            }
                        });
                    });
            }

            function newICO(ICO, index, ICOs) {
                modelname = 'bitcoin_icodrops';
                options = {};
                options.url = SERVER_HOST + '/api/' + modelname;

                options.json = {
                    kind: ICO.kind,
                    url: ICO.url,
                    name: ICO.name,
                    category: ICO.category,
                    now_percent: ICO.now_percent,
                    now: ICO.now,
                    goal: ICO.goal,
                    date: ICO.date,
                    rate: ICO.rate,
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
                        console.log("new！   response.statusCode=" + response.statusCode);
                        if (index === ICOs.length - 1 && ICO.kind === 'upcoming') {
                            modelname = 'bitcoin_icodrops';
                            options = {};

                            options.qs = {};
                            options.url = SERVER_HOST + '/api/' + modelname;
                            request.get(options, function (err, response, body) {
                                if (err) {
                                    console.log(err);
                                    matched = false;
                                    callback(matched);
                                }
                                else {
                                    body = JSON.parse(body);
                                    getICO(body);
                                }
                            })
                        }
                    }
                })

            }

            function getICO(body) {
                context.session.ICOs = body;
                for (var i = 0; i < body.length; i++) {
                    iconame.push(body[i].name.toLowerCase());
                }
                iconame = iconame.sort(function (a, b) {
                    return b.length - a.length;
                });

                var mm = iconame.length;
                for (var j = 0; j < mm; j++) {

                    if (userInput.indexOf(' ' + iconame[j] + ' ') !== -1 || userInput.indexOf(iconame[j] + ' ') !== -1 || userInput.indexOf(' ' + iconame[j]) !== -1) {
                        context.session.selecico.push(iconame[j]);
                        var name = iconame[j];
                        var regexp = new RegExp(name,"g");
                        userInput = userInput.replace(regexp,"");
                        if (j === iconame.length - 1 && context.session.selecico.length >= 1) {
                            matched = true;
                            callback(matched);
                        }
                        else if (j === iconame.length - 1 && context.session.selecico.length === 0) {
                            matched = false;
                            callback(matched);
                        }
                    }
                    else if (j === iconame.length - 1 && context.session.selecico.length >= 1) {
                        matched = true;
                        callback(matched);
                    }
                    else if (j === iconame.length - 1 && context.session.selecico.length === 0) {
                        matched = false;
                        callback(matched);
                    }
                }
            }
        }
    });

    bot.setTask('showICO2',
        {
            action: function (dialog, context, callback) {

                context.session.ICOsinfo = [];

                context.session.selecico.forEach(getICO);

                function getICO(iconame,index) {
                    for (var i = 0; i < context.session.ICOs.length; i++) {

                        if (iconame === context.session.ICOs[i].name.toLowerCase()) {
                            context.session.ICOsinfo.push(context.session.ICOs[i]);
                        }
                        else if (i === context.session.ICOs.length - 1 && index === context.session.selecico.length -1) {
                            if (context.session.ICOsinfo.length === 1) {
                                showICO();
                            }
                            else {
                                showICO2();
                            }
                        }
                    }
                }

                function showICO() {
                    if(context.session.ICOsinfo.kind === 'upcoming') {
                        dialog.output[0].text = ' Project: ' + context.session.ICOsinfo[0].name + '\n' +
                            'Kind: ' + context.session.ICOsinfo[0].kind + '\n' +
                            'Interest: ' + context.session.ICOsinfo[0].rate + '\n' +
                            'Category: ' + context.session.ICOsinfo[0].category + '\n' +
                            'Goal:  ' + context.session.ICOsinfo[0].goal + '\n' +
                            'Start Date: ' + context.session.ICOsinfo[0].date + '\n';
                        dialog.output[0].buttons = [
                            {
                                text: 'Specific Information',
                                url: context.session.ICOsinfo[0].url
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
                        dialog.output[0].text = ' Project: ' + context.session.ICOsinfo[0].name + '\n' +
                            'Kind: ' + context.session.ICOsinfo[0].kind + '\n' +
                            'Interest: ' + context.session.ICOsinfo[0].rate + '\n' +
                            'Category: ' + context.session.ICOsinfo[0].category + '\n' +
                            'Received: ' + context.session.ICOsinfo[0].now + ' / '+ context.session.ICOsinfo[0].now_percent + '\n' +
                            'Goal:  ' + context.session.ICOsinfo[0].goal + '\n' +
                            'End Date: ' + context.session.ICOsinfo[0].date + '\n';
                        dialog.output[0].buttons = [
                            {
                                text: 'Specific Information',
                                url: context.session.ICOsinfo[0].url
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

                function showICO2() {
                    dialog.output[0].text = 'Select the ICO you want to see the specify information.';
                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.ICOsinfo.length; i++) {
                        var ss = (i+1) + '. ' + context.session.ICOsinfo[i].name + ' [' + context.session.ICOsinfo[i].rate + ']';
                        dialog.output[0].buttons.push({text: ss})
                    }
                    dialog.output[0].buttons.push({text: 'Back'});
                    dialog.output[0].buttons.push({text: 'Start'});
                    callback();
                }
            }
        });


    bot.setType('ICO',
        {
            typeCheck: function (dialog, context, callback)
            {
                if(dialog.userInput.text.indexOf('.')===-1){
                    matched = false;
                    callback(matched);
                }
                else {
                    var matched = false;

                    if(dialog.userInput.text.toLowerCase().split('.')[2]){
                        dialog.userInput.text = dialog.userInput.text.toLowerCase().split('.')[1].trim()+'.'+dialog.userInput.text.toLowerCase().split('.')[2].split('[')[0].trim();
                    }
                    else {
                        dialog.userInput.text = dialog.userInput.text.toLowerCase().split('.')[1].split('[')[0].trim();
                    }
                    for (var i = 0; i < context.session.ICOsinfo.length; i++) {
                        if (dialog.userInput.text === context.session.ICOsinfo[i].name.toLowerCase()) {
                            context.session.ICOinfo = context.session.ICOsinfo[i];
                            matched = true;
                            return callback(matched);
                        }
                        else if(i === context.session.ICOsinfo.length - 1){
                            matched = false;
                            callback(matched);
                        }
                    }
                }
            }
        });

    bot.setTask('showICO1',
        {
            action: function (dialog, context, callback)
            {

                if(context.session.ICOinfo.kind === 'upcoming') {
                    dialog.output[0].text = ' Project: ' + context.session.ICOinfo.name + '\n' +
                        'Kind: ' + context.session.ICOinfo.kind + '\n' +
                        'Interest: ' + context.session.ICOinfo.rate + '\n' +
                        'Category: ' + context.session.ICOinfo.category + '\n' +
                        'Goal:  ' + context.session.ICOinfo.goal + '\n' +
                        'Start Date: ' + context.session.ICOinfo.date + '\n';
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
                else{
                    dialog.output[0].text = ' Project: ' + context.session.ICOinfo.name + '\n' +
                        'Kind: ' + context.session.ICOinfo.kind + '\n' +
                        'Interest: ' + context.session.ICOinfo.rate + '\n' +
                        'Category: ' + context.session.ICOinfo.category + '\n' +
                        'Received: ' + context.session.ICOinfo.now + ' / '+ context.session.ICOinfo.now_percent + '\n' +
                        'Goal:  ' + context.session.ICOinfo.goal + '\n' +
                        'End Date: ' + context.session.ICOinfo.date + '\n';
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
            }
        });



//----------------------------------------------------News-----------------------------------------------


    bot.setTask('newsCategory',
        {
            action: function (dialog, context, callback) {
                context.session.selecnews = [];
                context.session.newsinfo = [];
                COIN = dialog.userInput.text.split('.')[1].trim().toLowerCase();
                options = {};
                modelname = 'bitcoin_cointelegraph';
                options.url = SERVER_HOST + '/api/' + modelname;

                options.qs = {coin: COIN};

                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("get！   response.statusCode=" + response.statusCode);
                        body = JSON.parse(body);

                        if (body.length === 0) {
                            crawling(options);
                        }
                        else {
                            body = body.sort(function (a, b) {
                                return a.rate - b.rate;
                            });

                            var nowtime = new Date().getTime();

                            var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                            if (difference > 30) {
                                crawling(options);
                            }
                            else {
                                context.session.news = body;
                                callback();
                            }
                        }
                    }
                });


                function crawling(options) {
                    var NEWS = [];
                    url = "https://cointelegraph.com/tags/" + COIN;
                    superagent.get(url)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kinds = ['recent', 'top', 'commented'];
                            var craw = '';

                            kinds.forEach(crawling1);

                            function crawling1(kind) {
                                craw = $('#' + kind + ' div');
                                // description = $("#tag>div>div.col-md-8.description>p:nth-child(2)").text();
                                for (var i = 1; i <= 15; i++) {
                                    var s = i - 1;
                                    news[s] = {};
                                    news[s].title = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > h2 > a').text().replace(/\n/g, "").trim();
                                    news[s].url = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > h2 > a').attr('href').trim();
                                    news[s].image = craw.find('div:nth-child(' + i + ') > figure.col-sm-4 > div > a > div > img').attr('srcset').split('1x,')[0].trim();
                                    news[s].time = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > div.info > span.date').text().replace(/\n/g, "").trim();
                                    news[s].author = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > div.info > span.author > span > a').text().replace(/\n/g, "").trim();
                                    news[s].text = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > p > a').text().replace(/\n/g, "").trim();
                                    news[s].status = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > div:nth-child(4) > div > span').text().trim();
                                    news[s].rate = i;
                                    news[s].kind = kind;
                                    news[s].language = 'en';
                                    news[s].coin = COIN;
                                    news[s].created = new Date().toISOString();
                                    news[s].updateTime = new Date().getTime();

                                    NEWS.push(news[s]);
                                }
                                if(NEWS.length === 45) {

                                    request.delete(options, function (err, response, body) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            console.log("delete！   response.statusCode=" + response.statusCode);
                                            NEWS.forEach(save);
                                        }
                                    });
                                }
                            }
                        });
                }
                function save(NEWS, i) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = NEWS;

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("new！   response.statusCode=" + response.statusCode);
                            if (i === 44) {
                                options = {};
                                options.url = SERVER_HOST + '/api/' + modelname;

                                options.qs = {coin: COIN};

                                request.get(options, function (err, response, body) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("get！   response.statusCode=" + response.statusCode);
                                        body = JSON.parse(body);
                                        context.session.news = body;
                                        callback();
                                    }
                                });
                            }
                        }
                    })

                }
            }
        });



    bot.setTask('shownewstitle',
        {
            action: function (dialog, context, callback)
            {

                if(dialog.userInput.text === 'Recent'){
                    context.session.kind = 'recent';
                }
                else if(dialog.userInput.text === 'Top News'){
                    context.session.kind = 'top';
                }
                else if(dialog.userInput.text === 'Commented'){
                    context.session.kind = 'commented';
                }
                dialog.output[0].buttons = [];
                var ss = 0;

                for(var i = 0; i < context.session.news.length; i++){
                    if(context.session.news[i].kind === context.session.kind) {
                        context.session.selecnews[ss] = context.session.news[i];
                        ss++;
                        var newstitle = "" + ss + ". " + context.session.news[i].title;
                        dialog.output[0].buttons.push({text:newstitle});
                    }
                }
                callback();
            }
        });

    bot.setType('news',
        {
            typeCheck: function (dialog, context, callback) {
                var matched = false;
                context.session.newsinfo  = {};
                
                var userInput = dialog.userInput.text;

                if(userInput.indexOf('.')===-1){
                    matched = false;
                    callback(matched);
                }
                else {
                    if(userInput.split('.')[2]){
                        userInput = (userInput.split('.')[1]+'.'+userInput.split('.')[2]).trim();
                    }
                    else {
                        userInput = userInput.split('.')[1].trim();
                    }

                    for (var i = 0; i < context.session.selecnews.length; i++) {
                        if (userInput === context.session.selecnews[i].title) {
                            context.session.newsinfo = context.session.selecnews[i];
                            matched = true;
                            callback(matched);
                        }
                        else if (i === context.session.selecnews.length - 1 && context.session.newsinfo === {}) {
                            matched = false;
                            callback(matched);
                        }
                    }
                }
            }
        });

    bot.setTask('shownews',
        {
            action: function (dialog, context, callback)
            {
                dialog.output[0].images = {url: context.session.newsinfo.image};
                dialog.output[0].buttons = [
                    {
                        text: 'Specific content',
                        url: context.session.newsinfo.url
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

    bot.setType('news2',
        {
            typeCheck: function (dialog, context, callback) {
                var matched = false;

                if (dialog.userInput.matchedIntent !== 'News') {
                    matched = false;
                    callback(matched);
                }
                else {

                    var NEWS = [];
                    context.session.selecnews = [];
                    context.session.newsinfo = [];
                    COIN = ['bitcoin', 'ehtereum', 'altcoin', 'litecoin', 'ripple', 'monero'];
                    COIN.sort(function (a, b) {
                        return b.length - a.length;
                    });

                    var coin = '';


                    for (var i = 0; i < COIN.length; i++) {
                        if (dialog.userInput.text.toLowerCase().indexOf(COIN[i]) !== -1) {
                            coin = COIN[i];
                            break;
                        }
                        else if (i === COIN.length - 1 && coin === "") {
                            matched = false;
                            callback(matched);
                        }
                    }

                    options = {};
                    modelname = 'bitcoin_cointelegraph';
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.qs = {coin: coin};

                    request.get(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            console.log("get！   response.statusCode=" + response.statusCode);
                            body = JSON.parse(body);

                            if (body.length === 0) {
                                crawling(options);
                            }
                            else {
                                body = body.sort(function (a, b) {
                                    return a.rate - b.rate;
                                });

                                var nowtime = new Date().getTime();

                                var difference = (nowtime - Number(body[0].updateTime)) / (60 * 1000);

                                if (difference > 0) {
                                    crawling(options);
                                }
                                else {
                                    context.session.news = body;
                                    matched = true;
                                    callback(matched);
                                }
                            }
                        }
                    });
                }


                function crawling(options) {
                    url = "https://cointelegraph.com/tags/" + coin;
                    superagent.get(url)
                        .end(function (err, pres) {
                            var $ = cheerio.load(pres.text);
                            var kinds = ['recent', 'top', 'commented'];
                            var craw = '';
                            kinds.forEach(crawling1);

                            function crawling1(kind) {
                                craw = "";
                                craw = $('#' + kind + ' div');
                                var description = $("#tag>div>div.col-md-8.description>p:nth-child(2)").text();
                                for (var i = 1; i <= 15; i++) {
                                    var s = i - 1;
                                    news[s] = {};
                                    news[s].title = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > h2 > a').text().replace(/\n/g, "").trim();
                                    news[s].url = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > h2 > a').attr('href').trim();
                                    news[s].image = craw.find('div:nth-child(' + i + ') > figure.col-sm-4 > div > a > div > img').attr('srcset').split('1x,')[0].trim();
                                    news[s].time = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > div.info > span.date').text().replace(/\n/g, "").trim();
                                    news[s].author = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > div.info > span.author > span > a').text().replace(/\n/g, "").trim();
                                    news[s].text = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > p > a').text().replace(/\n/g, "").trim();
                                    news[s].status = craw.find('div:nth-child(' + i + ') > figure.col-sm-8 > div:nth-child(4) > div > span').text().trim();
                                    news[s].rate = i;
                                    news[s].kind = kind;
                                    news[s].language = 'en';
                                    news[s].coin = coin;
                                    news[s].created = new Date().toISOString();
                                    news[s].updateTime = new Date().getTime();

                                    NEWS.push(news[s]);
                                }
                                if (NEWS.length === 45) {
                                    request.delete(options, function (err, response, body) {
                                        if (err) {
                                            console.log(err);
                                            matched = false;
                                            callback(matched);
                                        }
                                        else {
                                            console.log("delete！   response.statusCode=" + response.statusCode);
                                            body = JSON.parse(body);
                                            NEWS.forEach(newnews)
                                        }
                                    });
                                }
                            }
                        });
                }

                function newnews(NEWs, index, NEWS) {
                    options = {};
                    options.url = SERVER_HOST + '/api/' + modelname;

                    options.json = NEWs;

                    request.post(options, function (err, response, body) {
                        if (err) {
                            console.log(err);
                            matched = false;
                            callback(matched);
                        }
                        else {
                            console.log("new！   response.statusCode=" + response.statusCode);
                            if (index === 44) {
                                options = {};
                                options.url = SERVER_HOST + '/api/' + modelname;

                                options.qs = {coin: coin};

                                request.get(options, function (err, response, body) {
                                    if (err) {
                                        console.log(err);
                                        matched = false;
                                        callback(matched);
                                    }
                                    else {
                                        console.log("get！   response.statusCode=" + response.statusCode);
                                        body = JSON.parse(body);
                                        context.session.news = body;
                                        matched = true;
                                        callback(matched);
                                    }
                                });
                            }
                        }
                    })
                }
            }
        });


    //
    // bot.setTask('coinprice_ch',
    // {
		// action: function (dialog, context, callback)
		// {
		// 	callback();
		// }
    // });
    //
    // bot.setTask('coinprice1_ch',
    // {
		// action: function (dialog, context, callback)
		// {
    //
		// 	callback();
		// }
    // });
    // bot.setTask('coinprice3_ch',
    // {
		// action: function (dialog, context, callback)
		// {
		// 	callback();
		// }
    // });
    // bot.setTask('coinprice4_ch',
    // {
		// action: function (dialog, context, callback)
		// {
		// 	callback();
		// }
    // });
    // bot.setType('coins_ch',
    // {
    //     typeCheck: function (dialog, context, callback)
    //     {
    //         var matched = false;
    //         callback(matched);
    //     }
    // });
    // bot.setTask('showcoins_ch',
    // {
		// action: function (dialog, context, callback)
		// {
		// 	callback();
		// }
    // });
    // bot.setTask('activeICO_ch',
    // {
		// action: function (dialog, context, callback)
		// {
		// 	callback();
		// }
    // });
    // bot.setType('coins2_ch',
    // {
    //     typeCheck: function (dialog, context, callback)
    //     {
    //         var matched = false;
    //         callback(matched);
    //     }
    // });
    // bot.setType('chart_ch',
    // {
    //     typeCheck: function (dialog, context, callback)
    //     {
    //         var matched = false;
    //         callback(matched);
    //     }
    // });
    // bot.setType('ico_ch',
    // {
    //     typeCheck: function (dialog, context, callback)
    //     {
    //         var matched = false;
    //         callback(matched);
    //     }
    // });



};
