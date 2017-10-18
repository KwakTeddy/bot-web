var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('Asan');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);






var BSimgindex = {
  		1: "BGB1F11.jpg",
  		2: "BGB1F12.jpg",
  		3: "BGB1F10.jpg",
  		5: "BGB1F09.jpg",
  		6: "BGB1F04.jpg",
  		7: "BGB1F03.jpg",
  		8: "BGB1F02.jpg",
  		9: "BGB1F01.jpg",
  		11: "BGB1F05.jpg",
  		12: "BGB1F06.jpg",
  		20: "f-206.jpg",
  		21: "f-205.jpg",
  		22: "f-204.jpg",
  		23: "f-202.jpg",
  		30: "BG306.jpg",
  		31: "BG305.jpg",
  		32: "BG304.jpg",
 		33: "BG303.jpg",
		34: "BG302.jpg",
		35: "BG301.jpg",
	}
var BSfloor = {
  		1: '지하 1층',
  		2: '지하 1층',
  		3: '지하 1층',
  		5: '지하 1층',
  		6: '지하 1층',
  		7: '지하 1층',
  		8: '지하 1층',
  		9: '지하 1층',
  		11: '지하 1층',
  		12: '지하 1층',
  		20: '2층',
  		21: '2층',
  		22: '2층',
  		23: '2층',
  		30: '3층',
  		31: '3층',
  		32: '3층',
  		33: '3층',
  		34: '3층',
  		35: '3층',
	
};
  

var BSTask = {
  action: function (task,context,callback) {
      task.text = '빈소'+ task['1'] + '호는 별관' + BSfloor[task['1']] + '에 있습니다.\n 자세한 위치는 아래 약도를 참고하세요. \n* 처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.'; 
      task.image = {url: 'https://dev.moneybrain.ai/files/asan/' + BSimgindex[task['1']]};
	
      task.buttons = 
		[
          {
            "text": "약도 자세히 보기",
            "url": 'https://dev.moneybrain.ai/files/asan/' + BSimgindex[task['1']]
          }
        ];

      callback(task,context);
	}
};

bot.setTask('BSTask',BSTask);



var Roomimgindex = {
  		501: "BG404.jpg",
  		502: "BG404.jpg",
  		503: "BG404.jpg",
  		504: "BG404.jpg",
  		505: "BG404.jpg",
  		506: "BG404.jpg",
  		507: "BG404.jpg",
  		508: "BG404.jpg",
  		509: "f-403.jpg",
  		510: "f-403.jpg",
  		511: "f-403.jpg",
  		512: "f-403.jpg",
  		513: "f-402.jpg",
  		514: "f-401.jpg"
    }
    

var  RoomTask= {
  action: function (task,context,callback) {
      task.text = '객실'+ task['1'] + '호의 위치는 아래 약도를 참고하세요. \n\n\n*처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.'; 
      task.image = {url: 'https://dev.moneybrain.ai/files/asan/' + Roomimgindex[task['1']]}; 
      task.buttons = 
		[
          {
            "text": "약도 자세히 보기",
            "url": 'https://dev.moneybrain.ai/files/asan/' + Roomimgindex[task['1']]
          }
        ];
    callback(task,context);
	}
};

bot.setTask('RoomTask',RoomTask);





var Seminarimgindex = {
  		1: "EG621.jpg",
  		2: "EG618.jpg",
  		3: "EG617.jpg", 
  		4: "EG616.jpg", 
  		5: "EG615.jpg", 
  		6: "EG610.jpg", 
  		7: "EG608.jpg"
	}

var SeminarTask = {
  action: function (task,context,callback) {
     task.text = '제' + task['1'] + '세미나실은 동관 6층에 있습니다.\n 자세한 위치는 아래 약도를 참고하세요.\n\n*처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.';
     task.image = {url: 'https://dev.moneybrain.ai/files/asan/' + Seminarimgindex[task['1']]};
     task.buttons = 
		[
          {
            "text": "약도 자세히 보기",
            "url": 'https://dev.moneybrain.ai/files/asan/' + Seminarimgindex[task['1']]
          }
        ];
   callback(task,context);
	}
};

bot.setTask('SeminarTask',SeminarTask );























