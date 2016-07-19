(function () {
  'use strict';

  describe('Custom actions Route Tests', function () {
    // Initialize global variables
    var $scope,
      DictsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DictsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DictsService = _DictsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('dicts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/dicts');
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
          DictsController,
          mockDict;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('dicts.view');
          $templateCache.put('modules/dicts/client/views/view-dict.client.view.html', '');

          // create mock Custom action
          mockDict = new DictsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          DictsController = $controller('DictsController as vm', {
            $scope: $scope,
            dictResolve: mockDict
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:dictId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.dictResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            dictId: 1
          })).toEqual('/dicts/1');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.dict._id).toBe(mockDict._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/dicts/client/views/view-dict.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DictsController,
          mockDict;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('dicts.create');
          $templateCache.put('modules/dicts/client/views/form-dict.client.view.html', '');

          // create mock Custom action
          mockDict = new DictsService();

          //Initialize Controller
          DictsController = $controller('DictsController as vm', {
            $scope: $scope,
            dictResolve: mockDict
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.dictResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/dicts/create');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.dict._id).toBe(mockDict._id);
          expect($scope.vm.dict._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/dicts/client/views/form-dict.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DictsController,
          mockDict;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('dicts.edit');
          $templateCache.put('modules/dicts/client/views/form-dict.client.view.html', '');

          // create mock Custom action
          mockDict = new DictsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Custom action Name'
          });

          //Initialize Controller
          DictsController = $controller('DictsController as vm', {
            $scope: $scope,
            dictResolve: mockDict
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:dictId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.dictResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            dictId: 1
          })).toEqual('/dicts/1/edit');
        }));

        it('should attach an Custom action to the controller scope', function () {
          expect($scope.vm.dict._id).toBe(mockDict._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/dicts/client/views/form-dict.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
