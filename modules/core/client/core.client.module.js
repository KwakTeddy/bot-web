'use strict';

// Use Applicaion configuration module to register a new module
if(_platform == 'mobile')
  ApplicationConfiguration.registerModule('core', ['ionic', 'messengers']);
else
  ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);
