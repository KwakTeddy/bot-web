var dialogs = [
    {
        "name": "1. 查看客房清单",
        "input": [
            {
                "regexp": "^1"
            },
            {
                "regexp": "客房清单"
            },
            {
                "text": {
                    "raw": "查看客房清单",
                    "nlp": "查看客房清单"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "以下是客房清单: ",
                "buttons": [
                    {
                        "text": "1. 单人间"
                    },
                    {
                        "text": "2. 双人间"
                    },
                    {
                        "text": "3. 大床房"
                    },
                    {
                        "text": "4. 三人间"
                    },
                    {
                        "text": "返回上一页"
                    },
                    {
                        "text": "回到初始页面"
                    }
                ]
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "1. 查看客房清单 1",
                "input": [
                    {
                        "regexp": "^1"
                    },
                    {
                        "text": {
                            "raw": "单人间",
                            "nlp": "单人间"
                        }
                    },
                    {
                        "regexp": "^2"
                    },
                    {
                        "text": {
                            "raw": "双人间",
                            "nlp": "双人间"
                        }
                    },
                    {
                        "regexp": "^3"
                    },
                    {
                        "text": {
                            "raw": "大床房",
                            "nlp": "大床房"
                        }
                    },
                    {
                        "regexp": "^4"
                    },
                    {
                        "text": {
                            "raw": "三人间",
                            "nlp": "三人间"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "☃单人间☃\n  ✔Single Room\n\n36m2 卧室1, 淋浴室1, 卫生间1\n55英寸智能电视\n(卫星52个频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 150元",
                        "buttons": [
                            {
                                "text": "返回上一页"
                            },
                            {
                                "text": "回到初始页面"
                            }
                        ],
                        "if": "context.session.isorder!==true"
                    },
                    {
                        "kind": "Content",
                        "text": "帮您预订这个房间吗？",
                        "if": "context.session.isorder===true",
                        "buttons": [
                            {
                                "text": "预订这个房间"
                            },
                            {
                                "text": "返回上一页"
                            },
                            {
                                "text": "回到初始页面"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": "image"
                },
                "id": "default1",
                "children": [
                    {
                        "name": "1. 查看客房清单 预约",
                        "input": [
                            {
                                "text": {
                                    "raw": "预订这个房间",
                                    "nlp": "预订这个房间"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "需要帮您预订几个房间？ \n(ex: 2)",
                                "type": "call",
                                "dialogName": "2. 预订 人数",
                                "dialogId": "default4"
                            }
                        ],
                        "id": "default19"
                    }
                ]
            }
        ],
        "task": {
            "name": "startmenu"
        }
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
                "text": "请告诉我您的入住日期。\n(ex: 2017-02-06)"
            }
        ],
        "id": "default2",
        "children": [
            {
                "name": "2. 预订 退房日期",
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
                        "text": "请告诉我您的退房日期。\n(ex: 2017-02-10)"
                    }
                ],
                "task": {
                    "name": "savedatein"
                },
                "id": "default100",
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
                                "kind": "Action",
                                "text": "需要帮您预订什么类型的房间?\n 请在下方列表中选择。",
                                "if": "context.session.days>=0",
                                "type": "call",
                                "dialogId": "default0",
                                "dialogName": "1. 查看客房清单"
                            },
                            {
                                "kind": "Action",
                                "text": "退房日期必须在入住日期之后。\n\n非常抱歉，请确认后再重新输入^^",
                                "if": "context.session.days<0",
                                "type": "repeat"
                            }
                        ],
                        "task": {
                            "name": "savedateout"
                        },
                        "id": "default3",
                        "children": [
                            {
                                "name": "2. 预订 人数",
                                "input": [
                                    {
                                        "if": "false"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "需要帮您预订几个房间？ \n(ex: 2)"
                                    }
                                ],
                                "task": {
                                    "name": ""
                                },
                                "id": "default4",
                                "children": [
                                    {
                                        "name": "2. 预订 预约人",
                                        "input": [
                                            {
                                                "regexp": "/^\\d/"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "请告诉我您的姓名。"
                                            }
                                        ],
                                        "task": {
                                            "name": "savenum"
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
                                                        "text": "请输入您的手机号码。(01012123434)"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "savename"
                                                },
                                                "id": "default6",
                                                "children": [
                                                    {
                                                        "name": "2. 预订 验证号码",
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
                                                                "text": "请输入您收到的短信验证号码。"
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
                                                                        "text": "以下是您的预订信息。\n入住日期: +context.session.datein+ \n退房日期: +context.session.dateout+\n预订房间数: +context.session.number+个\n价格: +context.session.allprice+元\n预订时间: +context.session.time+\n预订人姓名: +context.session.name+\n联系方式: +context.session.mobile+\n预订定信息正确吗?"
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
                                                                                    "raw": "是的",
                                                                                    "nlp": "是的"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": {
                                                                                    "raw": "好的",
                                                                                    "nlp": "好的"
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
                                                                                    "raw": "正确",
                                                                                    "nlp": "正确"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": {
                                                                                    "raw": "是",
                                                                                    "nlp": "是"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": {
                                                                                    "raw": "嗯",
                                                                                    "nlp": "嗯"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "output": [
                                                                            {
                                                                                "kind": "Content",
                                                                                "text": "已经为您完成了预约。\n\n但还没有得到最后确认，\n等确认房位后会给您发送短信通知您已经完成预订。\n\n想要查看预订信息的话请点击 \"查看预订信息\"按钮。\n想要回到初始换面的话请点击\"回到初始页面\"按钮。",
                                                                                "buttons": [
                                                                                    {
                                                                                        "url": "",
                                                                                        "text": "查看预订信息"
                                                                                    },
                                                                                    {
                                                                                        "url": "",
                                                                                        "text": "回到初始页面"
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ],
                                                                        "id": "default14",
                                                                        "children": [
                                                                            {
                                                                                "name": "2. 预订信息 查看",
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
                                                                                "id": "default23"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "2. 预订 验证号码 重发",
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
                                                                        "text": "已经重新发送。\n\n请输入您收到的短信验证号码。",
                                                                        "type": "call",
                                                                        "dialogName": "2. 预订 验证号码",
                                                                        "dialogId": "default7"
                                                                    }
                                                                ],
                                                                "task": {
                                                                    "name": "recertification"
                                                                },
                                                                "id": "default13"
                                                            },
                                                            {
                                                                "name": "2. 预订 验证号码 错误情况",
                                                                "input": [
                                                                    {
                                                                        "if": "true"
                                                                    }
                                                                ],
                                                                "output": [
                                                                    {
                                                                        "kind": "Action",
                                                                        "text": "您输入的验证号码有误。\n\n非常抱歉，请确认后再重新输入^^\n\n没有收到验证号码的情况，请输入'重发'。",
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
                                                                "text": "请输入的手机号格式不对。\n\n非常抱歉，请确认后再重新输入^^",
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
                                                "text": "非常抱歉，请输入纯数字^^",
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
                                "text": "请输入的日期格式有误。\n\n非常抱歉，请确认后再重新输入^^",
                                "type": "repeat"
                            }
                        ],
                        "id": "default9"
                    }
                ]
            },
            {
                "name": "2. 预订 退房日期 错误情况",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "您输入的日期格式有误或者比入住日期小。\n\n非常抱歉，请确认后再重新输入^^",
                        "type": "repeat"
                    }
                ],
                "id": "default101"
            }
        ],
        "task": {
            "name": "orderstart"
        }
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
                "name": "3. 是否查看预订信息",
                "input": [
                    {
                        "if": "true"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "查看预订信息",
                        "if": "context.session.confirmlist.length>0"
                    },
                    {
                        "kind": "Content",
                        "text": "预订",
                        "if": "context.session.confirmlist.length<=0",
                        "type": "call",
                        "dialogId": "default2",
                        "dialogName": "2. 预订 日期"
                    }
                ],
                "id": "default16",
                "task": {
                    "name": "showlist"
                },
                "children": [
                    {
                        "name": "3. 查看预订信息 取消",
                        "input": [
                            {
                                "regexp": "/^\\d/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "删除成功！",
                                "buttons": [
                                    {
                                        "text": "返回上一页"
                                    },
                                    {
                                        "text": "回到初始页面"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "deleteorder"
                        },
                        "id": "default20"
                    },
                    {
                        "name": "3. 查看预订信息 没有预订情况",
                        "input": [
                            {
                                "text": {
                                    "raw": "预订",
                                    "nlp": "预订"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "",
                                "type": "call",
                                "dialogId": "default2",
                                "dialogName": "2. 预订 日期"
                            }
                        ],
                        "id": "default22"
                    },
                    {
                        "name": "3. 查看预订信息 取消 错误情况",
                        "input": [
                            {
                                "if": "true"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "非常抱歉，请输入纯数字?^^",
                                "type": "repeat"
                            }
                        ],
                        "id": "default21"
                    }
                ]
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
                        "text": "NAVER地图"
                    },
                    {
                        "url": "http://dmaps.kr/2i3bv",
                        "text": "daum地图"
                    },
                    {
                        "text": "返回上一页"
                    },
                    {
                        "text": "回到初始页面"
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
                "regexp": "출근"
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
                "text": "<+bot.name+> 营业时间\n\nOpen hour\n24小时\n\nBreak time\n工作日中午12 - 1点\n\n没有休息日。",
                "buttons": [
                    {
                        "text": "返回上一页"
                    },
                    {
                        "text": "回到初始页面"
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
                    "raw": "初始",
                    "nlp": "初始"
                }
            },
            {
                "text": {
                    "raw": "开始对话",
                    "nlp": "开始对话"
                }
            },
            {
                "text": {
                    "raw": "回到初始页面",
                    "nlp": "回到初始页面"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "我是<+bot.name+>人工智能聊天机器人。 如果您有疑问随时可以问我哟~\n\n或者，您也可以告诉我以下列表中您想要查看的内容的编号！\n\n1. 查看客房请看\n2. 预订\n3. 查看预订信息"
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
