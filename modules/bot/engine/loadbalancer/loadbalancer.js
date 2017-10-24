var path = require('path');
var request = require('request');
var config = require(path.resolve('./config/config'));
var redis = require('redis');
var cache;
var MongoClient = require('mongodb').MongoClient;
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var localhost = utils.getLocalIPAddress();

var FAIL_OUT = 10;
var SERVER_UPDATE_INTERVAL = 10;

var servers = [
  {server: config.host + ':' + config.port, count: 0, fail: 0, time: 0}
];

var bUse = false;
var bMaster = false;
var bSlave = false;
var serverNum = 0;

function isUse() {
  return bUse;
}
exports.isUse = isUse;

function isMaster() {
  return bMaster;
}

exports.isMaster = isMaster;

function isSlave() {
  return bSlave;
};

exports.isSlave = isSlave;

function loadServers() {
  if(cache == undefined) return;

  cache.lrange('servers', 0, -1, function(err, data) {

    for(var i = 0; i < data.length; i++) {
      var bExist = false;
      for(var j = 0; j < servers.length; j++) {
        if(servers[j].server == data[i]) {
          if(servers[j].fail >= FAIL_OUT) {
            // cache.lrem('servers', 0, data[i]);

            console.log('processing fail check server=' + servers[j].server + ', fail=' + servers[j].fail);

            var _server = servers[j];
            request({
              uri: _server.server + '/kakao/test/keyboard',
              method: 'GET'
            }, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                _server.fail = 0;
              }
            });
          }

          servers[j].count = 0;
          bExist = true;
        }
      }
      if(!bExist) servers.push({server: data[i], count: 0, fail: 0});
    }

    console.log('processing load servers=' + JSON.stringify(servers));
  });
}

function initServer() {
  servers = [];
  loadServers();
  
  setInterval(function() {
    // console.log('processing update server check: ' + (new Date()));

    loadServers();
  }, SERVER_UPDATE_INTERVAL*1000);
}

exports.initServer = initServer;

function addServer() {
  console.log('Load Balancer: addServer Start');
  if(cache == undefined) return;

  cache.lrange('servers', 0, -1, function(err, ss) {
    console.log('Load Balancer: addServer redis=' + ss);
    // var server = config.loadBalance.host + ':' + config.loadBalance.port;
    var server = 'http://' + localhost + ':3000';

    console.log('Load Balancer: addServer check=' + server);
    var bExist = false;
    for(var i = 0; i < ss.length; i++) {
      if(ss[i] == server) bExist = true;
    }

    if(!bExist) {
      cache.lpush('servers', server);
      console.log('Load Balancer: addServer added=' + server);
    }
  });

}

exports.addServer = addServer;

function addMongoReplica(callback) {
  console.log('Load Balancer: addMongoReplica Start ' + localhost);

  MongoClient.connect('mongodb://172.31.23.169:27017/test', function(err, db) {
    console.log('Load Balancer: addMongoReplica Connected');
    var adminDb = db.admin();

    adminDb.command( { replSetGetConfig: 1 } , function(err, _conf) {
      var conf = _conf.config;

      var bExist = false;
      for(var i = 0; i < conf.members.length; i++) {
        if(conf.members[i].host == localhost + ':27017') bExist = true;
      }

      if(!bExist) {
        conf.members.push({_id: conf.members.length, host: localhost + ':27017'});
        conf.version = conf.version + 1;
        adminDb.command({replSetReconfig: conf}, function(err, info) {
          if(err) console.log(err);
          else console.log('Load Balancer: addMongoReplica: ' + JSON.stringify(info));


          adminDb.command({"replSetGetStatus":1 },function(err,result) {
            console.log( JSON.stringify(result) );
          });

          callback();
        });
      } else {
        adminDb.command({"replSetGetStatus":1 },function(err,result) {
          console.log( JSON.stringify(result) );
        });

        callback();
      }
    });
  });
}

function init() {
  bUse = config.loadBalance.use;
  bMaster = config.loadBalance.isMaster;
  bSlave = config.loadBalance.isSlave;

  console.log('Load Balancer: init Use=' + bUse + ', Master=' + bMaster + ', Slave=' + bSlave);

  if(bUse) {
    try {
      console.log('Load Balancer: Redis Connecting ' + config.redis.host + ':' + config.redis.port);
      cache = redis.createClient(config.redis.port, config.redis.host);

      cache.on('connect', function() {
        console.log('Load Balancer: Redis Connected ' + config.redis.host + ':' + config.redis.port);

        if(bSlave) {
          addMongoReplica(function() {
            addServer();
          });
        } else {
          initServer();
        }
      })
    } catch(e) {
      console.log(e);
    }
  }
}

