# 엔진 가이드

## 용어정리
Dialog (다이얼로그): 다이얼로그 그래프에서 작성하는 카드 데이터 정의.
Dialog Instance (다이얼로그 객체, 다이얼로그 인스턴스): 사용자 입력을 기반으로 매칭된 다이얼로그를 실행할 수 있게 생성한 객체.
MatchingDialog (매칭 다이얼로그): 사용자 입력에 매칭된 다이얼로그.
Dialog
Card (카드): 다이얼로그 카드. UI상에서 Dialog를 기반으로 그려지는 컴포넌트
User Text (사용자 입력 텍스트): 챗봇 사용자가 대화를 위해 챗봇에 입력한 Text 원문.
User Input (사용자 입력): 챗봇 사용자가 대화를 위해 챗봇에 입력한 Text를 분석한 데이터

### dialog
dialog는 다이얼로그 그래프에서 작성하는 카드 데이터이다. 카드 데이터는 다음과 같이 정의된다.
```$xslt
{
	"id": String,  // 다이얼로그 아이디 Call에 사용됨
	"name": String, // 다이얼로그 이름
	"input":
	[
		{
			"text": String, // 사용자 입력과 매칭시킬 텍스트 ex) 네 이름은 뭐니?
			"intent": String, //
			 		
		}
	],
	"Task": String,
	"output": [],
	"children": []
}
```

### Dialog Instance
```$xslt
{
	"id": String,
	"name": String,
	"originalInput": String, // 다이얼로그 Input 원본
	"userInput": {}, // 사용자 입력을 분석한 데이터
	"task": String,
	"output": [], // 실제로 출력될 결과, default는 다이얼로그 output 원본이 들어있음.
	"originalOutput": String, // 다이얼로그 Output 원본
	"options": {}, // 다이얼로그를 실행하기 위해 필요한 옵션.
	"data": {} // Task에서 필요한 데이터를 저장하는 공간. 출력될 결과 Text에서 치환할 변수를 이곳에 저장.
}
```


### Dialog History
실행된 다이얼로그가 최대 10개까지 쌓인다.
만약 시작 다이얼로그가 실행되면 History는 초기화된다.




------------------------------- OLD
# 엔진 구조

# 엔진 동작 흐름
## Core Process (core.js)
1. 채널로부터 사용자 입력 데이터를 받는다.
2. 봇을 로딩한다. (bot.js)
3. 레디스에서 컨텍스트 정보를 가져온다.
4. 사용자 입력값이 만약 커맨드이면 커맨드를 실행한다. (command.js)
5. 사용자 입력으로부터 새로운 대화 객체를 생성하고 History에 저장한다. 만약 history가 10개 이상이면 10개로 맞춘다.
6. 사용자 입력을 분석한다. (input.js)
7. 만약 봇이 지식그래프를 사용한다면 사용자 입력을 지식그래프에 학습시킨다. (km.js)
8. 사용자 입력에 대해 적절한 답변을 검색한다. (answer.js)
9. 답변을 적절한 모양으로 가공한다. (output.js)
10. 레디스에 컨텍스트 정보를 저장한다.
11. 답변을 채널을 통해 내보낸다.




## Bot process (bot.js)
1. 만약 봇이 로딩되어있으면 해당 봇을 사용한다.
2. 봇이 로딩되어있지 않으면
	- DB에서 봇 데이터를 읽어온다.
	- custom_modules의 봇 디렉토리에 있는 bot.js를 읽어서 옵션을 저장한다.
	- custom_modules의 봇 디렉토리에 있는 그래프와 로직 js파일을 읽어서 로딩한다.
	
	
	
	
## Command process (command.js)
### :reset user
플레이챗 시뮬레이터가 로딩될때 최초에 호출하는 커맨드이다.
1. 컨텍스트에서 다이얼로그 그래프 커서 데이터를 초기화하고 레디스에 저장한다.
2. commandDialogs의 첫번째 대화카드의 첫번째 output을 내보낸다.

### :reset memory (F6)
1. 로딩한 봇과 컨텍스트 데이터를 모두 초기화한다.

### :build (F5)
1. 로딩한 봇을 초기화하고 컨텍스트에서 커서 데이터를 초기화한다.

### :reload-bot-files
플레이챗에서 그래프를 수정하고 저장했을때 호출되는 커맨드이다.
1. 봇의 dialogs와 commanDialogs 데이터를 초기화한다.




## Input process (input.js)
1. 사용자의 input값에 대해 NLP처리를 한다. (input/nlp.js)
2. 사용자의 input에서 entities 데이터를 뽑아낸다. (input/entity.js)
3. 사용자의 input에서 intents 데이터를 뽑아낸다. (input/intents.js)

## NLP process (input/nlp.js)
1. 언어별로 NLP처리를 한다.
2. NLP처리된 결과를 기반으로 Sentence 정보를 뽑아낸다.
3. NLP처리된 결과를 기반으로 TurnTaking 정보를 뽑아낸다.

## Entity process (input/entity.js)
1. NLP 처리된 결과에서 명사만 뽑아내서 entitycontents 중 일치하는 데이터를 가져온다.

## Intent process (input/intent.js)
1. NLP 처리된 결과에서 조사나 접미사(Suffix)를 제외하고 intentcontents 중 일치하는 데이터를 가져온다.



## Knowledge Memory process (km.js)



## Answer process (answer.js)
1. 만약 봇이 오타수정기능을 사용한다면 autoCorrection을 실행한다. (input/nlp/autoCorrection.js)
2. Q&A 에서 답변을 찾는다.
3. DialogGraph 에서 답변을 찾는다.
4. 만약 DialogGraph 에서 답변을 찾았다면 답변을 내보낸다.
5. 만약 Q&A 에서 답변을 찾았다면 답변을 내보낸다.
6. 답변을 찾지 못했다면 commandDialogs 중 noanswer라는 아이디를 가진 답변을 내보낸다.



## AutoCorrection process (input/nlp/autoCorrection.js)


## Q&A process (answer/qa.js)


## Dialog Graph process (answer/dm.js)


## Output process (output.js)



# 데이터 구조
## 봇 데이터 구조 (bot/bot.js)
```
{
	id: String,
	name: String,
	dialogs: [],
	commonDialogs: [],
	dialogMap: {}, // id: dialog - id에 해당하는 Dialog가 맵핑되는 데이터
	parentDialogMap: {}, // id: parentDialog - id에 해당하는 Dialog의 부모 Dialog가 맵핑되는 데이터
	tasks: {},
	actions: {},
	types: {},
	typeChecks: {},
	concepts: {},
	messages: {},
	patterns: {},
	dialogsets: [],
	options:
	{
		use: Boolean, // 봇 사용여부 (default: true)
		useKnowledgeMemory: Boolean, // 지식그래프 사용여부 (default: false)
		useAutoCorrection: Boolean, // 오타수정기능 사용여부 (default: false)
	}
}
```

## Context 데이터 구조
```
{
	globals: Object,
	user: Object,
	bot: Object,
	channel: Object,
	session:
	{
		history: [Object],
		returnDialog: String,
    	dialogCursor: String,
	}
}
```

## Conversation 데이터 구조
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

## DialogGraph Dialog 구조
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

