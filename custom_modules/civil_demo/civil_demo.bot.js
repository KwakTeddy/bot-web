var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var civil_demo = {
  use: true,
  naver: {
    clientId: 'c7VNVyIG3s95N4q2LWZQ',
    clientSecret: 'HXWvXdrKi7'
  }
};

botlib.makeBot('civil_demo', civil_demo);



