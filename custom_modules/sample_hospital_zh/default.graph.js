var dialogs = [
    {
        "name": "1. 交通和停车场指南",
        "input": [
            {
                "regexp": "/^1/"
            },
            {
                "regexp": "/交通/"
            },
            {
                "regexp": "/停车/"
            },
            {
                "regexp": "/公交/"
            },
            {
                "regexp": "/地铁/"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "原来您想要查看<+bot.name+>的交通和停车信息呀!\n请输入您想要查看的相关内容。\n\n比如)坐地铁怎么去, 停车指南\n\n* 如果您想回到初始画面，请回复'开始'，如果您想返回上一页，请回复'返回'。"
            }
        ],
        "id": "default0",
        "children": [
            {
                "name": "1. 公交",
                "input": [
                    {
                        "regexp": "/公交/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "您准备乘坐公交车来哈!\n\n请选择您想要乘坐的公交车类型：",
                        "buttons": [
                            {
                                "text": "穿梭巴士"
                            },
                            {
                                "text": "公交车"
                            },
                            {
                                "text": "高速大巴"
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
                "id": "default1",
                "children": [
                    {
                        "name": "1. 公交 穿梭巴士",
                        "input": [
                            {
                                "regexp": "/穿梭巴士/"
                            },
                            {
                                "regexp": "/1/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "穿梭巴士乘坐指南：\n\n当天治疗预约人, 医院职员, 志愿服务人员专用穿梭巴士。\n请注意去殡仪馆或者为了一般用途而来的顾客不能使用。\n\n■ 运营路线: 医院后门右拐公交站（东大门站） \n\n■ 运营时间: 工作日6:30 ~ 18:00(大约15分钟一趟) \n • 午餐时间： 11:00, 11:15, 11:30, 11:45, 12:00, 12:15, 12:30 \n • 星期天, 公休日不运营。\n\n■ 乘坐地点: 北京市海口路新海站, 北京市黄埔大桥星星站",
                                "buttons": [
                                    {
                                        "text": "返回上一页"
                                    },
                                    {
                                        "text": "回到初始画面"
                                    }
                                ]
                            }
                        ],
                        "id": "default2"
                    },
                    {
                        "name": "2. 公交车",
                        "input": [
                            {
                                "regexp": "/公交车/"
                            },
                            {
                                "regexp": "/2/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "乘坐公交车方法： \n\n■ 0000号:\n+bot.name+下车 (景秀小区站 ↔ +bot.name+)\n\n■ 1111号:\n+bot.name+下车 (宜家小区站 ↔ +bot.name+)",
                                "buttons": [
                                    {
                                        "text": "返回上一页"
                                    },
                                    {
                                        "text": "回到初始画面"
                                    }
                                ]
                            }
                        ],
                        "id": "default3"
                    },
                    {
                        "name": "3. 高速大巴",
                        "input": [
                            {
                                "regexp": "/高速大巴/"
                            },
                            {
                                "regexp": "/3/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "乘坐高速大巴方法：\n\n■ 东部客运站:\n000号公交(凌海站A) →下车(\n+bot.name+)\n\n■ 西部客运站:\n西部客运站上车 → 星月站换乘 → +bot.name+下车",
                                "buttons": [
                                    {
                                        "text": "返回上一页"
                                    },
                                    {
                                        "text": "回到初始画面"
                                    }
                                ]
                            }
                        ],
                        "id": "default4"
                    }
                ]
            },
            {
                "name": "2. 地铁",
                "input": [
                    {
                        "regexp": "/地铁/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "乘坐地铁方法\n\n■ 首都战:\n15号出口 → 乘坐穿梭大巴或者徒步5分钟\n18号出口 → 1111号公交 →下车(+bot.name+)\n\n■ 宜家小区站:\n16号出口 →0000号公交 →下车(+bot.name+)",
                        "buttons": [
                            {
                                "text": "返回上一页"
                            },
                            {
                                "text": "回到初始画面"
                            }
                        ]
                    }
                ],
                "id": "default5"
            },
            {
                "name": "3. 停车",
                "input": [
                    {
                        "regexp": "/停车/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "有野外停车场, 后院停车场。\n请按相应的按钮查看具体位置。",
                        "buttons": [
                            {
                                "url": "https://map.naver.com/index.nhn?query=d2V3b3Jr&enc=b64&tab=1",
                                "text": "野外停车场"
                            },
                            {
                                "url": "https://map.naver.com/index.nhn?query=d2V3b3Jr&enc=b64&tab=1",
                                "text": "后院停车场"
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
                "id": "default6"
            }
        ]
    },
    {
        "name": "2. 查找医院内部位置",
        "input": [
            {
                "regexp": "/^2/"
            },
            {
                "regexp": "/位置/"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "<+bot.name+>的地址\n\n北京市二环创业大楼",
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
        "id": "default7"
    },
    {
        "name": "3. 诊疗指南",
        "input": [
            {
                "regexp": "/^3/"
            },
            {
                "regexp": "/诊疗指南/"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "为您进行诊疗指南。\n\n您想咨询什么内容？\n\n1. 门诊治疗\n2. 应急治疗\n3. 诊疗咨询预约"
            }
        ],
        "id": "default8",
        "children": [
            {
                "name": "3. 诊疗指南 门诊治疗",
                "input": [
                    {
                        "regexp": "/^1/"
                    },
                    {
                        "regexp": "/门诊治疗/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "请输入与关门诊治疗相关的疑问点。\n\n예) 预约业务时间, 治疗流程\n\n* 如果过您想回到初始画面，请回复'开始'，若您想要返回上一页，请输入'返回'。"
                    }
                ],
                "id": "default9",
                "children": [
                    {
                        "name": "3. 预约",
                        "input": [
                            {
                                "regexp": "/预约/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "请选择您想要知道的内容：",
                                "buttons": [
                                    {
                                        "text": "1. 预约方法"
                                    },
                                    {
                                        "text": "2. 预约业务时间"
                                    },
                                    {
                                        "text": "3. 诊疗需要提交的资料"
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
                        "id": "default10",
                        "children": [
                            {
                                "name": "1. 预约方法",
                                "input": [
                                    {
                                        "regexp": "/方法/"
                                    },
                                    {
                                        "regexp": "/1/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "■ 医院访问预约\n - 流程: 挂号窗口→挂号→诊疗预约→预约日来医院和诊疗\n - 预约时间: 工作日06:30~17:30 / 星期六: 08:30~15:30\n\n■ 电话预约 \n - 流程: 电话申请(0000-1111)→电话连接电话预约室咨询员→诊疗 상담 후 预约→预约日来医院和诊疗\n - 预约时间: 工作日: 06:00~18:0   星期六: 08:00~17:3 星期天: 08:30~17:30\n - 患者需要提供的内容: 姓名,身份证号,地址,联系方式, 诊疗科(咨询后选择)\n\n■ FAX预约\n - 患者姓名, 地址, 手机号, 症状, 填写想要挂的科→FAX申请(02-0000-1111)→确认后通过电话或者FAX通知\n - 预约时间: 24小时",
                                        "buttons": [
                                            {
                                                "text": "返回上一页"
                                            },
                                            {
                                                "text": "回到初始画面"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default11"
                            },
                            {
                                "name": "2. 预约业务时间",
                                "input": [
                                    {
                                        "regexp": "/业务时间/"
                                    },
                                    {
                                        "regexp": "/2/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "诊疗预约业务时间：\n• 工作日: 06:30~17:30\n• 星期六: 08:30~15:30",
                                        "buttons": [
                                            {
                                                "text": "返回上一页"
                                            },
                                            {
                                                "text": "回到初始画面"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default12"
                            },
                            {
                                "name": "3. 诊疗需要提交的资料",
                                "input": [
                                    {
                                        "regexp": "/资料/"
                                    },
                                    {
                                        "regexp": "/3/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "+bot.name+根据国家健康保险法1-2条：如果您提交诊所出具的医疗护理福利申请表可以获得保险福利。\n\n如果您出示医疗卡可以获得相应的医疗保险补助。",
                                        "buttons": [
                                            {
                                                "text": "返回上一页"
                                            },
                                            {
                                                "text": "回到初始画面"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default13"
                            }
                        ]
                    },
                    {
                        "name": "3. 诊疗",
                        "input": [
                            {
                                "regexp": "/治疗/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "请选择您想要知道的与诊疗相关的内容：",
                                "buttons": [
                                    {
                                        "text": "1. 门诊时间"
                                    },
                                    {
                                        "text": "2. 治疗流程"
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
                        "id": "default14",
                        "children": [
                            {
                                "name": "3. 诊疗 门诊时间",
                                "input": [
                                    {
                                        "regexp": "/门诊/"
                                    },
                                    {
                                        "regexp": "/时间/"
                                    },
                                    {
                                        "regexp": "/1/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "门诊时间：\n• 工作日: 08:00~17:00 (注意，公休日只能进行急症)\n• 星期六: 09:00~14:30",
                                        "buttons": [
                                            {
                                                "text": "返回上一页"
                                            },
                                            {
                                                "text": "回到初始画面"
                                            }
                                        ]
                                    }
                                ],
                                "id": "default15"
                            },
                            {
                                "name": "3. 诊疗 治疗流程",
                                "input": [
                                    {
                                        "regexp": "/2/"
                                    },
                                    {
                                        "regexp": "/流程/"
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "您是第一次来吗? 还是已经有过诊疗的经历?",
                                        "buttons": [
                                            {
                                                "text": "1. 第一次来医院"
                                            },
                                            {
                                                "text": "2. 有过诊疗的经历"
                                            },
                                            {
                                                "text": "返回上一页"
                                            },
                                            {
                                                "text": "回到初始画面"
                                            }

                                        ],
                                        "image": {
                                            "url": ""
                                        }
                                    }
                                ],
                                "id": "default16",
                                "children": [
                                    {
                                        "name": "3. 治疗流程 第一次",
                                        "input": [
                                            {
                                                "regexp": "/1/"
                                            },
                                            {
                                                "regexp": "/第一次/"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "■ 第一次来治疗流程指南： \n\n(1)挂号\n\n(2)到所挂科进行诊断\n\n(3)诊疗\n\n(4)付款\n\n(5)拿药或办理入院手续",
                                                "buttons": [
                                                    {
                                                        "text": "返回上一页"
                                                    },
                                                    {
                                                        "text": "回到初始画面"
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": "default17"
                                    },
                                    {
                                        "name": "3. 治疗流程 诊疗 받은적이 있는 분",
                                        "input": [
                                            {
                                                "regexp": "/有过诊疗的经历/"
                                            },
                                            {
                                                "regexp": "/2/"
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "■ 有过治疗经验诊疗流程指南： \n\n(1)到预约挂号窗口进行挂号\n\n(2)到所挂科进行诊断\n\n(3)付款\n\n(4)拿药或入院",
                                                "buttons": [
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
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "3. 应急治疗",
                "input": [
                    {
                        "regexp": "/急诊/"
                    },
                    {
                        "regexp": "/2/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "有关急诊的指南，请选择想知道的内容的编号。",
                        "buttons": [
                            {
                                "text": "1. 诊疗流程"
                            },
                            {
                                "text": "2. 保险优惠指南"
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
                "id": "default20",
                "children": [
                    {
                        "name": "3. 应急治疗 诊疗流程",
                        "input": [
                            {
                                "regexp": "/诊疗流程/"
                            },
                            {
                                "regexp": "/1/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "■ 急诊室诊疗流程指南 \n\n(1)诊疗申请\n\n(2)分类室\n\n(3)会诊\n\n- 紧急医疗服务部: 内科, 儿科, 神经科, 皮肤科, 外科, 眼科, 牙科\n\n(4)缴费\n\n(5)吃药",
                                "buttons": [
                                    {
                                        "text": "返回上一页"
                                    },
                                    {
                                        "text": "回到初始画面"
                                    }
                                ]
                            }
                        ],
                        "id": "default21"
                    },
                    {
                        "name": "3. 应急诊疗 保险优惠指南",
                        "input": [
                            {
                                "regexp": "/保险/"
                            },
                            {
                                "regexp": "/2/"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "卫生福利部将限制轻度患者使用紧急医疗中心, 紧急医疗服务法第二条规定灭有获得资格的患者不能获得医疗费用的优惠。\n\n■ 急诊症状\n-  神经系统紧急诊断: 头部受伤，伴有急性意识障碍，急性神经系统疾病，呕吐和意识障碍等症状\n- 心血管急症: 需要心肺复苏，急性呼吸窘迫，心悸，呕吐和休克的症状\n- 中毒及代谢紊乱: 重度脱水，药物或酒精或其他物质过量和成瘾，急性代谢紊乱（肝功能衰竭，肾功能衰竭和糖尿病等）\n- 外科急诊症状: 急性腹（急性腹膜炎和肠梗阻和急性胰腺炎，如仅在严重的情况下），大面积裂缝（体表面积的18％以上），或在需要开腹手术股骨脊椎骨​​折，可能切断四肢的血管损伤，多处创伤，需要在全身麻醉下立即手术的症状\n- 出血: 持续出血\n- 眼科紧急症状: 由于化学物质引起的眼睛损伤，急性视力丧失\n- 过敏: 面部水肿的过敏反应\n- 小儿急诊症状: 小儿惊厥失常\n- 精神病突发症状: 可能伤害自己或他人的精神障碍\n\n■ 与紧急诊断相似的症状\n- 神经紧急症状: 意识障碍\n- 心血管疾病紧急症状: 呼吸困难\n- 外科急诊症状: 烧伤，包括急性腹部症状，骨折或错位，外伤，其他急诊手术，排尿困难\n- 出血: 血管损伤",
                                "buttons": [
                                    {
                                        "text": "返回上一页"
                                    },
                                    {
                                        "text": "回到初始画面"
                                    }
                                ]
                            }
                        ],
                        "id": "default22"
                    }
                ]
            }
        ]
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
                    "raw": "回到初始画面",
                    "nlp": "回到初始画面"
                }
            },
            {
                "text": {
                    "raw": "第一次",
                    "nlp": "第一次"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "您好, 我是+bot.name+人工智能聊天机器人. \n24小时随时为您服务\n\n欢迎向我提和+bot.name+相关的问题\n\n不知道想问什么? 那么从下面的菜单中选择也是可以的哟:)\n\n1. 交通和停车指南\n2. 查找医院内部位置\n3. 诊疗指南"
            }
        ]
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
        "name": "上一步",
        "input": [
            {
                "text": {
                    "raw": "up",
                    "nlp": "up"
                }
            },
            {
                "text": {
                    "raw": "上一步",
                    "nlp": "上一步"
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
                "kind": "Content",
                "buttons": [
                    {
                        "text": "回到初始画面"
                    }

                ]
            },
            {
                "text": "啊，这个部分我暂时还不是很清楚耶。\n\n您可以拨打+bot.name+的客服中心电话(☎02-858-5683)\n\n等我学会了，下次再告诉您哟！",
                "kind": "Content",
                "buttons": [
                    {
                        "text": "回到初始画面"
                    }

                ]
            },
            {
                "text": "我还没有学过这个暂时回答不了您呢ㅠ.ㅠ\n\n您可以拨打+bot.name+的客服中心电话(☎02-858-5683)\n\n您也可以问我其他的问题!",
                "kind": "Content",
                "buttons": [
                    {
                        "text": "回到初始画面"
                    }

                ]
            }
        ]
    }
];

module.exports = function(bot)
{
	bot.setDialogs(dialogs);
	bot.setCommonDialogs(commonDialogs);
}
