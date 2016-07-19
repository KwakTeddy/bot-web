(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      CustomActionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CustomActionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CustomActionsService = _CustomActionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('custom-actions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/custom-actions');
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
          CustomActionsController,
          mockCustomAction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('custom-actions.view');
          $templateCache.put('modules/custom-actions/client/views/view-custom-action.client.view.html', '');

          // create mock Custom action
          mockCustomAction = new CustomActionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          CustomActionsController = $controller('CustomActionsController as vm', {
            $scope: $scope,
            customActionResolve: mockCustomAction
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:customActionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.customActionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            customActionId: 1
          })).toEqual('/custom-actions/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.customAction._id).toBe(mockCustomAction._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/custom-actions/client/views/view-custom-action.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CustomActionsController,
          mockCustomAction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('custom-actions.create');
          $templateCache.put('modules/custom-actions/client/views/form-custom-action.client.view.html', '');

          // create mock Custom action
          mockCustomAction = new CustomActionsService();

          //Initialize Controller
          CustomActionsController = $controller('CustomActionsController as vm', {
            $scope: $scope,
            customActionResolve: mockCustomAction
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.customActionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/custom-actions/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.customAction._id).toBe(mockCustomAction._id);
          expect($scope.vm.customAction._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/custom-actions/client/views/form-custom-action.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CustomActionsController,
          mockCustomAction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('custom-actions.edit');
          $templateCache.put('modules/custom-actions/client/views/form-custom-action.client.view.html', '');

          // create mock Custom action
          mockCustomAction = new CustomActionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          CustomActionsController = $controller('CustomActionsController as vm', {
            $scope: $scope,
            customActionResolve: mockCustomAction
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:customActionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.customActionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            customActionId: 1
          })).toEqual('/custom-actions/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.customAction._id).toBe(mockCustomAction._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/custom-actions/client/views/form-customAction.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
