'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-select/dist/select.css'
      ],
      js: [
        'public/lib/ionic/js/ionic.bundle.js',
        'public/lib/angular-datatables/dist/angular-datatables.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/codemirror/lib/codemirror.js',
        'public/lib/codemirror/mode/javascript/javascript.js',
        'public/lib/angular-ui-codemirror/ui-codemirror.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/dropzone/downloads/dropzone.js',
        'public/lib/angular-dropzone/lib/angular-dropzone.js',
        'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'public/lib/angular-dropzone/lib/angular-dropzone.js',
        'public/lib/d3/d3.min.js',
        'public/lib/d3-tip/index.js',
        'public/js/jsoneditor/dist/jsoneditor.js',
        'public/js/jsoneditor.js',
        'public/lib/jstree/dist/jstree.js',
        'public/lib/pnotify/dist/pnotify.js',
        'public/lib/angular-pnotify/src/angular-pnotify.js',
        'public/lib/ment.io/dist/mentio.js',
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css',
      'public/lib/codemirror/lib/codemirror.css',
      'public/lib/dropzone/downloads/css/dropzone.css',
      'public/lib/angular-ui-select/dist/select.css',
      'public/lib/pnotify/dist/pnotify.css',

    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*client*.js',
      'modules/*/client/**/*client*.js',
      'modules/*/client/*admin*.js',
      'modules/*/client/**/*admin*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  mobile: {
    lib: {
      css: [
        'public/lib/ionic/css/ionic.app.css'
      ],
      js: [
        'public/lib/ionic/js/ionic.bundle.js',
        'public/lib/ngCordova/dist/ng-cordova.min.js',
        'public/lib/angular-resource/angular-resource.js',
        //'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.js',

        // 'public/lib/angular-file-upload/angular-file-upload.js',
        // 'public/lib/ng-file-upload/ng-file-upload-shim.js',
        // 'public/lib/ng-file-upload/ng-file-upload.js',

        // 'http://dmaps.daum.net/map_js_init/postcode.v2.js',
        // 'https://www.youtube.com/iframe_api',
        // 'https://developers.kakao.com/sdk/js/kakao.min.js',
        // 'public/lib/angular-update-meta/dist/update-meta.min.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/mobile/css/*.css',
      'public/css/custom_mobile.css'
    ],
    less: [
      'modules/*/mobile/less/*.less'
    ],
    sass: [
      'modules/*/mobile/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/config/*mobile*.js',
      'modules/*/client/constants/*.js',
      'modules/*/client/controllers/*.js',
      'modules/*/client/services/*.js',
      'modules/*/client/directives/*.js',
      'modules/*/client/*/*/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/mobile/views/**/*mobile*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
