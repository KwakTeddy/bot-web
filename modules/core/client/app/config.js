'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';

  var applicationModuleVendorDependencies;

  if(_platform == 'mobile') {
    applicationModuleVendorDependencies = ['ng', 'ngResource', 'ngAnimate', 'ngMessages', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ui.bootstrap.modal', 'ui.utils', 'ionic'];
  } else {
    applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'datatables', 'ui.codemirror', 'ui.select', 'ngSanitize', 'ngDropzone', 'jlareau.pnotify'];
  }

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
