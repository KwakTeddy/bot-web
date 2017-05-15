(function () {
  'use strict';

  angular
    .module('restaurants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('restaurants', {
        abstract: true,
        url: '/developer/restaurants',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('restaurants.list', {
        url: '',
        templateUrl: 'modules/restaurants/client/views/list-restaurants.client.view.html',
        controller: 'RestaurantsListController',
        controllerAs: 'vm',
        resolve: {
          restaurantsResolve: getRestaurants
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('restaurants.create', {
        url: '/create',
        templateUrl: 'modules/restaurants/client/views/form-restaurant.client.view.html',
        controller: 'RestaurantsController',
        controllerAs: 'vm',
        resolve: {
          restaurantResolve: newRestaurant
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('restaurants.menus', {
        url: '/:restaurantId/menus',
        // url: '/menus',
        templateUrl: 'modules/restaurants/client/views/form-menu.client.view.html',
        controller: 'MenusController',
        controllerAs: 'vm',
        resolve: {
          menuResolve: getMenu
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
      .state('restaurants.edit', {
        url: '/:restaurantId/edit',
        templateUrl: 'modules/restaurants/client/views/form-restaurant.client.view.html',
        controller: 'RestaurantsController',
        controllerAs: 'vm',
        resolve: {
          restaurantResolve: getRestaurant
        },
        data: {
          // roles: ['user', 'enterprise', 'admin'],
          pageTitle: 'Edit Custom action {{ restaurantResolve.name }}'
        }
      })
      .state('restaurants.view', {
        url: '/:restaurantId',
        templateUrl: 'modules/restaurants/client/views/view-restaurant.client.view.html',
        controller: 'RestaurantsController',
        controllerAs: 'vm',
        resolve: {
          restaurantResolve: getRestaurant
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      });
  }

  getRestaurants.$inject = ['RestaurantsService'];
  function getRestaurants(RestaurantsService) {
    return RestaurantsService.query().$promise;
  }

  getRestaurant.$inject = ['$stateParams', 'RestaurantsService'];
  function getRestaurant($stateParams, RestaurantsService) {
    return RestaurantsService.get({
      restaurantId: $stateParams.restaurantId
    }).$promise;
  }

  newRestaurant.$inject = ['RestaurantsService'];
  function newRestaurant(RestaurantsService) {
    return new RestaurantsService();
  }

  newMenu.$inject = ['MenusService'];
  function newMenu(MenusService) {
    return new MenusService();
  }

  getMenu.$inject = ['$stateParams', 'MenusService'];
  function getMenu($stateParams, MenusService) {
    return MenusService.get({
      restaurantId: $stateParams.restaurantId
    }).$promise;
  }

})();
