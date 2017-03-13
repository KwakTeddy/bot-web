(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      DialogsetsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DialogsetsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DialogsetsService = _DialogsetsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('dialogsets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/dialogsets');
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
          DialogsetsController,
          mockDialogset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('dialogsets.view');
          $templateCache.put('modules/dialogsets/client/views/view-dialogset.client.view.html', '');

          // create mock Custom action
          mockDialogset = new DialogsetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          DialogsetsController = $controller('DialogsetsController as vm', {
            $scope: $scope,
            dialogsetResolve: mockDialogset
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:dialogsetId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.dialogsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            dialogsetId: 1
          })).toEqual('/dialogsets/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.dialogset._id).toBe(mockDialogset._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/dialogsets/client/views/view-dialogset.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DialogsetsController,
          mockDialogset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('dialogsets.create');
          $templateCache.put('modules/dialogsets/client/views/form-dialogset.client.view.html', '');

          // create mock Custom action
          mockDialogset = new DialogsetsService();

          //Initialize Controller
          DialogsetsController = $controller('DialogsetsController as vm', {
            $scope: $scope,
            dialogsetResolve: mockDialogset
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.dialogsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/dialogsets/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.dialogset._id).toBe(mockDialogset._id);
          expect($scope.vm.dialogset._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/dialogsets/client/views/form-dialogset.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DialogsetsController,
          mockDialogset;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('dialogsets.edit');
          $templateCache.put('modules/dialogsets/client/views/form-dialogset.client.view.html', '');

          // create mock Custom action
          mockDialogset = new DialogsetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          DialogsetsController = $controller('DialogsetsController as vm', {
            $scope: $scope,
            dialogsetResolve: mockDialogset
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:dialogsetId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.dialogsetResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            dialogsetId: 1
          })).toEqual('/dialogsets/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.dialogset._id).toBe(mockDialogset._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/dialogsets/client/views/form-dialogset.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
