//Bot users service used to communicate Bot users REST endpoints
(function ()
{
    'use strict';

    angular.module('playchat').factory('TabService', function($window, $rootScope)
    {
        var Tab = function(tab)
        {
            this.tab = tab;
            this.tab.selectedTab = '';

            this.tab.selectTab = function(e, name)
            {
                e.currentTarget.parentElement.querySelector('.select_tab').className = '';
                e.currentTarget.className = 'select_tab';
                tab.selectedTab = name;
            };

            this.tab.isSelectedTab = function(name)
            {
                return tab.selectedTab == name;
            };
        };

        Tab.prototype.setDefaultTab = function(name)
        {
            this.tab.selectedTab = name;
        };

        return Tab;
    });
})();
