var path = require('path')
var address = require(path.resolve('./engine/bot/action/common/address'));
var type = require(path.resolve('./engine/bot/action/common/type'));
var shop = require(path.resolve('./engine/bot/common/shop'));
// var hospital = require('./hospital');


var dialogs = [
    {
        id: 'restaurant35',
        filename: 'restaurant',
        name: '예약내역',
        input: ['예약 취소', '예약 확인', '예약 내역'],
        task:   "reserveCheck",
        output: [
            {if: 'context.botUser.isOwner && context.dialog.reserves != undefined', output: '미처리 예약내역입니다.\n#reserves#+index+. +name+ +dateStr+ +time+ +numOfPerson+명 [+status+]\n#\n처리할 예약번호를 말씀해주세요.',
                children: [
                    {
                        id: 'restaurant30',
                        filename: 'restaurant',
                        input: {types: [{name: 'reserve', listName: 'reserves', typeCheck: 'listTypeCheck'}]},
                        task:       {action: function(task, context, callback) { task.result = {smartReply: ['예약확정', '예약취소']}; callback(task, context);}},
                        output: '상세 예약내역입니다.\n상태: +reserve.status+\n예약자명: +reserve.name+\n일시: +reserve.dateStr+ +reserve.time+\n인원: +reserve.numOfPerson+명\n연락처: +reserve.mobile+\n\n"확정", "취소"를 선택해 주세요.',
                        children: [
                            {
                                id: 'restaurant26',
                                filename: 'restaurant',
                                input: '~확정',
                                task:           'reserveOwnerConfirm',
                                output: {call: '예약내역', options: {prefix: '예약이 확정 되었습니다. 고객님에게 문자가 발송되었습니다.\n\n'}}
                            },
                            {
                                id: 'restaurant28',
                                filename: 'restaurant',
                                input: '~취소',
                                output: '취소 이유를 입력해주세요.',
                                children: [
                                    {
                                        id: 'restaurant27',
                                        filename: 'restaurant',
                                        input: {if: 'true'},
                                        task:               'reserveOwnerCancel',
                                        output: {call: '예약내역', options: {prefix: '예약이 취소 되었습니다.\n\n'}}
                                    }
                                ]
                            },
                            {
                                id: 'restaurant29',
                                filename: 'restaurant',
                                input: {if: 'true'},
                                output: {repeat: 1, options: {output: '"확정" 또는 "취소"라고 말씀해주세요.'}}
                            }
                        ]
                    },
                    {
                        id: 'restaurant31',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        output: {repeat: 1, options: {prefix: '목록에서 선택해주세요.\n'}}
                    }
                ]},
            {if: 'context.botUser.isOwner && context.dialog.reserves == undefined', output: '미처리 예약내역이 없습니다.'},
            {if: 'context.dialog.reserves != undefined', output: '고객님의 예약 내역입니다.\n#reserves#+index+. +dateStr+ +time+ [+status+]\n#\n예약을 취소하시려면, 취소할 번호를 말씀해주세요.',
                children: [
                    {
                        id: 'restaurant32',
                        filename: 'restaurant',
                        input: {types: [{name: 'reserve', listName: 'reserves', typeCheck: 'listTypeCheck'}]},
                        task:       'reserveCancel2',
                        output: '예약이 취소되었습니다.'
                    },
                    {
                        id: 'restaurant33',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        output: {repeat: 1, options: {prefix: '목록에서 선택해주세요.\n'}}
                    }
                ]},
            {if: 'context.dialog.reserve != undefined', output: '고객님의 예약 내역입니다.\n상태: +reserve.status+\n일시: +reserve.dateStr+ +reserve.time+\n예약자명: +reserve.name+\n연락처: +reserve.mobile+\n\n예약을 취소하시려면 "취소"라고 말씀해주세요.',
                children: [
                    {
                        id: 'restaurant34',
                        filename: 'restaurant',
                        input: '취소',
                        task:       'reserveCancel2',
                        output: '예약이 취소되었습니다.'
                    }
                ]}, '고객님의 예약내역이 없습니다.']
    },
    {
        id: 'restaurant57',
        filename: 'restaurant',
        name: "예약하기",
        input: ['예약', {"regexp": "^3$"}],
        output: {callChild: '날짜선택'},
        children: [
            {
                id: 'restaurant39',
                filename: 'restaurant',
                name: '날짜선택',
                input: false,
                output: '예약하실 일자를 말씀해 주세요.',
                children: [
                    {
                        id: 'restaurant36',
                        filename: 'restaurant',
                        input: {types: [{name: 'date', typeCheck: 'dateTypeCheck'}]},
                        // task:           {action: shop.checkDate},
                        task: "checkDate",
                        output: [
                            {
                                "if": "context.dialog.check == false",
                                "output": {"callChild": "시간선택"}
                            },
                            {
                                "if": "context.dialog.check == true",
                                "output": {
                                    "call": "날짜선택",
                                    "options": {
                                        "prefix": "+holiday+은 휴일입니다.\n\n다시 "
                                    }
                                }
                            },
                            {
                                "if": "context.dialog.check == 'past'",
                                "output": {
                                    "call": "날짜선택",
                                    "options": {
                                        "prefix": "이미 지난 날짜입니다.\n\n다시 "
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'restaurant37',
                        filename: 'restaurant',
                        input: {if: 'context.dialog.날짜입력최초 == undefined'},
                        task:           {
                            action: function(task, context, callback) {
                                context.dialog.날짜입력최초 = true; callback(task, context);
                            }
                        },
                        output: {call: '날짜선택'}
                    },
                    {
                        id: 'restaurant38',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        output: {repeat: 1, options: {prefix: '날짜가 아닙니다.\n', postfix: '\n\n취소하고 처음으로가려면\n"시작"이라고 말씀해주세요.'}}
                    }
                ]
            },
            {
                id: 'restaurant43',
                filename: 'restaurant',
                name: '시간선택',
                input: false,
                output: '예약하실 시간을 말씀해 주세요.',
                children: [
                    {
                        id: 'restaurant40',
                        filename: 'restaurant',
                        input: {types: 'timeType'},
                        // task:           {action: shop.checkTime},
                        task: "checkTime",
                        "output": [
                            {
                                "if": "context.user.reserveName && context.user.mobile",
                                "output": {"call": "예약내용확인"}
                            },
                            {
                                "if": "context.dialog.check == false",
                                "output": {"call": "예약자명"}
                            },
                            {
                                "if": "context.dialog.check == 're'",
                                "output": {
                                    "call": "시간선택",
                                    "options": {
                                        "prefix": "시간은 오전/오후를 붙여서 이야기 해주세요.\n\n"
                                    }
                                }
                            },
                            {
                                "if": "context.dialog.check == true",
                                "output": {
                                    "call": "시간선택",
                                    "options": {
                                        "prefix": "영업시간은 +startTime+부터 +endTime+까지입니다.\n\n다시 "
                                    }
                                }
                            },
                            {
                                "if": "context.dialog.check == 'past'",
                                "output": {
                                    "call": "시간선택",
                                    "options": {
                                        "prefix": "이미 지난 시간입니다.\n\n다시 "
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'restaurant41',
                        filename: 'restaurant',
                        input: {if: 'context.dialog.시간입력최초 == undefined'},
                        task:           {
                            action: function(task, context, callback) {
                                context.dialog.시간입력최초 = true; callback(task, context);
                            }
                        },
                        output: {call: '시간선택'}
                    },
                    {
                        id: 'restaurant42',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        output: {repeat: 1, options: {prefix: '시간이 아닙니다.\n', postfix: '\n\n예약 진행을 취소하시려면\n"시작"이라고 말씀해주세요.'}}
                    }
                ]
            },
            {
                id: 'restaurant47',
                filename: 'restaurant',
                name: '인원선택',
                input: false,
                output: '몇명이 오실지 말씀해 주세요',
                children: [
                    {
                        id: 'restaurant44',
                        filename: 'restaurant',
                        input: {types: [{name: 'numOfPerson', typeCheck: 'numOfPersonTypeCheck', init: true}]},
                        output: {call: '예약자명'}
                    },
                    {
                        id: 'restaurant45',
                        filename: 'restaurant',
                        input: {if: 'context.dialog.인원선택최초 == undefined'},
                        task:           {
                            action: function(task, context, callback) {
                                context.dialog.인원선택최초 = true; callback(task, context);
                            }
                        },
                        output: {call: '인원선택'}
                    },
                    {
                        id: 'restaurant46',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        output: {repeat: 1, options: {prefix: '인원수가 아닙니다.\n', postfix: '\n\n예약 진행을 취소하시려면\n"시작"이라고 말씀해주세요.'}}
                    }
                ]
            },
            {
                id: 'restaurant49',
                filename: 'restaurant',
                name: '예약자명',
                input: false,
                output: '예약하실 이름을 입력해주세요.',
                children: [
                    {
                        id: 'restaurant48',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        task:           'reserveNameTask',
                        output: [
                            {if: 'context.user.mobile == undefined', output: {call: '휴대폰번호입력'}},
                            {if: 'true', output: {call: '예약내용확인'}}]
                    }
                ]
            },
            {
                id: 'restaurant54',
                filename: 'restaurant',
                name: '휴대폰번호입력',
                input: false,
                output: '휴대폰 번호를 말씀해주세요.',
                children: [
                    {
                        id: 'restaurant52',
                        filename: 'restaurant',
                        input: {types: [{type : type.mobileType, context: false}]},
                        task:           'smsAuth',
                        output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.',
                        children: [
                            {
                                id: 'restaurant50',
                                filename: 'restaurant',
                                input: {regexp: /[\d\s]+/},
                                // output: [{if: shop.smsAuthValid, task: 'smsAuthTask', output: {call: '예약내용확인'}}, {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}]
                                output: [{if: shop.smsAuthValid, task: 'smsAuthTask', output: {call: '예약내용확인'}}, {
                                    "kind": "Action",
                                    "repeat": 1,
                                    "options": {
                                        "output": "인증번호가 틀렸습니다.\n인증번호를 재전송합니다. 발송된 인증번호를 입력해주세요\n\n 처음으로 돌아가려면 '시작'을 입력하세요."
                                    }
                                }]
                            },
                            {
                                id: 'restaurant51',
                                filename: 'restaurant',
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                output: {
                                    "kind": "Action",
                                    "repeat": 1,
                                    "options": {
                                        "output": "인증번호가 틀렸습니다.\n인증번호를 재전송합니다. 발송된 인증번호를 입력해주세요\n\n 처음으로 돌아가려면 '시작'을 입력하세요."
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'restaurant53',
                        filename: 'restaurant',
                        input: {if: 'true'},
                        output: {repeat: 1, options: {prefix: '휴대폰 번호가 아닙니다.\n', postfix: '\n\n예약 진행을 취소하시려면\n"시작"이라고 말씀해주세요.'}}
                    }
                ]
            },
            {
                id: 'restaurant56',
                filename: 'restaurant',
                name: '예약내용확인',
                input: false,
                task:       {action: 'reserveConfirm'},
                output: '예약내용을 확인해주세요.\n일시: +dateStr+ +time+\n성함: +reserveName+\n연락처: +mobile+\n다음과 같이 예약신청하시겠습니까?\n(네/아니오)\n\n1.일시 다시 선택\n2.이름 변경\n3.연락처 변경',
                children: [
                    {
                        id: 'restaurant55',
                        filename: 'restaurant',
                        input: '~네',
                        task: "reserveRequest2",
                        output: '예약을 요청하였습니다.\n\n아직 확정이 아닙니다.\n확인 후 예약완료 문자를 보내 드리겠습니다.\n\n 처음으로 돌아가려면 "시작"을 입력하세요.'
                    },
                    {
                        id: 'restaurant55',
                        filename: 'restaurant',
                        input: '~아니요',
                        output: '예약이 취소되었습니다.\n\n 처음으로 돌아가려면 "시작"을 입력하세요.'
                    },
                    {
                        id: 'restaurant55',
                        filename: 'restaurant',
                        input: ['1','일시','일 시','날짜'],
                        output: {call: '날짜선택'}
                    },
                    {
                        id: 'restaurant55',
                        filename: 'restaurant',
                        input: ['2','이름'],
                        output: {call: '예약자명'}
                    },
                    {
                        id: 'restaurant55',
                        filename: 'restaurant',
                        input: ['3','연락처'],
                        output: {call: '휴대폰번호입력'}
                    }
                ]
            }
        ]
    }
];

var _bot = require(require('path').resolve("engine/bot")).getTemplateBot('hospital');
_bot.setDialogs(dialogs);
