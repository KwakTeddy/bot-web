var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('csdemo2');

var concepts = {
  '서비스센터': ['서비스센터', '서비스 센터', '센터', '쎈터', '수리점', '센타', '쎈타', '대리점', '영업점', '곳', '센서'],
  '찾다': ['찾다','알다', '궁금하다', '가르치다', '가리키다', '가르다 켜다'], //아르키다 아르 켜다 안됨
  '가다': ['가다','가지'],
  '어디': ['어디','어디야', '어딨다'],
  '언제': ['언제','어느 때', '언제까지'],
  '어떻다':['어떻다'],
  '영업': ['영업','영업하다', '근무', '일 하다', '오픈', '열다', '열리다', '문여', '문 여 는', '여 는'], //'열다'동사의 '여는'형태가 자연어처리 안 됨
  '시간': ['시간','타임', '때'], 
  '수리': ['수리'],
  '가능':['가능'],
  '되다':['되다'],
  '하다':['하다'],
  '번호':['번호','전화', '전화번호', '전번', '연락처'],
  '지하철': ['지하철', '쟈철', '전철', '서브웨이'],
  '버스':['버스','뻐스','마을 버스'],
  '자가용': ['자동차', '차'],
  '경로':['길', '경로','가다 길'],
  '다른': ['따른', '말고'],
  '공휴일': ['공휴일', '신정', '새해 첫날', '1월 1일', '1/1', '설날', '설연휴', '삼일절', '31절', '3/1','3.1절', '석가탄신일','부처님오신날','부처님 오다 날', '어린이날', '5월 5일', '5/5', '현충일', '6월 6일', '6/6', '광복절', '8월 15일', '8/15', '추석', '추석연휴', '한가위', '개천절', '10월 3일', '10/3', '한글날', '10월 9일', '10/9', '크리스마스', '성탄절', '12월 25일', '12/25'],
  '월요일':['월요일', '월욜'],
  '화요일':['화요일', '화욜'],
  '수요일':['수요일', '수욜'],
  '목요일':['목요일', '목욜'],
  '금요일':['금요일', '금욜'],
  '토요일':['토요일', '토욜'],
  '일요일':['일요일', '일욜'],
  '이전':['이전','위로','뒤로'],
  '콜센터':['전화 상담','상담원','통화 상담','고객 센터', '고객센터'],
  '네': ['좋다','응', '그래', '어', '네', '그렇다', '오케이', '오키', '오냐', '그려', '예스', '맞다', 'ㅇㅋ','ㅇ', 'ㅇㅇ', 'OK', 'ok', 'Ok', 'YES', 'yes', 'Yes', 'sp', 'SP'],
  '아니요': ['아니요','아니오','아니다','아니', '싫다', '않다', '노', 'ㄴ','ㄴㄴ', 'NO', 'no', 'No','하지마', '없다','시르다', '별로'],
  '냉장고' : ['냉장고', '디오스', '싱싱', '냉동고', '시그니쳐', 'SIGNATURE', 'refrigerator', 'DIOS', 'dios', 'SINGSING', 'singsing','녹다','상하다','냉장 실','냉동 실','냉동','냉장','얼다','음식'],
  '에어컨': ['에어컨', '휘센', '에어콘', 'airconditoner', 'air', 'WHISEN', 'whisen', '냉방','폭염'],
  '약냉': ['약냉', '안 시원하다', '안 차갑다', '약하다', '녹다', '미지근하다', '따뜻하다', '덥다', '시원하다 않다','모터 약하다', '송풍 처럼', '상하다','온도 내려가다 않다', '안 내려가다','약해지다'],
  '강냉': ['강냉', '세다', '얼다'],
  '무냉': ['무냉', '안 되다', '안 돼다', '멈추다', '안 나오다', '나오다 않다','가스 나가다','가스 없다','모터 안 돌아가다','냉기 없다'],
  '양문형': ['양문형', '양문', '디오스', 'DIOS', 'dios'],
  '일반형': ['일반형', '일반', '싱싱', 'singsing', 'SINGSING'],
  '스탠딩': ['스탠딩', '스탠드'],
  '벽걸이': ['벽걸이', '벽 걸'],
  '모두': ['모두', '둘 다', '전부'],
  '투인원': ['투 인 원', '투인원', 'two in one', '2 in 1', '투 인원', 'twoinone']
};

bot.setConcepts(concepts);
