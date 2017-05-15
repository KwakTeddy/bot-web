'use strict';

// Configuring the Messengers module
angular.module('messengers').run(['Menus',
  function (Menus) {
    // Add the messengers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Messengers',
      state: 'messengers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'messengers', {
      title: 'List Messengers',
      state: 'messengers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'messengers', {
      title: 'Create Messengers',
      state: 'messengers.create',
      roles: ['enterprise', 'user']
    });
  }
]);