var Dongindex = {
  		71: "서관 7층",
  		72: "서관 7층",
  		81: "서관 8층",
  		82: "서관 8층",
  		91: "서관 9층",
  		92: "서관 9층",
  		101: "서관 10층",
  		102: "서관 10층",
  		111: "서관 11층",
  		112: "서관 11층",
  		121: "서관 12층",
  		73: "동관 7층",
  		74: "동관 7층",
  		83: "동관 8층",
  		84: "동관 8층",
  		93: "동관 9층",
  		94: "동관 9층",
  		103: "동관 10층",
 		104: "동관 10층",
		113: "동관 11층",
		114: "동관 11층",
 		123: "동관 12층",
		124: "동관 12층",
		133: "동관 13층",
  		134: "동관 13층",
 		143: "동관 14층",
		144: "동관 14층",
		153: "동관 15층",
		154: "동관 15층",
  		163: "동관 16층",
		164: "동관 16층",
  		173: "동관 17층",
		174: "동관 17층",
  		183: "동관 18층",
		184: "동관 18층",
  		75: "신관 7층",
  		76: "신관 7층",
  		85: "신관 8층",
  		86: "신관 8층",
 		95: "신관 9층",
		96: "신관 9층",
		105: "신관 10층",
 		106: "신관 10층",
  		115: "신관 11층",
  		116: "신관 11층",
 		125: "신관 12층",
		126: "신관 12층",
 		135: "신관 13층",
		136: "신관 13층",
  		145: "신관 14층",
 		146: "신관 14층",
  		155: "신관 15층",
  		156: "신관 15층",
 			}


var DongTask = {
  action: function (task,context,callback) {
      task.text = task['1'] + '병동은 ' + Dongindex[task['1']] + '에 있습니다.\n\n*처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.'; 
      callback(task,context);
	}
};

bot.setTask('DongTask',DongTask);







var ORTask = {
  action: function (task,context,callback) {
    var text3 = ''
    if(task['1'] == '4') text3 = '입원안내'
    if(task['1'] == '6') text3 = '서류발급'
    if(task['1'] == '입원안내') text3 ='입원안내'
    if(task['1'] == '서류발급') text3 = '서류발급'
    if(task['1'] == '입원 안내') text3 = '입원안내'
    if(task['1'] == '서류 발급') text3 = '서류발급'
    if(task['1'] == '입원') text3 ='입원안내'
  
    var text4 = ''
    if(task['1'] == '4') text4 = '입원예약변경, 입원비 무통장 입금'
    if(task['1'] == '6') text4 = '서류발급 준비물은 무엇인가요?'
    if(task['1'] == '입원안내') text4 ='입원예약변경, 입원비 무통장 입금'
    if(task['1'] == '서류발급') text4 = '서류발급 준비물은 무엇인가요?'
    if(task['1'] == '입원 안내') text4 ='입원예약변경, 입원비 무통장 입금'
    if(task['1'] == '서류 발급') text4 =  '서류발급 준비물은 무엇인가요?'
     if(task['1'] == '입원') text4 ='입원예약변경, 입원비 무통장 입금'
     

    
      task.text = text3 + ' 관련하여 궁금하신 점이 무엇이든 알려드릴께요.\n 무엇을 도와드릴까요? \n예)'+ text4 +'\n\n* 처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.'
      callback(task,context);
	}
};

bot.setTask('ORTask',ORTask);










var  locationORTask= {
  action: function (task,context,callback) {
    var text1 = ''
    if(task['1'] == '2') text1 = '병원 내 위치 찾기'
    if(task['1'] == '7') text1 = '편의 시설 이용 안내'
    if(task['1'] == '위치찾기') text1 = '병원 내 위치 찾기'
    if(task['1'] == '편의시설') text1 = '편의 시설 이용 안내'
    if(task['1'] == '위치 찾기') text1 = '병원 내 위치 찾기'
    if(task['1'] == '편의 시설') text1 = '편의 시설 이용 안내'
    if(task['1'] == '위치') text1 = '병원 내 위치 찾기'
  
    var text2 = ''
    if(task['1'] == '2') text2 = '정형외과는 어디야?'
    if(task['1'] == '7') text2 = '샤워실은 어디죠?, 마트위치 알려줘요'
    if(task['1'] == '위치찾기') text2 = '정형외과는 어디야?'
    if(task['1'] == '편의시설') text2 = '샤워실은 어디죠?, 마트위치 알려줘요'
    if(task['1'] == '위치 찾기') text2 = '정형외과는 어디야?'
    if(task['1'] == '편의 시설') text2 = '샤워실은 어디죠?, 마트위치 알려줘요'
    if(task['1'] == '위치') text2 = '정형외과는 어디야?'   
    
    task.text = text1 + '를 해드릴께요. \n어디를 찾으시나요? \n예)' + text2 + '\n\n* 처음으로 가시려면 처음 또는 0번, 이전단계로 가시러면 이전 또는 9번을 입력해주세요.'
    
    callback(task,context);
	}
};

bot.setTask('locationORTask',locationORTask);






