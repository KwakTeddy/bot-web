
var PlayChat = {};
(function()
{
    'use strict';
    //this == PlayChat



    //CONST variables
    this.CONFIG = {
        PLATFORM: undefined
    };





    //private variables
    var p = {
        user: undefined,
        enterprise: undefined
    };

    this.setUser = function(user)
    {
        p.user = user;
    };

    this.getUser = function()
    {
        return p.user;
    };

    this.setEnterprise = function(enterprise)
    {
        p.enterprise = enterprise;
    };

    this.getEnterprise = function()
    {
        return p.enterprise;
    };




    //public
    this.checkSignin = function()
    {
        if(p.user)
        {
            return true;
        }

        return false;
    };


}).call(PlayChat);
