var dialogs = [];

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
            }
        ],
        "output": [{
            "kind": "Content",
            "text": "您好, 我是+bot.name+。"
        }]
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
                text: "我不是很明白您的意思。",
                kind: 'Content'
            }
        ]
    }
];

module.exports = function(bot)
{
    bot.setDialogs(dialogs);
    bot.setCommonDialogs(commonDialogs);
};
