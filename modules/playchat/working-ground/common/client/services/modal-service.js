//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('ModalService', function($window, $rootScope)
    {
        var Modal = function(name, $scope)
        {
            this.isOpened = false;
            this.name = name;
            this.$scope = $scope;

            this.$scope.modal = this.$scope.modal || {};
            this.openCallback = undefined;
            this.closeCallback = undefined;

            this.data = {};

            this.$scope.modal[name] = this;
        };

        Modal.prototype.open = function()
        {
            this.isOpened = true;
            if(this.openCallback)
                this.openCallback();
        };

        Modal.prototype.close = function()
        {
            this.isOpened = false;
            this.clear();
            if(this.closeCallback)
                this.closeCallback();
        };

        Modal.prototype.setOpenCallback = function(callback)
        {
            this.openCallback = callback;
        };

        Modal.prototype.setCloseCallback = function(callback)
        {
            this.closeCallback = callback;
        };

        Modal.prototype.setData = function(data)
        {
            for(var key in data)
            {
                this.data[key] = data[key];
            }
        };

        Modal.prototype.clear = function()
        {
            this.data = {};
        };

        // var Modal = function($scope)
        // {
        //     $scope.modal = {};
        //     $scope.modal.isOpened = false;
        //     this.scope = $scope;
        //     this.openCallbackList = [];
        //     this.closeCallbackList = [];
        //
        //     this.init();
        // };
        //
        // Modal.prototype.init = function()
        // {
        //     var that = this;
        //     var ec = function(e)
        //     {
        //         if(e.keyCode == 27)
        //         {
        //             that.scope.$apply(function()
        //             {
        //                 that.scope.modal.close();
        //             });
        //         }
        //     };
        //
        //     that.scope.modal.open = function()
        //     {
        //         that.scope.modal.isOpened = true;
        //         var list = that.openCallbackList;
        //         for(var i=0, l=list.length; i<l; i++)
        //         {
        //             list[i]();
        //         }
        //
        //         angular.element(document).on('keydown', ec);
        //     };
        //
        //     that.scope.modal.close = function()
        //     {
        //         that.scope.modal.isOpened = false;
        //         var list = that.closeCallbackList;
        //         for(var i=0, l=list.length; i<l; i++)
        //         {
        //             list[i]();
        //         }
        //
        //         angular.element(document).off('keydown', ec);
        //     };
        // };
        //
        // Modal.prototype.addOpenCallback = function(callback)
        // {
        //     this.openCallbackList.push(callback);
        // };
        //
        // Modal.prototype.addCloseCallback = function(callback)
        // {
        //     this.closeCallbackList.push(callback);
        // };

        return Modal;
    });
})();
