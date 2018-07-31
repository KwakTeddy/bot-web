var dialogs = [];

var commonDialogs = [
    {
        "id": "startDialog",
        "name": "start",
        "input": [
            {
                "text": {
                    "raw": "start",
                    "nlp": "start"
                }
            },
            {
                "text": {
                    "raw": "スタート",
                    "nlp": "スタート"
                }
            }
        ],
        "output": [{
            "kind": "Content",
            "text": "こんにちは、私は +bot.name+です。"
        }]
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
                    "raw": "前",
                    "nlp": "前"
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
                    "raw": "親",
                    "nlp": "親"
                }
            },
            {
                "text": {
                    "raw": "アップ",
                    "nlp": "アップ"
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
                text: "知らない",
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
