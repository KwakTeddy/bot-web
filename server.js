'use strict';

/**
 * Module dependencies.
 */

var app = require('./config/lib/app');
var server = app.start();

//TODO 임시 카카오 ssl 오류 해결시 까지 http로 접속
var app2 = require('./config/lib/app2');
// app2.start();