exports.init = init;

function balance(channel, user, bot, text, json, callback) {
  var server;
  var retryCount = 0;
  var _request = function() {
    // if(!server) server = config.loadBalance.host + ':' + config.loadBalance.port;

    if(!server)
    {
        console.log('마스터 실행');
        server = 'http://' + localhost + ':3000';
        var botServer = require(path.resolve('./modules/bot/server/controllers/bot.server.controller.js'));
        botServer.write(channel, user, bot, text, json, function(_out, _task)
        {
            if(_task == undefined || (_task.result == undefined && _task.image == undefined && _task.buttons == undefined && _task.items == undefined)) {
                callback(_out.text, _out);
            } else if(_task.result) {
                if(_task.result.text == undefined) _task.result.text = _out;
                callback(JSON.stringify(_task.result), JSON.stringify(_task.result));
            } else {
                _task.text = _out;
                _task.topTask = undefined;
                callback(JSON.stringify(_task), JSON.stringify(_task));
            }
        });

        return;
    }

    request({
      uri: server + '/chat/' + bot + '/message',
      method: 'POST',
      json: query
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // var json;
        // try {
        //   json = JSON.parse(body);
        // } catch(e) {
        // }

        callback(body.text? body.text:body, body);

        for(var i = 1; i < servers.length; i++) {
          if(servers[i].server == server) {
            servers[i].count++;

            // console.log('loadbalancer:balance: ' + server + '[' + servers[i].count + ']');
          }
        }

      } else {
        for(var i = 1; i < servers.length; i++) {
          if(servers[i].server == server) {
            servers[i].fail++;
            servers[i].time = -1;

            console.error('=======================================================================');
            console.error('loadbalancer:balance: ' + server + '[' + servers[i].count + '] ');
            console.error(error.stack || error);
            console.error('channel: ' + channel);
            console.error('user: ' + user);
            console.error('bot: ' + bot);
            console.error('text: ' + text);
            console.error('=======================================================================');

            break;
          }
        }

        setTimeout(function()
        {
            console.error('재시도 : ' + server + '[' + retryCount + '] ');
            if(retryCount == 4)
            {
                return callback(JSON.stringify(error));
            }

            retryCount++;
            _request();
        }, 500);
      }
    });
  };

  var query = {
    channel: channel,
    user: user,
    bot: bot,
    text: text
  };

  if(cache && cache.connected) {

    try {
      cache.get(channel + user, function (err, data) {
        // console.log('loadbalancer:balance: ' + (channel + user) + '=' + data);
        if (data) {
          for (var i = 0; i < servers.length; i++) {
            if (servers[i].server == data) {
              if(servers[i].fail >= FAIL_OUT) server = undefined;
              else server = data;
            }
          }
        }

        // console.log('loadbalancer:balance: server0=' + server);

        // if (!server) {
        //   var minLoad = -1, minTime = 10000, minServer;
        //   for (var i = 0; i < servers.length; i++) {
        //     if ((minLoad == -1 || servers[i].count < minLoad) && servers[i].fail < FAIL_OUT) {
        //       minLoad = servers[i].count;
        //       minServer = i;
        //     }
        //   }
        //
        //   if(minLoad != -1) {
        //     server = servers[minServer].server;
        //     cache.set(channel + user, server);
        //   }
        // }

        if (!server && servers.length > 0) {
          for (var i = 0; i < servers.length; i++) {
            serverNum = (++serverNum) % servers.length;
            if(servers[serverNum].fail < FAIL_OUT) break;
          }

          server = servers[serverNum].server;
          cache.set(channel + user, server);
        }

          console.log("서버 호출 : " + server);
        // console.log('loadbalancer:balance: server=' + JSON.stringify(servers));
        _request();

      });
    } catch(e) {
      if(servers.length > 0) server = servers[0].server;
      _request();
    }
  } else {
    if(servers.length > 0) server = servers[0].server;
    _request();
  }
}

exports.balance = balance;
