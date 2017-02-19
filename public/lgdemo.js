var dialogs =
    [
        {
            name: '시작',
            output: '안녕하세요',
            children: [
                {
                    input: {
                        types: [{name: 'address', typeCheck: 'address.addressTypeCheck2', raw: true}],
                        regexp: /~서비스센터/
                    },
                    output: {callChild: '위치찾기'}
                },
                {
                    name: '위치찾기',
                    input: '~서비스센터',
                    output: '현재 계신 지역을 말씀해 주세요.\n예시)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 조은아트빌',
                    children: [
                        {
                            input: {types: [{name: 'address', typeCheck: 'address.addressTypeCheck2', raw: true}]},
                            output: [
                                {
                                    if: '!Array.isArray(context.dialog.address)',
                                    output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '서비스센터정보'}
                                        },
                                        {
                                            input: {if: 'true'},
                                            output: {up: 1}
                                        }
                                    ]
                                },
                                {
                                    if: 'Array.isArray(context.dialog.address)',
                                    output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#',
                                    children: [
                                        {
                                            input: {
                                                types: [{
                                                    name: 'address',
                                                    listName: 'address',
                                                    typeCheck: 'listTypeCheck'
                                                }]
                                            },
                                            output: {call: '서비스센터정보'}
                                        },
                                        {
                                            input: {if: 'true'},
                                            output: {up: 1}
                                        }
                                    ]
                                }]
                        },
                        {
                            input: {if: 'true'},
                            output: {repeat: 1, options: {output: '지역을 찾을 수 없습니다. 동명을 말씀해주세요.'}}
                        }
                    ]
                },
                {
                    name: '서비스센터정보',
                    input: false,
                    task: 'lgdemo.searchCenterTask',
                    output: '가장 가까운 서비스센터는 +item.0.svc_center_name+ +item.0.distance+km 입니다.\n인근의 다른 서비스센터로 +item.1.svc_center_name+ +item.1.distance+km 가 있습니다.\n어디로 안내해 드릴까요?',
                    children: [
                        {
                            input: {
                                types: [{
                                    name: 'center',
                                    listName: 'item',
                                    field: 'svc_center_name',
                                    typeCheck: 'listTypeCheck'
                                }]
                            },
                            task: {action: 'function(task, context, callback) {context.user.center = context.dialog.center;callback(task, context);}'},
                            output: {
                                output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
                                return: 1
                            },
                            children: [
                                {
                                    input: '~네',
                                    output: {call: '방문경로'}
                                },
                                {
                                    input: '~아니요',
                                    output: '더 필요하신 게 있으신가요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '궁금하신 걸 말씀해주세요~'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            input: {if: 'true'} > {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}} < {if: 'true'},
                            output: {repeat: 1, options: {output: '목록에서 선택해주세요.\n'}}
                        }
                    ]
                },
                {
                    name: '시간체크',
                    input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
                    task: {action: 'lgdemo.checkTime'},
                    output: [
                        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '시간체크'}}},
                        {
                            if: 'context.dialog.check == true',
                            output: '죄송합니다. 영업 시간이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            if: 'context.dialog.check == false', output: '네 서비스 받으실 수 있는 시간 입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            if: 'context.dialog.check == \'re\'',
                            output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '날짜체크',
                    input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
                    task: {action: 'lgdemo.checkDate'},
                    output: [
                        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '날짜체크'}}},
                        {
                            if: 'context.dialog.check == true',
                            output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            if: 'context.dialog.check == false',
                            output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '토요일영업',
                    input: ['~월요일', '~화요일', '~수요일', '~목요일', '~금요일', '~토요일'],
                    output: [
                        {
                            if: 'lgdemo.locationNotExists',
                            output: {returnCall: '위치찾기', options: {returnDialog: '토요일영업'}}
                        },
                        {
                            output: '네 영업일입니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '수리가능',
                    input: {types: [{name: 'repairable', typeCheck: 'lgdemo.repairableTypecheck', raw: true}]},
                    task: {action: 'lgdemo.repairableCheck'},
                    output: [
                        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '수리가능'}}},
                        {
                            if: 'context.dialog.repairable == true',
                            output: '네 +category+ 상품은 현 지점에서 현장 수리 가능합니다.\n센터 정보를 알려드릴까요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문경로'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: '~아니요',
                                    output: '더 필요하신 게 있으신가요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '궁금하신 걸 말씀해주세요~'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            if: 'context.dialog.repairable == \'remote\'',
                            output: '+category+ 상품은 출장 수리가 필요합니다.\n출장수리 신청은 아래 LG전자 서비스 홈페이지에서 가능합니다.\nwww.lgservice.co.kr/reserve/selectBusinessTrip.do\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n 좋은 하루 보내세요. 감사합니다.\n센터 정보를 알려드릴까요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문경로'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: '~아니요',
                                    output: '더 필요하신 게 있으신가요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '궁금하신 걸 말씀해주세요~'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            if: 'context.dialog.repairable == false',
                            output: '죄송합니다. 이 영업점에서는 취급하지 않는 품목입니다.\n센터 정보를 알려드릴까요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문경로'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: '~아니요',
                                    output: '더 필요하신 게 있으신가요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '궁금하신 걸 말씀해주세요~'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '수리가능품목',
                    input: '~수리 ~가능',
                    task: {action: 'lgdemo.repairableList'},
                    output: [
                        {
                            if: 'lgdemo.locationNotExists',
                            output: {returnCall: '위치찾기', options: {returnDialog: '수리가능품목'}}
                        },
                        {
                            output: '해당 서비스센터의 수리 가능 품목은 +center.productlist+ 입니다.\n센터 정보를 알려드릴까요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '+center.svc_center_name+\n주소: +center.address3+\n영업시간\n평일: +center.winter_week_open+ ~ +center.winter_week_close+\n토요일: +center.winter_sat_open+ ~ +center.winter_sat_close+\n전화번호: +center.phone+\n+center.parking+\n경로를 안내해드릴까요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문경로'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: '~아니요',
                                    output: '더 필요하신 게 있으신가요?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '궁금하신 걸 말씀해주세요~'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '좋은 하루 보내세요.\n감사합니다.'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '공휴일영업',
                    input: ['~공휴일', '일요일'],
                    output: [
                        {
                            if: 'lgdemo.locationNotExists',
                            output: {returnCall: '위치찾기', options: {returnDialog: '공휴일영업'}}
                        },
                        {
                            output: '죄송합니다. 영업일이 아닙니다.\n해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '영업시간',
                    input: '~영업 ~시간',
                    output: [
                        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '영업시간'}}},
                        {
                            output: '해당 서비스 센터의 영업시간은\n평일 +center.winter_week_open+부터 +center.winter_week_close+까지,\n 토요일 +center.winter_sat_open+부터 +center.winter_sat_close+까지 이며,\n 공휴일은 휴무입니다.\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '방문경로',
                    input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가는 방법'],
                    output: [
                        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '방문경로'}}},
                        {
                            output: '어떻게 방문하실 계획인가요?\n 1. 지하철\n 2. 버스\n 3. 자가용 \n4. 네비게이션',
                            children: [
                                {
                                    input: ['1', '지하철'],
                                    output: '+center.lms_subway+\n방문 예약을 하시겠습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문예약'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: '더 필요하신 게 있으신가요?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '궁금하신 걸 말씀해주세요~'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                                    children: [
                                                        {
                                                            input: '~네',
                                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                                        },
                                                        {
                                                            input: '~아니요',
                                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: ['2', '버스'],
                                    output: '+center.lms_bus+\n방문 예약을 하시겠습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문예약'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: '더 필요하신 게 있으신가요?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '궁금하신 걸 말씀해주세요~'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                                    children: [
                                                        {
                                                            input: '~네',
                                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                                        },
                                                        {
                                                            input: '~아니요',
                                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: ['3', '자가용'],
                                    output: '+center.owner+\n방문 예약을 하시겠습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문예약'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: '더 필요하신 게 있으신가요?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '궁금하신 걸 말씀해주세요~'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                                    children: [
                                                        {
                                                            input: '~네',
                                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                                        },
                                                        {
                                                            input: '~아니요',
                                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    input: ['4', '경로', '네비게이션', '네비'],
                                    task: 'lgdemo.ang',
                                    output: '경로안내입니다 \n +_docs.link_find+\n방문 예약을 하시겠습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: {call: '방문예약'}
                                        },
                                        {
                                            input: '~아니요',
                                            output: '더 필요하신 게 있으신가요?',
                                            children: [
                                                {
                                                    input: '~네',
                                                    output: '궁금하신 걸 말씀해주세요~'
                                                },
                                                {
                                                    input: '~아니요',
                                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                                    children: [
                                                        {
                                                            input: '~네',
                                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                                        },
                                                        {
                                                            input: '~아니요',
                                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '방문예약',
                    input: '예약',
                    output: '센터 방문 예약은 아래 LG전자 서비스 홈페이지에서 가능합니다.\nwww.lgservice.co.kr/reserve/selectVisit.do\n경로를 안내해드릴까요?',
                    children: [
                        {
                            input: '~네',
                            output: {call: '방문경로'}
                        },
                        {
                            input: '~아니요',
                            output: '더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '전화번호안내',
                    input: '~번호',
                    output: [
                        {
                            if: 'lgdemo.locationNotExists',
                            output: {returnCall: '위치찾기', options: {returnDialog: '전화번호안내'}}
                        },
                        {
                            output: '+center.svc_center_name+ 전화번호입니다.\n +center.phone+\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    name: '주차안내',
                    input: '~주차',
                    output: [
                        {if: 'lgdemo.locationNotExists', output: {returnCall: '위치찾기', options: {returnDialog: '주차안내'}}},
                        {
                            output: '+center.owner+\n더 필요하신 게 있으신가요?',
                            children: [
                                {
                                    input: '~네',
                                    output: '궁금하신 걸 말씀해주세요~'
                                },
                                {
                                    input: '~아니요',
                                    output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                                    children: [
                                        {
                                            input: '~네',
                                            output: '좋은 하루 보내세요.\n감사합니다.'
                                        },
                                        {
                                            input: '~아니요',
                                            output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                                        }
                                    ]
                                }
                            ]
                        }]
                }
            ]
        }
];

var commonDialogs = [
    {
        name: '시작',
        input: '시작',
        task:   {action: 'startAction'},
        output: '안녕하세요. LG전자 고객센터 데모 입니다.'
    },
    {
        input: '이전',
        output: {up:1}
    },
    {
        input: '전페이지',
        output: {repeat: 1, options: {page: 'pre'}}
    },
    {
        input: '다음페이지',
        output: {repeat: 1, options: {page: 'next'}}
    },
    {
        input: '콜센터',
        output: '고객센터 번호는 1577-7314입니다.'
    },
    {
        name: '답변없음',
        input: '',
        output: '알아듣지 못하는 말입니다.\n고객센터로 연결해드릴까요?',
        children: [
            {
                input: '~네',
                output: '고객센터 번호는 1577-7314입니다.'
            },
            {
                input: '~아니요',
                output: 'LG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                children: [
                    {
                        input: '~네',
                        output: '좋은 하루 보내세요.\n감사합니다.'
                    },
                    {
                        input: '~아니요',
                        output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\nLG전자 콜센터 번호는 1544-7777입니다.\nLG전자에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                    }
                ]
            }
        ]
    }
];

var json = JSON.stringify(dialogs);
var data =  JSON.parse(json);
console.log(data);
