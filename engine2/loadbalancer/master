var path = require('path');
var engine = require(path.resolve('engine2/bot/server/controllers/bot.server.controller'));
var request = require('request');

(function()
{
    var Master = function()
    {
        this.slaves = [];
        this.slaveMap = {};
        this.userMap = {};
        this.master = { host: 'localhost', users: {} };
        this.awsEc2Creator = undefined;
        this.isCreating = false;
    };

    Master.prototype.connection = function(client)
    {
        var that = this;
        client.on('lb_initialize', function(host)
        {
            var slaveObject = { host: host, cpuUsage: -1, users: {} };
            that.slaves.push(slaveObject);
            console.log('새로운 슬레이브가 연결되었습니다 : ' + host);
            console.log('=========== 모든 슬레이브 ===========');
            for(var i=0; i<that.slaves.length; i++)
            {
                console.log(that.slaves[i].host);
            }

            if(that.slaveMap[host])
            {
                slaveObject.instanceId = that.slaveMap[host].instanceId;
                console.log('연결되었다 : ' + that.slaveMap[host].instanceId);
            }

            console.log('=====================================');

            that.isCreating = false;

            // client.on('lb_cpu', function(usage)
            // {
            //     slaveObject.cpuUsage = parseFloat(usage);
            //
            //     console.log('CPU Usage [' + host + ']  ' + usage + '% ' + (usage >= 40));
            //
            //     if(usage >= 40)
            //     {
            //         that.createInstance(slaveObject);
            //     }
            // });

            client.on('disconnect', function()
            {
                that.disconnect.call(that, slaveObject);
            });
        });
    };

    Master.prototype.disconnect = function(slaveObject)
    {
        var index = this.slaves.indexOf(slaveObject);
        this.slaves.splice(index, 1);

        console.log('슬레이브 연결이 해제되었습니다 : ' + slaveObject.host);
        console.log('=========== 모든 슬레이브 ===========');
        for(var i=0; i<this.slaves.length; i++)
        {
            console.log(this.slaves[i].host);
        }
        console.log('=====================================');
    };

    Master.prototype.createInstance = function()
    {
        this.isCreating = true;
        // var index = this.slaves.indexOf(slaveObject);
        // if(index < this.slaves.length-1)
        //     return;

        var that = this;
        console.log('인스턴스 생성해야해');
        this.awsEc2Creator.createInstance(function(err, result)
        {
            if(err)
            {
                that.isCreating = false;
            }

            that.slaveMap[result.privateHost] = result;
        });
    };

    Master.prototype.deleteInstance = function()
    {
        var that = this;

        //5분에 한 번씩 실행한다.
        setTimeout(function()
        {
            // 모든 슬레이브의 유저들을 돌면서 마지막 대화가 10분이 넘은 유저는 거기서 삭제한다.
            // 그리고 모든 유저가 삭제된 슬레이브도 삭제한다.
            // 최소 슬레이브는 남겨야함.

            console.log('슬레이브 삭제 체크');

            var now = new Date().getTime();

            for(var i=0; i<that.slaves.length; i++)
            {
                var slave = that.slaves[i];
                for(var key in slave.users)
                {
                    var lastRequest = slave.users[key];
                    var diffMins = Math.round((((now - lastRequest) % 86400000) % 3600000) / 60000); // minutes
                    if(diffMins >= 1) //마지막 대화가 30분이 넘은 유저는 삭제
                    {
                        delete slave.users[key];
                        delete that.userMap[key];
                    }
                }

                if(Object.keys(slave.users).length == 0 && slave.instanceId)
                {
                    console.log('서버 삭제합니다' + slave.instanceId);
                    (function(slave)
                    {
                        that.awsEc2Creator.deleteInstance(slave.instanceId, function(err, data)
                        {
                            if(!err)
                            {
                                var targetIndex = that.slaves.indexOf(slave);
                                that.slaves.splice(targetIndex, 1);

                                console.log('=========== 모든 슬레이브 ===========');
                                for(var i=0; i<that.slaves.length; i++)
                                {
                                    console.log(that.slaves[i].host);
                                }
                                console.log('=====================================');
                            }
                        });
                    })(slave);
                }
            }

            for(var key in that.master.users)
            {
                var lastRequest = that.master.users[key];
                var diffMins = Math.round((((now - lastRequest) % 86400000) % 3600000) / 60000); // minutes
                if(diffMins >= 1) //마지막 대화가 30분이 넘은 유저는 삭제
                {
                    console.log('마스터에서 삭제 ' + key);
                    delete that.master.users[key];
                    delete that.userMap[key];
                }
            }

            that.deleteInstance();
        }, 1000 * 60 * 1);
    };

    Master.prototype.routing = function(channel, user, bot, text, json, callback)
    {
        var targetHost = undefined;

        //만약 유저가 대화중인 슬레이브 서버가 있다면 구해야함. 그런데 모종의 이유로 슬레이브가 죽을수도 있음.
        if(this.userMap[user])
        {
            var index = this.slaves.indexOf(this.userMap[user]);
            if(index == -1) // 대화중이었던 슬레이브 서버가 죽은거임. 얘는 새로 할당해줘야함.
            {

            }
            else
            {
                //대화중인 슬레이브 서버 호스트를 세팅해줌.
                targetHost = this.userMap[user].host;
                this.userMap[user].users[user] = new Date().getTime(); //해당 유저의 마지막 대화 시간 기록.
            }
        }

        //만약 최초 접속한 유저이거나 대화중인 슬레이브가 죽은경우 새로 슬레이브를 할당해야함.
        if(!targetHost)
        {
            for(var i=0; i<this.slaves.length; i++)
            {
                var usersCount = Object.keys(this.slaves[i].users).length;
                //사람당 초당 2개씩 보낼 수 있다고 가정했을때 50명이 초당 2개씩 초당 100개의 request를 받으면 t2.medium의 cpu가 50%정도 도달한다. 50%이상은 쓰지 않는것으로.
                if(usersCount <= 50)
                {
                    console.log('유저 카운트 [' + this.slaves[i].host + '] ' + usersCount + ' ' + i);
                    //만약 마지막 슬레이브의 유저가 10명 이상이면 슬레이브 생성
                    if(usersCount > 10 && this.slaves.length-1 == i && !this.isCreating)
                    {
                        this.createInstance(this.slaves[i]);
                    }

                    console.log('새로운 유저 할당 : ' + Object.keys(this.slaves[i].users).length);
                    targetHost = this.slaves[i].host;
                    this.slaves[i].users[user] = new Date().getTime(); //해당 유저의 마지막 대화 시간 기록.
                    this.userMap[user] = this.slaves[i];
                    break;
                }
            }

            if(!targetHost)
            {
                targetHost = 'master';
                this.master.users[user] = new Date().getTime();
                this.userMap[user] = this.master;
            }
        }

        if(!targetHost || targetHost == 'master')
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
                    console.error('채널 라우팅 에러 : ' + JSON.stringify(error) + targetHost);
                    callback(null, null, JSON.stringify(error));
                }
            });
        }
    };

    Master.prototype.init = function(io)
    {
        this.awsEc2Creator = require('./aws-ec2-creator.js');
        io.on('connection', this.connection.bind(this));
        this.deleteInstance();
    };

    var instance = new Master();

    module.exports = instance;
})();
