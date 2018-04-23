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
                "text": "Hi！I am bitcoin-bot. \n\nToday is a great day! \nLet’s start today’s Bitcoin tour~\n*You can type the content in numbers and in texts.\n\nex: '1',   'coins',  'bitcoin price',  'ICO',  'btc chart'\n\n1. Coins\n2. ICOs"
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
                "name": "3 Coins price",
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
                                "kind": "Content",
                                "text": "Select the coin you want to see the specify information."
                            }
                        ],
                        "task": {
                            "name": "coinprice1"
                        },
                        "id": "default12",
                        "children": [
                            {
                                "name": "3 Coins More2",
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
                                    "name": "coinprice2"
                                },
                                "id": "default13",
                                "children": [
                                    {
                                        "name": "3 Coins More3",
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
                                            "name": "coinprice3"
                                        },
                                        "id": "default14",
                                        "children": [
                                            {
                                                "name": "4 Coins More4",
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
                                                    "name": "coinprice4"
                                                },
                                                "id": "default15",
                                                "children": [
                                                    {
                                                        "name": "3 Coins price info4",
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
                                                        "task": {
                                                            "name": "showcoins"
                                                        },
                                                        "id": "default20"
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "3 Coins price info3",
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
                                                "task": {
                                                    "name": "showcoins"
                                                },
                                                "id": "default19"
                                            }
                                        ]
                                    },
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
                                        "task": {
                                            "name": "showcoins"
                                        },
                                        "id": "default18"
                                    }
                                ]
                            },
                            {
                                "name": "3 Coins price info1",
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
                                "task": {
                                    "name": "showcoins"
                                },
                                "id": "default17"
                            }
                        ]
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
                                        "kind": "Content",
                                        "text": "Select the ICO if you want to see the specify information."
                                    }
                                ],
                                "task": {
                                    "name": "activeICO1"
                                },
                                "id": "default27",
                                "children": [
                                    {
                                        "name": "4 Active ICO info1",
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
                                        "task": {
                                            "name": "showICO"
                                        },
                                        "id": "default28"
                                    }
                                ]
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
                                        "kind": "Content",
                                        "text": "Select the ICO if you want to see the specify information."
                                    }
                                ],
                                "id": "default29",
                                "children": [
                                    {
                                        "name": "4 Upcoming ICO2",
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
                                            "name": "upcomingICO2"
                                        },
                                        "id": "default30",
                                        "children": [
                                            {
                                                "name": "4 Upcoming ICO3",
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
                                                        "text": "Project: +context.session.ICOinfo1.name+\nInterest: +context.session.ICOinfo1.rate+\nCategory: +context.session.ICOinfo1.category+\nGoal: +context.session.ICOinfo1.goal+\nStart Date: +context.session.ICOinfo1.date+"
                                                    }
                                                ],
                                                "task": {
                                                    "name": "showICO1"
                                                },
                                                "id": "default32"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "4 Upcoming ICO info1",
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
                                                "text": "Project: +context.session.ICOinfo1.name+\nInterest: +context.session.ICOinfo1.rate+\nCategory: +context.session.ICOinfo1.category+\nGoal: +context.session.ICOinfo1.goal+\nStart Date: +context.session.ICOinfo1.date+"
                                            }
                                        ],
                                        "task": {
                                            "name": "showICO1"
                                        },
                                        "id": "default31"
                                    }
                                ],
                                "task": {
                                    "name": "upcomingICO1"
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
                                        "text": "Project: +context.session.ICOinfo1.name+\nInterest: +context.session.ICOinfo1.rate+\nCategory: +context.session.ICOinfo1.category+\nGoal: +context.session.ICOinfo1.goal+\nStart Date: +context.session.ICOinfo1.date+"
                                    }
                                ],
                                "id": "default26",
                                "task": {
                                    "name": "showICO1"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "coin price or information",
                "input": [
                    {
                        "types": [
                            "coins2"
                        ]
                    },
                    {
                        "intent": "price"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
                    }
                ],
                "task": {
                    "name": "showcoins"
                },
                "id": "default22"
            },
            {
                "name": "coin chart",
                "input": [
                    {
                        "types": [
                            "chart"
                        ]
                    },
                    {
                        "intent": "coinchart"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Coin: +context.session.coinsinfo3.name+\nShortname: +context.session.coinsinfo3.shortname+\n\nPrice Graph:"
                    }
                ],
                "task": {
                    "name": "showchart"
                },
                "id": "default33"
            },
            {
                "name": "ico",
                "input": [
                    {
                        "types": [
                            "ico"
                        ]
                    },
                    {
                        "intent": "ICO"
                    }
                ],
                "output": [
                    {
                        "kind": "Content",
                        "text": "Project: +context.session.ICOinfo2.name+\nInterest: +context.session.ICOinfo2.rate+\nCategory: +context.session.ICOinfo2.category+\nGoal: +context.session.ICOinfo2.goal+\nStart Date: +context.session.ICOinfo2.date+"
                    }
                ],
                "task": {
                    "name": "showico"
                },
                "id": "default34"
            }
        ],
        "task": {
            "name": ""
        }
    },
    {
        "name": "all coin price or information",
        "input": [
            {
                "types": [
                    "coins"
                ],
                "intent": "price"
            }
        ],
        "output": [
            {
                "kind": "Content",
                "text": "Coin: +context.session.coinsinfo.name+\nShortname: +context.session.coinsinfo.shortname+\nPrice: +context.session.coinsinfo.price+\nVolume(24h):  +context.session.coinsinfo.volume+\nChange(24h): +context.session.coinsinfo.change+\nPrice Graph:"
            }
        ],
        "task": {
            "name": "showcoins"
        },
        "id": "default21"
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
                "if": "context.session.IsNew==='not'",
                "type": "call",
                "dialogId": "default1",
                "dialogName": "1 Start 2"
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