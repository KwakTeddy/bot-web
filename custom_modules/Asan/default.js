module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        name: 'defaultTask',
        action: function(dialog, context, callback)
        {
            callback();
        }
    });

	bot.setTask('locationTask', 
	{
		action: function (dialog, context, callback)
		{
          	var text1 = ''
            
            var userText = dialog.userInput.text;
          	if(userText == '2')
            {
            }
            
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
			callback();
		}
	});

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

	bot.setTask('findBinso', 
	{
		action: function (dialog, context, callback)
		{
            var number = dialog.userInput.regexp[0];

            dialog.output[0].text = '빈소 ' + number + '호는 별관 ' + BSfloor[number] + '에 있습니다.\n자세한 위치는 아래 약도를 참고하세요. \n* 처음으로 가시려면 처음 또는 0번 이전단계로 가시려면 이전 또는 9번을 입력해주세요.';
            dialog.output[0].image = { url : 'https://s3.ap-northeast-2.amazonaws.com/playchat-asan/' + BSimgindex[number] };
            dialog.output[0].buttons = [
                {
                    'text': '약도 자세히 보기',
                    'url': 'https://s3.ap-northeast-2.amazonaws.com/playchat-asan/' + BSimgindex[number]
                }
            ];

			callback();
		}
	});
};
