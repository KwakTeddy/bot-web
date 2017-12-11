"user strict"

angular.module("playchat").controller("DialogTrainingInputController", ['$scope', '$resource', '$cookies', '$http', 'DateRangePickerService', 'ExcelDownloadService', 'LanguageService',function ($scope, $resource, $cookies, $http, DateRangePickerService, ExcelDownloadService, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Analysis') + ' > ' + LanguageService('Dialog Training Input'), '/modules/playchat/gnb/client/imgs/traininginput.png');

    //서비스 선언
    var DialogTrainingInputService = $resource('/api/:botId/analysis/dialog-training-input', { botId: '@botId' });

    //변수 선언
    var chatbot = $cookies.getObject('chatbot');

    var excelData = undefined;

    //스코프 변수 선언
    $scope.date = {};
    $scope.list = [];

    (function()
    {
        //함수 선언
        $scope.getList = function()
        {
            excelData = [];
            DialogTrainingInputService.query({ botId: chatbot.id, startDate: new Date($scope.date.start).toISOString(), endDate: new Date($scope.date.end).toISOString() }, function(result)
            {
                console.log(result);

                var data = {};
                var summary = {};
                for(var i=0; i<result.length; i++)
                {
                    data[result[i].dialogId._id] = result[i];

                    if(!summary[result[i].dialogId._id])
                        summary[result[i].dialogId._id] = {};

                    if(!summary[result[i].dialogId._id][result[i]._id.preDialogName])
                        summary[result[i].dialogId._id][result[i]._id.preDialogName] = 0;

                    summary[result[i].dialogId._id][result[i]._id.preDialogName] += result[i].count;
                }

                var list = [];
                for(var key in summary)
                {
                    var userInput = [];
                    var object = { input: data[key].dialogId.inputRaw.join('\n'), userInput: userInput };

                    var sum = 0;
                    for(var subkey in summary[key])
                    {
                        sum += summary[key][subkey];
                        userInput.push({ name : subkey, count: summary[key][subkey] });
                    }

                    userInput.sort(function(a, b)
                    {
                        return b.count - a.count;
                    });

                    object.sum = sum;

                    list.push(object);

                    var input = '';
                    for(var i=0; i<object.userInput.length; i++)
                    {
                        input += object.userInput[i].name + ':' + object.userInput[i].count + '\n';
                    }

                    excelData.push({ q: object.input, input: input, sum: sum});
                }

                $scope.list = list;

                $scope.$parent.loaded('working-ground');
            },
            function(err)
            {
                alert(err.data.error || err.data.message);
            });
        };

        $scope.exelDownload = function()
        {
            var template = {
                sheetName: '대화 학습 입력',
                columnOrder: ["q", "input", 'sum'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.id, '대화 학습 입력', $scope.date, template);
        };
    })();

    //initialize
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
