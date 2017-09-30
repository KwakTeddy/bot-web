


var dialogs = [
    { name: '주소확인', input: /주소.*(?:확인|무엇|뭐|알다)/, output: '현재 주소는 +address.지번주소+ 입니다.'},

    { name: '주소등록', input: {regexp: /주소.*~변경/g},
        output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.',
        children: [
            { input: {types: [{type: type.addressType, raw: true, context: true}]},
                output: [
                    { if: 'context.dialog.address.지번본번 == undefined && context.dialog.forceAddress != true',
                        output: '주문을 위해서는 번지수 및 동호수를 포함한 상세한 주소가 필요합니다.\n\n주소를 정확히 입력해 주세요.\n그냥 근처의 음식점을 먼저 검색하고 싶으면 "계속"이라고 말씀해주세요.',
                        children: [
                            {input: '계속', output: {call: '주소등록확인'}},
                            {output: {callChild: '주소등록'}}
                        ]},
                    { if: 'context.dialog.address.지번본번 == undefined && context.dialog.forceAddress == true', output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.\n0.이전 !. 처음'}}},
                    { if: 'context.dialog.address.상세주소 == undefined', output: '동호수나 몇층인지 까지 말씀해주세요.\n 있으면 말씀해주시고, 이게 전부이면 "거기까지"라고 얘기해주세요.',
                        children: [
                            {input: '거기까지', output: {call: '주소등록확인'}},
                            { task: { action: function(task, context, callback) {
                                console.log('주소변경' + task.inRaw);
                                context.user.address.상세주소 = context.dialog.address.상세주소 = task.inRaw;
                                context.user.address.지번주소  = context.dialog.address.지번주소 = context.user.address.지번주소 + ' ' + task.inRaw;
                                context.user.address.도로명주소  = context.dialog.address.도로명주소 = context.user.address.도로명주소 + ' ' + task.inRaw;
                                callback(task, context);
                            }},
                                output: {call: '주소등록확인'}}
                        ]},
                    {if: 'true', output: {call: '주소등록확인'}}
                ]
            },
            { name: '주소등록확인',
                input: false,
                output: [
                    {
                        // if : "context.bot.channel == 'ios'|context.bot.channel == 'android'",
                        output: '입력하신 주소는 +address.지번주소+ 입니다. 이 주소가 맞으신가요?',
                        children: [
                            {input: /~네/, output: {call: '주소변경완료'}},
                            {input: /~아니요/, output: {call: '주소등록'}},
                            {output: {repeat: 1, options: {prefix: '네 혹은 아니오로 대답해주세요.\n'}} }
                        ]},
                    {if: 'true', output: {call: '주소변경완료'}}
                ]
            },
            { input: false,
                name: '주소변경완료',
                task: {action: function(task, context, callback) {
                    task.address = context.dialog.address;
                    context.user.addressCompact = context.user.address.지번주소.replace(/^([가-힣]+\s*)/, function(matched, p1) { return ''});
                    context.user.updates = ['address'];
                    botUser.updateUserContext(context.user, context, function () {
                        context.user.updates = null;
                        address.naverGeocode(task, context, function(task, context) {
                            context.dialog.lat = task.lat; context.dialog.lng = task.lng;

                            if(context.botUser.returnCall &&
                                context.botUser.currentDialog && context.botUser.currentDialog.top && context.botUser.currentDialog.top.name == '배달주문') {

                                if(context.dialog.orderRestaurant) {
                                    if(!orderTasks.isRestaurantIndistance(context, context.dialog.orderRestaurant)) {
                                        // context.dialog.orderble = null;
                                        context.dialog.orderRestaurant = null;
                                        context.dialog.orderMenu = null;
                                        context.dialog.orderOption = null;
                                        context.dialog.restaurant = null;
                                        context.dialog.menu = null;
                                        context.dialog.menus = null;

                                        context.dialog.typeInits['restaurant'] = null;
                                        context.dialog.typeInits['menu'] = null;
                                        context.dialog.음식점입력최초 == true;

                                        context.botUser.returnCall.returnPrefix = '주소가 변경되어 음식점을 다시 검색해야 해요.\n';
                                        context.botUser.returnCall.returnDialog = dialogModule.findDialog(null, context, '음식점입력');
                                        context.botUser.returnCall.returnMethod = 'callChild';
                                        context.botUser.returnCall.returnMethod = null;
                                    }
                                }
                            }

                            callback(task, context);
                        });
                    });
                }},
                output: {output: '주소가 등록되었습니다.', return: 1/*, options: {prefix: '주소가 바뀌어서 주문을 다시 할께요.\n'}*/}},
            { output: {repeat: 1, options: {output: '번지수 및 동호수를 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.\n0.이전 !. 처음 | 상세주소를 말씀해주세요'}}}
        ]
    }
];

var commonDialogs = [
	{
		"id": "defaultcommon0",
		"filename": "defaultcommon",
		"name": "시작",
		"input": [
			{
				"text": "시작"
			}
		],
		"output": {
			"text": "bot_exp6 입니다.",
			"kind": "Text"
		}
	},
	{
		"id": "defaultcommon1",
		"filename": "defaultcommon",
		"name": "상위",
		"input": [
			{
				"text": "상위"
			},
			{
				"text": "이전"
			}
		],
		"output": {
			"up": 1
		}
	},
	{
		"id": "defaultcommon2",
		"filename": "defaultcommon",
		"name": "답변없음",
		"input": "",
		"output": "알아듣지 못했습니다"
	}
];
var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('bot_exp6');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
