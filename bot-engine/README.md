# Bot Engine
엔진의 구조에 대해서 설명합니다.

## Flow Chart
1. User가 BotEngine과 Socket Connection으로 연결됨.
2. Context
	* User Context 생성.
	* Bot-User Context 생성.
	* Bot Context 생성.
3. NLP
	* 사용자 입력 자연어 처리
	* Entity 사전 매칭
	* 사용자 입력값에서 공통 Type Check 추출 (mobile, date 등)
	* Intent 매칭
	* userDialogType 체크
	* dialogType 체크
4. 지식그래프 처리 (현재는 사용하지 않음)
5. 사후처리 (좀 더 분석 필요)
	* or 커맨드 처리 (:build, :view graph, :reset user)
	* or pendingCallback 처리
	* or Dialog 공감하거나 globalDialogType 매칭
6. 결과를 User에게 Response


## Component 설명

### Context
사용자가 연결되었을때 생성되는 데이터 instance라고 볼 수 있다. Context에 저장되는 데이터는 다음과 같다.

* User Context
	* BotUser DB에 저장되는 데이터. 한 번 불러오면 Global Memory 영역에 저장해서 이후엔 DB접근을 하지 않는다.
		* BotUser는 User : Bot = 1 : N 구조이다. 사용자별 연결된 봇 데이터를 저장한다.
	* 사용자가 봇에 연결될떄 마다 Memory에 없으면 BotUser DB를 뒤지고 Insert 하는 작업을 한다.
	* 성능상 많은 BotUser 데이터를 Memory에 들고 있다가 한 번에 Insert 하는 로직이 적용되어 있다.
	
* BotUser Context
	* 사용자와 연결된 봇의 관계 데이터가 저장된다.
	* _dialog, _task, _option 등이 저장된다.
	
* Bot Context
	* 연결된 봇의 데이터가 저장된다. 만약 봇이 메모리에 로딩되지 않았으면 로딩하는 작업이 수행된다. 아래에서 로드하는 데이터는 모두 최초 로드한 Bot 데이터에 머지된다.
	* Bot DB 데이터 로드.
	* Bot의 Template 데이터 로드.
	* BotName.bot.js 로드
	* Bot의 다이얼로그에 globalStartDialogs를 세팅.
	* Bot의 다이얼로그 파일이 있다면 해당 파일들 모두 로드.
	* Bot 디렉토리의 *.dialog.js 모두 로드. 위에서 추가했던 파일은 추가하지 않는다.
	* Bot 디렉토리의 .js 파일을 모두 로드. 위에서 추가했던 파일과 .test.js, .bot.js 파일은 제외.
	* Bot이 가지고 있는 dialogs 중 input pattern 이 있으면 input params로 바꾸는 작업 ( 안쓰는 느낌? )
	* Bot이 가지고 있는 commonDialogs 도 위와 같은 작업 수행.
	* Bot의 템플릿이 포함한 각종 데이터 Intent, Entity, Task등을 Bot 객체에 머지.
	* Bot의 인텐트를 로드
	* Bot의 Entity 로드
	* Bot의 Custom Context 로드
	* Bot의 dialogset에 있는 topicKeyword를 bot 객체의 topicKeyword로 합침.

### NLP
* 사용자 입력 Text를 자연어 처리
* 사용자 입력에서 매칭되는 Entity 추출.
* 사용자 입력에서 공통 타입 부분 추출.
* 사용자 입력에서 매칭되는 인텐트, 인텐트 다이얼로그 추출.
* globalDialogs.userDialogType 실행.
* globalDialogs.dialogsType 실행.
* 사용자 입력이 intentDialog -> userDialogs -> dialogsetDialogs 순서로 가장 매칭이 잘된? bestDialog 추출.

### 사후처리
* 커맨드 처리
	* ':build', ':view graph', ':reset user' 커맨드 3개를 처리함.
* pendingCallback 처리
	* dialogServer가 있고 사용자 입력이 처음인경우 또는 사용자 입력이 ':'로 시작되는경우 (위에서 처리못한) pendingCallback와 pendingType을 undefined.
	* 그게 아니면 User Context에 잇는 pendingCallback 호출.
* dialog 처리
	* Bot Context가 dialogs를 가지고 있다면
		* dialog.sympathize를 호출하거나 (그냥 '응' output)
		* matchGlobalDialogs를 호출함.
* dialogServer 응답
	* 만약 dialogServer가 있다면 dialogServer로 socket을 또 연결함. 근데 이게 매번 호출마다 여기 코드가 실행되는데..?
	
	
	
