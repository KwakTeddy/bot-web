'use strict';

// Configuring the Bots module
angular.module('bots').run(['Menus',
  function (Menus) {
    // Add the bots dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Bots',
      state: 'bots',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'bots', {
      title: 'List Bots',
      state: 'bots.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'bots', {
      title: 'Create Bots',
      state: 'bots.create',
      roles: ['user']
    });
  }
]);
