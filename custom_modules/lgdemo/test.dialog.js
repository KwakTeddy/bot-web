


var dialogs = [
{
  id: 1,
  input: '로봇 등록',
  output: '유저키를 말해주세요',
    children: [
    {
      id: 0,
      input: '~~~',
      task:       {},
      output: ['~~', '~~']
    }
  ]
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('lgdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);

// TEST
var json = JSON.stringify(dialogs);
console.log(json);
var fs = require('fs');
fs.writeFile(require('path').resolve("public/js") + "/dialog.json", json, function(err) {
if(err) { return console.log(err); }
console.log("dialog.json was saved!"); });
