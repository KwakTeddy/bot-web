
var path = require('path');
var dialog = require(path.resolve('modules/bot/action/common/dialog'));
var botlib = require(path.resolve('config/lib/bot'));
var bot = botlib.getBot('sample');

var dialogs = [
{
<<<<<<< HEAD
  input: { pattern: 'dbListPattern', params: {type: 'franchise', field: 'name', desc: '음식점', output: '+franchise.name+\n전화번호 +franchise.category+'}},
=======
  input: { pattern: 'dbListPattern', params: {type: 'franchise', field: 'name', desc: '음식점', output: '+franchise.name+\n전화번호 +franchise.category+'}} ,
>>>>>>> ad9f45ab53e3d4667f0804c5ba38dab9c52ceff8
  output: ''
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('sample');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
