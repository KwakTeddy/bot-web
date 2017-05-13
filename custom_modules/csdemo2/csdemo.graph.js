
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var csdemo = require('./csdemo');
var pre = /(?:~이전페이지|~앞|^<$)/;
var next = /(?:~다음페이지|~뒤|^>$)/;
var up = /(?:^0$)/
var first = /(?:~시작|~처음|^!$|취소)/

var dialogs = [
{
  id: 'csdemo0',
  filename: 'csdemo',
  input: [{text:'출장 비'}, {text:'수리 비'}, {text:'비용'}],
  output: {output:'출장비용은 15,000원 입니다.평일 18시이후 및 주말엔 18,000원 입니다.\n수리비, 부품비는 엔지니어 점검 후 안내해 드리고 있습니다.\n단, 품질보증 기간이내 정상 사용 중 발생된 기능/성능상의 하자의 경우 무상으로 조치됩니다.'}
},
{
  id: 'csdemo5',
  filename: 'csdemo',
  name: '냉장고온도조절',
  input: [{text:'~냉장고 온도 조절'}, {text:'~냉장고 온도 설정'}, {text:'~냉장고 온도 어떻다'}, {text:'~냉장고 온도 싶다'}],
  output: {output:'[답변]\n1. [잠금/풀림] 버튼을  2초 이상 길게 눌러 풀림 상태로 만듭니다.\n1초 이상 누를 시 잠금이 풀리는 모델도 있습니다.\n2. 냉동실은 "냉동온도", 냉장실은 "냉장온도" 버튼으로 원하는 온도로 조절 할 수 있습니다.\n3. 원하시는 온도로 조절하신 후 잠금/풀림 버튼을 누르시면 다시 자물쇠가 잠금그림으로 됩니다.\n\n답변이 유용한가요?'}, 
    children: [
    {
      id: 'csdemo1',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
    },
    {
      id: 'csdemo4',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo2',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo3',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo10',
  filename: 'csdemo',
  name: '에어컨온도조절',
  input: [{text:'~에어컨 온도 조절'}, {text:'~에어컨 온도 설정'}, {text:'~에어컨 온도 어떻다'}, {text:'~에어컨 온도 싶다'}],
  output: {output:'[답변]\n에어컨은 기기의 버튼 또는 리모콘을 통해 온도조절을 할 수 있습니다.\n\n답변이 유용한가요?'}, 
    children: [
    {
      id: 'csdemo6',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
    },
    {
      id: 'csdemo9',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo7',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo8',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo13',
  filename: 'csdemo',
  input: [{text:'온도 조절'}, {text:'온도 설정'}, {text:'온도 어떻다'}, {text:'온도 싶다'}],
  output: {output:'어떤 제품의 온도조절 방법이 궁금하신가요?\n(냉장고 또는 에어컨)'}, 
    children: [
    {
      id: 'csdemo11',
      filename: 'csdemo',
      input: {text:'~냉장고'},
      output: {call:'냉장고온도조절'}
    },
    {
      id: 'csdemo12',
      filename: 'csdemo',
      input: {text:'~에어컨'},
      output: {call:'에어컨온도조절'}
    }
  ]
},
{
  id: 'csdemo18',
  filename: 'csdemo',
  input: {text:'~투인원 함께 ~약냉'},
  output: {output:'[답변]\n정속 투인원 모델(FNC*** / FNS*** 모델)은 스탠드형/벽걸이형 동시에 가동을 하게 되면 냉기가 약해질 수 있습니다.\n실외기에서 낼 수 있는 냉방 성능은 정해져 있고, 그 냉방 성능을 스탠드형과 벽걸이형이 나눠서 가집니다.\n하지만 최근에 개발되는 투인원(FNQ***)모델은 고효율 인버터 냉방 시스템을 적용하여 인버터 압축기의 회전수를 높여 100% 능력을 달성합니다.\n\n답변이 유용한가요?'}, 
    children: [
    {
      id: 'csdemo14',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
    },
    {
      id: 'csdemo17',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo15',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo16',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo23',
  filename: 'csdemo',
  input: [{text:'Od'}, '오디'],
  output: {output:'[답변]\n[Od]는 실외기 과열 감지 표시입니다.\n실외기 앞쪽 환기창이 열려있다 하더라도 갤러리 각도가 일직선이 되지 않거나 방충망이 닫혀있는 경우에도 발생할 수 있습니다.\n날씨가 더울 때는 갤러리 각도를 일직선으로 맞추고 방충망까지 열어주세요.\n실외기가 열을 받으면 냉각 능력이 떨어질 수 있습니다. \n\n답변이 유용한가요?'}, 
    children: [
    {
      id: 'csdemo19',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
    },
    {
      id: 'csdemo22',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo20',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo21',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo24',
  filename: 'csdemo',
  input: [{text:'냉동 잘되다 냉장 안 돼다'}, {text:'냉장 실만'}],
  output: []
},
{
  id: 'csdemo38',
  filename: 'csdemo',
  name: '예약',
  input: [{text:'출장'}, {text:'점검'}, {text:'예약'}],
  output: {output:'출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다.\n출장 방문시 안내를 받으실 분의 성함을 입력해 주세요.'}, 
    children: [
    {
      id: 'csdemo37',
      filename: 'csdemo',
      input: {regexp: /[가-힣]/g},
      output: {output:'저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요.'}, 
        children: [
        {
          id: 'csdemo35',
          filename: 'csdemo',
          input: {types: [{type : type.mobileType, context: false}]},
          output: {output:'출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다.'}, 
            children: [
            {
              id: 'csdemo33',
              filename: 'csdemo',
              input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}]},
              output: {output:'출장 수리를 받고 싶으신 날짜를 입력해주세요'}, 
                children: [
                {
                  id: 'csdemo31',
                  filename: 'csdemo',
                  input: [{text:'월'}, {text:'일'}, {text:'내일'}, {text:'모레'}, {text:'오늘'}, {regexp: /\d{1,2} \/ \d{1,2}/g}],
                  output: {output:'고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.'}, 
                    children: [
                    {
                      id: 'csdemo29',
                      filename: 'csdemo',
                      input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                      output: {output:'출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요?'}, 
                        children: [
                        {
                          id: 'csdemo25',
                          filename: 'csdemo',
                          input: {text:'~네'},
                          output: {output:'고객님, 어떤 부분이 궁금하신가요?'}
                        },
                        {
                          id: 'csdemo28',
                          filename: 'csdemo',
                          input: {text:'~아니요'},
                          output: {output:'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?'},
                          children: [
                            {
                              id: 'csdemo26',
                              filename: 'csdemo',
                              input: {text:'~네'},
                              output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
                            },
                            {
                              id: 'csdemo27',
                              filename: 'csdemo',
                              input: {text:'~아니요'},
                              output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 LG전자이 되겠습니다.\nLG전자 콜센터 번호는 1577-7314입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'}
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 'csdemo30',
                      filename: 'csdemo',
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                    }
                  ]
                },
                {
                  id: 'csdemo32',
                  filename: 'csdemo',
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                }
              ]
            },
            {
              id: 'csdemo34',
              filename: 'csdemo',
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.|지번 또는 도로명을 포함한 상세주소를 말씀해주세요.'}}
            }
          ]
        },
        {
          id: 'csdemo36',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
        }
      ]
    }
  ]
},
{
  id: 'csdemo47',
  filename: 'csdemo',
  name: '약냉',
  input: [{text:'~냉장고 ~약냉 ~양문형'}, {text:'~냉장고 ~약냉 ~일반형'}],
  task:   'refriweak',
  output: {output:'아래는 냉장고의 냉기가 약할 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.'}, 
    children: [
    {
      id: 'csdemo43',
      filename: 'csdemo',
      input: {types: [{name: 'doc', listName: 'doc', field: 'title', typeCheck: 'listTypeCheck'}]},
      output: {output:'[답변]\n+doc.content+\n\n답변이 유용한가요?'}, 
        children: [
        {
          id: 'csdemo39',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
        },
        {
          id: 'csdemo42',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
          children: [
            {
              id: 'csdemo40',
              filename: 'csdemo',
              input: {text:'~네'},
              output: {call:'예약'}
            },
            {
              id: 'csdemo41',
              filename: 'csdemo',
              input: {text:'~아니요'},
              output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo46',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo44',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo45',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo50',
  filename: 'csdemo',
  name: '냉장고약냉',
  input: {text:'~냉장고 ~약냉'},
  task:   'checktorefri',
  output: {output:'고객님의 냉장고의 형태를 말씀해주세요.\n\(양문형 또는 일반형\)'}, 
    children: [
    {
      id: 'csdemo48',
      filename: 'csdemo',
      input: [{text:'~양문형'}, {text:'~일반형'}],
      output: {call: '약냉'}
    },
    {
      id: 'csdemo49',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo59',
  filename: 'csdemo',
  name: '강냉',
  input: [{text:'~냉장고 ~강냉 ~양문형'}, {text:'~냉장고 ~강냉 ~일반형'}],
  task:   'refristrong',
  output: {output:'아래는 냉장고의 냉기가 너무 강할 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.'}, 
    children: [
    {
      id: 'csdemo55',
      filename: 'csdemo',
      input: {types: [{name: 'doc', listName: 'doc', field: 'title', typeCheck: 'listTypeCheck'}]},
      output: {output:'[답변]\n+doc.content+\n\n답변이 유용한가요?'}, 
        children: [
        {
          id: 'csdemo51',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
        },
        {
          id: 'csdemo54',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
          children: [
            {
              id: 'csdemo52',
              filename: 'csdemo',
              input: {text:'~네'},
              output: {call:'예약'}
            },
            {
              id: 'csdemo53',
              filename: 'csdemo',
              input: {text:'~아니요'},
              output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo58',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo56',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo57',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo62',
  filename: 'csdemo',
  name: '냉장고강냉',
  input: {text:'~냉장고 ~강냉'},
  task:   'checktorefri',
  output: {output:'고객님의 냉장고의 형태를 말씀해주세요.\n\(양문형 또는 일반형\)'}, 
    children: [
    {
      id: 'csdemo60',
      filename: 'csdemo',
      input: [{text:'~양문형'}, {text:'~일반형'}],
      output: {call: '강냉'}
    },
    {
      id: 'csdemo61',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat:1, options: {output: '양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo71',
  filename: 'csdemo',
  name: '무냉',
  input: [{text:'~냉장고 ~무냉 ~양문형'}, {text:'~냉장고 ~무냉 ~일반형'}],
  task:   'refrino',
  output: {output:'아래는 냉장고이 작동하지 않을 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.'}, 
    children: [
    {
      id: 'csdemo67',
      filename: 'csdemo',
      input: {types: [{name: 'doc', listName: 'doc', field: 'title', typeCheck: 'listTypeCheck'}]},
      output: {output:'[답변]\n+doc.content+\n\n답변이 유용한가요?'}, 
        children: [
        {
          id: 'csdemo63',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
        },
        {
          id: 'csdemo66',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
          children: [
            {
              id: 'csdemo64',
              filename: 'csdemo',
              input: {text:'~네'},
              output: {call:'예약'}
            },
            {
              id: 'csdemo65',
              filename: 'csdemo',
              input: {text:'~아니요'},
              output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo70',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo68',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo69',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo74',
  filename: 'csdemo',
  name: '냉장고무냉',
  input: {text:'~냉장고 ~무냉'},
  task:   'checktorefri',
  output: {output:'고객님의 냉장고의 형태를 말씀해주세요.\n\(양문형 또는 일반형\)'}, 
    children: [
    {
      id: 'csdemo72',
      filename: 'csdemo',
      input: [{text:'~양문형'}, {text:'~일반형'}],
      output: {call: '무냉'}
    },
    {
      id: 'csdemo73',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat:1, options: {output: '양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo79',
  filename: 'csdemo',
  name: '냉장고',
  input: [{text:'~냉장고 ~양문형'}, {text:'~냉장고 ~일반형'}],
  task:   'checktorefri',
  output: {output:'고객님 냉장고의 증상을 말씀해주세요.'}, 
    children: [
    {
      id: 'csdemo75',
      filename: 'csdemo',
      input: {text:'~강냉'},
      output: {call: '강냉'}
    },
    {
      id: 'csdemo76',
      filename: 'csdemo',
      input: {text:'~약냉'},
      output: {call: '약냉'}
    },
    {
      id: 'csdemo77',
      filename: 'csdemo',
      input: {text:'~무냉'},
      output: {call: '무냉'}
    },
    {
      id: 'csdemo78',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(강냉, 약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.'}
    }
  ]
},
{
  id: 'csdemo82',
  filename: 'csdemo',
  input: {text:'~냉장고'},
  task:   'checktorefri',
  output: {output:'고객님의 냉장고의 형태를 말씀해주세요.\n\(양문형 또는 일반형\)'}, 
    children: [
    {
      id: 'csdemo80',
      filename: 'csdemo',
      input: [{text:'~양문형'}, {text:'~일반형'}],
      output: {call: '냉장고'}
    },
    {
      id: 'csdemo81',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat:1, options: {output: '양문형 혹은 일반형 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo87',
  filename: 'csdemo',
  name: '투인원스탠딩',
  input: [{text:'~투인원 ~스탠딩 ~약냉'}, {text:'~투인원 ~스탠딩 ~무냉'}],
  task:   'checktoair1',
  output: {output:'[답변]\n투인원 벽걸이는 정상적으로 냉방이 되는데 스탠드만 냉방이 전혀 안된다면 냉매순환 밸브쪽 문제일 수 있습니다.운전모드를 냉방으로 선택, 희망(설정) 온도는 18도(℃)로 맞추고 30분 이상 가동해 주십시오.\n여름들어 처음 가동하는 경우 냉기 나오는 속도가 조금 늦어질 수 있습니다.\n- 스탠드 바람이 나오는 부분에 냉기가 나온다면 정상입니다.\n- 냉기가 나오지 않을 시 스탠드 쪽으로만 냉매가 순환되지 않는 문제는 전문 엔지니어의 점검이 필요합니다.\n\n답변이 유용한가요?'}, 
    children: [
    {
      id: 'csdemo83',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
    },
    {
      id: 'csdemo86',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo84',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo85',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo92',
  filename: 'csdemo',
  name: '투인원벽걸이',
  input: [{text:'~투인원 ~벽걸이 ~약냉'}, {text:'~투인원 ~벽걸이 ~무냉'}],
  task:   'checktoair2',
  output: {output:'[답변]\n투인원 제품의 경우 동작 원리상 스탠드형 에어컨의 전원코드를 연결하지 않으면 벽걸이형 제품 단독 운전시 실외기가 가동되지 않아 차가운 바람이 나오지 않을 수 있습니다.\n\n답변이 유용한가요?'}, 
    children: [
    {
      id: 'csdemo88',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
    },
    {
      id: 'csdemo91',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo89',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo90',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo95',
  filename: 'csdemo',
  input: {text:'~투인원 ~벽걸이'},
  task:   'checktoair2',
  output: {output:'고객님 에어컨의 증상을 말씀해주세요.'}, 
    children: [
    {
      id: 'csdemo93',
      filename: 'csdemo',
      input: [{text:'~약냉'}, {text:'~무냉'}],
      output: {call: '투인원벽걸이'}
    },
    {
      id: 'csdemo94',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.'}
    }
  ]
},
{
  id: 'csdemo98',
  filename: 'csdemo',
  input: {text:'~투인원 ~스탠딩'},
  task:   'checktoair1',
  output: {output:'고객님 에어컨의 증상을 말씀해주세요.'}, 
    children: [
    {
      id: 'csdemo96',
      filename: 'csdemo',
      input: [{text:'~약냉'}, {text:'~무냉'}],
      output: {call: '투인원스탠딩'}
    },
    {
      id: 'csdemo97',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.'}
    }
  ]
},
{
  id: 'csdemo102',
  filename: 'csdemo',
  input: [{text:'~투인원 ~무냉'}, {text:'~투인원 ~약냉'}],
  task:   'checktoair',
  output: {output:'고객님의 투인원 에어컨 중 어떤 것에 문제가 생겼나요?\n\(스탠딩 또는 벽걸이\)'}, 
    children: [
    {
      id: 'csdemo99',
      filename: 'csdemo',
      input: {text:'~스탠딩'},
      task:       'checktoair1',
      output: {call: '투인원스탠딩'}
    },
    {
      id: 'csdemo100',
      filename: 'csdemo',
      input: {text:'~벽걸이'},
      task:       'checktoair2',
      output: {call: '투인원벽걸이'}
    },
    {
      id: 'csdemo101',
      filename: 'csdemo',
      input: {text:'~모두'},
      output: {call: '에어컨약냉'}
    }
  ]
},
{
  id: 'csdemo110',
  filename: 'csdemo',
  name: '투인원에어컨',
  input: {text:'~투인원'},
  task:   'checktoair',
  output: {output:'고객님의 투인원 에어컨 중 어떤 것에 문제가 생겼나요?\n\(스탠딩 또는 벽걸이\)'}, 
    children: [
    {
      id: 'csdemo105',
      filename: 'csdemo',
      input: {text:'~스탠딩'},
      task:       'checktoair1',
      output: {output:'고객님 에어컨의 증상을 말씀해주세요.'}, 
        children: [
        {
          id: 'csdemo103',
          filename: 'csdemo',
          input: [{text:'~약냉'}, {text:'~무냉'}],
          output: {call: '투인원스탠딩'}
        },
        {
          id: 'csdemo104',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {output:'죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.'}
        }
      ]
    },
    {
      id: 'csdemo108',
      filename: 'csdemo',
      input: {text:'~벽걸이'},
      task:       'checktoair2',
      output: {output:'고객님 에어컨의 증상을 말씀해주세요.'}, 
        children: [
        {
          id: 'csdemo106',
          filename: 'csdemo',
          input: [{text:'~약냉'}, {text:'~무냉'}],
          output: {call: '투인원벽걸이'}
        },
        {
          id: 'csdemo107',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {output:'죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.'}
        }
      ]
    },
    {
      id: 'csdemo109',
      filename: 'csdemo',
      input: {text:'~모두'},
      output: {call: '에어컨'}
    }
  ]
},
{
  id: 'csdemo119',
  filename: 'csdemo',
  name: '에어컨약냉',
  input: [{text:'~에어컨 ~약냉 ~스탠딩'}, {text:'~에어컨 ~약냉 ~벽걸이'}],
  task:   'airweak',
  output: {output:'아래는 에어컨의 냉기가 약할 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.'}, 
    children: [
    {
      id: 'csdemo115',
      filename: 'csdemo',
      input: {types: [{name: 'doc', listName: 'doc', field: 'title', typeCheck: 'listTypeCheck'}]},
      output: {output:'[답변]\n+doc.content+\n\n답변이 유용한가요?'}, 
        children: [
        {
          id: 'csdemo111',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
        },
        {
          id: 'csdemo114',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
          children: [
            {
              id: 'csdemo112',
              filename: 'csdemo',
              input: {text:'~네'},
              output: {call:'예약'}
            },
            {
              id: 'csdemo113',
              filename: 'csdemo',
              input: {text:'~아니요'},
              output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo118',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo116',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo117',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo123',
  filename: 'csdemo',
  name: '에어컨약냉둘',
  input: {text:'~에어컨 ~약냉'},
  task:   'checktoair',
  output: {output:'고객님의 에어컨의 형태를 말씀해주세요.\n\(스탠딩 또는 벽걸이\)'}, 
    children: [
    {
      id: 'csdemo120',
      filename: 'csdemo',
      input: {text:'~투인원'},
      output: {call: '투인원에어컨'}
    },
    {
      id: 'csdemo121',
      filename: 'csdemo',
      input: [{text:'~스탠딩'}, {text:'~벽걸이'}],
      output: {call: '에어컨약냉'}
    },
    {
      id: 'csdemo122',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat:1, options: {output: '스탠딩 혹은 벽걸이 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo132',
  filename: 'csdemo',
  name: '에어컨무냉',
  input: [{text:'~에어컨 ~무냉 ~스탠딩'}, {text:'~에어컨 ~무냉 ~벽걸이'}],
  task:   'airweak',
  output: {output:'아래는 에어컨이 작동하지 않을 때의 주된 원인입니다.\n#doc#+index+. +title+\n#\n고객님께 해당되는 경우가 있으면 선택해주세요.\n어떤 것도 해당하지 않으면 전문기사님의 출장점검을 도와드리겠습니다.'}, 
    children: [
    {
      id: 'csdemo128',
      filename: 'csdemo',
      input: {types: [{name: 'doc', listName: 'doc', field: 'title', typeCheck: 'listTypeCheck'}]},
      output: {output:'[답변]\n+doc.content+\n\n답변이 유용한가요?'}, 
        children: [
        {
          id: 'csdemo124',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {output:'더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'}
        },
        {
          id: 'csdemo127',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
          children: [
            {
              id: 'csdemo125',
              filename: 'csdemo',
              input: {text:'~네'},
              output: {call:'예약'}
            },
            {
              id: 'csdemo126',
              filename: 'csdemo',
              input: {text:'~아니요'},
              output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo131',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'답변으로 문제 해결이 어렵다면 전문기사가 출장점검을 진행해야합니다.\n출장예약을 도와드릴까요?'},
      children: [
        {
          id: 'csdemo129',
          filename: 'csdemo',
          input: {text:'~네'},
          output: {call:'예약'}
        },
        {
          id: 'csdemo130',
          filename: 'csdemo',
          input: {text:'~아니요'},
          output: {output:'고객님, 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 고객센터는 1577-7324입니다.'}
        }
      ]
    }
  ]
},
{
  id: 'csdemo136',
  filename: 'csdemo',
  name: '에어컨무냉둘',
  input: {text:'~에어컨 ~무냉'},
  task:   'checktoair',
  output: {output:'고객님의 에어컨의 형태를 말씀해주세요.\n\(스탠딩 또는 벽걸이\)'}, 
    children: [
    {
      id: 'csdemo133',
      filename: 'csdemo',
      input: {text:'~투인원'},
      output: {call: '투인원에어컨'}
    },
    {
      id: 'csdemo134',
      filename: 'csdemo',
      input: [{text:'~스탠딩'}, {text:'~벽걸이'}],
      output: {call: '에어컨무냉'}
    },
    {
      id: 'csdemo135',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat:1, options: {output: '스탠딩 혹은 벽걸이 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo140',
  filename: 'csdemo',
  name: '에어컨',
  input: [{text:'~에어컨 ~스탠딩'}, {text:'~에어컨 ~벽걸이'}],
  task:   'checktoair',
  output: {output:'고객님 에어컨의 증상을 말씀해주세요.'}, 
    children: [
    {
      id: 'csdemo137',
      filename: 'csdemo',
      input: {text:'~약냉'},
      output: {call: '에어컨약냉'}
    },
    {
      id: 'csdemo138',
      filename: 'csdemo',
      input: {text:'~무냉'},
      output: {call: '에어컨무냉'}
    },
    {
      id: 'csdemo139',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {output:'죄송합니다. 현재 챗봇 상담은 냉기 관련 증상(약냉, 무냉)만 상담해드리고 있습니다.\n그 외 상담은 콜센터를 이용해주시기 바랍니다.\nLG전자 콜센터 번호는 1577-7314입니다.'}
    }
  ]
},
{
  id: 'csdemo144',
  filename: 'csdemo',
  input: {text:'~에어컨'},
  task:   'checktoair',
  output: {output:'고객님의 에어컨의 형태를 말씀해주세요.\n\(스탠딩 또는 벽걸이\)'}, 
    children: [
    {
      id: 'csdemo141',
      filename: 'csdemo',
      input: [{text:'~투인원'}, {text:'~모두'}, {text:'~스탠딩 ~벽걸이'}],
      output: {call: '투인원에어컨'}
    },
    {
      id: 'csdemo142',
      filename: 'csdemo',
      input: [{text:'~스탠딩'}, {text:'~벽걸이'}],
      output: {call: '에어컨'}
    },
    {
      id: 'csdemo143',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat:1, options: {output: '스탠딩 혹은 벽걸이 중에 입력해주세요.\n\n처음으로 돌아가시려면 "시작"을 입력해주세요.'}}
    }
  ]
},
{
  id: 'csdemo147',
  filename: 'csdemo',
  input: {text:'~약냉'},
  output: [
  {if: 'context.botUser.curcontext == \'refri\'', output: {call: '약냉'}}, 
  {if: 'context.botUser.curcontext == \'air\'', output: {call: '에어컨약냉'}}, 
  {if: 'context.botUser.curcontext == \'air1\'', output: {call: '투인원스탠딩'}}, 
  {if: 'context.botUser.curcontext == \'air2\'', output: {call: '투인원벽걸이'}}, 
  {if: 'true', output: '어떤 제품이 제대로 동작하지 않나요?\n\[냉장고 또는 에어컨\]', 
    children: [
    {
      id: 'csdemo145',
      filename: 'csdemo',
      input: {text:'~냉장고'},
      output: {call:'냉장고약냉'}
    },
    {
      id: 'csdemo146',
      filename: 'csdemo',
      input: {text:'~에어컨'},
      output: {call:'에어컨약냉둘'}
    }
  ]}]
},
{
  id: 'csdemo150',
  filename: 'csdemo',
  input: {text:'~무냉'},
  output: [
  {if: 'context.botUser.curcontext == \'refri\'', output: {call: '무냉'}}, 
  {if: 'context.botUser.curcontext == \'air\'', output: {call: '에어컨무냉'}}, 
  {if: 'context.botUser.curcontext == \'air1\'', output: {call: '투인원스탠딩'}}, 
  {if: 'context.botUser.curcontext == \'air2\'', output: {call: '투인원벽걸이'}}, 
  {if: 'true', output: '어떤 제품이 제대로 동작하지 않나요?\n\[냉장고 또는 에어컨\]', 
    children: [
    {
      id: 'csdemo148',
      filename: 'csdemo',
      input: {text:'~냉장고'},
      output: {call:'냉장고무냉'}
    },
    {
      id: 'csdemo149',
      filename: 'csdemo',
      input: {text:'~에어컨'},
      output: {call:'에어컨무냉둘'}
    }
  ]}]
},
{
  id: 'csdemo153',
  filename: 'csdemo',
  input: {text:'~강냉'},
  output: [
  {if: 'context.botUser.curcontext == \'refri\'', output: {call: '강냉'}}, 
  {if: 'context.botUser.curcontext == \'air\' || context.botUser.curcontext == \'air1\' || context.botUser.curcontext == \'air2\'', output: '죄송합니다. 에어컨의 강냉 관련 질문은 챗봇상담이 불가능합니다.\n고객센터의 전문 상담원과 연결을 원하십니까?', 
    children: [
    {
      id: 'csdemo151',
      filename: 'csdemo',
      input: {text:'~네'},
      output: {output:'LG전자 고객센터 번호는 1577-7314입니다.'}
    },
    {
      id: 'csdemo152',
      filename: 'csdemo',
      input: {text:'~아니요'},
      output: {output:'감사합니다. LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.'}
    }
  ]}, 
  {if: 'true', output: {call:'냉장고강냉'}}]
}
];

var commonDialogs = [
{
  id: 'csdemocommon0',
  filename: 'csdemocommon',
  name: '시작',
  input: {regexp: first},
  task:   'start',
  output: {output:'안녕하세요. LG전자 고객센터입니다.'}
},
{
  id: 'csdemocommon3',
  filename: 'csdemocommon',
  name: '특수문자',
  input: {regexp:/^(\.|\,|\;|\:|\!|\?|\@|\#|\$|\%)$/},
  output: {output:'고객님, 불편을 끼쳐드려 죄송합니다.\n현재 챗봇상담은 냉장고 및 에어컨 냉기관련 상담만 진행하고 있습니다.\n그 외 상담은 전문 상담원을 통해 상담진행 도와드리겠습니다.\n고객센터의 전문 상담원과 연결을 원하십니까?'}, 
    children: [
    {
      id: 'csdemocommon1',
      filename: 'csdemocommon',
      input: {text:'~네'},
      output: {output:'LG전자 고객센터 번호는 1577-7314입니다.'}
    },
    {
      id: 'csdemocommon2',
      filename: 'csdemocommon',
      input: {text:'~아니요'},
      output: {output:'감사합니다. LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.'}
    }
  ]
},
{
  id: 'csdemocommon4',
  filename: 'csdemocommon',
  input: {regexp: up},
  output: {up:1}
},
{
  id: 'csdemocommon5',
  filename: 'csdemocommon',
  input: {regexp: pre},
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 'csdemocommon6',
  filename: 'csdemocommon',
  input: {regexp: next},
  output: {repeat: 1, options: {page: 'next'}}
},
{
  id: 'csdemocommon7',
  filename: 'csdemocommon',
  input: {text:'콜센터'},
  output: {output:'고객센터 번호는 1577-7314입니다.'}
},
{
  id: 'csdemocommon10',
  filename: 'csdemocommon',
  name: '답변없음',
  input: '',
  output: {output:'고객님, 불편을 끼쳐드려 죄송합니다.\n현재 챗봇상담은 냉장고 및 에어컨 냉기관련 상담만 진행하고 있습니다.\n그 외 상담은 전문 상담원을 통해 상담진행 도와드리겠습니다.\n고객센터의 전문 상담원과 연결을 원하십니까?'},
  children: [
   {
     id: 'csdemocommon8',
     filename: 'csdemocommon',
     input: {text:'~네'},
     output: {output:'LG전자 고객센터 번호는 1577-7314입니다.'}
   },
   {
     id: 'csdemocommon9',
     filename: 'csdemocommon',
     input: {text:'~아니요'},
     output: {output:'감사합니다. LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.'}
   }
  ]
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('csdemo2');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);