var os = require('os');
var osUtils = require('os-utils');

function getLocalIPAddress() {

    var _address = '127.0.0.1';
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                _address = address.address;
                // addresses.push(address.address);
            }
        }
    }

    return _address;
}

(function()
{
    var Slave = function()
    {
        this.socket = undefined;
    };

    Slave.prototype.connection = function()
    {
        console.log('연결');
        this.socket.emit('lb_initialize', getLocalIPAddress());
        // this.checkCpuUsage();
    };

    Slave.prototype.disconnect = function()
    {

    };

    Slave.prototype.checkCpuUsage = function()
    {
        var that = this;
        setTimeout(function()
        {
            osUtils.cpuUsage(function(v)
            {
                console.log('시피유 : ' + v);
                that.socket.emit('lb_cpu', v * 100);
                that.checkCpuUsage();
            });

        }, 5 * 1000);
    };

    Slave.prototype.init = function()
    {
        var SERVER_HOST = process.env.MASTER_HOST;
        console.log('마스터 서버호스트 : ' + SERVER_HOST);

        this.socket = require('socket.io-client')(SERVER_HOST);
        this.socket.on('connect', this.connection.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
    };

    module.exports = new Slave();
})();
