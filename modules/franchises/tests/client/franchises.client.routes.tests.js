(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      FranchisesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FranchisesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FranchisesService = _FranchisesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('franchises');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/franchises');
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
          FranchisesController,
          mockFranchise;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('franchises.view');
          $templateCache.put('modules/franchises/client/views/view-franchise.client.view.html', '');

          // create mock Custom action
          mockFranchise = new FranchisesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          FranchisesController = $controller('FranchisesController as vm', {
            $scope: $scope,
            franchiseResolve: mockFranchise
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:franchiseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.franchiseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            franchiseId: 1
          })).toEqual('/franchises/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.franchise._id).toBe(mockFranchise._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/franchises/client/views/view-franchise.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FranchisesController,
          mockFranchise;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('franchises.create');
          $templateCache.put('modules/franchises/client/views/form-franchise.client.view.html', '');

          // create mock Custom action
          mockFranchise = new FranchisesService();

          //Initialize Controller
          FranchisesController = $controller('FranchisesController as vm', {
            $scope: $scope,
            franchiseResolve: mockFranchise
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.franchiseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/franchises/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.franchise._id).toBe(mockFranchise._id);
          expect($scope.vm.franchise._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/franchises/client/views/form-franchise.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FranchisesController,
          mockFranchise;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('franchises.edit');
          $templateCache.put('modules/franchises/client/views/form-franchise.client.view.html', '');

          // create mock Custom action
          mockFranchise = new FranchisesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          FranchisesController = $controller('FranchisesController as vm', {
            $scope: $scope,
            franchiseResolve: mockFranchise
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:franchiseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.franchiseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            franchiseId: 1
          })).toEqual('/franchises/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.franchise._id).toBe(mockFranchise._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/franchises/client/views/form-franchise.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
