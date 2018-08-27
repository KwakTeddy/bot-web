(function()
{
    'use strict';
})();
angular.module('playchat').controller('OutboundController', ['$window', '$scope', '$resource', '$cookies', '$location', '$timeout','$interval', 'LanguageService', '$rootScope', 'FileUploader', 'ExcelDownloadService', function ($window, $scope, $resource, $cookies, $location, $timeout, $interval, LanguageService, $rootScope, FileUploader, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Bot Profile'), '/modules/playchat/working-ground/chatbot-edit/client/imgs/botsetting.png');

    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var BizMsgsService = $resource('/api/:botId/biz-msg/:id', { botId: '@botId', id:'@id', data:'@data' });
    var OutboundService = $resource('/api/outbound/:action',{action: '@action'});
    var TelebookService = $resource('/api/telebook/:userId/:tag',{userId: '@userId', tag: '@tag'});

    const match = /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g;
    const dtFormat = 'YYYY-MM-DD HH:mm:ss';

    var page = 1, countPerPage = $location.search().countPerPage || 50;

    var user = $cookies.getObject('user');
    $scope.botList = [], $scope.numberset = [], $scope.telebookset = [];
    $scope.selectedBot = 'null';
    $scope.isSingle = false;

    $scope.getList = function()
    {
        ChatBotService.query({ page: page, countPerPage: countPerPage, type : true }, function(list)
        {
            list.forEach((e) => {
                e.created = moment(e.created).format('YYYY.MM.DD');
            });

            $scope.botList = list;
        });
    };

    $scope.getTotalNumber = () => {
        var n = 0;
        if($scope.inputMethod==1){
            $scope.numberset.forEach((e) => {
                e.use == true? n++ : null;
            });
        }else{
            $scope.telebookset.forEach((e) => {
                e.useYN == true? n = n + parseInt(e.total) : null;
            })
        }

        return n
    };

    $scope.$watch('selectedBot',(n,o)=>{
        _setBot(n,()=>{
            $rootScope.$broadcast('editChatbotInfo');
        });
    });

    var _setBot = (id,cb) => {
        if(id){
            var bot = $scope.botList.find((e) => {return e.id ==id})

            bot.myBotAuth = { read: true, edit: true };
            $cookies.putObject('chatbot', bot);
            if(cb && typeof cb =='function'){
                cb()
            }
        }
    };
    $scope.pickerSetting = (e) => {
        $('#createdRange').daterangepicker({
            timePicker: true,
            singleDatePicker: e,
            opens: "left",
            drops: "up",
            minDate : new Date(),autoApply:true,
            endDate: moment().add(7, 'days'),
            locale: {
                "format": "YYYY/MM/DD HH:mm",
                "separator": " - ",
                "applyLabel": LanguageService('Apply'),
                "cancelLabel": LanguageService('Cancel'),
                "weekLabel": LanguageService('week'),
                "daysOfWeek": [
                    LanguageService('Sunday'),
                    LanguageService('Monday'),
                    LanguageService('Tuesday'),
                    LanguageService('Wednesday'),
                    LanguageService('Thursday'),
                    LanguageService('Friday'),
                    LanguageService('Saturday')
                ],
                monthNames: [
                    LanguageService('January'),
                    LanguageService('February'),
                    LanguageService('March'),
                    LanguageService('April'),
                    LanguageService('May'),
                    LanguageService('June'),
                    LanguageService('July'),
                    LanguageService('August'),
                    LanguageService('September'),
                    LanguageService('October'),
                    LanguageService('November'),
                    LanguageService('December')
                ],
                "firstDay": 1
            }
        });
    };

    $scope.uploader = new FileUploader({
        alias: 'uploadFile',
        autoUpload: true
    });

    $scope.triggerFile = (e) => {
        $scope.uploader.url = '/api/outbound/'+user._id+'/upload/'+ ($scope.inputMethod == 2 ? 'telebook' : 'temp');
        e.target.nextElementSibling.click()
    };

    $scope.uploader.onErrorItem = function(item, response, status, headers)
    {
        alert(response.message)
    };

    $scope.uploader.onSuccessItem = function(item, response, status, headers)
    {
        if(response.status){
            _loadTeleBook();
        }
    };

    var _loadTeleBook = () => {
        TelebookService.get({
            userId:user._id,
            tag: $scope.inputMethod == 2 ? 'telebook' : 'temp'
        },(telebook) => {
            if(telebook.status){items = telebook.data
                $scope.telebookset = telebook.data
            }
        })
    };

    $scope.setInputMethod = (m) => {
        $scope.inputMethod = m;

        if(m==2||m==3){
            _loadTeleBook();
        }
    };

    $scope.deleteTelebook = (item) => {
        TelebookService.remove({
            id:item._id,
            userId:user._id,
            tag: $scope.inputMethod == 2 ? 'telebook' : 'temp'
        },(result) => {
            if(result.status){
                _loadTeleBook();
            }
        })
    }

    $scope.setRegular = (e) => {
        if(e&&e.number){
            if(!e.number.match(match)){
                e.number = '';
                e.use = false;
            }else{
                e.use = true;
            }
        }
    };

    $scope.send = () => {
        var paramset = {
            botId : null,
            tag : '',
            numberset : '',
            telebookset : '',
            startTime : null,
            endTime : null
        };

        if(!$scope.selectedBot||$scope.selectedBot=='null'){
            return alert('봇을 선택해주세요.');
        }

        try{
            var supported = true;
            var arr = [];
            paramset.botId = $scope.selectedBot;
            var range = $scope.datetimeRange.split(' - ');
            switch(range.length){
                case 1 :
                    paramset.startTime = moment().format(dtFormat);
                    paramset.endTime = moment(new Date(range[0])).format(dtFormat);
                    break;
                case 2 :
                    // 임시코드
                    supported = false;
                    paramset.startTime = moment(new Date(range[0])).format(dtFormat);
                    paramset.endTime = moment(new Date(range[1])).format(dtFormat);
                    break;
            }
            paramset.tag = $scope.inputMethod == 1 ? 'numberSet' : 'telebookSet';
            if(paramset.tag == 'numberSet'){
                $scope.numberset.forEach((e) => {
                    e.use ? arr.push(e) : null;
                });

                paramset.numberset = JSON.stringify(arr);
            }else{
                $scope.telebookset.forEach((e) => {
                    e.useYN == 1 ? arr.push(e._id):null;
                });

                paramset.telebookset = JSON.stringify(arr);
            }

            if(arr.length == 0||paramset.startTime>paramset.endTime){
                throw '필수정보가 누락되었거나 사용불가능한 시간을 선택하셨습니다.\n입력하신 내용을 확인해주세요.';
            };

            if(!supported){
                throw '아직 지원하지 않는 기능입니다.\n나중에 다시 시도해주세요.';
            }


            _send_process(paramset);
        }catch(e){
            console.log(e);
            alert(e);
        }
    };

    var _send_process = (paramset) => {
        var bot = $scope.botList.find((e)=>{return e.id==paramset.botId});
        BizMsgsService.get({botId:paramset.botId},(res) => {
            paramset.firstString = res.data[0].message.
                replace('+bot.name+',bot.name).
                replace('+bot.companyCall+',bot.companyCall).
                replace('+bot.description+',bot.description);

            OutboundService.save(paramset,(res) => {
                if(!res.status){
                    alert('현재 번호가 사용중입니다.\n나중에 다시 시도해주세요.');
                }else{
                    alert('성공적으로 발송요청되었습니다.\n결과를 기다려주세요.');
                }
            },(err) => {
                console.log(err)
            });
        })
    };

    $scope.excelDownload = () => {
        var template = {
            sheetName: 'Contact',
            columnOrder: ['Name', 'Mobile'],
            orderedData: [{
                Name: '',
                Mobile: ''
            }]
        };

        ExcelDownloadService.download(user._id, 'Telebook', null, template);
    };

    $scope.clear = () => {
        $scope.numberset = [];
    };

    // default environment setting
    (() => {
        $scope.getList();
        $scope.setInputMethod(1);
        $scope.pickerSetting(true);
        angular.element('.main-logo-background').css('opacity', 0);
        $timeout(function()
        {
            var bot = $cookies.getObject('chatbot');
            if(bot && bot.id){
                $scope.selectedBot = bot.id;
                _setBot(bot.id);
            }
            angular.element('.main-logo-background').css('display', 'none');
        }, 1200);

        // 1분마다 interval
        $interval(()=>{
            $scope.timeNow = moment().format('YYYY년 MM월 DD일 HH시 mm분')
        },1000);

        $scope.$watch('inputMethod',(o,n) => {

        });
    })();

    $scope.$parent.loaded('working-ground');


    //$scope.getList();
    //$scope.excelDownload();
    $scope.lan = LanguageService;
}]);



var items = null;
