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

			callback();
		}
	});
};
