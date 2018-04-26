var dialogs = [
    {
        "name": "0-1 change language",
        "input": [
            {
                "intent": "ChangeLanguage"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "Please select a language to change the language we use.",
                "buttons": [
                    {
                        "text": "English"
                    },
                    {
                        "text": "한국어"
                    },
                    {
                        "text": "中文"
                    }
                ]
            }
        ],
        "task": {
            "name": ""
        },
        "id": "default0",
        "children": [
            {
                "name": "0-1-1 change language",
                "input": [
                    {
                        "text": {
                            "raw": "English",
                            "nlp": "English"
                        }
                    },
                    {
                        "text": {
                            "raw": "中文",
                            "nlp": "中文"
                        }
                    },
                    {
                        "text": {
                            "raw": "한국어",
                            "nlp": "한국어"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "",
                        "type": "call",
                        "dialogId": "startDialog",
                        "dialogName": "start"
                    }
                ],
                "task": {
                    "name": "ChangeLanguage"
                },
                "id": "default8"
            }
        ]
    },
    {
        "name": "0-2-1 A brief introduction",
        "input": [
            {
                "text": {
                    "raw": "A brief introduction",
                    "nlp": "A brief introduction"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "What is bitcoin?\nBitcoin is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. From a user perspective, Bitcoin is pretty much like cash for the Internet. Bitcoin can also be seen as the most prominent triple entry bookkeeping system in existence.",
                "buttons": [
                    {
                        "text": "Learn more"
                    },
                    {
                        "text": "Return"
                    },
                    {
                        "text": "Talk now!"
                    }
                ]
            }
        ],
        "id": "default2",
        "children": [
            {
                "name": "0-2-2 A brief introduction",
                "input": [
                    {
                        "text": {
                            "raw": "learn more",
                            "nlp": "learn more"
                        }
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "How does one acquire Bitcoins?\n* As payment for goods or services.\n* Purchase bitcoins at a Bitcoin exchange.\n* Exchange bitcoins with someone near you.\n* Earn bitcoins through competitive mining.\nWhile it may be possible to find individuals who wish to sell bitcoins in exchange for a credit card or PayPal payment, most exchanges do not allow funding via these payment methods. This is due to cases where someone buys bitcoins with PayPal, and then reverses their half of the transaction. This is commonly referred to as a chargeback.",
                        "buttons": [
                            {
                                "text": "learn more"
                            },
                            {
                                "text": "Return"
                            },
                            {
                                "text": "Talk now!"
                            }
                        ]
                    }
                ],
                "id": "default3",
                "children": [
                    {
                        "name": "0-2-3 A brief introduction",
                        "input": [
                            {
                                "text": {
                                    "raw": "Learn more",
                                    "nlp": "Learn more"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "What information can I get from bitcoin-bot?\n1. Coin real-time price\n2. ICO Infomation",
                                "buttons": [
                                    {
                                        "text": "Return"
                                    },
                                    {
                                        "text": "Talk now!"
                                    }
                                ]
                            }
                        ],
                        "id": "default4"
                    }
                ]
            }
        ]
    },
    {
        "name": "1 Start 2",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "Hi！I am bitcoin-bot. \n\nToday is a great day! \nLet’s start today’s Bitcoin tour~\n*You can type the content in numbers and in texts.\n\nex: '1',   'coins',  'bitcoin price',  'ICO',  'btc chart'\n\n1. Coins\n2. ICOs\n3. News"
            }
        ],
        "id": "default1",
        "children": [
            {
                "name": "1 Bitcoin introduction",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "Do you want to ask those questions?",
                        "buttons": [
                            {
                                "text": "1. What is Bitcoin?"
                            },
                            {
                                "text": "2. How does one acquire Bitcoins?"
                            },
                            {
                                "text": "Return"
                            },
                            {
                                "text": "Start"
                            }
                        ]
                    }
                ],
                "id": "default5",
                "children": [
                    {
                        "name": "1-1 What is Bitcoin?",
                        "input": [
                            {
                                "text": {
                                    "raw": "1. What is Bitcoin?",
                                    "nlp": "1. What is Bitcoin?"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Bitcoin is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. From a user perspective, Bitcoin is pretty much like cash for the Internet. Bitcoin can also be seen as the most prominent triple entry bookkeeping system in existence.",
                                "buttons": [
                                    {
                                        "url": "https://bitcoin.org/en/",
                                        "text": "Learn more"
                                    },
                                    {
                                        "text": "Return"
                                    },
                                    {
                                        "text": "Start"
                                    }
                                ]
                            }
                        ],
                        "id": "default6"
                    },
                    {
                        "name": "1-2 How does one acquire Bitcoins?",
                        "input": [
                            {
                                "text": {
                                    "raw": "2. How does one acquire Bitcoins?",
                                    "nlp": "2. How does one acquire Bitcoins?"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "* As payment for goods or services.\n* Purchase bitcoins at a Bitcoin exchange.\n* Exchange bitcoins with someone near you.\n* Earn bitcoins through competitive mining.\nWhile it may be possible to find individuals who wish to sell bitcoins in exchange for a credit card or PayPal payment, most exchanges do not allow funding via these payment methods. This is due to cases where someone buys bitcoins with PayPal, and then reverses their half of the transaction. This is commonly referred to as a chargeback.",
                                "buttons": [
                                    {
                                        "text": "See exchanges"
                                    },
                                    {
                                        "text": "Return"
                                    },
                                    {
                                        "text": "Start"
                                    }
                                ]
                            }
                        ],
                        "id": "default7"
                    }
                ]
            },
            {
                "name": "2 Exchanges",
                "input": [
                    {
                        "intent": "Exchanges"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Exchanges list"
                    }
                ],
                "id": "default9"
            },
            {
                "name": "coin price or information",
                "input": [
                    {
                        "types": [
                            "coins2"
                        ],
                        "intent": "price"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Coin: +context.session.coinsinfo[0].name+\nShortname: +context.session.coinsinfo[0].shortname+\nPrice: +context.session.coinsinfo[0].price+\nVolume(24h):  +context.session.coinsinfo[0].volume+\nChange(24h): +context.session.coinsinfo[0].change+\nPrice Graph:"
                    }
                ],
                "task": {
                    "name": "showcoins2"
                },
                "id": "default22",
                "children": [
                    {
                        "name": "3 Coins price info2",
                        "input": [
                            {
                                "types": [
                                    "coins"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                            }
                        ],
                        "id": "default16-Clone",
                        "task": {
                            "name": "showcoins"
                        }
                    }
                ]
            },
            {
                "name": "coin chart",
                "input": [
                    {
                        "intent": "coinchart",
                        "types": [
                            "chart2"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Coin: +context.session.coinsinfo[0].name+\nShortname: +context.session.coinsinfo[0].shortname+\n\nPrice Graph:"
                    }
                ],
                "task": {
                    "name": "showchart2"
                },
                "id": "default33",
                "children": [
                    {
                        "name": "3 Coins char info2",
                        "input": [
                            {
                                "types": [
                                    "chart"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\n\nPrice Graph:"
                            }
                        ],
                        "id": "default16-Clone-Clone",
                        "task": {
                            "name": "showchart"
                        }
                    }
                ]
            },
            {
                "name": "ico",
                "input": [
                    {
                        "intent": "ICO",
                        "types": [
                            "icos"
                        ]
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Project: +context.session.ICOinfo2.name+\nInterest: +context.session.ICOinfo2.rate+\nCategory: +context.session.ICOinfo2.category+\nGoal: +context.session.ICOinfo2.goal+\nStart Date: +context.session.ICOinfo2.date+"
                    }
                ],
                "task": {
                    "name": "showICO2"
                },
                "id": "default34",
                "children": [
                    {
                        "name": "4 Upcoming ICO info-Clone",
                        "input": [
                            {
                                "types": [
                                    "ICO"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Project: +context.session.ICOinfo.name+\nInterest: +context.session.ICOinfo.rate+\nCategory: +context.session.ICOinfo.category+\nGoal: +context.session.ICOinfo.goal+\nStart Date: +context.session.ICOinfo.date+"
                            }
                        ],
                        "id": "default26-Clone",
                        "task": {
                            "name": "showICO1"
                        }
                    }
                ]
            },
            {
                "name": "3 Coins price",
                "input": [
                    {
                        "regexp": "/^1$/"
                    },
                    {
                        "intent": "coininfor",
                        "entities": "coins"
                    },
                    {
                        "intent": "price",
                        "entities": "coins"
                    },
                    {
                        "regexp": "/^coins$/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Select the coin you want to see the specify information."
                    }
                ],
                "id": "default10",
                "task": {
                    "name": "coinprice"
                },
                "children": [
                    {
                        "name": "3 Coins More1",
                        "input": [
                            {
                                "text": {
                                    "raw": "MORE",
                                    "nlp": "MORE"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Action",
                                "text": "What kind of coin do you want to know the price?\n\nTell me like 'bitcoin price' or 'bct price'",
                                "type": "call",
                                "dialogId": "default1",
                                "dialogName": "1 Start 2"
                            }
                        ],
                        "task": {
                            "name": ""
                        },
                        "id": "default12",
                        "children": []
                    },
                    {
                        "name": "3 Coins price info",
                        "input": [
                            {
                                "types": [
                                    "coins"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                            }
                        ],
                        "id": "default16",
                        "task": {
                            "name": "showcoins"
                        }
                    }
                ]
            },
            {
                "name": "4 ICO Information",
                "input": [
                    {
                        "intent": "ICO",
                        "entities": "ICO"
                    },
                    {
                        "regexp": "/^2$/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Select the correct ICO that you want to see.",
                        "buttons": [
                            {
                                "text": "Active ICO"
                            },
                            {
                                "text": "Upcoming ICO"
                            }
                        ]
                    }
                ],
                "id": "default11",
                "task": {
                    "name": ""
                },
                "children": [
                    {
                        "name": "4 Active ICO",
                        "input": [
                            {
                                "intent": "Active ICO"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Select the ICO if you want to see the specify information."
                            }
                        ],
                        "task": {
                            "name": "activeICO"
                        },
                        "id": "default23",
                        "children": [
                            {
                                "name": "4 Active ICO1",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "MORE",
                                            "nlp": "MORE"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "What kind of ICO do you want to know further?\n\nTell me like 'AI crypto ICO'",
                                        "type": "call",
                                        "dialogId": "default1",
                                        "dialogName": "1 Start 2"
                                    }
                                ],
                                "task": {
                                    "name": ""
                                },
                                "id": "default27",
                                "children": []
                            },
                            {
                                "name": "4 Active ICO info",
                                "input": [
                                    {
                                        "types": [
                                            "activeICO"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Project: +context.session.ICOinfo.name+\nInterest: +context.session.ICOinfo.rate+\nCategory: +context.session.ICOinfo.category+\nReceived: +context.session.ICOinfo.now+ /  +context.session.ICOinfo.now_percent+\nGoal: +context.session.ICOinfo.goal+\nEnd Date: +context.session.ICOinfo.date+"
                                    }
                                ],
                                "id": "default25",
                                "task": {
                                    "name": "showICO"
                                }
                            }
                        ]
                    },
                    {
                        "name": "4 Upcoming ICO",
                        "input": [
                            {
                                "intent": "Upcoming ICO"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Select the ICO if you want to see the specify information."
                            }
                        ],
                        "task": {
                            "name": "upcomingICO"
                        },
                        "id": "default24",
                        "children": [
                            {
                                "name": "4 Upcoming ICO1",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "MORE",
                                            "nlp": "MORE"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Action",
                                        "text": "What kind of ICO do you want to know further?\n\nTell me like 'AI crypto ICO'",
                                        "type": "call",
                                        "dialogId": "default1",
                                        "dialogName": "1 Start 2"
                                    }
                                ],
                                "id": "default29",
                                "children": [],
                                "task": {
                                    "name": ""
                                }
                            },
                            {
                                "name": "4 Upcoming ICO info",
                                "input": [
                                    {
                                        "types": [
                                            "upcomingICO"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Project: +context.session.ICOinfo.name+\nInterest: +context.session.ICOinfo.rate+\nCategory: +context.session.ICOinfo.category+\nGoal: +context.session.ICOinfo.goal+\nStart Date: +context.session.ICOinfo.date+"
                                    }
                                ],
                                "id": "default26",
                                "task": {
                                    "name": "showICO"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "5 News",
                "input": [
                    {
                        "entities": "NewsCoin",
                        "intent": "News"
                    },
                    {
                        "regexp": "/^3$/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Select the correct News that you want to see.",
                        "buttons": [
                            {
                                "text": "1. Bitcoin"
                            },
                            {
                                "text": "2. Ethereum"
                            },
                            {
                                "text": "3. Altcoin"
                            },
                            {
                                "text": "4. Litecoin"
                            },
                            {
                                "text": "5. Ripple"
                            },
                            {
                                "text": "6. Monero"
                            }
                        ]
                    }
                ],
                "task": {
                    "name": ""
                },
                "id": "default21",
                "children": [
                    {
                        "name": "5 News category",
                        "input": [
                            {
                                "text": {
                                    "raw": "1. Bitcoin",
                                    "nlp": "1. Bitcoin"
                                }
                            },
                            {
                                "text": {
                                    "raw": "2. Ethereum",
                                    "nlp": "2. Ethereum"
                                }
                            },
                            {
                                "text": {
                                    "raw": "3. Altcoin",
                                    "nlp": "3. Altcoin"
                                }
                            },
                            {
                                "text": {
                                    "raw": "4. Litecoin",
                                    "nlp": "4. Litecoin"
                                }
                            },
                            {
                                "text": {
                                    "raw": "5. Ripple",
                                    "nlp": "5. Ripple"
                                }
                            },
                            {
                                "text": {
                                    "raw": "6. Monero",
                                    "nlp": "6. Monero"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Select the kind of news you want to see.",
                                "buttons": [
                                    {
                                        "text": "Recent"
                                    },
                                    {
                                        "text": "Top News"
                                    },
                                    {
                                        "text": "Commented"
                                    }
                                ]
                            }
                        ],
                        "task": {
                            "name": "newsCategory"
                        },
                        "id": "default35",
                        "children": [
                            {
                                "name": "5 News category2",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "Recent",
                                            "nlp": "Recent"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "Top News",
                                            "nlp": "Top News"
                                        }
                                    },
                                    {
                                        "text": {
                                            "raw": "Commented",
                                            "nlp": "Commented"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Select the news you want to know the specific content."
                                    }
                                ],
                                "task": {
                                    "name": "shownewstitle"
                                },
                                "id": "default36",
                                "children": [
                                    {
                                        "name": "5 News info",
                                        "input": [
                                            {
                                                "types": [
                                                    "news"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "Title: +context.session.newsinfo.title+\nTime: +context.session.newsinfo.time+\nAuthor: +context.session.newsinfo.author+\nHists: +context.session.newsinfo.status+\nDescription: +context.session.newsinfo.text+"
                                            }
                                        ],
                                        "id": "default37",
                                        "task": {
                                            "name": "shownews"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "task": {
            "name": ""
        }
    },
    {
        "name": "1 Start 2 ch",
        "input": [
            {
                "if": "false"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "您好！我是虚拟币聊天机器人~ \n\n让我们开始今天的虚拟币之旅吧~\n*您可以输入序号或者以下内容来查询相关内容\n\nex: '1',   '虚拟币',  '比特币价格',  'ICO',  'btc 价格图'\n\n1. 虚拟币\n2. ICOs"
            }
        ],
        "id": "default111",
        "children": [
            {
                "name": "1 Bitcoin introduction ch",
                "input": [
                    {
                        "if": "false"
                    }
                ],
                "output": [
                    {
                        "kind": "Action",
                        "text": "Do you want to ask those questions?",
                        "buttons": [
                            {
                                "text": "1. What is Bitcoin?"
                            },
                            {
                                "text": "2. How does one acquire Bitcoins?"
                            },
                            {
                                "text": "Return"
                            },
                            {
                                "text": "Start"
                            }
                        ]
                    }
                ],
                "id": "default115",
                "children": [
                    {
                        "name": "1-1 What is Bitcoin? ch",
                        "input": [
                            {
                                "text": {
                                    "raw": "1. What is Bitcoin?",
                                    "nlp": "1. What is Bitcoin?"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Bitcoin is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. From a user perspective, Bitcoin is pretty much like cash for the Internet. Bitcoin can also be seen as the most prominent triple entry bookkeeping system in existence.",
                                "buttons": [
                                    {
                                        "url": "https://bitcoin.org/en/",
                                        "text": "Learn more"
                                    },
                                    {
                                        "text": "Return"
                                    },
                                    {
                                        "text": "Start"
                                    }
                                ]
                            }
                        ],
                        "id": "default116"
                    },
                    {
                        "name": "1-2 How does one acquire Bitcoins? ch",
                        "input": [
                            {
                                "text": {
                                    "raw": "2. How does one acquire Bitcoins?",
                                    "nlp": "2. How does one acquire Bitcoins?"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "* As payment for goods or services.\n* Purchase bitcoins at a Bitcoin exchange.\n* Exchange bitcoins with someone near you.\n* Earn bitcoins through competitive mining.\nWhile it may be possible to find individuals who wish to sell bitcoins in exchange for a credit card or PayPal payment, most exchanges do not allow funding via these payment methods. This is due to cases where someone buys bitcoins with PayPal, and then reverses their half of the transaction. This is commonly referred to as a chargeback.",
                                "buttons": [
                                    {
                                        "text": "See exchanges"
                                    },
                                    {
                                        "text": "Return"
                                    },
                                    {
                                        "text": "Start"
                                    }
                                ]
                            }
                        ],
                        "id": "default117"
                    }
                ]
            },
            {
                "name": "2 Exchanges ch",
                "input": [
                    {
                        "intent": "Exchanges_ch"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Exchanges list"
                    }
                ],
                "id": "default119"
            },
            {
                "name": "3 Coins price ch",
                "input": [
                    {
                        "regexp": "/^1$/"
                    },
                    {
                        "intent": "coininfor"
                    },
                    {
                        "intent": "price"
                    },
                    {
                        "regexp": "/^虚拟币$/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "请选择您想要查看的虚拟币~"
                    }
                ],
                "id": "default1110",
                "task": {
                    "name": "coinprice_ch"
                },
                "children": [
                    {
                        "name": "3 Coins More1 ch",
                        "input": [
                            {
                                "text": {
                                    "raw": "MORE",
                                    "nlp": "MORE"
                                }
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Select the coin you want to see the specify information."
                            }
                        ],
                        "task": {
                            "name": "coinprice1_ch"
                        },
                        "id": "default1112",
                        "children": [
                            {
                                "name": "3 Coins More2 ch",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "MORE",
                                            "nlp": "MORE"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Select the coin you want to see the specify information."
                                    }
                                ],
                                "task": {
                                    "name": "coinprice2_ch"
                                },
                                "id": "default1113",
                                "children": [
                                    {
                                        "name": "3 Coins More3 ch",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "MORE",
                                                    "nlp": "MORE"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "Select the coin you want to see the specify information."
                                            }
                                        ],
                                        "task": {
                                            "name": "coinprice3_ch"
                                        },
                                        "id": "default1114",
                                        "children": [
                                            {
                                                "name": "4 Coins More4 ch",
                                                "input": [
                                                    {
                                                        "text": {
                                                            "raw": "MORE",
                                                            "nlp": "MORE"
                                                        }
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "Select the coin you want to see the specify information."
                                                    }
                                                ],
                                                "task": {
                                                    "name": "coinprice4_ch"
                                                },
                                                "id": "default1115",
                                                "children": [
                                                    {
                                                        "name": "3 Coins price info4 ch",
                                                        "input": [
                                                            {
                                                                "types": [
                                                                    "coins_ch"
                                                                ]
                                                            }
                                                        ],
                                                        "output": [
                                                            {
                                                                "kind": "Content",
                                                                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                                                            }
                                                        ],
                                                        "task": {
                                                            "name": "showcoins_ch"
                                                        },
                                                        "id": "default1120"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "3 Coins price info3 ch",
                                                "input": [
                                                    {
                                                        "types": [
                                                            "coins_ch"
                                                        ]
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "showcoins_ch"
                                                },
                                                "id": "default1119"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "3 Coins price info2 ch",
                                        "input": [
                                            {
                                                "types": [
                                                    "coins_ch"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                                            }
                                        ],
                                        "task": {
                                            "name": "showcoins_ch"
                                        },
                                        "id": "default1118"
                                    }
                                ]
                            },
                            {
                                "name": "3 Coins price info1 ch",
                                "input": [
                                    {
                                        "types": [
                                            "coins_ch"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                                    }
                                ],
                                "task": {
                                    "name": "showcoins_ch"
                                },
                                "id": "default1117"
                            }
                        ]
                    },
                    {
                        "name": "3 Coins price info ch",
                        "input": [
                            {
                                "types": [
                                    "coins_ch"
                                ]
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                            }
                        ],
                        "id": "default1116",
                        "task": {
                            "name": "showcoins_ch"
                        }
                    }
                ]
            },
            {
                "name": "4 ICO Information ch",
                "input": [
                    {
                        "intent": "ICO"
                    },
                    {
                        "regexp": "/^2$/"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Select the correct ICO that you want to see.",
                        "buttons": [
                            {
                                "text": "Active ICO"
                            },
                            {
                                "text": "Upcoming ICO"
                            }
                        ]
                    }
                ],
                "id": "default1111",
                "task": {
                    "name": ""
                },
                "children": [
                    {
                        "name": "4 Active ICO ch",
                        "input": [
                            {
                                "intent": "Active ICO_ch"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Select the ICO if you want to see the specify information."
                            }
                        ],
                        "task": {
                            "name": "activeICO_ch"
                        },
                        "id": "default1123",
                        "children": [
                            {
                                "name": "4 Active ICO1 ch",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "MORE",
                                            "nlp": "MORE"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Select the ICO if you want to see the specify information."
                                    }
                                ],
                                "task": {
                                    "name": "activeICO1_ch"
                                },
                                "id": "default1127",
                                "children": [
                                    {
                                        "name": "4 Active ICO info1 ch",
                                        "input": [
                                            {
                                                "types": [
                                                    "activeICO_ch"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "Project: +context.session.ICOinfo.name+\nInterest: +context.session.ICOinfo.rate+\nCategory: +context.session.ICOinfo.category+\nReceived: +context.session.ICOinfo.now+ /  +context.session.ICOinfo.now_percent+\nGoal: +context.session.ICOinfo.goal+\nEnd Date: +context.session.ICOinfo.date+"
                                            }
                                        ],
                                        "task": {
                                            "name": "showICO_ch"
                                        },
                                        "id": "default1128"
                                    }
                                ]
                            },
                            {
                                "name": "4 Active ICO info ch",
                                "input": [
                                    {
                                        "types": [
                                            "activeICO_ch"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Project: +context.session.ICOinfo.name+\nInterest: +context.session.ICOinfo.rate+\nCategory: +context.session.ICOinfo.category+\nReceived: +context.session.ICOinfo.now+ /  +context.session.ICOinfo.now_percent+\nGoal: +context.session.ICOinfo.goal+\nEnd Date: +context.session.ICOinfo.date+"
                                    }
                                ],
                                "id": "default1125",
                                "task": {
                                    "name": "showICO_ch"
                                }
                            }
                        ]
                    },
                    {
                        "name": "4 Upcoming ICO ch",
                        "input": [
                            {
                                "intent": "Upcoming ICO_ch"
                            }
                        ],
                        "output": [
                            {
                                "kind": "Content",
                                "text": "Select the ICO if you want to see the specify information."
                            }
                        ],
                        "task": {
                            "name": "upcomingICO_ch"
                        },
                        "id": "default1124",
                        "children": [
                            {
                                "name": "4 Upcoming ICO1 ch",
                                "input": [
                                    {
                                        "text": {
                                            "raw": "MORE",
                                            "nlp": "MORE"
                                        }
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Select the ICO if you want to see the specify information."
                                    }
                                ],
                                "id": "default1129",
                                "children": [
                                    {
                                        "name": "4 Upcoming ICO2 ch",
                                        "input": [
                                            {
                                                "text": {
                                                    "raw": "MORE",
                                                    "nlp": "MORE"
                                                }
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "Select the ICO if you want to see the specify information."
                                            }
                                        ],
                                        "task": {
                                            "name": "upcomingICO2_ch"
                                        },
                                        "id": "default1130",
                                        "children": [
                                            {
                                                "name": "4 Upcoming ICO3 ch",
                                                "input": [
                                                    {
                                                        "types": [
                                                            "upcomingICO_ch"
                                                        ]
                                                    }
                                                ],
                                                "output": [
                                                    {
                                                        "kind": "Content",
                                                        "text": "Project: +context.session.ICOinfo1.name+\nInterest: +context.session.ICOinfo1.rate+\nCategory: +context.session.ICOinfo1.category+\nGoal: +context.session.ICOinfo1.goal+\nStart Date: +context.session.ICOinfo1.date+"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "showICO1_ch"
                                                },
                                                "id": "default1132"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "4 Upcoming ICO info1 ch",
                                        "input": [
                                            {
                                                "types": [
                                                    "upcomingICO_ch"
                                                ]
                                            }
                                        ],
                                        "output": [
                                            {
                                                "kind": "Content",
                                                "text": "Project: +context.session.ICOinfo1.name+\nInterest: +context.session.ICOinfo1.rate+\nCategory: +context.session.ICOinfo1.category+\nGoal: +context.session.ICOinfo1.goal+\nStart Date: +context.session.ICOinfo1.date+"
                                            }
                                        ],
                                        "task": {
                                            "name": "showICO1_ch"
                                        },
                                        "id": "default1131"
                                    }
                                ],
                                "task": {
                                    "name": "upcomingICO1_ch"
                                }
                            },
                            {
                                "name": "4 Upcoming ICO info ch",
                                "input": [
                                    {
                                        "types": [
                                            "upcomingICO_ch"
                                        ]
                                    }
                                ],
                                "output": [
                                    {
                                        "kind": "Content",
                                        "text": "Project: +context.session.ICOinfo1.name+\nInterest: +context.session.ICOinfo1.rate+\nCategory: +context.session.ICOinfo1.category+\nGoal: +context.session.ICOinfo1.goal+\nStart Date: +context.session.ICOinfo1.date+"
                                    }
                                ],
                                "id": "default1126",
                                "task": {
                                    "name": "showICO1_ch"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "coin price or information ch",
                "input": [
                    {
                        "types": [
                            "coins2_ch"
                        ]
                    },
                    {
                        "intent": "price_ch"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                    }
                ],
                "task": {
                    "name": "showcoins_ch"
                },
                "id": "default1122"
            },
            {
                "name": "coin chart ch",
                "input": [
                    {
                        "types": [
                            "chart_ch"
                        ]
                    },
                    {
                        "intent": "coinchart_ch"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Coin: +context.session.coinsinfo3.name+\nShortname: +context.session.coinsinfo3.shortname+\n\nPrice Graph:"
                    }
                ],
                "task": {
                    "name": "showchart_ch"
                },
                "id": "default1133"
            },
            {
                "name": "ico ch",
                "input": [
                    {
                        "types": [
                            "ico_ch"
                        ]
                    },
                    {
                        "intent": "ICO_ch"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Project: +context.session.ICOinfo2.name+\nInterest: +context.session.ICOinfo2.rate+\nCategory: +context.session.ICOinfo2.category+\nGoal: +context.session.ICOinfo2.goal+\nStart Date: +context.session.ICOinfo2.date+"
                    }
                ],
                "task": {
                    "name": "showico_ch"
                },
                "id": "default1134"
            }
        ],
        "task": {
            "name": ""
        }
    }
];

var commonDialogs = [
    {
        "id": "startDialog",
        "name": "start",
        "input": [
            {
                "text": {
                    "raw": "first",
                    "nlp": "first"
                }
            },
            {
                "text": {
                    "raw": "start",
                    "nlp": "start"
                }
            },
            {
                "text": {
                    "raw": "Talk now!",
                    "nlp": "Talk now!"
                }
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "Hello! my name is +bot.name+. Nice to meet you. \n\nBefore talk, I recommend you check a brief introduction of Bitcoin.\n\n If you are ready we can start our talk right now! :)",
                "if": "context.session.IsNew!=='not'",
                "type": "call",
                "dialogId": "default1",
                "dialogName": "2. Start 2",
                "buttons": [
                    {
                        "text": "A brief introduction"
                    },
                    {
                        "text": "Talk now!"
                    }
                ]
            },
            {
                "kind": "Action",
                "text": "",
                "if": "context.session.IsNew==='not' && context.session.language==='en'",
                "type": "call",
                "dialogId": "default1",
                "dialogName": "1 Start 2"
            },
            {
                "kind": "Action",
                "text": "",
                "if": "context.session.IsNew==='not' && context.session.language==='ch'",
                "type": "call",
                "dialogId": "default111",
                "dialogName": "1 Start 2 ch"
            }
        ],
        "task": {
            "name": "UpdateUser"
        }
    },
    {
        "id": "backDialog",
        "name": "back",
        "input": [
            {
                "text": {
                    "raw": "back",
                    "nlp": "back"
                }
            },
            {
                "text": {
                    "raw": "previous",
                    "nlp": "previous"
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
        "name": "upper",
        "input": [
            {
                "text": {
                    "raw": "up",
                    "nlp": "up"
                }
            },
            {
                "text": {
                    "raw": "parent",
                    "nlp": "parent"
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
        "name": "noanswer",
        "input": "",
        "output": [
            {
                "text": "Sorry, I don't know.\nYou can ask me some other questions~\n(ex: 'bitcoin price')",
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