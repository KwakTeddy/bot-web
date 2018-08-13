'use strict';

module.exports =
{
    app:
    {
        title: 'PlayChat',
        description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
    },
    port: process.env.PORT || 8443,
    templateEngine: 'swig',
    // Session Cookie settings
    sessionCookie:
    {
        // session expiration is set by default to 24 hours
        maxAge: null,
        // maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    // sessionKey is set to the generic sessionId key used by PHP applications
    // for obsecurity reasons
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    logo: 'public/images/' + process.env.ENTERPRISE + '.png',
    favicon: process.env.ENTERPRISEFAVICON || 'modules/core/client/img/brand/playchat_favicon3.ico',
    uploads:
    {
        profileUpload:
        {
            dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
            limits:
            {
                fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
            }
        },
        dialogUpload:
        {
            dest: './custom_modules/private_bot/_data/ko/kakao/',
            limits:
            {
                fileSize: 100*1024*1024 // Max file size in bytes (1 MB)
            }
        }
    },
    enterprise:
    {
        logo: process.env.ENTERPRISE ? '/images/' + process.env.ENTERPRISE + '.png' : undefined,
        name: process.env.ENTERPRISE || 'moneybrain',
        title: process.env.ENTERPRISETITLE || 'PlayChat'
    },
    chatServer: '../bot-server/',
    callcenter: '15777314'
};
