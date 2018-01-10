'use strict';

angular.module('playchat').controller('TitleController', ['$scope', '$http', function ($scope, $http)
{
    $http.get('/config').then(function (result)
    {
        if(result.data.enterprise.title)
        {
            $scope.enterpriseTitle = result.data.enterprise.title;
        }
        else
        {
            $scope.enterpriseTitle = '아테나 Athena - 인공지능 챗봇 플랫폼, 머니브레인 MoneyBrain';
        }
    },
    function (err)
    {
        console.log(err);
    });
}]);
