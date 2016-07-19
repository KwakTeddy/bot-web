(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      ConceptsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ConceptsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ConceptsService = _ConceptsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('concepts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/concepts');
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
          ConceptsController,
          mockConcept;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('concepts.view');
          $templateCache.put('modules/concepts/client/views/view-concept.client.view.html', '');

          // create mock Custom action
          mockConcept = new ConceptsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          ConceptsController = $controller('ConceptsController as vm', {
            $scope: $scope,
            conceptResolve: mockConcept
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:conceptId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.conceptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            conceptId: 1
          })).toEqual('/concepts/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.concept._id).toBe(mockConcept._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/concepts/client/views/view-concept.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ConceptsController,
          mockConcept;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('concepts.create');
          $templateCache.put('modules/concepts/client/views/form-concept.client.view.html', '');

          // create mock Custom action
          mockConcept = new ConceptsService();

          //Initialize Controller
          ConceptsController = $controller('ConceptsController as vm', {
            $scope: $scope,
            conceptResolve: mockConcept
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.conceptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/concepts/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.concept._id).toBe(mockConcept._id);
          expect($scope.vm.concept._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/concepts/client/views/form-concept.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ConceptsController,
          mockConcept;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('concepts.edit');
          $templateCache.put('modules/concepts/client/views/form-concept.client.view.html', '');

          // create mock Custom action
          mockConcept = new ConceptsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          ConceptsController = $controller('ConceptsController as vm', {
            $scope: $scope,
            conceptResolve: mockConcept
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:conceptId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.conceptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            conceptId: 1
          })).toEqual('/concepts/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.concept._id).toBe(mockConcept._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/concepts/client/views/form-concept.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
