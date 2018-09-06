(function()
{
    'use strict';
    angular.module('playchat').controller('UserProfileController', ['$window', '$http','$scope', '$resource', '$cookies', '$rootScope', 'LanguageService', function ($window,$http, $scope, $resource, $cookies, $rootScope, LanguageService)
    {
        $scope.$parent.loading = false;

        var user = $cookies.getObject('user');
        $scope.user = user;

        $scope.password = '';
        $scope.passwordConfirm = '';
        (function()
        {

            $scope.save = function()
            {
                if($scope.password && $scope.passwordConfirm)
                {
                    if($scope.password != $scope.passwordConfirm)
                    {
                        return alert(LanguageService('Password is disaccord'));
                    }
                    else{
                        $scope.user.password = $scope.password;
                    }
                }
                else
                {
                    $scope.password = '';
                }

                if($scope.user.bizKindOfBusiness === "업종을 선택하세요." ){
                    $scope.user.bizKindOfBusiness = "";
                }

                if($scope.bizChair === "직책"){
                    $scope.user.bizChair = "";
                }

                $http.post('/api/users/updateBizAuthUser', $scope.user).success(function (response)
                {
                    $window.location.href = '/playchat/development/create-bot';
                    user.language = $scope.user.language;
                    $cookies.putObject('user', user);
                    $rootScope.$broadcast('changeLanguage');

                    alert(LanguageService('Has been applied'));
                }).error(function (response)
                {
                    console.log(response);
                    alert(response);
                })
            };

        })();

        $scope.lan = LanguageService;
    }]);

})();
