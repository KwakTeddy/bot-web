# 엔진 가이드

## 컨텍스트
사용자가 챗봇과 대화를 했을때 생성되는 데이터.
```
{
	user: Object,
	bot: Object,
	channel: String,
	history: [
		{
			nlu:
          	{
          		sentence: String,
          		nlp: Array,
          		nlpText: String
          	},
          	dialog: Object,
          	next: Object,
          	prev: Object
		}
	],
	returnDialog: String,
	dialogCursor: String
}
```

## 다이얼로그 그래프 데이터 구조
```
{
	id: String,
	name: String,
	input: Array,
	task: String,
	output: Array,
	children: Array
}
```

### 다이얼로그 그래프 Input 유형
* text: { raw: String, nlp: String }
* intent
* entities
* types
* if
* regexp

### 다이얼로그 그래프 output 데이터 구조

#### kind가 Content인 경우
* kind: 'Content'
* text: String,
* image: String,
* buttons: Array

#### kind가 Action인 경우
* kind: 'Action'
* type: 'call', 'callChild', 'returnCall', 'return', 'repeat', 'up'
* dialogId: String
* dialogName: String // 변경가능성에 대해서 생각해봐야 함.

