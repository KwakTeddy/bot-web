(function (app) {
    'use strict';

    // Start by defining the main module and adding the module dependencies
    angular
        .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

    // Setting HTML5 Location Mode
    angular
        .module(app.applicationModuleName)
        .config(bootstrapConfig);

    bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider'];

    function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');

        // $httpProvider.interceptors.push('authInterceptor');

        // Disable debug data for production environment
        // @link https://docs.angularjs.org/guide/production
        $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
        $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
    }

    angular.module(app.applicationModuleName).run(function ($rootScope, $state, $cookies)
    {
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams)
        {
            //추후 여기서 현재 로그인한 유저의 롤과 toState의 롤을 체크해서 401로 넘기면 된다
        });

        // Record previous state
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams)
        {
            var state = fromState;
            var params = fromParams;

            // only store this state if it shouldn't be ignored
            if (!state.data || !state.data.ignoreState)
            {
                $state.previous = {
                    state: state,
                    params: params,
                    href: $state.href(state, params)
                };
            }
        });
    });

    // Then define the init function for starting up the application
    angular.element(document).ready(init);

    function init() {
        // Fixing facebook bug with redirect
        if (window.location.hash && window.location.hash === '#_=_') {
            if (window.history && history.pushState) {
                window.history.pushState('', document.title, window.location.pathname);
            } else {
                // Prevent scrolling by storing the page's current scroll offset
                var scroll = {
                    top: document.body.scrollTop,
                    left: document.body.scrollLeft
                };
                window.location.hash = '';
                // Restore the scroll offset, should be flicker free
                document.body.scrollTop = scroll.top;
                document.body.scrollLeft = scroll.left;
            }
        }

        // Then init the app
        angular.bootstrap(document, [app.applicationModuleName]);
    }
}(ApplicationConfiguration));
