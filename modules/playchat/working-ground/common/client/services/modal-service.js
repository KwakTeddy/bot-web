//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat.working-ground').factory('ModalService', function($window, $rootScope)
    {
        var Modal = function($scope)
        {
            $scope.modal = {};
            $scope.modal.isOpened = false;
            this.scope = $scope;
            this.openCallbackList = [];
            this.closeCallbackList = [];

            this.init();
        };

        Modal.prototype.init = function()
        {
            var that = this;
            var ec = function(e)
            {
                if(e.keyCode == 27)
                {
                    that.scope.$apply(function()
                    {
                        that.scope.modal.close();
                    });
                }
            };

            that.scope.modal.open = function()
            {
                that.scope.modal.isOpened = true;
                var list = that.openCallbackList;
                for(var i=0, l=list.length; i<l; i++)
                {
                    list[i]();
                }

                angular.element(document).on('keydown', ec);
            };

            that.scope.modal.close = function()
            {
                that.scope.modal.isOpened = false;
                var list = that.closeCallbackList;
                for(var i=0, l=list.length; i<l; i++)
                {
                    list[i]();
                }

                angular.element(document).off('keydown', ec);
            };
        };

        Modal.prototype.addOpenCallback = function(callback)
        {
            this.openCallbackList.push(callback);
        };

        Modal.prototype.addCloseCallback = function(callback)
        {
            this.closeCallbackList.push(callback);
        };

        return Modal;
    });
})();
