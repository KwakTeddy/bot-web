


var dialogs = [
{
  input: 'test',
  task:   {action: 'http://www.naver.com'},
  output: 'test', 
    children: [
    {
      input: 'aaa',
      output: 'bbb'
    },
    {
      input: 'bbb',
      output: 'ccc'
    },
    {
      input: 'ccc',
      output: 'ddd'
    }
  ]
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
