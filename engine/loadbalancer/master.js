var path = require('path');
var engine = require(path.resolve('engine/bot/server/controllers/bot.server.controller'));
var request = require('request');

(function()
{
    var Master = function()
    {
        this.slaves = [];
        this.userMap = {};
    };

    Master.prototype.connection = function(client)
    {
        var that = this;
        client.on('lb_initialize', function(host)
        {
            var slaveObject = { host: host };
            that.slaves.push(slaveObject);
            console.log('새로운 슬레이브가 연결되었습니다 : ', host);
            console.log('=========== 모든 슬레이브 ===========');
            console.log(that.slaves.join('\n'));
            console.log('=====================================');

            client.on('lb_cpu', function(usage)
            {
                slaveObject.cpuUsage = usage;

                console.log('CPU Usage [' + host + ']', usage + '%');

                if(usage >= 40)
                {
                    that.createInstance(slaveObject);
                }
            });

            client.on('disconnect', function()
            {
                that.disconnect.call(that, slaveObject);
            });
        });
    };

    Master.prototype.disconnect = function(slaveObject)
    {
        delete this.slaves[host];

        console.log('슬레이브 연결이 해제되었습니다 : ', slaveObject.host);
        console.log('=========== 모든 슬레이브 ===========');
        for(var key in this.slaves)
        {
            console.log(key);
        }
        console.log('=====================================');
    };

    Master.prototype.createInstance = function(slaveObject)
    {
        //생성하고 next를 Ready로 기록한다.
        if(slaveObject.next)
            return;

        console.log('인스턴스 생성해야해');

        //생성하고 난 다음에 생성중 플래그 선언.
        //this.slaves[host].next = true;
        //만약 나중에 생성된 슬레이브가 자체 종료를 선언하게 되면?
    };

    Master.prototype.routing = function(channel, user, bot, text, json, callback)
    {
        var targetHost = undefined;

        if(this.userMap[user])
        {
            //만약 이 유저를 처리하고 있던 서버가 있다면. 해당 서버로 넘긴다.
            targetHost = this.userMap[user];
            if(!this.slaves.hasOwnProperty(targetHost)) // 그런데 해당 서버가 종료되었다면 초기화해야함
            {
                targetHost = undefined;
            }
        }

        if(!targetHost)
        {
            for(var key in this.slaves)
            {
                var cpuUsage = this.slaves[key].cpuUsage;

                //슬레이브는 하나당 최대 cpu 50% 까지만 사용하도록 한다. 모든 슬레이브가 50이 넘었다면 다음 슬레이브가 실행중일텐데 그 사이 처리는 마스터가 해보자.
                if(!cpuUsage || cpuUsage < 50)
                {
                    targetHost = key;
                    break;
                }
            }

            //만약 최초 유저의 경우 모든 슬레이브에서 처리가 불가능하다면 마스터로 세팅한다.
            this.userMap[user] = targetHost ? targetHost : 'master';
        }

        if(!targetHost)
        {
            //슬레이브가 없다면 마스터가 처리한다.
            engine.write(channel, user, bot, text, json, callback);
        }
        else
        {
            var query =
            {
                channel: channel,
                user: user,
                bot: bot,
                text: text
            };

            request({ uri: 'http://' + targetHost + ':3000/chat/' + bot + '/message', method: 'POST', json: query }, function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    callback(body.text? body.text:body, body);
                }
                else
                {
                    console.error('채널 라우팅 에러 : ', error);
                    callback(JSON.stringify(error));
                }
            });
        }
    };

    Master.prototype.init = function(io)
    {
        io.on('connection', this.connection.bind(this));
    };

    var instance = new Master();

    module.exports = instance;
})();
