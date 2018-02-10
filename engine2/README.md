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


### Task
기본태스크 작성 방법
```
bot.setTask("defaultTask",
{
	name: 'defaultTask',
	action: function(dialog, context, callback)
	{
		callback();
	}
});
```

태스크 파라미터 사용법
```
bot.setTask('paramTask',
{
	myName: 'Ray',
	action: function(dialog, context, callback)
	{
		dialog.output[0].text = '내 이름은: ' + this.myName;
		callback();
	}
});
```

필수 파라미터와 preCallback, postCallback
```
bot.setTask('myTask', 
{
	paramDefs: [{ type: 'mobile', description: '핸드폰 입력해라' }],
	preCallback: function(dialog, context, callback)
	{
		dialog.output[0].text = '프리콜백\n';
		callback();
	},
	action: function (dialog, context, callback)
	{
		dialog.output[0].text += dialog.userInput.types.mobile + ':' + '액션\n';
		callback();
	},
	postCallback: function(dialog, context, callback)
	{
		dialog.output[0].text += '포스트콜백';
		callback();
	}
});
```

시퀀스 태스크
```
bot.setTask('sampleTask1',
{
	name: 'sample1',
	action: function (dialog, context, callback)
	{
		dialog.output[0].text += '\n하하하';
	 	callback();
	}
});
   
var sampleTask2 =
{
	name: 'sample2',
	action: function (dialog, context, callback)
	{
		dialog.output[0].text += '\n하하하2';
		callback();
  	}
};
bot.setTask('sampleTask2', sampleTask2);

var sampleTask3 = function(dialog, context, callback)
{
	dialog.output[0].text += '\n하하하3';
	callback();
}

bot.setTask('sequenceTask',
{
	action: 'sequence',
	tasks: [
		'sampleTask1',
		sampleTask2,
		sampleTask3
	]
});
```
