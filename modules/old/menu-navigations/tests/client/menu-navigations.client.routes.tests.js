(function () {
  'use strict';

  describe('Menu navigations Route Tests', function () {
    // Initialize global variables
    var $scope,
      MenuNavigationsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MenuNavigationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MenuNavigationsService = _MenuNavigationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('menu-navigations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/menu-navigations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MenuNavigationsController,
          mockMenuNavigation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('menu-navigations.view');
          $templateCache.put('modules/menu-navigations/client/views/view-menu-navigation.client.view.html', '');

          // create mock Menu navigation
          mockMenuNavigation = new MenuNavigationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Menu navigation Name'
          });

          // Initialize Controller
          MenuNavigationsController = $controller('MenuNavigationsController as vm', {
            $scope: $scope,
            menuNavigationResolve: mockMenuNavigation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:menuNavigationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.menuNavigationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            menuNavigationId: 1
          })).toEqual('/menu-navigations/1');
        }));

        it('should attach an Menu navigation to the controller scope', function () {
          expect($scope.vm.menuNavigation._id).toBe(mockMenuNavigation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/menu-navigations/client/views/view-menu-navigation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MenuNavigationsController,
          mockMenuNavigation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('menu-navigations.create');
          $templateCache.put('modules/menu-navigations/client/views/form-menu-navigation.client.view.html', '');

          // create mock Menu navigation
          mockMenuNavigation = new MenuNavigationsService();

          // Initialize Controller
          MenuNavigationsController = $controller('MenuNavigationsController as vm', {
            $scope: $scope,
            menuNavigationResolve: mockMenuNavigation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.menuNavigationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/menu-navigations/create');
        }));

        it('should attach an Menu navigation to the controller scope', function () {
          expect($scope.vm.menuNavigation._id).toBe(mockMenuNavigation._id);
          expect($scope.vm.menuNavigation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/menu-navigations/client/views/form-menu-navigation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MenuNavigationsController,
          mockMenuNavigation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('menu-navigations.edit');
          $templateCache.put('modules/menu-navigations/client/views/form-menu-navigation.client.view.html', '');

          // create mock Menu navigation
          mockMenuNavigation = new MenuNavigationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Menu navigation Name'
          });

          // Initialize Controller
          MenuNavigationsController = $controller('MenuNavigationsController as vm', {
            $scope: $scope,
            menuNavigationResolve: mockMenuNavigation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:menuNavigationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.menuNavigationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            menuNavigationId: 1
          })).toEqual('/menu-navigations/1/edit');
        }));

        it('should attach an Menu navigation to the controller scope', function () {
          expect($scope.vm.menuNavigation._id).toBe(mockMenuNavigation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/menu-navigations/client/views/form-menuNavigation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
