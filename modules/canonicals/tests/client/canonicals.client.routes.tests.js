(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      CanonicalsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CanonicalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CanonicalsService = _CanonicalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('canonicals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/canonicals');
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
          CanonicalsController,
          mockCanonical;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('canonicals.view');
          $templateCache.put('modules/canonicals/client/views/view-canonical.client.view.html', '');

          // create mock Custom action
          mockCanonical = new CanonicalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          CanonicalsController = $controller('CanonicalsController as vm', {
            $scope: $scope,
            canonicalResolve: mockCanonical
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:canonicalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.canonicalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            canonicalId: 1
          })).toEqual('/canonicals/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.canonical._id).toBe(mockCanonical._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/canonicals/client/views/view-canonical.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CanonicalsController,
          mockCanonical;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('canonicals.create');
          $templateCache.put('modules/canonicals/client/views/form-canonical.client.view.html', '');

          // create mock Custom action
          mockCanonical = new CanonicalsService();

          //Initialize Controller
          CanonicalsController = $controller('CanonicalsController as vm', {
            $scope: $scope,
            canonicalResolve: mockCanonical
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.canonicalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/canonicals/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.canonical._id).toBe(mockCanonical._id);
          expect($scope.vm.canonical._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/canonicals/client/views/form-canonical.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CanonicalsController,
          mockCanonical;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('canonicals.edit');
          $templateCache.put('modules/canonicals/client/views/form-canonical.client.view.html', '');

          // create mock Custom action
          mockCanonical = new CanonicalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          CanonicalsController = $controller('CanonicalsController as vm', {
            $scope: $scope,
            canonicalResolve: mockCanonical
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:canonicalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.canonicalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            canonicalId: 1
          })).toEqual('/canonicals/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.canonical._id).toBe(mockCanonical._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/canonicals/client/views/form-canonical.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
