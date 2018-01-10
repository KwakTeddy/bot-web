angular.module('playchat').controller('FailedDialogsOperationController', ['$window', '$scope', '$resource', '$cookies', '$location', 'LanguageService',function ($window, $scope, $resource, $cookies, $location, LanguageService)
{
    $scope.$parent.changeWorkingGroundName(LanguageService('Operation') + ' > ' + LanguageService('Failed Chat log'), '/modules/playchat/gnb/client/imgs/failed.png');

    $scope.changeTab = function(e, name)
    {
        angular.element(e.currentTarget).parent().find('.select_tab').removeClass('select_tab');
        angular.element(e.currentTarget).addClass('select_tab');

        angular.element('.tab-body').hide();
        angular.element('.tab-body[data-id="' + name + '"]').show();

        $location.hash(name);

        e.preventDefault();
        e.stopPropagation();
    };

    if($location.hash())
    {
        angular.element('.failed-dialog .select_tab').removeClass('select_tab');
        angular.element('.failed-dialog a[href="#' + $location.hash() + '"]').parent().addClass('select_tab');

        setTimeout(function()
        {
            console.log('나와라 : ', angular.element('.failed-dialog .tab-body'));
            angular.element('.failed-dialog .tab-body').hide();
            angular.element('.failed-dialog .tab-body[data-id="' + $location.hash() + '"]').show();
        }, 100);
    }
    $scope.lan=LanguageService;
}]);
