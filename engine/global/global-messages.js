var path = require('path');
var globals = require(path.resolve('./engine/bot/engine/common/globals'));

var messages = {
  // typeExit: '\n처음으로 돌아가기: \'ㄱ\'',
  typeExit: '',
  typeAddress: '주소 형식이 틀렸습니다.',
  typeAddressCheck1: '입력하신 주소가 없습니다.',
  yesRegExp: "응|그래|네|그렇다|오케이|예스|ㅇㅋ|ㅇㅇ|OK|ok|Ok|YES|yes|Yes|sp|SP",
  noRegExp: "아니다|싫다|않다|노|NO|no|No",
  userError: '일시적 오류가 발생하였습니다.\n\n불편을 드려 죄송합니다.\n\n"시작"을 입력하여 처음부터 다시 시작해 주세요'
};

globals.setGlobalMessages(messages);
