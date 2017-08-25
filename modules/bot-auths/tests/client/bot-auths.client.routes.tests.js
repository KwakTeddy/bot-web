(function () {
  'use strict';

  describe('Bot auths Route Tests', function () {
    // Initialize global variables
    var $scope,
      BotAuthsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BotAuthsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BotAuthsService = _BotAuthsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('bot-auths');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/bot-auths');
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
          BotAuthsController,
          mockBotAuth;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('bot-auths.view');
          $templateCache.put('modules/bot-auths/client/views/view-bot-auth.client.view.html', '');

          // create mock Bot auth
          mockBotAuth = new BotAuthsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bot auth Name'
          });

          // Initialize Controller
          BotAuthsController = $controller('BotAuthsController as vm', {
            $scope: $scope,
            botAuthResolve: mockBotAuth
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:botAuthId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.botAuthResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            botAuthId: 1
          })).toEqual('/bot-auths/1');
        }));

        it('should attach an Bot auth to the controller scope', function () {
          expect($scope.vm.botAuth._id).toBe(mockBotAuth._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/bot-auths/client/views/view-bot-auth.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BotAuthsController,
          mockBotAuth;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('bot-auths.create');
          $templateCache.put('modules/bot-auths/client/views/form-bot-auth.client.view.html', '');

          // create mock Bot auth
          mockBotAuth = new BotAuthsService();

          // Initialize Controller
          BotAuthsController = $controller('BotAuthsController as vm', {
            $scope: $scope,
            botAuthResolve: mockBotAuth
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.botAuthResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/bot-auths/create');
        }));

        it('should attach an Bot auth to the controller scope', function () {
          expect($scope.vm.botAuth._id).toBe(mockBotAuth._id);
          expect($scope.vm.botAuth._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/bot-auths/client/views/form-bot-auth.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BotAuthsController,
          mockBotAuth;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('bot-auths.edit');
          $templateCache.put('modules/bot-auths/client/views/form-bot-auth.client.view.html', '');

          // create mock Bot auth
          mockBotAuth = new BotAuthsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bot auth Name'
          });

          // Initialize Controller
          BotAuthsController = $controller('BotAuthsController as vm', {
            $scope: $scope,
            botAuthResolve: mockBotAuth
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:botAuthId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.botAuthResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            botAuthId: 1
          })).toEqual('/bot-auths/1/edit');
        }));

        it('should attach an Bot auth to the controller scope', function () {
          expect($scope.vm.botAuth._id).toBe(mockBotAuth._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/bot-auths/client/views/form-botAuth.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
