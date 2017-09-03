var path = require('path');
var request = require('request');
var config = require(path.resolve('./config/config'));
var redis = require('redis');
var cache;

var FAIL_OUT = 100;
var SERVER_UPDATE_INTERVAL = 60;

var servers = [
  {server: config.host + ':' + config.port, count: 0, fail: 0}
];

var bUse = false;
var bMaster = false;
var bSlave = false;

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

  console.log('processing load servers');


  var ss = cache.lrange('servers', 0, -1);

  servers = [];
  for(var i = 0; i < ss.length; i++) {
    servers.push({server: ss[i].server, count: 0, fail: 0});
  }
}

function initServer() {
  loadServers();
  
  setInterval(function() {
    console.log('processing update server check: ' + (new Date()));

    loadServers();
  }, SERVER_UPDATE_INTERVAL*1000);
}

exports.initServer = initServer;

function addServer() {
  if(cache == undefined) return;

  cache.lrange('servers', 0, -1, function(err, ss) {
    console.log('Load Balancer: addServer redis=' + ss);
    var server = config.host + ':' + config.port;

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
          addServer();
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
  var _request = function() {
    if(!server) server = config.host + ':' + config.port;

    request({
      uri: server + '/chat/' + bot + '/message',
      method: 'POST',
      json: query
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json;
        try {
          json = JSON.parse(body);
        } catch(e) {
        }

        callback(json ? json.text : body, json);

        for(var i = 0; i < servers.length; i++) {
          if(servers[i].server == server) servers[i].count++;
        }
      } else {
        console.log("Unable to send message.");
        // console.log(JSON.stringify(response.body.error));
        console.log(error);

        for(var i = 0; i < servers.length; i++) {
          if(servers[i].server == server) servers[i].fail++;
        }
        callback(JSON.stringify(error));
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
        server = data;
        if (server) {
          for (var i = 0; i < servers.length; i++) {
            if (servers[i].server == server && servers[i].fail >= FAIL_OUT) server = undefined;
          }
        }

        if (!server) {
          var minLoad = -1, minServer;
          for (var i = 0; i < servers.length; i++) {
            if (minLoad == -1 || (servers[i].count < minLoad && servers[i].fail < FAIL_OUT)) {
              minLoad = servers[i].count;
              minServer = i;
            }
          }

          server = servers[minServer].server;
          cache.set(channel + user, server);
        }

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