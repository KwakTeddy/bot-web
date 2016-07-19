'use strict';

// Configuring the Learnings module
angular.module('learnings').run(['Menus',
  function (Menus) {
    // Add the learnings dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Learnings',
      state: 'learnings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'learnings', {
      title: 'List Learnings',
      state: 'learnings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'learnings', {
      title: 'Create Learnings',
      state: 'learnings.create',
      roles: ['user']
    });
  }
]);
