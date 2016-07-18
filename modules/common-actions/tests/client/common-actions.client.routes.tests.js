(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      CommonActionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CommonActionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CommonActionsService = _CommonActionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('common-actions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/common-actions');
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
          CommonActionsController,
          mockCommonAction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('common-actions.view');
          $templateCache.put('modules/common-actions/client/views/view-common-action.client.view.html', '');

          // create mock Custom action
          mockCommonAction = new CommonActionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          CommonActionsController = $controller('CommonActionsController as vm', {
            $scope: $scope,
            commonActionResolve: mockCommonAction
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:commonActionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.commonActionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            commonActionId: 1
          })).toEqual('/common-actions/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.commonAction._id).toBe(mockCommonAction._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/common-actions/client/views/view-common-action.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CommonActionsController,
          mockCommonAction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('common-actions.create');
          $templateCache.put('modules/common-actions/client/views/form-common-action.client.view.html', '');

          // create mock Custom action
          mockCommonAction = new CommonActionsService();

          //Initialize Controller
          CommonActionsController = $controller('CommonActionsController as vm', {
            $scope: $scope,
            commonActionResolve: mockCommonAction
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.commonActionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/common-actions/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.commonAction._id).toBe(mockCommonAction._id);
          expect($scope.vm.commonAction._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/common-actions/client/views/form-common-action.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CommonActionsController,
          mockCommonAction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('common-actions.edit');
          $templateCache.put('modules/common-actions/client/views/form-common-action.client.view.html', '');

          // create mock Custom action
          mockCommonAction = new CommonActionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          CommonActionsController = $controller('CommonActionsController as vm', {
            $scope: $scope,
            commonActionResolve: mockCommonAction
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:commonActionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.commonActionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            commonActionId: 1
          })).toEqual('/common-actions/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.commonAction._id).toBe(mockCommonAction._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/common-actions/client/views/form-commonAction.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
