var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('ddbot');

var concepts = {
  '배달': ['주문', '시키다', '보내다']
};

bot.setConcepts(concepts);
