(function () {
  'use strict';

  describe('Bot users Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserDialogsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserDialogsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserDialogsService = _UserDialogsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('user-dialogs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/user-dialogs');
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
          UserDialogsController,
          mockUserDialog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('user-dialogs.view');
          $templateCache.put('modules/user-dialogs/client/views/view-user-dialog.client.view.html', '');

          // create mock Bot user
          mockUserDialog = new UserDialogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bot user Name'
          });

          //Initialize Controller
          UserDialogsController = $controller('UserDialogsController as vm', {
            $scope: $scope,
            userDialogResolve: mockUserDialog
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userDialogId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userDialogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userDialogId: 1
          })).toEqual('/user-dialogs/1');
        }));

        it('should attach an Bot user to the controller scope', function () {
          expect($scope.vm.userDialog._id).toBe(mockUserDialog._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/user-dialogs/client/views/view-user-dialog.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserDialogsController,
          mockUserDialog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('user-dialogs.create');
          $templateCache.put('modules/user-dialogs/client/views/form-user-dialog.client.view.html', '');

          // create mock Bot user
          mockUserDialog = new UserDialogsService();

          //Initialize Controller
          UserDialogsController = $controller('UserDialogsController as vm', {
            $scope: $scope,
            userDialogResolve: mockUserDialog
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userDialogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/user-dialogs/create');
        }));

        it('should attach an Bot user to the controller scope', function () {
          expect($scope.vm.userDialog._id).toBe(mockUserDialog._id);
          expect($scope.vm.userDialog._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/user-dialogs/client/views/form-user-dialog.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserDialogsController,
          mockUserDialog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('user-dialogs.edit');
          $templateCache.put('modules/user-dialogs/client/views/form-user-dialog.client.view.html', '');

          // create mock Bot user
          mockUserDialog = new UserDialogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bot user Name'
          });

          //Initialize Controller
          UserDialogsController = $controller('UserDialogsController as vm', {
            $scope: $scope,
            userDialogResolve: mockUserDialog
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userDialogId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userDialogResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userDialogId: 1
          })).toEqual('/user-dialogs/1/edit');
        }));

        it('should attach an Bot user to the controller scope', function () {
          expect($scope.vm.userDialog._id).toBe(mockUserDialog._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/user-dialogs/client/views/form-userDialog.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
