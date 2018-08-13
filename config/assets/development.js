'use strict';

module.exports = {
    client: {
        css: [
            'modules/core/client/css/*.css',
            'modules/authentication/client/css/*.css',
            'modules/chatbots/client/css/*.css',
            'modules/playchat/core/layout/client/css/layout.css',
            'modules/playchat/core/layout/client/css/styleCustom.css',
            'modules/playchat/core/layout/client/css/common.css',
            'modules/playchat/core/layout/client/css/component.css',
            'modules/playchat/gnb/client/css/gnb.css',
            'modules/playchat/top-bar/client/css/top-bar.css',
            'modules/playchat/simulator/client/css/simulator.css',
            'modules/playchat/log-analysis/client/css/log-analysis.css',
            'modules/playchat/working-ground/common/client/css/working-ground-common.css',
            'modules/playchat/working-ground/!(common)/client/css/*.css'
        ],
        js: [
            'modules/core/client/config/config.js',
            'modules/core/client/config/init.js',
            'modules/core/client/config/modules.js',
            'modules/core/client/services/interceptors/auth.interceptor.client.service.js',
            'modules/*/client/services/*service.js',
            'modules/core/client/controllers/title.client.controller.js',
            'modules/core/client/controllers/main.client.controller.js',
            'modules/core/client/controllers/header.client.controller.js',
            'modules/core/client/config/core.client.routes.js',
            'modules/!(core)/client/*/*.js',
            'modules/playchat/core/layout/client/controllers/playchat.client.controller.js',
            'modules/playchat/core/layout/client/controllers/layout.client.controller.js',
            'modules/playchat/core/layout/client/services/layout.client.service.js',
            'modules/playchat/core/layout/client/services/menu.client.service.js',
            'modules/playchat/core/layout/client/config/layout.routes.js',
            'modules/playchat/!(core)/client/controllers/*.js',
            'modules/playchat/working-ground/*/client/*/*.js',
            'templates/*/client/controllers/*.js'
        ]
    }
};
