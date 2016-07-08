'use strict';

// Configuring the Campaigns module
angular.module('campaigns').run(['Menus',
  function (Menus) {
    // Add the campaigns dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Campaigns',
      state: 'campaigns',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'campaigns', {
      title: 'List Campaigns',
      state: 'campaigns.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'campaigns', {
      title: 'Create Campaigns',
      state: 'campaigns.create',
      roles: ['user']
    });
  }
]);
