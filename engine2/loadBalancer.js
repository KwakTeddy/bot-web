var path = require('path');

var config = require(path.resolve('./config/config.js'));

// var master = require(path.resolve('./engine2/loadbalancer/master.js'));
// var slave = require(path.resolve('./engine2/loadbalancer/slave.js'));

(function()
{
    var LoadBalancer = function()
    {

    };

    LoadBalancer.prototype.init = function(app, io)
    {
        if(config.loadBalance.use)
        {
            if(config.loadBalance.isMaster)
            {
                master.init(io);
            }
            else
            {
                slave.init();
            }
        }
    };

    module.exports = new LoadBalancer();
})();
