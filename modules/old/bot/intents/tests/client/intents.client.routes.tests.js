(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      IntentsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _IntentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      IntentsService = _IntentsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('intents');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/intents');
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
          IntentsController,
          mockIntent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('intents.view');
          $templateCache.put('modules/intents/client/views/view-intent.client.view.html', '');

          // create mock Custom action
          mockIntent = new IntentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          IntentsController = $controller('IntentsController as vm', {
            $scope: $scope,
            intentResolve: mockIntent
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:intentId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.intentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            intentId: 1
          })).toEqual('/intents/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.intent._id).toBe(mockIntent._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/intents/client/views/view-intent.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          IntentsController,
          mockIntent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('intents.create');
          $templateCache.put('modules/intents/client/views/form-intent.client.view.html', '');

          // create mock Custom action
          mockIntent = new IntentsService();

          //Initialize Controller
          IntentsController = $controller('IntentsController as vm', {
            $scope: $scope,
            intentResolve: mockIntent
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.intentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/intents/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.intent._id).toBe(mockIntent._id);
          expect($scope.vm.intent._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/intents/client/views/form-intent.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          IntentsController,
          mockIntent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('intents.edit');
          $templateCache.put('modules/intents/client/views/form-intent.client.view.html', '');

          // create mock Custom action
          mockIntent = new IntentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          IntentsController = $controller('IntentsController as vm', {
            $scope: $scope,
            intentResolve: mockIntent
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:intentId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.intentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            intentId: 1
          })).toEqual('/intents/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.intent._id).toBe(mockIntent._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/intents/client/views/form-intent.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
