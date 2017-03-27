var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var restaurant = {
  use: true,
  schema: {
    name: {
      type: String
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    address: {
      type: String
    }
  }
};

botlib.makeBot('restaurant', restaurant);

