
var path = require('path');
var dialog = require(path.resolve('modules/bot/action/common/dialog'));
var botlib = require(path.resolve('config/lib/bot'));
var bot = botlib.getBot('sample');

var dialogs = [
{
  input: { pattern: 'dbListPattern', params: {type: 'franchise', field: 'name', desc: '음식점', output: '+franchise.name+\n전화번호 +franchise.category+'}},
  output: ''
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('sample');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
