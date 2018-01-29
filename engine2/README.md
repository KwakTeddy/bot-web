# 엔진 가이드

## 세션
사용자가 챗봇을 사용하기 위해 특정 채널로 접속했을때 생성되는 값. 사용자의 마지막 대화시간으로부터 5분이 지나면 삭제된다.

### 컨텍스트 데이터 구조
```
{
	userKey: String,									// 채널에서 할당한 사용자 키
	botId: String,											// 사용자가 대화를 요청한 챗봇 아이디
	channel: String,									// 사용자가 대화를 요청한 채널
	userData: Object,								// 사용자가 다이얼로그 그래프에서 저장하는 변수.
	contexts: Array, 								// 사용자의 대화 컨텍스트, 총 10개까지만 저장됨. prev로 이전 대화를 참조할 수 있다.
	returnDialog: String,				// 엔진에서 사용하는 변수, 다이얼로그 카드에서 returnCall 이후 return으로 돌아가야할 다이얼로그 카드 저장.
	dialogCursor: String					// 엔진에서 사용하는 변수, 사용자의 다음 입력이 들어왔을때 카드를 검색할 커서.
}
```

## 컨텍스트
사용자가 챗봇과 대화를 했을때 생성되는 데이터.

### 다이얼로그 데이터 구조
```
{
	nlu:
	{
		sentence: String,
		nlp: Array,
		nlpText: String
	},
	dialog:
	{
		inputRaw: String,
		input: Object,
		task: String,
		output: Object
	},
	prev: Object
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

