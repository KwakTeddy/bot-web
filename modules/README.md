# Modules

## Structure
/modules
* athena - ai 서버 모듈.
* core - 플레이챗 코어 모듈
* login - 로그인 화면
* chatbots - 챗봇목록 화면
* playchat - 관리자/개발자 화면
	* core
		* layout - 전체 레이아웃 모듈
		* keymap - 단축키 모듈 (추후)
	* side-menu - 좌측 메뉴 부분
	* log-analysis - 로그 부분
	* top-bar - 탑바 부분
	* simulator - 시뮬레이터 부분
	* working-ground - 각 메뉴 컨텐츠 화면
	
	
## Module Structure
* client
	* config
	* controllers
	* css
	* service
	* views
* server
	* config
	* controllers
	* models
	* routes
	
	
## Configuration
각 모듈들의 Server, Client 모듈들의 라우팅 설정은 다음과 같다.
config/config.js 에서 필요한 파일들의 라우팅 path를 만들고 config/lib/express.js 에서 각 path들을 static URL로 라우팅 설정을 해준다.
