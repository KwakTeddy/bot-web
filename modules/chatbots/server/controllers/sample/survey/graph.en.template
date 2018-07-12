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
                    "raw": "first",
                    "nlp": "first"
                }
            }
        ],
        "output": [{
            "kind": "Content",
            "text": "Hello, my name is +bot.name+."
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
                text: "I don't know.",
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
