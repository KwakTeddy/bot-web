
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var csdemo = require('./csdemo');

var dialogs = [
{
  id: 'csdemo16',
  filename: 'csdemo',
  name: '센터및수리',
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true},{name: 'repairable', typeCheck: csdemo.repairableTypecheck, raw: true}]},
  task:   {action: csdemo.repairableCheck},
  output: [
  {if: 'context.dialog.repairable == \'remote\'', output: '+category+ 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장 수리 예약을 도와드릴까요?', 
    children: [
    {
      id: 'csdemo0',
      filename: 'csdemo',
      input: '~네',
      output: {call:'출장수리예약'}
    },
    {
      id: 'csdemo5',
      filename: 'csdemo',
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 'csdemo1',
          filename: 'csdemo',
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 'csdemo4',
          filename: 'csdemo',
          input: '~아니요',
          output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo2',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo3',
              filename: 'csdemo',
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 LG전자가 되겠습니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    }
  ]}, 
  {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.', 
    children: [
    {
      id: 'csdemo10',
      filename: 'csdemo',
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
        children: [
        {
          id: 'csdemo6',
          filename: 'csdemo',
          input: '~네',
          task:           csdemo.searchCenterTask,
          output: {returnCall: '서비스센터정보', options: {returnDialog: '수리가능'}}
        },
        {
          id: 'csdemo7',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}, 
      {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
        children: [
        {
          id: 'csdemo8',
          filename: 'csdemo',
          input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
          task:           csdemo.searchCenterTask,
          output: {returnCall: '서비스센터정보', options: {returnDialog: '수리가능'}}
        },
        {
          id: 'csdemo9',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}]
    },
    {
      id: 'csdemo11',
      filename: 'csdemo',
      input: {if: 'true'},
      output: '죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.아래 예시와 같이 다시 말씀해주세요.'
    }
  ]}, 
  {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
    children: [
    {
      id: 'csdemo12',
      filename: 'csdemo',
      input: '~네',
      task:       csdemo.searchCenterTask,
      output: {returnCall: '서비스센터정보', options: {returnDialog: '수리가능'}}
    },
    {
      id: 'csdemo13',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {up: 1}
    }
  ]}, 
  {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
    children: [
    {
      id: 'csdemo14',
      filename: 'csdemo',
      input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
      task:       csdemo.searchCenterTask,
      output: {returnCall: '서비스센터정보', options: {returnDialog: '수리가능'}}
    },
    {
      id: 'csdemo15',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {up: 1}
    }
  ]}]
},
{
  id: 'csdemo23',
  filename: 'csdemo',
  name: '센터정보',
  input: '센터 정보',
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '센터정보', output: '고객님 근처의 서비스 센터를 파악한 후에 센터정보를 안내해드려도 될까요?'}}}, 
  {output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|센터 정보는 다음과 같습니다.위치를 지도에서 확인하시겠습니까?', 
    children: [
    {
      id: 'csdemo17',
      filename: 'csdemo',
      input: '~네',
      output: {call:'방문경로'}
    },
    {
      id: 'csdemo22',
      filename: 'csdemo',
      input: '~아니요',
      output: '고객님, 추가적으로 궁금하신 사항이 있으신지요?',
      children: [
        {
          id: 'csdemo18',
          filename: 'csdemo',
          input: '~네',
          output: '네, 필요하신 사항이 있으시면 말씀해주세요.'
        },
        {
          id: 'csdemo21',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo19',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo20',
              filename: 'csdemo',
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
  id: 'csdemo28',
  filename: 'csdemo',
  name: '처음에서위치찾기',
  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}], regexp: /~서비스센터/},
  output: [
  {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
  {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
    children: [
    {
      id: 'csdemo24',
      filename: 'csdemo',
      input: '~네',
      output: {call: '서비스센터정보'}
    },
    {
      id: 'csdemo25',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {up: 1}
    }
  ]}, 
  {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
    children: [
    {
      id: 'csdemo26',
      filename: 'csdemo',
      input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
      output: {call: '서비스센터정보'}
    },
    {
      id: 'csdemo27',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {up: 1}
    }
  ]}]
},
{
  id: 'csdemo37',
  filename: 'csdemo',
  name: '위치찾기',
  input: '~서비스센터',
  output: '고객님, 현재 고객님께서 계신 근처의 서비스 센터를 안내해 드릴까요?', 
    children: [
    {
      id: 'csdemo35',
      filename: 'csdemo',
      input: '~네',
      output: '현재 계신 지역을 말씀해 주세요.|현재 계신 지역을 말씀해주세요.',
      children: [
        {
          id: 'csdemo33',
          filename: 'csdemo',
          input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
          output: [
          {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
          {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
            children: [
            {
              id: 'csdemo29',
              filename: 'csdemo',
              input: '~네',
              output: {call: '서비스센터정보'}
            },
            {
              id: 'csdemo30',
              filename: 'csdemo',
              input: {if: 'true'},
              output: {up: 1}
            }
          ]}, 
          {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
            children: [
            {
              id: 'csdemo31',
              filename: 'csdemo',
              input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
              output: {call: '서비스센터정보'}
            },
            {
              id: 'csdemo32',
              filename: 'csdemo',
              input: {if: 'true'},
              output: {up: 1}
            }
          ]}]
        },
        {
          id: 'csdemo34',
          filename: 'csdemo',
          input: {if: 'true'},
          task:           {action: csdemo.searchNaver},
          output: [
          {if: '!(context.dialog.item)', output: {repeat: 1, options : {output: '죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 여의도 트윈타워\n5.지하철역: 여의도역|죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.아래 예시와 같이 다시 말씀해주세요.'}}}, 
          {if: 'context.dialog.item', output: {call:'서비스센터정보'}}]
        }
      ]
    },
    {
      id: 'csdemo36',
      filename: 'csdemo',
      input: '~아니요',
      output: '만족스러운 응대가 되지 못하여 죄송합니다.\n 더욱 원활한 상담을 위하여 전문 상담원을 연결들 도와 드리겠습니다. 잠시만 기다려주세요.|상담원을 연결 해 드리겠습니다. 잠시만 기다려 주세요.'
    }
  ]
},
{
  id: 'csdemo65',
  filename: 'csdemo',
  name: '서비스센터정보',
  input: false,
  task:   csdemo.searchCenterTask,
  output: '현재 고객님께서 계신 위치해서 가장 가까운 서비스센터는 +item.0.svc_center_name+ +item.0.distance+km 입니다.\n 인근의 가까운 다른 서비스센터로 +item.1.svc_center_name+ +item.1.distance+km 가 있습니다.\n 어떤 서비스 센터 정보를 안내해드릴까요?|어떤 서비스 센터 정보를 안내해드릴까요?', 
    children: [
    {
      id: 'csdemo46',
      filename: 'csdemo',
      input: {types: [{name: 'center', listName: 'item', field: 'svc_center_name', typeCheck: 'listTypeCheck'}]},
      task:       {action: function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}},
      output: {output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|서비스센터 정보는 다음과 같습니다. 위치를 지도에서 확인하시겠습니까?', return : 1}, 
        children: [
        {
          id: 'csdemo38',
          filename: 'csdemo',
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          id: 'csdemo44',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 추가적으로 궁금하신 사항이 있으신지요?',
          children: [
            {
              id: 'csdemo40',
              filename: 'csdemo',
              input: '~네',
              output: '네, 필요하신 사항이 있으시면 말씀해주세요.',
              children: [
                {
                  id: 'csdemo39',
                  filename: 'csdemo',
                  input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법', '위치'],
                  output: {call:'방문경로'}
                }
              ]
            },
            {
              id: 'csdemo43',
              filename: 'csdemo',
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 'csdemo41',
                  filename: 'csdemo',
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 'csdemo42',
                  filename: 'csdemo',
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                }
              ]
            }
          ]
        },
        {
          id: 'csdemo45',
          filename: 'csdemo',
          input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법', '위치'],
          output: {call:'방문경로'}
        }
      ]
    },
    {
      id: 'csdemo63',
      filename: 'csdemo',
      input: '세탁기',
      output: '세탁기 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장 수리 예약을 도와드릴까요?', 
        children: [
        {
          id: 'csdemo62',
          filename: 'csdemo',
          input: '~네',
          output: '출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다. \n 수리가 필요한 제품의 증상을 입력해 주세요.', 
            children: [
            {
              id: 'csdemo61',
              filename: 'csdemo',
              input: {regexp: /[가-힣]/g},
              output: '출장 방문시 안내를 받으실 분의 성함을 입력해 주세요.', 
                children: [
                {
                  id: 'csdemo59',
                  filename: 'csdemo',
                  input: {regexp: /[가-힣]/g},
                  output: '저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요.', 
                    children: [
                    {
                      id: 'csdemo57',
                      filename: 'csdemo',
                      input: {types: [{type : type.mobileType, context: false}]},
                      output: '출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n 지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다.', 
                        children: [
                        {
                          id: 'csdemo55',
                          filename: 'csdemo',
                          input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}]},
                          output: '출장 수리를 받고 싶으신 날짜를 입력해주세요', 
                            children: [
                            {
                              id: 'csdemo53',
                              filename: 'csdemo',
                              input: ['월', '일', '내일', '모레', '오늘', {regexp: /\d{1,2} \/ \d{1,2}/g}],
                              output: '고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                                children: [
                                {
                                  id: 'csdemo51',
                                  filename: 'csdemo',
                                  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                                  output: '출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요?', 
                                    children: [
                                    {
                                      id: 'csdemo47',
                                      filename: 'csdemo',
                                      input: '~네',
                                      output: '고객님, 어떤 부분이 궁금하신가요?'
                                    },
                                    {
                                      id: 'csdemo50',
                                      filename: 'csdemo',
                                      input: '~아니요',
                                      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                      children: [
                                        {
                                          id: 'csdemo48',
                                          filename: 'csdemo',
                                          input: '~네',
                                          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                                        },
                                        {
                                          id: 'csdemo49',
                                          filename: 'csdemo',
                                          input: '~아니요',
                                          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  id: 'csdemo52',
                                  filename: 'csdemo',
                                  input: {if: 'true'},
                                  output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                                }
                              ]
                            },
                            {
                              id: 'csdemo54',
                              filename: 'csdemo',
                              input: {if: 'true'},
                              output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                            }
                          ]
                        },
                        {
                          id: 'csdemo56',
                          filename: 'csdemo',
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.|지번 또는 도로명을 포함한 상세주소를 말씀해주세요.'}}
                        }
                      ]
                    },
                    {
                      id: 'csdemo58',
                      filename: 'csdemo',
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
                    }
                  ]
                },
                {
                  id: 'csdemo60',
                  filename: 'csdemo',
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
      id: 'csdemo64',
      filename: 'csdemo',
      input: {if: 'true && context.botUser.wordCorrection'},
      output: {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}}
    }
  ]
},
{
  id: 'csdemo78',
  filename: 'csdemo',
  name: '시간체크',
  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: csdemo.checkTime},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '시간체크', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 영업 시간이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo66',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으시면 말씀해주세요~~'
    },
    {
      id: 'csdemo69',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo67',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo68',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.check == false', output: '네 서비스 받으실 수 있는 시간 입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo70',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으신지요?'
    },
    {
      id: 'csdemo73',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo71',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo72',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.check == \'re\'', output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo74',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo77',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo75',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo76',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo87',
  filename: 'csdemo',
  name: '날짜체크',
  input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: csdemo.checkDate},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '날짜체크', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 해당 일자는 서비스센터 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo79',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo82',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo80',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo81',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.check == false', output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo83',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으시면 말씀해주세요~~'
    },
    {
      id: 'csdemo86',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo84',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo85',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo92',
  filename: 'csdemo',
  name: '토요일영업',
  input: ['~월요일', '~화요일', '~수요일', '~목요일', '~금요일', '~토요일'],
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '토요일영업', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo88',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 추가적으로 궁금하신 사항이 있으시면 말씀해주세요~~'
    },
    {
      id: 'csdemo91',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo89',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo90',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo97',
  filename: 'csdemo',
  name: '공휴일영업',
  input: ['~공휴일', '일요일'],
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '공휴일영업', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo93',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo96',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo94',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo95',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo102',
  filename: 'csdemo',
  name: '영업시간',
  input: ['~영업 ~시간', '몇 시'],
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '영업시간', output: '고객님 근처의 서비스 센터를 파악한 후에 영업시간을 안내해드려도 될까요?'}}}, 
  {output: '해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요', 
    children: [
    {
      id: 'csdemo98',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo101',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo99',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo100',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo109',
  filename: 'csdemo',
  name: '방문경로둘',
  input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법', '위치'],
  task:   {action: csdemo.daumgeoCode},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '방문경로둘', output: '고객님 근처의 서비스 센터를 파악한 후에 방문경로를 안내해드려도 될까요?'}}}, 
  {output: '+center.svc_center_name+의 위치정보입니다\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n+_docs.link_find+해당 서비스 센터의 방문 예약을 하시겠습니까?|위치정보는 다음과 같습니다. 방문예약을 하시겠습니까?', 
    children: [
        {
          id: 'csdemo103',
          filename: 'csdemo',
          input: '~네',
          output: {call:'방문예약'}
        },
        {
          id: 'csdemo108',
          filename: 'csdemo',
          input: '~아니요',
          output: '더 필요하신 게 있으신가요?',
          children: [
            {
              id: 'csdemo104',
              filename: 'csdemo',
              input: '~네',
              output: '고객님, 어떤 부분이 궁금하신가요?'
            },
            {
              id: 'csdemo107',
              filename: 'csdemo',
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 'csdemo105',
                  filename: 'csdemo',
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 'csdemo106',
                  filename: 'csdemo',
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
  id: 'csdemo116',
  filename: 'csdemo',
  name: '방문경로',
  input: false,
  task:   {action: csdemo.daumgeoCode},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '방문경로둘', output: '고객님 근처의 서비스 센터를 파악한 후에 방문경로를 안내해드려도 될까요?'}}}, 
  {output: '+center.svc_center_name+의 위치정보입니다\n+_docs.link_find+해당 서비스 센터의 방문 예약을 하시겠습니까?', 
    children: [
        {
          id: 'csdemo110',
          filename: 'csdemo',
          input: '~네',
          output: {call:'방문예약'}
        },
        {
          id: 'csdemo115',
          filename: 'csdemo',
          input: '~아니요',
          output: '더 필요하신 게 있으신가요?',
          children: [
            {
              id: 'csdemo111',
              filename: 'csdemo',
              input: '~네',
              output: '고객님, 어떤 부분이 궁금하신가요?'
            },
            {
              id: 'csdemo114',
              filename: 'csdemo',
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 'csdemo112',
                  filename: 'csdemo',
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 'csdemo113',
                  filename: 'csdemo',
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
  id: 'csdemo133',
  filename: 'csdemo',
  name: '예약',
  input: false,
  output: [
  {if: 'context.dialog.repairable == true', output: '네 +category+ 상품은 현 지점에서 현장 수리 가능합니다.\n성함을 말씀해주세요', 
    children: [
    {
      id: 'csdemo127',
      filename: 'csdemo',
      input: {regexp: /[가-힣]/g},
      output: '휴대폰 번호를 말씀해주세요.', 
        children: [
        {
          id: 'csdemo125',
          filename: 'csdemo',
          input: {types: [{type : type.mobileType, context: false}]},
          output: '원하시는 방문날짜를 입력해주세요', 
            children: [
            {
              id: 'csdemo123',
              filename: 'csdemo',
              input: ['월', '일', '내일', '오늘', '모레', {regexp: /\d{1,2} \/ \d{1,2}/g}],
              output: '시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                children: [
                {
                  id: 'csdemo121',
                  filename: 'csdemo',
                  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                  output: '센터방문 예약이 완료되었습니다.\n더 필요하신 게 있으신가요?', 
                    children: [
                    {
                      id: 'csdemo117',
                      filename: 'csdemo',
                      input: '~네',
                      output: '고객님, 어떤 부분이 궁금하신가요?'
                    },
                    {
                      id: 'csdemo120',
                      filename: 'csdemo',
                      input: '~아니요',
                      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          id: 'csdemo118',
                          filename: 'csdemo',
                          input: '~네',
                          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                        },
                        {
                          id: 'csdemo119',
                          filename: 'csdemo',
                          input: '~아니요',
                          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'csdemo122',
                  filename: 'csdemo',
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                }
              ]
            },
            {
              id: 'csdemo124',
              filename: 'csdemo',
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
            }
          ]
        },
        {
          id: 'csdemo126',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 'csdemo128',
      filename: 'csdemo',
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
    }
  ]}, 
  {if: 'context.dialog.repairable == false', output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n더 필요한 것이 있으신가요?', 
    children: [
    {
      id: 'csdemo129',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo132',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo130',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo131',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo163',
  filename: 'csdemo',
  name: '방문예약',
  input: '예약',
  output: '서비스 센터 방문 예약을 도와드릴까요?', 
    children: [
    {
      id: 'csdemo157',
      filename: 'csdemo',
      input: '~네',
      output: '서비스를 받고 싶으신 제품을 말씀해주세요.',
      children: [
        {
          id: 'csdemo156',
          filename: 'csdemo',
          input: {types: [{name: 'repairable', typeCheck: csdemo.repairableTypecheck, raw: true}]},
          task:           {action: csdemo.repairableCheck},
          output: [
          {if: 'context.dialog.repairable == \'remote\'', output: '+category+ 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장수리 예약을 도와드릴까요?', 
            children: [
            {
              id: 'csdemo134',
              filename: 'csdemo',
              input: '~네',
              output: {call:'출장수리예약'}
            },
            {
              id: 'csdemo139',
              filename: 'csdemo',
              input: '~아니요',
              output: '더 필요하신 게 있으신가요?',
              children: [
                {
                  id: 'csdemo135',
                  filename: 'csdemo',
                  input: '~네',
                  output: '고객님, 어떤 부분이 궁금하신가요?'
                },
                {
                  id: 'csdemo138',
                  filename: 'csdemo',
                  input: '~아니요',
                  output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                  children: [
                    {
                      id: 'csdemo136',
                      filename: 'csdemo',
                      input: '~네',
                      output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                    },
                    {
                      id: 'csdemo137',
                      filename: 'csdemo',
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
              id: 'csdemo150',
              filename: 'csdemo',
              input: {regexp: /[가-힣]/g},
              output: '휴대폰 번호를 말씀해주세요.', 
                children: [
                {
                  id: 'csdemo148',
                  filename: 'csdemo',
                  input: {types: [{type : type.mobileType, context: false}]},
                  output: '원하시는 방문날짜를 입력해주세요', 
                    children: [
                    {
                      id: 'csdemo146',
                      filename: 'csdemo',
                      input: ['월', '일', '내일', '오늘', '모레', {regexp: /\d{1,2} \/ \d{1,2}/g}],
                      output: '시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                        children: [
                        {
                          id: 'csdemo144',
                          filename: 'csdemo',
                          input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                          output: '센터방문 예약이 완료되었습니다.\n더 필요하신 게 있으신가요?', 
                            children: [
                            {
                              id: 'csdemo140',
                              filename: 'csdemo',
                              input: '~네',
                              output: '고객님, 어떤 부분이 궁금하신가요?'
                            },
                            {
                              id: 'csdemo143',
                              filename: 'csdemo',
                              input: '~아니요',
                              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                              children: [
                                {
                                  id: 'csdemo141',
                                  filename: 'csdemo',
                                  input: '~네',
                                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                                },
                                {
                                  id: 'csdemo142',
                                  filename: 'csdemo',
                                  input: '~아니요',
                                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: 'csdemo145',
                          filename: 'csdemo',
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                        }
                      ]
                    },
                    {
                      id: 'csdemo147',
                      filename: 'csdemo',
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                    }
                  ]
                },
                {
                  id: 'csdemo149',
                  filename: 'csdemo',
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
                }
              ]
            },
            {
              id: 'csdemo151',
              filename: 'csdemo',
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
            }
          ]}, 
          {if: 'context.dialog.repairable == false', output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n더 필요한 것이 있으신가요?', 
            children: [
            {
              id: 'csdemo152',
              filename: 'csdemo',
              input: '~네',
              output: '고객님, 어떤 부분이 궁금하신가요?'
            },
            {
              id: 'csdemo155',
              filename: 'csdemo',
              input: '~아니요',
              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 'csdemo153',
                  filename: 'csdemo',
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 'csdemo154',
                  filename: 'csdemo',
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
      id: 'csdemo162',
      filename: 'csdemo',
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 'csdemo158',
          filename: 'csdemo',
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 'csdemo161',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo159',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo160',
              filename: 'csdemo',
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
  id: 'csdemo179',
  filename: 'csdemo',
  name: '출장수리예약',
  input: false,
  output: '출장 수리 예약을 하기 위하여, 간단한 정보 몇가지를 수집하도록 하겠습니다. \n 수리가 필요한 제품의 증상을 입력해 주세요.', 
    children: [
    {
      id: 'csdemo178',
      filename: 'csdemo',
      input: {regexp: /[가-힣]/g},
      output: '출장 방문시 안내를 받으실 분의 성함을 입력해 주세요.', 
        children: [
        {
          id: 'csdemo176',
          filename: 'csdemo',
          input: {regexp: /[가-힣]/g},
          output: '저희 기사님께서 출장 방문시 연락드릴 휴대폰 번호를 입력해주세요.', 
            children: [
            {
              id: 'csdemo174',
              filename: 'csdemo',
              input: {types: [{type : type.mobileType, context: false}]},
              output: '출장 방문을 하기 위해서는 고객님의 정확한 주소가 필요합니다.\n 지번 또는 도로명을 포함한 상세주소를 입력 부탁드리겠습니다.', 
                children: [
                {
                  id: 'csdemo172',
                  filename: 'csdemo',
                  input: {types: [{name: 'address', typeCheck: address.addressTypeCheck, raw: true}]},
                  output: '출장 수리를 받고 싶으신 날짜를 입력해주세요', 
                    children: [
                    {
                      id: 'csdemo170',
                      filename: 'csdemo',
                      input: ['월', '일', '내일', '모레', '오늘', {regexp: /\d{1,2} \/ \d{1,2}/g}],
                      output: '고객님께서 지정하신 날짜에 출장 수리 예약이 가능한 시간 목록입니다. 원하시는 시간을 선택해주세요\n오전\n09:00 09:30 09:50\n10:10 10:30 11:00\n11:20 11:30 11:50\n오후\n12:00 12:30 12:50\n13:00 13:20 13:40\n15:00 15:10 15:50\n 16:10 16:20 16:50\n17:00 17:20 17:40|원하시는 시간을 말씀해주세요.', 
                        children: [
                        {
                          id: 'csdemo168',
                          filename: 'csdemo',
                          input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}]},
                          output: '출장수리 예약이 완료되었습니다. \n더 필요하신 게 있으신가요?', 
                            children: [
                            {
                              id: 'csdemo164',
                              filename: 'csdemo',
                              input: '~네',
                              output: '고객님, 어떤 부분이 궁금하신가요?'
                            },
                            {
                              id: 'csdemo167',
                              filename: 'csdemo',
                              input: '~아니요',
                              output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                              children: [
                                {
                                  id: 'csdemo165',
                                  filename: 'csdemo',
                                  input: '~네',
                                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                                },
                                {
                                  id: 'csdemo166',
                                  filename: 'csdemo',
                                  input: '~아니요',
                                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: 'csdemo169',
                          filename: 'csdemo',
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output: '시간을 말씀해주세요.\n예시)14시, 오후 2시, 04:00'}}
                        }
                      ]
                    },
                    {
                      id: 'csdemo171',
                      filename: 'csdemo',
                      input: {if: 'true'},
                      output: {repeat: 1, options: {output: '방문 날짜를 말씀해주세요.'}}
                    }
                  ]
                },
                {
                  id: 'csdemo173',
                  filename: 'csdemo',
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.|지번 또는 도로명을 포함한 상세주소를 말씀해주세요.'}}
                }
              ]
            },
            {
              id: 'csdemo175',
              filename: 'csdemo',
              input: {if: 'true'},
              output: {repeat: 1, options: {output: '휴대폰 번호를 말씀해주세요.'}}
            }
          ]
        },
        {
          id: 'csdemo177',
          filename: 'csdemo',
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '성함을 말씀해주세요.'}}
        }
      ]
    }
  ]
},
{
  id: 'csdemo202',
  filename: 'csdemo',
  name: '수리가능',
  input: {types: [{name: 'repairable', typeCheck: csdemo.repairableTypecheck, raw: true}]},
  task:   {action: csdemo.repairableCheck},
  output: [
  {if: 'context.dialog.repairable == \'remote\'', output: '+category+ 상품은 서비스 센터에서 수리를 받으시는 것보다 출장 수리를 예약하여, 기사님을 통하여 서비스를 받으시면 더욱 편리합니다.\n서비스 기사님의 출장수리 예약을 도와드릴까요?|서비스 기사님의 출장 수리 예약을 도와드릴까요?', 
    children: [
    {
      id: 'csdemo180',
      filename: 'csdemo',
      input: '~네',
      output: {call:'출장수리예약'}
    },
    {
      id: 'csdemo185',
      filename: 'csdemo',
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 'csdemo181',
          filename: 'csdemo',
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 'csdemo184',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo182',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo183',
              filename: 'csdemo',
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
      id: 'csdemo186',
      filename: 'csdemo',
      input: '~네',
      output: {call:'예약', options: {output: '성함을 말씀해주세요.'}}
    },
    {
      id: 'csdemo191',
      filename: 'csdemo',
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 'csdemo187',
          filename: 'csdemo',
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 'csdemo190',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo188',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo189',
              filename: 'csdemo',
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
      id: 'csdemo196',
      filename: 'csdemo',
      input: '~네',
      output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|센터 정보는 다음과 같습니다.위치를 지도에서 확인하시겠습니까?',
      children: [
        {
          id: 'csdemo192',
          filename: 'csdemo',
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          id: 'csdemo195',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo193',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo194',
              filename: 'csdemo',
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo201',
      filename: 'csdemo',
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 'csdemo197',
          filename: 'csdemo',
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 'csdemo200',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo198',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo199',
              filename: 'csdemo',
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
  id: 'csdemo213',
  filename: 'csdemo',
  name: '수리가능품목',
  input: '~수리 ~가능',
  task:   {action: csdemo.repairableList},
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '수리가능품목', output: '고객님 근처의 서비스 센터를 파악한 후에 수리가능품목을 안내해드려도 될까요?'}}}, 
  {output: '문의 주신 서비스센터의 수리 가능 품목은 +center.productlist+ 입니다.\n 해당 서비스 센터 정보를 알려드릴까요?', 
    children: [
    {
      id: 'csdemo207',
      filename: 'csdemo',
      input: '~네',
      output: '[+center.svc_center_name+]\n- 주소: +center.address3+\n- 영업시간 : 평일: +center.winter_week_open+ ~ +center.winter_week_close+, 토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n- 전화번호: +center.phone+\n- +center.parking+\n서비스 센터의 위치를 지도에서 확인하시겠습니까?|센터 정보는 다음과 같습니다.위치를 지도에서 확인하시겠습니까?',
      children: [
        {
          id: 'csdemo203',
          filename: 'csdemo',
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          id: 'csdemo206',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo204',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo205',
              filename: 'csdemo',
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
            }
          ]
        }
      ]
    },
    {
      id: 'csdemo212',
      filename: 'csdemo',
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          id: 'csdemo208',
          filename: 'csdemo',
          input: '~네',
          output: '고객님, 어떤 부분이 궁금하신가요?'
        },
        {
          id: 'csdemo211',
          filename: 'csdemo',
          input: '~아니요',
          output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 'csdemo209',
              filename: 'csdemo',
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 'csdemo210',
              filename: 'csdemo',
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
  id: 'csdemo218',
  filename: 'csdemo',
  name: '전화번호안내',
  input: '~번호',
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '전화번호안내', output: '고객님 근처의 서비스 센터를 파악한 후에 전화번호를 안내해드려도 될까요?'}}}, 
  {output: '+center.svc_center_name+ 전화번호입니다.\n +center.phone+\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo214',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo217',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo215',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo216',
          filename: 'csdemo',
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니브레인가 되겠습니다.\n머니브레인 콜센터 번호는 02-858-5683입니다.\n머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
        }
      ]
    }
  ]}]
},
{
  id: 'csdemo223',
  filename: 'csdemo',
  name: '주차안내',
  input: '~주차',
  output: [
  {if: csdemo.locationNotExists, output: {returnCall: '위치찾기', options: {returnDialog: '주차안내', output: '고객님 근처의 서비스 센터를 파악한 후에 주차가능여부를 안내해드려도 될까요?'}}}, 
  {output: '+center.parking+합니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      id: 'csdemo219',
      filename: 'csdemo',
      input: '~네',
      output: '고객님, 어떤 부분이 궁금하신가요?'
    },
    {
      id: 'csdemo222',
      filename: 'csdemo',
      input: '~아니요',
      output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 'csdemo220',
          filename: 'csdemo',
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 'csdemo221',
          filename: 'csdemo',
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
  id: 'csdemocommon0',
  filename: 'csdemocommon',
  name: '시작',
  input: ['시작', '처음'],
  output: '안녕하세요. 머니브레인 고객센터입니다.'
},
{
  id: 'csdemocommon1',
  filename: 'csdemocommon',
  input: '이전',
  output: {up:1}
},
{
  id: 'csdemocommon2',
  filename: 'csdemocommon',
  input: '전페이지',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 'csdemocommon3',
  filename: 'csdemocommon',
  input: '다음페이지',
  output: {repeat: 1, options: {page: 'next'}}
},
{
  id: 'csdemocommon4',
  filename: 'csdemocommon',
  input: '콜센터',
  output: '고객센터 번호는 02-858-5683입니다.'
},
{
  id: 'csdemocommon9',
  filename: 'csdemocommon',
  name: '답변없음',
  input: '',
  output: '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 고객센터의 전문 상담원과 연결을 원하십니까?',
  children: [
   {
     id: 'csdemocommon5',
     filename: 'csdemocommon',
     input: '~네',
     output: '고객센터 번호는 02-858-5683입니다.'
   },
   {
     id: 'csdemocommon8',
     filename: 'csdemocommon',
     input: '~아니요',
     output: '머니브레인에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
     children: [
       {
         id: 'csdemocommon6',
         filename: 'csdemocommon',
         input: '~네',
         output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
       },
       {
         id: 'csdemocommon7',
         filename: 'csdemocommon',
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
