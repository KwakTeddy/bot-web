
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var cscenter = require('./cscenter');

var dialogs = [
{
  id: 'cscenter1',
  filename: 'cscenter',
  input: '냉장고',
  output: '고객님의 냉장고가 일반형인가요? 양문형인가요?', 
    children: [
    {
      id: 'cscenter0',
      filename: 'cscenter',
      input: '양문',
      task:       {action: function (task, context, callback) {
          task.result = {
              image: {url: 'https://dev.moneybrain.ai/files/lgsample.png'},
              buttons: [{text:'상세보기',url:'https://www.moneybrain.ai'}]
          }
          callback(task,context);
      }},
      output: '양문형 냉장고가 충분히 시원하지 않을 경우에는 다음 글을 참조하세요.\n\n글에 쓰인 방법으로도 해결되지 않을시, 전문 엔지니어의 출장 점검이 필요합니다.\n출장예약이 필요하시면, “출장 예약”을 입력해주세요.'
    }
  ]
},
{
  id: 'cscenter10',
  filename: 'cscenter',
  input: 'bb',
  output: '안녕하세요. LG전자 고객센터입니다.', 
    children: [
    {
      id: 'cscenter9',
      filename: 'cscenter',
      input: '냉장고',
      output: '고객님의 냉장고가 일반형인가요? 양문형인가요?', 
        children: [
        {
          id: 'cscenter8',
          filename: 'cscenter',
          input: '양문',
          output: '전원 코드는 제대로 꼽았나요?', 
            children: [
            {
              id: 'cscenter7',
              filename: 'cscenter',
              input: '네',
              output: '전원 콘센트에 이상은 없나요?', 
                children: [
                {
                  id: 'cscenter6',
                  filename: 'cscenter',
                  input: '네',
                  output: '냉장실만 그런가요? 냉동실도 그런가요?', 
                    children: [
                    {
                      id: 'cscenter5',
                      filename: 'cscenter',
                      input: '냉장',
                      output: '온도 설정을 낮게 하셔도 그런가요?', 
                        children: [
                        {
                          id: 'cscenter4',
                          filename: 'cscenter',
                          input: '네',
                          output: '냉장고 문이 제대로 닫혀있나요?', 
                            children: [
                            {
                              id: 'cscenter3',
                              filename: 'cscenter',
                              input: '네',
                              output: '냉장고가 가득 차있나요?', 
                                children: [
                                {
                                  id: 'cscenter2',
                                  filename: 'cscenter',
                                  input: '네',
                                  output: '냉장고 내부가 꽉 차있는 경우는 냉기 순환이 약해 냉장이 약할 수가 있습니다\n냉장고를 비워서 테스트해보시고, 그래도 문제가 해결되지 않는 경우에는 출장 점검이 필요합니다.\n출장예약이 필요하시면, “출장 예약”을 입력해주세요.'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
];

var commonDialogs = [
{
  id: 'cscentercommon0',
  filename: 'cscentercommon',
  name: '시작',
  input: '~시작',
  output: '안녕하세요. LG전자 고객센터입니다.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('demo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
