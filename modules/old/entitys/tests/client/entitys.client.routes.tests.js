(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      EntitysService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EntitysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EntitysService = _EntitysService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('entitys');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/entitys');
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
          EntitysController,
          mockEntity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('entitys.view');
          $templateCache.put('modules/entitys/client/views/view-entity.client.view.html', '');

          // create mock Custom action
          mockEntity = new EntitysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          EntitysController = $controller('EntitysController as vm', {
            $scope: $scope,
            entityResolve: mockEntity
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:entityId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.entityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            entityId: 1
          })).toEqual('/entitys/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.entity._id).toBe(mockEntity._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/entitys/client/views/view-entity.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EntitysController,
          mockEntity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('entitys.create');
          $templateCache.put('modules/entitys/client/views/form-entity.client.view.html', '');

          // create mock Custom action
          mockEntity = new EntitysService();

          //Initialize Controller
          EntitysController = $controller('EntitysController as vm', {
            $scope: $scope,
            entityResolve: mockEntity
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.entityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/entitys/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.entity._id).toBe(mockEntity._id);
          expect($scope.vm.entity._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/entitys/client/views/form-entity.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EntitysController,
          mockEntity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('entitys.edit');
          $templateCache.put('modules/entitys/client/views/form-entity.client.view.html', '');

          // create mock Custom action
          mockEntity = new EntitysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          EntitysController = $controller('EntitysController as vm', {
            $scope: $scope,
            entityResolve: mockEntity
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:entityId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.entityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            entityId: 1
          })).toEqual('/entitys/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.entity._id).toBe(mockEntity._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/entitys/client/views/form-entity.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
