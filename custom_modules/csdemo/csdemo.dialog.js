
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var csdemo = require('./csdemo');

var dialogs = [
{
  id: 8,
  input: '일산 휴대폰 내일 4',
  output: '고객님 근처의 서비스 센터를 파악한 후에 수리가능여부를 안내해드려도 될까요?', 
    children: [
    {
      id: 7,
      input: '~네',
      output: '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 화정서비스센터 5.7km 입니다.\n인근의 가까운 다른 서비스센터로 김포서비스센터 7.9km 가 있습니다.\n어떤 서비스 센터 정보를 안내해드릴까요?',
      children: [
        {
          id: 6,
          input: ['화정', '김포'],
          output: '네 휴대폰 상품은 내일 오후 4시 서비스 센터에서 현장 수리 가능합니다.\n 서비스 센터 방문 전 예약을 미리 하시면 대기시간 없이 서비스를 받아 보실 수 있습니다. 서비스 센터 방문예약을 도와드릴까요?|+category+ 상품은 현재 서비스 센터에서 현장 수리 가능합니다.서비스 센터 방문 예약을 도와드릴까요?', 
            children: [
            {
              id: 0,
              input: '~네',
              output: {call:'방문예약'}
            },
            {
              id: 5,
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  id: 1,
                  input: '~네',
                  output: '고객님, 어떤 부분이 궁금하신가요?'
                },
                {
                  id: 4,
                  input: '~아니요',
                  output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      id: 2,
                      input: '~네',
                      output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                    },
                    {
                      id: 3,
                      input: '~아니요',
                      output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
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
},
{
  id: 15,
  name: '센터정보',
  input: '센터 정보',
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '센터정보', output: '고객님 근처의 서비스 센터를 파악한 후에 센터정보를 안내해드려도 될까요?'}}}, 
  {output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|센터 정보는 다음과 같습니다.위치를 지도에서 확인하시겠습니까?', 
    children: [
    {
      id: 9,
      input: '~네',
      output: {call:'방문경로'}
    },
    {
      id: 14,
      input: '~아니요',
      output: '고객님, 추가적으로 궁금하신 사항이 있으신지요?',
      children: [
        {
          id: 10,
          input: '~네',
          output: '네, 필요하신 사항이 있으시면 말씀해주세요.'
        },
        {
          id: 13,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 11,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 12,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]}]
},
{
  id: 20,
  name: '처음에서위치찾기',
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}], regexp: /~서비스센터/},
  output: [
  {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
  {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
    children: [
    {
      id: 16,
      input: '~네',
      output: {call: '서비스센터정보'}
    },
    {
      id: 17,
      input: {if: 'true'},
      output: {up: 1}
    }
  ]}, 
  {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
    children: [
    {
      id: 18,
      input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
      output: {call: '서비스센터정보'}
    },
    {
      id: 19,
      input: {if: 'true'},
      output: {up: 1}
    }
  ]}]
},
{
  id: 29,
  name: '위치찾기',
  input: '~서비스센터',
  output: '고객님, 현재 고객님께서 계신 근처의 서비스 센터를 안내해 드릴까요?', 
    children: [
    {
      id: 27,
      input: '~네',
      output: '현재 계신 지역을 말씀해 주세요.|현재 계신 지역을 말씀해주세요.',
      children: [
        {
          id: 25,
          input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
          output: [
          {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
          {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
            children: [
            {
              id: 21,
              input: '~네',
              output: {call: '서비스센터정보'}
            },
            {
              id: 22,
              input: {if: 'true'},
              output: {up: 1}
            }
          ]}, 
          {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
            children: [
            {
              id: 23,
              input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
              output: {call: '서비스센터정보'}
            },
            {
              id: 24,
              input: {if: 'true'},
              output: {up: 1}
            }
          ]}]
        },
        {
          id: 26,
          input: {if: 'true'},
          task:           {action: csdemo.searchNaver},
          output: [
          {if: '!(context.dialog.item)', output: {repeat: 1, options : {output: '죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.아래 예시와 같이 다시 말씀해주세요.'}}}, 
          {if: 'context.dialog.item', output: {call:'서비스센터정보'}}]
        }
      ]
    },
    {
      id: 28,
      input: '~아니요',
      output: '만족스러운 응대가 되지 못하여 죄송합니다.\n 더욱 원활한 상담을 위하여 전문 상담원을 연결들 도와 드리겠습니다. 잠시만 기다려주세요.|상담원을 연결 해 드리겠습니다. 잠시만 기다려 주세요.'
    }
  ]
},
{
  id: 57,
  name: '서비스센터정보',
  input: false,
  task:   csdemo.searchCenterTask,
  output: '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 +item.0.svc_center_name+ +item.0.distance+km 입니다.\n 인근의 가까운 다른 서비스센터로 +item.1.svc_center_name+ +item.1.distance+km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요?|어떤 서비스 센터 정보를 안내해드릴까요?', 
    children: [
    {
      id: 38,
      input: {types: [{name: 'center', listName: 'item', field: 'svc_center_name', typeCheck: 'listTypeCheck'}]},
      task:       {action: function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}},
      output: {output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|서비스센터 정보는 다음과 같습니다. 위치를 지도에서 확인하시겠습니까?', return : 1}, 
        children: [
        {
          id: 30,
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          id: 36,
          input: '~아니요',
          output: '고객님, 추가적으로 궁금하신 사항이 있으신지요?',
          children: [
            {
              id: 32,
              input: '~네',
              output: '네, 필요하신 사항이 있으시면 말씀해주세요.',
              children: [
                {
                  id: 31,
                  input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법', '위치'],
                  output: {call:'방문경로'}
                }
              ]
            },
            {
              id: 35,
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 33,
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 34,
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                }
              ]
            }
          ]
        },
        {
          id: 37,
          input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법', '위치'],
          output: {call:'방문경로'}
        }
      ]
    },
    {
      id: 55,
      input: '세탁기',
      output: '세탁기 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장 수리 예약을 도와드릴까요?', 
        children: [
        {
          id: 54,
          input: '~네',
          output: '출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다. \n 수리가 필요한 제품의 증상을 입력해 주세요.', 
            children: [
            {
              id: 53,
              input: {regexp: /[가-힣]/g},
              output: '출장 방문시 안내를 받으실 분의 성함을 입력해 주세요.', 
                children: [
                {
                  id: 51,
                  input: {regexp: /[가-힣]/g},
                  output: '저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요.', 
                    children: [
                    {
                      id: 49,
                      input: {types: [{type : type.mobileType, context: false}]},
                      output: '출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n 지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다.', 
                        children: [
                        {
                          id: 47,
                          input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}]},
                          output: '출장 수리를 받고 싶으신 날짜를 입력해주세요', 
                            children: [
                            {
                              id: 45,
                              input: ['월', '일', '내일', '모레', '오늘', {regexp: /\d{1,2} \/ \d{1,2}/g}],
                              output: '고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                                children: [
                                {
                                  id: 43,
                                  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                                  output: '출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요?', 
                                    children: [
                                    {
                                      id: 39,
                                      input: '~네',
                                      output: '고객님, 어떤 부분이 궁금하신가요?'
                                    },
                                    {
                                      id: 42,
                                      input: '~아니요',
                                      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                      children: [
                                        {
                                          id: 40,
                                          input: '~네',
                                          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                                        },
                                        {
                                          id: 41,
                                          input: '~아니요',
                                          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  id: 44,
                                  input: {if: 'true'},
                                  output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                                }
                              ]
                            },
                            {
                              id: 46,
                              input: {if: 'true'},
                              output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                            }
                          ]
                        },
                        {
                          id: 48,
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.|지번 또는 도로명을 포함한 상세주소를 말씀해주세요.'}}
                        }
                      ]
                    },
                    {
                      id: 50,
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
                    }
                  ]
                },
                {
                  id: 52,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 56,
      input: {if: 'true && context.botUser.wordCorrection'},
      output: {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}}
    }
  ]
},
{
  id: 70,
  name: '시간체크',
  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: csdemo.checkTime},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '시간체크', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 영업 시간이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 58,
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으시면 말씀해주세요~~'
    },
    {
      id: 61,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 59,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 60,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.check == false', output: '네 서비스 받으실 수 있는 시간 입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 62,
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으신지요?'
    },
    {
      id: 65,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 63,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 64,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.check == \'re\'', output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 66,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 69,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 67,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 68,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 79,
  name: '날짜체크',
  input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: csdemo.checkDate},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '날짜체크', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 해당 일자는 서비스센터 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 71,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 74,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 72,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 73,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.check == false', output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 75,
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으시면 말씀해주세요~~'
    },
    {
      id: 78,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 76,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 77,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 84,
  name: '토요일영업',
  input: ['~월요일', '~화요일', '~수요일', '~목요일', '~금요일', '~토요일'],
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '토요일영업', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 80,
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으시면 말씀해주세요~~'
    },
    {
      id: 83,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 81,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 82,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 89,
  name: '공휴일영업',
  input: ['~공휴일', '일요일'],
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '공휴일영업', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 85,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 88,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 86,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 87,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 94,
  name: '영업시간',
  input: ['~영업 ~시간', '몇 시'],
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '영업시간', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {output: '해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요', 
    children: [
    {
      id: 90,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 93,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 91,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 92,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 101,
  name: '방문경로둘',
  input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법', '위치'],
  task:   {action: csdemo.daumgeoCode},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '방문경로둘', output: '고객님 근처의 서비스 센터를 파악한 후에 방문경로를 안내해드려도 될까요?'}}}, 
  {output: '+center.svc_center_name+의 위치정보입니다\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n+_docs.link_find+해당 서비스 센터의 방문 예약을 하시겠습니까?|위치정보는 다음과 같습니다. 방문예약을 하시겠습니까?', 
    children: [
        {
          id: 95,
          input: '~네',
          output: {call:'방문예약'}
        },
        {
          id: 100,
          input: '~아니요',
          output: '더 필요하신 게 있으신가요?',
          children: [
            {
              id: 96,
              input: '~네',
              output: '고객님, 어떤 부분이 궁금하신가요?'
            },
            {
              id: 99,
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 97,
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 98,
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                }
              ]
            }
          ]
        }
  ]}]
},
{
  id: 108,
  name: '방문경로',
  input: false,
  task:   {action: csdemo.daumgeoCode},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '방문경로둘', output: '고객님 근처의 서비스 센터를 파악한 후에 방문경로를 안내해드려도 될까요?'}}}, 
  {output: '+center.svc_center_name+의 위치정보입니다\n+_docs.link_find+해당 서비스 센터의 방문 예약을 하시겠습니까?', 
    children: [
        {
          id: 102,
          input: '~네',
          output: {call:'방문예약'}
        },
        {
          id: 107,
          input: '~아니요',
          output: '더 필요하신 게 있으신가요?',
          children: [
            {
              id: 103,
              input: '~네',
              output: '고객님, 어떤 부분이 궁금하신가요?'
            },
            {
              id: 106,
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 104,
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 105,
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                }
              ]
            }
          ]
        }
  ]}]
},
{
  id: 125,
  name: '예약',
  input: false,
  output: [
  {if: 'context.dialog.repairable == true', output: '네 +category+ 상품은 현 지점에서 현장 수리 가능합니다.\n성함을 말씀해주세요', 
    children: [
    {
      id: 119,
      input: {regexp: /[가-힣]/g},
      output: '휴대폰 번호를 말씀해주세요.', 
        children: [
        {
          id: 117,
          input: {types: [{type : type.mobileType, context: false}]},
          output: '원하시는 방문날짜를 입력해주세요', 
            children: [
            {
              id: 115,
              input: ['월', '일', '내일', '오늘', '모레', {regexp: /\d{1,2} \/ \d{1,2}/g}],
              output: '시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                children: [
                {
                  id: 113,
                  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                  output: '센터방문 예약이 완료되었습니다.\n더 필요하신 게 있으신가요?', 
                    children: [
                    {
                      id: 109,
                      input: '~네',
                      output: '고객님, 어떤 부분이 궁금하신가요?'
                    },
                    {
                      id: 112,
                      input: '~아니요',
                      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          id: 110,
                          input: '~네',
                          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                        },
                        {
                          id: 111,
                          input: '~아니요',
                          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 114,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                }
              ]
            },
            {
              id: 116,
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
            }
          ]
        },
        {
          id: 118,
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 120,
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
    }
  ]}, 
  {if: 'context.dialog.repairable == false', output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n더 필요한 것이 있으신가요?', 
    children: [
    {
      id: 121,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 124,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 122,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 123,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 155,
  name: '방문예약',
  input: '예약',
  output: '서비스 센터 방문 예약을 도와드릴까요?', 
    children: [
    {
      id: 149,
      input: '~네',
      output: '서비스를 받고 싶으신 제품을 말씀해주세요.',
      children: [
        {
          id: 148,
          input: {types: [{name: 'repairable', typeCheck: csdemo.repairableTypecheck, raw: true}]},
          task:           {action: csdemo.repairableCheck},
          output: [
          {if: 'context.dialog.repairable == \'remote\'', output: '+category+ 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장수리 예약을 도와드릴까요?', 
            children: [
            {
              id: 126,
              input: '~네',
              output: {call:'출장수리예약'}
            },
            {
              id: 131,
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  id: 127,
                  input: '~네',
                  output: '고객님, 어떤 부분이 궁금하신가요?'
                },
                {
                  id: 130,
                  input: '~아니요',
                  output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      id: 128,
                      input: '~네',
                      output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                    },
                    {
                      id: 129,
                      input: '~아니요',
                      output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                    }
                  ]
                }
              ]
            }
          ]}, 
          {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '예약', output: '고객님 근처의 서비스 센터를 파악한 후에 방문예약을 도와드려도 될까요?'}}}, 
          {if: 'context.dialog.repairable == true', output: '네 +category+ 상품은 현 지점에서 현장 수리 가능합니다.\n성함을 말씀해주세요', 
            children: [
            {
              id: 142,
              input: {regexp: /[가-힣]/g},
              output: '휴대폰 번호를 말씀해주세요.', 
                children: [
                {
                  id: 140,
                  input: {types: [{type : type.mobileType, context: false}]},
                  output: '원하시는 방문날짜를 입력해주세요', 
                    children: [
                    {
                      id: 138,
                      input: ['월', '일', '내일', '오늘', '모레', {regexp: /\d{1,2} \/ \d{1,2}/g}],
                      output: '시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                        children: [
                        {
                          id: 136,
                          input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                          output: '센터방문 예약이 완료되었습니다.\n더 필요하신 게 있으신가요?', 
                            children: [
                            {
                              id: 132,
                              input: '~네',
                              output: '고객님, 어떤 부분이 궁금하신가요?'
                            },
                            {
                              id: 135,
                              input: '~아니요',
                              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                              children: [
                                {
                                  id: 133,
                                  input: '~네',
                                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                                },
                                {
                                  id: 134,
                                  input: '~아니요',
                                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: 137,
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                        }
                      ]
                    },
                    {
                      id: 139,
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                    }
                  ]
                },
                {
                  id: 141,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
                }
              ]
            },
            {
              id: 143,
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
            }
          ]}, 
          {if: 'context.dialog.repairable == false', output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n더 필요한 것이 있으신가요?', 
            children: [
            {
              id: 144,
              input: '~네',
              output: '고객님, 어떤 부분이 궁금하신가요?'
            },
            {
              id: 147,
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 145,
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 146,
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                }
              ]
            }
          ]}]
        }
      ]
    },
    {
      id: 154,
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 150,
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 153,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 151,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 152,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  id: 171,
  name: '출장수리예약',
  input: false,
  output: '출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다. \n 수리가 필요한 제품의 증상을 입력해 주세요.', 
    children: [
    {
      id: 170,
      input: {regexp: /[가-힣]/g},
      output: '출장 방문시 안내를 받으실 분의 성함을 입력해 주세요.', 
        children: [
        {
          id: 168,
          input: {regexp: /[가-힣]/g},
          output: '저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요.', 
            children: [
            {
              id: 166,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n 지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다.', 
                children: [
                {
                  id: 164,
                  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}]},
                  output: '출장 수리를 받고 싶으신 날짜를 입력해주세요', 
                    children: [
                    {
                      id: 162,
                      input: ['월', '일', '내일', '모레', '오늘', {regexp: /\d{1,2} \/ \d{1,2}/g}],
                      output: '고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                        children: [
                        {
                          id: 160,
                          input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                          output: '출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요?', 
                            children: [
                            {
                              id: 156,
                              input: '~네',
                              output: '고객님, 어떤 부분이 궁금하신가요?'
                            },
                            {
                              id: 159,
                              input: '~아니요',
                              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                              children: [
                                {
                                  id: 157,
                                  input: '~네',
                                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                                },
                                {
                                  id: 158,
                                  input: '~아니요',
                                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: 161,
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                        }
                      ]
                    },
                    {
                      id: 163,
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                    }
                  ]
                },
                {
                  id: 165,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.|지번 또는 도로명을 포함한 상세주소를 말씀해주세요.'}}
                }
              ]
            },
            {
              id: 167,
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
            }
          ]
        },
        {
          id: 169,
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
        }
      ]
    }
  ]
},
{
  id: 194,
  name: '수리가능',
  input: {types: [{name: 'repairable', typeCheck: csdemo.repairableTypecheck, raw: true}]},
  task:   {action: csdemo.repairableCheck},
  output: [
  {if: 'context.dialog.repairable == \'remote\'', output: '+category+ 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장 수리 예약을 도와드릴까요?', 
    children: [
    {
      id: 172,
      input: '~네',
      output: {call:'출장수리예약'}
    },
    {
      id: 177,
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 173,
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 176,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 174,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 175,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]}, 
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '수리가능', output: '고객님 근처의 서비스 센터를 파악한 후에 수리가능여부를 안내해드려도 될까요?'}}}, 
  {if: 'context.dialog.repairable == true', output: '네 +category+ 상품은 현재 서비스 센터에서 현장 수리 가능합니다.\n 서비스 센터 방문 전 예약을 미리 하시면 대기시간 없이 서비스를 받아 보실 수 있습니다. 서비스 센터 방문예약을 도와드릴까요?|+category+ 상품은 현재 서비스 센터에서 현장 수리 가능합니다.서비스 센터 방문 예약을 도와드릴까요?', 
    children: [
    {
      id: 178,
      input: '~네',
      output: {call:'예약', options: {output: '성함을 말씀해주세요.'}}
    },
    {
      id: 183,
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 179,
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 182,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 180,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 181,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.repairable == false', output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n센터 정보를 알려드릴까요?', 
    children: [
    {
      id: 188,
      input: '~네',
      output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|센터 정보는 다음과 같습니다.위치를 지도에서 확인하시겠습니까?',
      children: [
        {
          id: 184,
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          id: 187,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 185,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 186,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    },
    {
      id: 193,
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 189,
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 192,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 190,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 191,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]}]
},
{
  id: 205,
  name: '수리가능품목',
  input: '~수리 ~가능',
  task:   {action: csdemo.repairableList},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '수리가능품목', output: '고객님 근처의 서비스 센터를 파악한 후에 수리가능품목을 안내해드려도 될까요?'}}}, 
  {output: '문의 주신 서비스센터의 수리 가능 품목은 +center.productlist+ 입니다.\n 해당 서비스 센터 정보를 알려드릴까요?', 
    children: [
    {
      id: 199,
      input: '~네',
      output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|센터 정보는 다음과 같습니다.위치를 지도에서 확인하시겠습니까?',
      children: [
        {
          id: 195,
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          id: 198,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 196,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 197,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    },
    {
      id: 204,
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 200,
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 203,
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 201,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 202,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]}]
},
{
  id: 210,
  name: '전화번호안내',
  input: '~번호',
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '전화번호안내', output: '고객님 근처의 서비스 센터를 파악한 후에 전화번호를 안내해드려도 될까요?'}}}, 
  {output: '+center.svc_center_name+ 전화번호입니다.\n +center.phone+\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 206,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 209,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 207,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 208,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 215,
  name: '주차안내',
  input: '~주차',
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '주차안내', output: '고객님 근처의 서비스 센터를 파악한 후에 주차가능여부를 안내해드려도 될까요?'}}}, 
  {output: '+center.parking+합니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 211,
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 214,
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 212,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 213,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
}
];

var commonDialogs = [
{
  id: 0,
  name: '시작',
  input: ['시작', '처음'],
  output: '안녕하세요. 머니브레인 고객센터입니다.'
},
{
  id: 1,
  input: '이전',
  output: {up:1}
},
{
  id: 2,
  input: '전페이지',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 3,
  input: '다음페이지',
  output: {repeat: 1, options: {page: 'next'}}
},
{
  id: 4,
  input: '콜센터',
  output: '고객센터 번호는 02-858-5683입니다.'
},
{
  id: 9,
  name: '답변없음',
  input: '',
  output: '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 고객센터의 전문 상담원과 연결을 원하십니까?',
  children: [
   {
     id: 5,
     input: '~네',
     output: '고객센터 번호는 02-858-5683입니다.'
   },
   {
     id: 8,
     input: '~아니요',
     output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
     children: [
       {
         id: 6,
         input: '~네',
         output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
       },
       {
         id: 7,
         input: '~아니요',
         output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
       }
     ]
   }
  ]
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('csdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);

// TEST
var json = JSON.stringify(dialogs);
console.log(json);
var fs = require('fs');
fs.writeFile(require('path').resolve("public/js") + "/dialog.json", json, function(err) {
if(err) { return console.log(err); }
console.log("dialog.json was saved!"); });