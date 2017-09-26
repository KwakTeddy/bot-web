(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      FactsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FactsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FactsService = _FactsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('facts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/facts');
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
          FactsController,
          mockFact;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('facts.view');
          $templateCache.put('modules/facts/client/views/view-fact.client.view.html', '');

          // create mock Custom action
          mockFact = new FactsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          FactsController = $controller('FactsController as vm', {
            $scope: $scope,
            factResolve: mockFact
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:factId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.factResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            factId: 1
          })).toEqual('/facts/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.fact._id).toBe(mockFact._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/facts/client/views/view-fact.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FactsController,
          mockFact;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('facts.create');
          $templateCache.put('modules/facts/client/views/form-fact.client.view.html', '');

          // create mock Custom action
          mockFact = new FactsService();

          //Initialize Controller
          FactsController = $controller('FactsController as vm', {
            $scope: $scope,
            factResolve: mockFact
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.factResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/facts/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.fact._id).toBe(mockFact._id);
          expect($scope.vm.fact._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/facts/client/views/form-fact.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FactsController,
          mockFact;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('facts.edit');
          $templateCache.put('modules/facts/client/views/form-fact.client.view.html', '');

          // create mock Custom action
          mockFact = new FactsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          FactsController = $controller('FactsController as vm', {
            $scope: $scope,
            factResolve: mockFact
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:factId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.factResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            factId: 1
          })).toEqual('/facts/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.fact._id).toBe(mockFact._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/facts/client/views/form-fact.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
