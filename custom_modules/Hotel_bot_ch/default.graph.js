


var dialogs = [
    {
        "id": "default0",
        "filename": "default",
        "input": [
            {
                "text": "房间"
            },
            {
                "text": "1"
            }
        ],
        "output": {
            "text": "[客室]\n\n您好，欢迎光临Moneybrain酒店 \n提供酒店服务信息，请选择需要的选项 \n\n1. 房间信息\n2. 房间预订\n3. 房间预订确认\n4. 房间预订取消\n\n(9.上一步, 0.开始)",
            "kind": "Text"
        },
        "name": "객실",
        "children": [
            {
                "name": "이름",
                "id": "default1",
                "filename": "default",
                "input": [
                    {
                        "types": [
                            "myname"
                        ]
                    }
                ],
                "output": {
                    "text": "+myname+입니다.",
                    "kind": "Text"
                },
                "task": {
                    "name": "mynamesave"
                }
            },
            {
                "name": "객실 정보",
                "id": "default4",
                "filename": "default",
                "input": [
                    {
                        "text": "信息"
                    },
                    {
                        "text": "1"
                    }
                ],
                "output": {
                    "text": "[房间信息]\n\nMoneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息.\n\n1. 单人间\n2. 豪华间\n3. 套间\n\n(9.上一步, 0.开始)",
                    "kind": "Text"
                },
                "children": [
                    {
                        "name": "싱글룸",
                        "id": "default5",
                        "filename": "default",
                        "input": [
                            {
                                "text": "1"
                            },
                            {
                                "text": "单人间"
                            }
                        ],
                        "output": {
                            "text": "[客室 情報 - 单人间]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n- 卧室1， 浴室1，卫生间1\n- 视野 : 街景或者海景\n- 床型 : 双人床，大床 \n- 大小 : 36m2\n- 入住 : 下午 3点\n- 退宿 : 白天 12点\n- 55寸 智能电视 TV(52个卫星电视频道)卫星电视信息 \n- 300Mbps 超高速有线网，无线网免费提供300Mbps \n- 可使用 220V 11V 电压 \n-  咖啡，茶速冲包免费提供\n- 加大号床 30,000韩元/1晚\n-婴儿面霜（免费）\n\n[房间照片\n\n(9.上一步, 0.开始)]",
                            "image": {
                                "url": "/files/Hotel_bot1499950855867.jpg",
                                "displayname": "싱글 객실.jpg"
                            },
                            "kind": "Content"
                        }
                    },
                    {
                        "name": "豪华间",
                        "id": "default6",
                        "filename": "default",
                        "input": [
                            {
                                "text": "2"
                            },
                            {
                                "text": "豪华间"
                            }
                        ],
                        "output": {
                            "text": "[客室 情報 - 单人间]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n- 卧室1， 浴室1，卫生间1\n- 视野 : 街景或者海景\n- 床型 : 双人床，大床 \n- 大小 : 43m2\n- 入住 : 下午 3点\n- 退宿 : 白天 12点\n- 55寸 智能电视 TV(52个卫星电视频道)卫星电视信息 \n- 300Mbps 超高速有线网，无线网免费提供300Mbps \n- 可使用 220V 11V 电压 \n-  咖啡，茶速冲包免费提供\n- 加大号床 30,000韩元/1晚\n-婴儿面霜（免费）\n\n[房间照片\n\n(9.上一步, 0.开始)]",

                            "image": {
                                "url": "/files/Hotel_bot1499950900068.jpeg",
                                "displayname": "디럭스 객실.jpeg"
                            },
                            "kind": "Content"
                        }
                    },
                    {
                        "name": "套房",
                        "id": "default9",
                        "filename": "default",
                        "input": [
                            {
                                "text": "3"
                            },
                            {
                                "text": "套房"
                            }
                        ],
                        "output": {
                            "text": "[客室 情報 - 单人间]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n- 卧室1， 浴室1，卫生间1\n- 视野 : 街景或者海景\n- 床型 : 双人床，大床 \n- 大小 : 124m2\n- 入住 : 下午 3点\n- 退宿 : 白天 12点\n- 55寸 智能电视 TV(52个卫星电视频道)卫星电视信息 \n- 300Mbps 超高速有线网，无线网免费提供300Mbps \n- 可使用 220V 11V 电压 \n-  咖啡，茶速冲包免费提供\n- 加大号床 30,000韩元/1晚\n-婴儿面霜（免费）\n\n[房间照片\n\n(9.上一步, 0.开始)]",

                            "image": {
                                "url": "/files/Hotel_bot1499950914400.jpg",
                                "displayname": "스윗룸 객실.jpg"
                            },
                            "kind": "Content"
                        }
                    }
                ]
            },
            {
                "name": "객실 예약",
                "id": "default11",
                "filename": "default",
                "input": [
                    {
                        "text": "预订"
                    },
                    {
                        "text": "2"
                    }
                ],
                "output": {
                    "text": "[房间 – 房间预约]\n Moneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息 \n\n1. 单人间 \n2. 豪华间 \n3. 套间\n\n(9.上一步, 0.开始)",
                    "kind": "Text"
                },
                "children": [
                    {
                        "name": "객실 예약 날짜",
                        "id": "default12",
                        "filename": "default",
                        "input": [
                            {
                                "text": "1"
                            },
                            {
                                "text": "单人间"
                            }
                        ],
                        "output": {
                            "text": "[房间预订]\n房间预约情况\n- 房间种类 : 单人间\n\n请选择入住日期.\n\n(9.上一步, 0.开始)",
                            "kind": "Text"
                        },
                        "children": [
                            {
                                "name": "객실 예약 날짜2",
                                "id": "default13",
                                "filename": "default",
                                "input": [
                                    {
                                        "if": " true"
                                    }
                                ],
                                "output": {
                                    "text": "[房间预订\n房间预约信息\n- 房间种类 : 单人间\n- 入住日期 : 2017-07-13\n\n请输入退房日期.\n\n(9.上一步, 0.开始)",
                                    "kind": "Text"
                                },
                                "children": [
                                    {
                                        "name": "预约情况",
                                        "id": "default14",
                                        "filename": "default",
                                        "input": [
                                            {
                                                "if": " true"
                                            }
                                        ],
                                        "output": {
                                            "text": "[房间预订]\n您的房间预订已经完成.\n\n房间预订信息\n- 房间种类 : 单人间\n- 入住日期 : 2017년 7月13日\n- 退房日期 : 2017-07-20\n- 住宿时间 : 6晚7天\n- 价格 : 500,000韩元\n\n确认进行预订吗?\n\n(9.上一步, 0.开始)",
                                            "kind": "Text"
                                        },
                                        "children": [
                                            {
                                                "name": "예약 완료",
                                                "id": "default15",
                                                "filename": "default",
                                                "input": [
                                                    {
                                                        "text": "是"
                                                    }
                                                ],
                                                "output": {
                                                    "text": "[房间预订]\n您的房间预订已经完成.\n\n房间预订信息\n- 房间种类 : 单人间\n- 入住日期 : 2017년 7月13日\n- 退房日期 : 2017년 7月 20日\n- 住宿时间 : 6晚7天\n\n(9.上一步, 0.开始)",
                                                    "kind": "Text"
                                                }
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
        "name": "다이닝",
        "id": "default2",
        "filename": "default",
        "input": [
        {
            "text": "2"
        },
        {
            "text": "다이닝"
        }
    ],
    "output": {
    "text": "[餐厅]\nMoneybrain为您提供多样的餐饮空间。请点击下列选项查看详细信息。 \n\n1. 韩餐厅\n2. 日餐厅\n3. 中餐厅\n4. 西餐厅\n\n(9.上一步, 0.开始)",
        "kind": "Text"
    },
    "children": [
        {
            "name": "한식당",
            "id": "default16",
            "filename": "default",
            "input": [
                {
                    "text": "韩餐厅"
                },
                {
                    "text": "1"
                }
            ],
            "output": {
                "text": "[餐厅 – 韩餐厅]\n将传统的味道更加细心，精炼地 表达出来的韩国传统餐厅. 欢迎您来体验世界最初的米其林三星韩餐厅. \n\n- 位置 : 23层\n- 营业时间 \n中午 : 12:00 ~ 14:30\n晚上 : 18:00 ~ 22:00\n- 座位数 : 总 40座\n\n(9.上一步, 0.开始)",
                "image": {
                    "url": "/files/Hotel_bot1499950962135.jpg",
                    "displayname": "한식.jpg"
                },
                "kind": "Content"
            }
        },
        {
        "name": "일식당",
        "id": "default17",
        "filename": "default",
        "input": [
            {
                "text": "2"
            },
            {
                "text": "日餐厅"
            }
        ],
        "output": {
            "text": "[餐厅 – 日餐厅]\n充满时尚氛围和现代气息的餐厅，通过纯净海域的海鲜和直接精选的食材为您呈现日本料理的精髓。 \n\n- 位置 : 2楼\n- 营业时间 \n中午 : 12:00 ~ 14:30\n晚上 : 18:00 ~ 22:00\n- 座位数 : 总120座\n- 20个房间\n包含照片\n\n(9.上一步, 0.开始)",
            "image": {
                "url": "/files/Hotel_bot1499950974389.jpg",
                "displayname": "일식.jpg"
            },
            "kind": "Content"
        }
    },
    {
        "name": "중식당",
        "id": "default18",
        "filename": "default",
        "input": [
            {
                "text": "3"
            },
            {
                "text": "中餐厅"
            }
        ],
        "output": {
            "text": "[餐厅 – 中餐厅]\n 融合东方风情和现代感的室内装修，体验中国或香港上流餐厅的感觉。随和而又独居风格的氛围，让您在进入餐厅的一瞬间沉醉其中。 \n\n- 位置 : 11楼\n- 营业时间 \n中午 : 12:00 ~ 14:30\n晚上 : 18:00 ~ 22:00\n- 座位数 : 总100座\n- 11个房间\n包含照片\n\n(9.上一步, 0.开始)",

            "image": {
                "url": "/files/Hotel_bot1499950986006.jpg",
                "displayname": "중식.jpg"
            },
            "kind": "Content"
        }
    },
    {
        "name": "西餐厅",
        "id": "default19",
        "filename": "default",
        "input": [
            {
                "text": "4"
            },
            {
                "text": "西餐厅"
            }
        ],
        "output": {
            "text": "融合东方风情和现代感的室内装修，体验中国或香港上流餐厅的感觉。随和而又独居风格的氛围，让您在进入餐厅的一瞬间沉醉其中。\n\n- 位置 : 5楼\n- 营业时间 \n中午 : 12:00 ~ 14:30\n晚上 : 18:00 ~ 22:00\n- 座位数 : 总40座\n- 5个房间\n包含照片\n\n(9.上一步, 0.开始)",

    "image": {
    "url": "/files/Hotel_bot1499950995305.jpg",
        "displayname": "양식.jpg"
},
    "kind": "Content"
}
}
]
},
{
    "name": "시설",
    "id": "default3",
    "filename": "default",
    "input": [
    {
        "text": "3"
    },
    {
        "text": "设施"
    }
],
    "output": {
    "text": "[施設]\n Moneybrank为顾客提供了可以便捷实用的多种设施。请点击下列选项查看详细信息。 \n\n1. 泳池\n2. 礼堂\n3. 会议厅\n4. 健身房\n\n(9.上一步, 0.开始)",
        "kind": "Text"
},
    "children": [
    {
        "name": "수영장",
        "id": "default20",
        "filename": "default",
        "input": [
            {
                "text": "泳池"
            },
            {
                "text": "1"
            }
        ],
        "output": {
            "text": "[设施 – 泳池]\n温泉, 四季浴缸, 室外酒吧，为您提供高档次休闲方式的泳池. \n\n- 位置 : 3楼\n- 设施介绍 \n浴缸，温泉，吧台，桑拿\n\n(9.上一步, 0.开始)",
            "image": {
                "url": "/files/Hotel_bot1499951023309.jpg",
                "displayname": "수영장.jpg"
            },
            "kind": "Content"
        }
    },
    {
        "name": "예식장",
        "id": "default21",
        "filename": "default",
        "input": [
            {
                "text": "礼堂"
            }
        ],
        "output": {
            "text": "[设施 – 礼堂]\n让您永远珍藏幸福瞬间的氛围，为新人提供的无微不至的照顾，我们精心为您打造的约定终身的最佳场所。\n\n- 位置 : 2楼\n- 规模 : 49.5 x 22.0m / 高度 6.2m\n- 容纳人员 : 700\n\n(9.上一步, 0.开始)",
            "image": {
                "url": "/files/Hotel_bot1499951038739.jpg",
                "displayname": "예식장.jpg"
            },
            "kind": "Content"
        }
    },
    {
        "name": "컨퍼런스룸",
        "id": "default22",
        "filename": "default",
        "input": [
            {
                "text": "会议厅"
            },
            {
                "text": "3"
            }
        ],
        "output": {
            "text": "[设施 – 会议厅]\n会议厅可以更具活动的规模和性质不同，为你提供可以多样化使用的空间。\n\n- 位置 : 4楼\n- 规模 : 16.0 x 22.9m / 高度 6.2m\n- 容纳人员 : 最多 400人\n\n(9.上一步, 0.开始)",
            "image": {
                "url": "/files/Hotel_bot1499951055872.jpg",
                "displayname": "컨퍼런스룸.jpg"
            },
            "kind": "Content"
        }
    },
    {
        "name": "헬스장",
        "id": "default23",
        "filename": "default",
        "input": [
            {
                "text": "健身房"
            },
            {
                "text": "4"
            }
        ],
        "output": {
            "text": "[设施 – 健身房]\n 由为了进行系统的体力管理而准备的多功能空间和提供最佳休息的运动空间构成，满足您的运动和休息需求。 \n\n- 位置 : 5층\n- 营业时间 : 05:30 ~ 22:30\n- 租借物品 : 运动服，袜子\n\n(9.上一步, 0.开始)",
            "image": {
                "url": "/files/Hotel_bot1499951079672.jpeg",
                "displayname": "헬스장.jpeg"
            },
            "kind": "Content"
        }
    }
]
},
{
    "name": "이벤트",
    "id": "default24",
    "filename": "default",
    "input": [
    {
        "text": "4"
    },
    {
        "text": "特别活动"
    }
],
    "output": {
    "text": "[特别活动]\nMoneybrain酒店为迎接夏季而举办的特别活动，想要具体了解请选择下列选项。 \n \n1. 夏季狂欢节 \n2. 晚会玛利亚周\n3. 特别周末\n\n(9.上一步, 0.开始)",
        "kind": "Text"
},
    "children": [
    {
        "name": "여름 페스티벌",
        "id": "default25",
        "filename": "default",
        "input": [
            {
                "text": "夏季"
            },
            {
                "text": "狂欢节"
            },
            {
                "text": "1"
            }
        ],
        "output": {
            "text": "[特别活动 – 夏季狂欢节] \n 在野外的露天平台为您准备了驱走夏季炎热的清凉饮料。\n和厨师选择的主餐搭配宝石般的甜点以及充满风格的红酒，一起在Moneybrain酒店度过特别的夜晚. \n \n- 地点 1楼酒吧 \n- 时间：周一到周四( 17:00~22:00)\n- 期间：2017-07-01 ~ 2017-08-31\n\n(9.上一步, 0.开始)",
            "kind": "Text"
        }
    },
    {
        "name": "이브닝 마리아주",
        "id": "default26",
        "filename": "default",
        "input": [
            {
                "text": "晚会"
            },
            {
                "text": "玛利亚周"
            },
            {
                "text": "2"
            }
        ],
        "output": {
            "text": "[特别活动 – 晚会玛利亚周] \n为您介绍营造特别夜晚的剪影晚会玛利亚周.\n和厨师选择的主餐搭配宝石般的甜点以及充满风格的红酒，一起在Moneybrain酒店度过特别的夜晚. \n \n- 地点 1楼酒吧 .\n 时间 2017-07-01 ~ 2017-08-31\n\n(9.上一步, 0.开始)",
            "kind": "Text"
        }
    },
    {
        "name": "주말 스페셜",
        "id": "default27",
        "filename": "default",
        "input": [
            {
                "text": "3"
            },
            {
                "text": "周末"
            },
            {
                "text": "特别活动"
            }
        ],
        "output": {
            "text": "[特别活动 – 特别周末] \n丰盛的美食和清爽的啤酒还有隐隐的月光.\n欢迎体验我们为您准备的月光沐浴狂欢节. \n \n - 地点 1楼酒吧 .\n 时间 2017-07-01 ~ 2017-08-31,\n优惠 酒吧, 健身房, 室内桑拿, 泳池, 不限量啤酒\n\n(9.上一步, 0.开始)",

            "kind": "Text"
        }
    }
]
},
{
    "name": "위치 안내",
    "id": "default28",
    "filename": "default",
    "input": [
    {
        "text": "5"
    },
    {
        "text": "位置"
    },
    {
        "text": "信息服务"
    }
],
    "output": {
    "text": "[位置介绍]\nMoneybrain酒店是城市中的花园. 尽我们最大的努力为您提供休息的空间. \n\n- 地址 : 首尔市中路222号 \n\n(9.上一步, 0.开始)",
        "image": {
        "url": "/files/Hotel_bot1499951113228.gif",
            "displayname": "오시는길.gif"
    },
    "kind": "Content"
}
}
];

var commonDialogs = [
    {
        "id": "defaultcommon0",
        "filename": "defaultcommon",
        "name": "시작",
        "input": [
            {
                "text": "开始"
            }
        ],
        "output": {
            "text": "您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3. 设施 \n4. 活动 \n5. 咨询",
            "kind": "Text"
        }
    },
    {
        "id": "defaultcommon1",
        "filename": "defaultcommon",
        "name": "처음",
        "input": [
            {
                "text": "开始"
            },
            {
                "text": "0"
            }
        ],
        "output": {
            "kind": "Action",
            "call": "시작"
        }
    },
    {
        "name": "이전",
        "id": "commondefault30",
        "filename": "defaultcommon",
        "input": [
            {
                "text": "上一步"
            },
            {
                "text": "9"
            }
        ],
        "output": {
            "kind": "Action",
            "up": "1"
        }
    }
];
var _bot = require(require('path').resolve("config/lib/bot")).getBot('Hotel_bot_ch');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
