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

                var dialogNameIdx = {};

                var list = [];

                for(var i = 0; i < result.length; i++)
                {
                    if(dialogNameIdx[result[i]._id.dialogName])
                    {
                        var obj = {};
                        dialogNameIdx[result[i]._id.dialogName][result[i]._id.dialog] = result[i].count;

                    }
                    else
                    {
                        var obj = {};
                        obj[result[i]._id.dialog] = result[i].count;
                        dialogNameIdx[result[i]._id.dialogName] = obj;
                    }
                }

                for(var dialogName in dialogNameIdx)
                {
                    var userInput = [];
                    var item = {};
                    var sum = 0;

                    item.input = dialogName;

                    for(var raw in dialogNameIdx[dialogName])
                    {
                        var obj = {};
                        obj.raw = raw;
                        obj.count = dialogNameIdx[dialogName][raw];
                        userInput.push(obj);

                        sum += obj.count;
                    }


                    item.userInput = userInput;
                    item.sum = sum;


                    list.push(item);

                    for(var j = 0; j < userInput.length; j++)
                    {
                        var input = undefined;
                        if(j === 0) input = dialogName;
                        excelData.push({ q: input, input: userInput[j].raw, count: userInput[j].count});
                    }
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
                columnOrder: ["q", "input", 'count'],
                orderedData: excelData
            };

            ExcelDownloadService.download(chatbot.name, '대화 학습 입력', $scope.date, template);
        };
    })();

    //initialize
    DateRangePickerService.init('#createdRange', $scope.date, $scope.getList);
    $scope.getList();
    $scope.lan=LanguageService;
}]);
