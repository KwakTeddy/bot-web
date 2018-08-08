(function()
{
    'use strict';
})();
angular.module('playchat').controller('OutboundController', ['$window', '$scope', '$resource', '$cookies', '$location', '$timeout','$interval', 'LanguageService', '$rootScope', 'FileUploader', 'ExcelDownloadService', function ($window, $scope, $resource, $cookies, $location, $timeout, $interval, LanguageService, $rootScope, FileUploader, ExcelDownloadService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Bot Profile'), '/modules/playchat/working-ground/chatbot-edit/client/imgs/botsetting.png');

    var ChatBotService = $resource('/api/chatbots/:botId', { botId: '@botId', botDisplayId: '@botDisplayId' }, { update: { method: 'PUT' } });
    var BizMsgsService = $resource('/api/:botId/biz-msg/:id', { botId: '@botId', id:'@id', data:'@data' });
    var OutboundService = $resource('/api/outbound',{});

    const match = /\b((?:010[-.]?\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g;
    const dtFormat = 'YYYY-MM-DD HH:mm:ss';

    var page = 1, countPerPage = $location.search().countPerPage || 50;

    var user = $cookies.getObject('user');

    $scope.botList = [], $scope.numberset = [];
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

    $scope.getCallNumber = () => {
        var n = 0;
        $scope.numberset.forEach((e) => {
            e.use == true? n++ : null;
        });
        return n
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
        url: '/api/dialogsets/uploadfile',
        alias: 'uploadFile',
        autoUpload: true
    });

    $scope.uploader.onErrorItem = function(item, response, status, headers)
    {
        $scope.modalForm.fileUploadError = response.message;
    };

    $scope.uploader.onSuccessItem = function(item, response, status, headers)
    {
        importModal.data.path = response.path;
        importModal.data.filename = response.filename;
    };

    $scope.setInputMethod = (m) => {
        $scope.inputMethod = m;
    };

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
            numberset : '',
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
                    supported = false;
                    paramset.startTime = moment(new Date(range[0])).format(dtFormat);
                    paramset.endTime = moment(new Date(range[1])).format(dtFormat);
                    break;
            }
            $scope.numberset.forEach((e) => {
                e.use ? arr.push(e) : null;
            });

            if(arr.length == 0||paramset.startTime>paramset.endTime){
                throw '필수정보가 누락되었거나 사용불가능한 시간을 선택하셨습니다.\n입력하신 내용을 확인해주세요.';
            };

            if(!supported){
                throw '아직 지원하지 않는 기능입니다.\n나중에 다시 시도해주세요.';
            }

            paramset.numberset = JSON.stringify(arr);
            _send_process(paramset);
        }catch(e){
            console.log(e);
            alert(e);
        }
    };

    var _send_process = (paramset) => {
        var bot = $scope.botList.find((e)=>{return e.id==paramset.botId});
        BizMsgsService.get({botId:paramset.botId},(res) => {
            paramset.firstString = res.data[0].message.replace('+bot.name+',bot.name);

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
            angular.element('.main-logo-background').css('display', 'none');
        }, 1200);

        // 1분마다 interval
        $interval(()=>{
            $scope.timeNow = moment().format('YYYY년 MM월 DD일 HH시 mm분')
        },1000);
    })();

    $scope.$parent.loaded('working-ground');


    $scope.excelDownload = () => {
        var template = {
            sheetName: 'Contact',
            columnOrder: ['Name', 'Mobile'],
            orderedData: [{
                Name: '',
                Mobile: ''
            }]
        };

        ExcelDownloadService.download('userID', 'Telebook', null, template);
    };
    //$scope.getList();
    //$scope.excelDownload();
    $scope.lan = LanguageService;
}]);
