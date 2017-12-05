'use strict';

//플레이챗 전반적인 관리

angular.module('playchat').controller('LogAnalysisController', ['$window', '$scope', 'LanguageService', function ($window, $scope, LanguageService)
{
    $scope.$parent.loaded('log-analysis');

    $scope.lan=LanguageService;
}]);
