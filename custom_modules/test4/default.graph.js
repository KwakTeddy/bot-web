


var dialogs = [
	{
		"id": "default0",
		"filename": "default",
		"input": [
			{
				"intent": "강냉",
				"entities": [
					"냉장고@가전제품"
				]
			}
		],
		"output": "냉장고 양문형 강냉인 경우의 증상 입니다.",
		"name": "냉장고.양문형.강냉",
		"context": {
			"name": "강냉"
		}
	},
	{
		"id": "default1",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"output": "냉장고 양문형 약냉인 경우의 증상 입니다."
			}
		],
		"name": "냉장고.양문형.약냉",
		"context": {
			"name": "약냉"
		}
	},
	{
		"id": "default3",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": "냉장고 양문형 무냉인 경우의 증상 입니다.",
		"name": "냉장고.양문형.무냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default4",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": [
			{
				"output": "냉장고 일반형 강냉인 경우의 증상 입니다."
			}
		],
		"name": "냉장고.일반형.강냉",
		"context": {
			"name": "강냉"
		}
	},
	{
		"id": "default5",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"output": "냉장고 일반형 약냉인 경우의 증상 입니다."
			}
		],
		"name": "냉장고.일반형.약냉",
		"context": {
			"name": "약냉"
		}
	},
	{
		"id": "default6",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": [
			{
				"output": "냉장고 일반형 무냉인 경우의 증상 입니다."
			}
		],
		"name": "냉장고.일반형.무냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default7",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": [
			{
				"output": "에어컨 스탠딩 강냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.스탠딩.강냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default8",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"output": "에어컨 스탠딩 약냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.스탠딩.약냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default9",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": [
			{
				"output": "에어컨 스탠딩 무냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.스탠딩.무냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default10",
		"filename": "default",
		"input": [
			{
				"intent": "강냉"
			}
		],
		"output": [
			{
				"output": "에어컨 벽걸이 강냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.벽걸이.강냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default11",
		"filename": "default",
		"input": [
			{
				"intent": "약냉"
			}
		],
		"output": [
			{
				"output": "에어컨 벽걸이 약냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.벽걸이.약냉",
		"context": {
			"name": "무냉"
		}
	},
	{
		"id": "default12",
		"filename": "default",
		"input": [
			{
				"intent": "무냉"
			}
		],
		"output": [
			{
				"output": "에어컨 벽걸이 무냉인 경우의 증상 입니다."
			}
		],
		"name": "에어컨.벽걸이.무냉",
		"context": {
			"name": "무냉"
		}
	}
];

var commonDialogs = [
{
  id: 'defaultcommon0',
  filename: 'defaultcommon',
  name: '시작',
  input: '시작',
  output: 'test4 입니다.'
},
{
  id: 'defaultcommon1',
  filename: 'defaultcommon',
  name: '답변없음',
  input: '',
  output: '알아듣지 못했습니다'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test4');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
