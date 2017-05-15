'use strict';

module.exports = {
  secure: {
    ssl: true,
    ca: './config/sslcerts/sub.class1.server.ca.pem',
    //ca: './config/sslcerts/ca.pem',
    privateKey: './config/sslcerts/ssl.key',
    certificate: './config/sslcerts/ssl.crt'
  },
  host: process.env.HOST || 'https://localhost',
  port: process.env.PORT || 443,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/bot',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    level: process.env.LOG_LEVEL || 'debug',

    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
        fileName: process.env.LOG_FILE || 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs 
          fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
          verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false
        }
      }
    }
  },

  facebook: {
      // clientID: process.env.FACEBOOK_ID || '240853479709635',
      // clientSecret: process.env.FACEBOOK_SECRET || '085c64a8566fefe3833ed3d983623a10',
      clientID: process.env.FACEBOOK_ID || '1557169960967403',
      clientSecret: process.env.FACEBOOK_SECRET || '282b2a30ec8115f364833a5d48b60cf6',
      callbackURL: '/api/auth/facebook/callback'
  },
  kakao: {
      clientID: process.env.KAKAO_KEY || '25009b49de426e1ad0b8da2631b52cc5',
      callbackURL: '/api/auth/kakao/callback',
      clientJSID: 'f1eb73f3491e5c1e1178b3b8c12b10e5'
  },
  google: {
      clientID: process.env.GOOGLE_ID || '567723322080-pofpo61olppueufq2r57j2cufgb65tg3.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET || 'cM_Rcn6dxCNeipINWI8K2QG7',
      callbackURL: '/api/auth/google/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  // mailer: {
  //     from: process.env.MAILER_FROM || 'PlayChat',
  //     options: {
  //         host: 'smtp.cafe24.com',
  //         port: 587,
  //         auth: {
  //             user: process.env.MAILER_EMAIL_ID || 'info@moneybrain1.cafe24.com',
  //             pass: process.env.MAILER_PASSWORD || 'Make01mb!'
  //         }
  //     }
  // },
  mailer: {
      from: process.env.MAILER_FROM || 'PlayChat',
      options: {
          service: process.env.MAILER_SERVICE_PROVIDER || 'GMAIL',
          auth: {
              user: process.env.MAILER_EMAIL_ID || 'playchatai@gmail.com',
              pass: process.env.MAILER_PASSWORD || 'Make01mb!'
          }
      }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['enterprise', 'user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'enterprise', 'admin']
      }
    }
  },
};
