var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var test = {
  use: true,
  serviceName: 'Coupang',
  serviceNick: 'Coupang'
};

botlib.makeBot('test', test);

