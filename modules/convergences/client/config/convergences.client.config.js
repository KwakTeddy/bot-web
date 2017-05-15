(function () {
  'use strict';

  angular
    .module('convergences')
    .run();
    // .run(menuConfig);

  // menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'Convergences',
    //   state: 'convergences',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    //
    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'convergences', {
    //   title: 'List Convergences',
    //   state: 'convergences.list'
    // });
    //
    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'convergences', {
    //   title: 'Create Convergence',
    //   state: 'convergences.create',
    //   roles: ['enterprise', 'user']
    // });
  }
}());
