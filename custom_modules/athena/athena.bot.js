var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var athena = {
  use: true,
  naver: {
    clientId: 'c7VNVyIG3s95N4q2LWZQ',
    clientSecret: 'HXWvXdrKi7'
  },
  dialogFiles: [
    'test.dialog.js'
  ]
};

botlib.makeBot('athena', athena);

