var dialogs = [
    {
        "name": "1. 查看菜单",
        "input": [
            {
                "regexp": "/^1/"
            },
            {
                "regexp": "/菜单/"
            },
            {
                "text": {
                    "raw": "查看菜单",
                    "nlp": "查看菜单"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "菜单如下：",
                "buttons": [
                    {
                        "text": "1. 汉堡牛排"
                    },
                    {
                        "text": "2. 酱香米饭"
                    },
                    {
                        "text": "3. 黑椒牛排"
                    },
                    {
                        "text": "返回上一页"
                    },
                    {
                        "text": "回到初始画面"
                    }
                ]
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "1. 查看菜单 1",
                "input": [
                    {
                        "regexp": "^1"
                    },
                    {
                        "text": {
                            "raw": "汉堡牛排",
                            "nlp": "汉堡牛排"
                        }
                    },
                    {
                        "regexp": "^2"
                    },
                    {
                        "text": {
                            "raw": "酱香米饭",
                            "nlp": "酱香米饭"
                        }
                    },
                    {
                        "regexp": "^3"
                    },
                    {
                        "text": {
                            "raw": "黑椒牛排",
                            "nlp": "黑椒牛排"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "☃汉堡牛排☃\n  ✔house burgsteak\n\n清新西红柿酱味\n\n价格: 89元",
                        "buttons": [
                            {
                                "url": "",
                                "text": "返回上一页"
                            },
                            {
                                "url": "",
                                "text": "回到初始画面"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "image"
                },
                "id": "default1"
            }
        ]
    },
    {
        "name": "2. 预订 日期",
        "input": [
            {
                "regexp": "预订"
            },
            {
                "regexp": "^2"
            },
            {
                "regexp": "预约"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "请告诉我您要预订的日期。\n(ex: 2017-02-06)"
            }
        ],
        "id": "default2",
        "children": [
            {
                "name": "2. 预订 时间",
                "input": [
                    {
                        "types": [
                            "date"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "请告诉我您要预订的时间。\n(ex: 下午 4点)"
                    }
                ],
                "task": {
                    "name": "savedate"
                },
                "id": "default3",
                "children": [
                    {
                        "name": "2. 预订 人数",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "请告诉我您想预订的人数\n(ex: 6)"
                            }
                        ],
                        "task": {
                            "name": "savetime"
                        },
                        "id": "default4",
                        "children": [
                            {
                                "name": "2. 预订 预订者",
                                "input": [
                                    {
                                        "types": [
                                            "peoplenumber"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "请告诉我您的姓名。"
                                    }
                                ],
                                "task": {
                                    "name": "savepeoplenum"
                                },
                                "id": "default5",
                                "children": [
                                    {
                                        "name": "2. 预订 手机号",
                                        "input": [
                                            {
                                                "if": "true"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "请告诉我您的手机号码。(01012123434)"
                                            }
                                        ],
                                        "task": {
                                            "name": "savename"
                                        },
                                        "id": "default6",
                                        "children": [
                                            {
                                                "name": "2. 预订 验证码",
                                                "input": [
                                                    {
                                                        "types": [
                                                            "mobile"
                                                        ]
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "请输入您收到的验证码。"
                                                    }
                                                ],
                                                "id": "default7",
                                                "children": [
                                                    {
                                                        "name": "2. 查看预订信息",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "identification"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "以下是您的预订信息：\n时间: +context.session.date+ +context.session.time+\n人数: +context.session.peoplenumber+位\n预订人姓名: +context.session.name+\n联系方式: +context.session.mobile+\n为您这样预订吗?"
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "saveorder"
                                                        },
                                                        "id": "default8",
                                                        "children": [
                                                            {
                                                                "name": "2. 预订",
                                                                "input": [
                                                                    {
                                                                        "text": {
                                                                            "raw": "好的",
                                                                            "nlp": "好的"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "行",
                                                                            "nlp": "行"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "好",
                                                                            "nlp": "好"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "嗯",
                                                                            "nlp": "嗯"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "哦",
                                                                            "nlp": "哦"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "可以",
                                                                            "nlp": "可以"
                                                                        }
                                                                    },
                                                                    {
                                                                        "text": {
                                                                            "raw": "是的",
                                                                            "nlp": "是的"
                                                                        }
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Content",
                                                                        "text": "已经为您申请了预订。\n\n但现在还不确定是否能预订成功。\n确定有座位以后会给您发送预订成功短信。\n\n如果您想要查看预订信息的话，请按\"查看预订信息\"按钮。\n如果您想回到初始画面，请按\"回到初始画面\"按钮。",
                                                                        "buttons": [
                                                                            {
                                                                                "url": "",
                                                                                "text": "查看预订信息"
                                                                            },
                                                                            {
                                                                                "url": "",
                                                                                "text": "回到初始画面"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "id": "default14",
                                                                "children": [
                                                                    {
                                                                        "name": "2. 预订 信息查询",
                                                                        "input": [
                                                                            {
                                                                                "text": {
                                                                                    "raw": "查看预订信息",
                                                                                    "nlp": "查看预订信息"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "output": [
                                                                            {
                                                                                "kind": "Action",
                                                                                "text": "",
                                                                                "type": "call",
                                                                                "dialogId": "default15",
                                                                                "dialogName": "3. 查看预订信息"
                                                                            }
                                                                        ],
                                                                        "id": "default19"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "2. 预订 验证码 重发",
                                                        "input": [
                                                            {
                                                                "text": {
                                                                    "raw": "重发",
                                                                    "nlp": "重发"
                                                                }
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "text": "已向您重新发送了验证码。\n\n请输入您收到的验证码。",
                                                                "type": "call",
                                                                "dialogName": "2. 预订 验证码",
                                                                "dialogId": "default7"
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "recertification"
                                                        },
                                                        "id": "default13"
                                                    },
                                                    {
                                                        "name": "2. 预订 验证码 错误情况",
                                                        "input": [
                                                            {
                                                                "if": "true"
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Action",
                                                                "text": "您输入的验证号码有误。\n\n非常抱歉，请确认后重新输入^^\n\n没有收到验证码的情况请回复'重发'。",
                                                                "type": "repeat"
                                                            }
                                                        ],
                                                        "id": "default12"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "savemobile"
                                                }
                                            },
                                            {
                                                "name": "2.预订 手机号 错误情况",
                                                "input": [
                                                    {
                                                        "if": "true"
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Action",
                                                        "text": "您输入的手机号格式有误。\n\n非常抱歉，请确认后重新输入^^",
                                                        "type": "repeat"
                                                    }
                                                ],
                                                "id": "default11"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "2. 预订 人数 错误情况",
                                "input": [
                                    {
                                        "if": "true"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "非常抱歉，您输入纯数字^^",
                                        "type": "repeat"
                                    }
                                ],
                                "id": "default10"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "2. 预订 日期 错误情况",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "您输入的日期格式有误。\n\n非常抱歉，请确认后重新输入^^",
                        "type": "repeat"
                    }
                ],
                "id": "default9"
            }
        ]
    },
    {
        "name": "3. 查看预订信息",
        "input": [
            {
                "regexp": "^3"
            },
            {
                "regexp": "查看预订信息"
            },
            {
                "regexp": "预订信息"
            },
            {
                "regexp": "预订的"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "请输入预订人姓名。"
            }
        ],
        "task": {
            "name": ""
        },
        "id": "default15",
        "children": [
            {
                "name": "3. 查看预订信息 是否",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "查看预订信息"
                    }
                ],
                "id": "default16",
                "task": {
                    "name": "showlist"
                }
            }
        ]
    },
    {
        "name": "5. 地图",
        "input": [
            {
                "regexp": "地图"
            },
            {
                "regexp": "位置"
            },
            {
                "regexp": "地址"
            },
            {
                "regexp": "在哪"
            },
            {
                "regexp": "公交"
            },
            {
                "regexp": "地铁"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<+bot.name+>的地址：\n\n北京市二环创业大楼",
                "buttons": [
                    {
                        "url": "https://map.naver.com/?query=%EC%84%9C%EC%9A%B8+%EC%84%9C%EC%B4%88%EA%B5%AC+%EA%B0%95%EB%82%A8%EB%8C%80%EB%A1%9C+373+(%EC%84%9C%EC%B4%88%EB%8F%99%2C+%ED%99%8D%EC%9A%B0%EB%B9%8C%EB%94%A9)+WeWork",
                        "text": "naver地图"
                    },
                    {
                        "url": "http://dmaps.kr/2i3bv",
                        "text": "daum地图"
                    },
                    {
                        "text": "返回上一页"
                    },
                    {
                        "text": "回到初始画面"
                    }
                ]
            }
        ],
        "id": "default18"
    },
    {
        "name": "4.营业时间",
        "input": [
            {
                "regexp": "营业时间"
            },
            {
                "regexp": "营业"
            },
            {
                "regexp": "开门"
            },
            {
                "regexp": "上班"
            },
            {
                "regexp": "下班"
            },
            {
                "regexp": "关门"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<+bot.name+>的营业时间：\n\nOpen hour\n上午 11点 30分 - 下午 10点\n(last order / 9点)\n\nBreak time\n工作日下午 3 - 4点\n\n周日休息",
                "buttons": [
                    {
                        "url": "",
                        "text": "返回上一页"
                    },
                    {
                        "url": "",
                        "text": "回到初始画面"
                    }
                ]
            }
        ],
        "id": "default17"
    }
];

var commonDialogs = [
    {
        "id": "startDialog",
        "name": "开始",
        "input": [
            {
                "text": {
                    "raw": "start",
                    "nlp": "start"
                }
            },
            {
                "text": {
                    "raw": "开始",
                    "nlp": "开始"
                }
            },
            {
                "text": {
                    "raw": "初始画面",
                    "nlp": "初始画面"
                }
            },
            {
                "text": {
                    "raw": "对话开始",
                    "nlp": "对话开始"
                }
            },
            {
                "text": {
                    "raw": "回到初始画面",
                    "nlp": "回到初始画面"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "我是<+bot.name+>人工智能聊天机器人。 有什么需要我帮助您的吗？\n\n或者是，您可以输入以下菜单中想要查看内容的编号\n\n1. 查看菜单\n2. 预订\n3. 查看预订信息"
            }
        ],
        "task": {
            "name": "start"
        }
    },
    {
        "id": "backDialog",
        "name": "返回",
        "input": [
            {
                "text": {
                    "raw": "back",
                    "nlp": "back"
                }
            },
            {
                "text": {
                    "raw": "返回",
                    "nlp": "返回"
                }
            },
            {
                "text": {
                    "raw": "返回上一页",
                    "nlp": "返回上一页"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "back"
            }
        ]
    },
    {
        "id": "upDialog",
        "name": "上一页",
        "input": [
            {
                "text": {
                    "raw": "up",
                    "nlp": "up"
                }
            },
            {
                "text": {
                    "raw": "上一页",
                    "nlp": "上一页"
                }
            }
        ],
        "output": [
            {
                "kind": "Action",
                "type": "up"
            }
        ]
    },
    {
        "id": "noanswer",
        "name": "没有回答",
        "input": "",
        "output": [
            {
                "text": "非常抱歉，您说的话我暂时理解不了~\n\n您可以拨打+bot.name+的客服中心电话(☎02-858-5683)\n\n您可以问我其他的问题哟~^^",
                "kind": "Content"
            },
            {
                "text": "啊，这个部分我暂时还不是很清楚耶。\n\n您可以拨打+bot.name+的客服中心电话(☎02-858-5683)\n\n等我学会了，下次再告诉您哟！",
                "kind": "Content"
            },
            {
                "text": "我还没有学过这个暂时回答不了您呢ㅠ.ㅠ\n\n您可以拨打+bot.name+的客服中心电话(☎02-858-5683)\n\n您也可以问我其他的问题!",
                "kind": "Content"
            }
        ]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}