angular.module('playchat.working-ground').controller('DialogGraphEditorBasicController', ['$window', '$scope', '$resource', '$cookies', '$location', '$compile', 'DialogGraph', 'DialogGraphEditor', function ($window, $scope, $resource, $cookies, $location, $compile, DialogGraph, DialogGraphEditor)
{
    $scope.basic = {};
    $scope.basic.name = '';
    $scope.basic.inputList = [{ type: 'text', value: '' }];
    $scope.basic.outputList = [{ type: 'text', value: '이곳을 편집하세요' }];

    $scope.addInput = function()
    {
        $scope.basic.inputList.push({ type: 'text', value: '' });
    };

    $scope.deleteInput = function(index)
    {
        if($scope.basic.inputList.length == 1)
        {
            alert('마지막 Input은 삭제할 수 없습니다');
            return;
        }

        if(confirm('정말 삭제하시겠습니까?'))
        {
            $scope.basic.inputList = $scope.basic.inputList.splice(index, 1);
        }
    };

    $scope.addOutput = function(e)
    {
        $scope.basic.outputList.push({ type: 'text', value: '이곳을 편집하세요' });
    };

    $scope.changeOutputType = function(e)
    {

    };

    $scope.addOutputImage = function(e)
    {

    };

    $scope.addOutputButton = function(e)
    {

    };

    $scope.save = function()
    {

    };

    $scope.close = function()
    {
        DialogGraphEditor.close();
    };
}]);
