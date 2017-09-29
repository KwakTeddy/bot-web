'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['$state', '$timeout', function ($state, $timeout)
{
    this.connect = function ()
    {
        this.socket = io();
    };

    this.isConnected = function()
    {
        return this.socket ? true : false;
    };

    this.connect();

    this.on = function (eventName, callback)
    {
        if (this.socket)
        {
            this.socket.on(eventName, function (data)
            {
                $timeout(function ()
                {
                    callback(data);
                });
            });
        }
    };

    this.emit = function (eventName, data)
    {
        if (this.socket)
        {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function (eventName)
    {
        if (this.socket)
        {
            this.socket.removeListener(eventName);
        }
    };
}]);
