'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
    secure: {
        ssl: true,
        ca: './config/sslcerts_moneybrain/ChainCA/rsa-dv.chain-bundle.pem',
        privateKey: './config/sslcerts_moneybrain/ssl.key',
        certificate: './config/sslcerts_moneybrain/ssl.crt'
    },
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/bot-dev',
    options: {
      user: '',
      pass: '',
      db: {
        readPreference: "secondaryPreferred"
      },
      replset: {
        rs_name: 'rs0',
        debug: false
      }
    },
    debug: process.env.MONGODB_DEBUG || false
  },
    templatesdb: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/templates-dev',
        options: {
            user: '',
            pass: '',
            db: {
                readPreference: "secondaryPreferred"
            },
            replset: {
                rs_name: 'rs0',
                debug: false
            }
        },
        debug: process.env.MONGODB_DEBUG || false
    },
  redis: {
    host: process.env.REDIS ||  '127.0.0.1',
    port: 6379
  },
  loadBalance: {
    use: process.env.LB_USE == "true" || false,
    isMaster: process.env.LB_MASTER == "true"|| false,
    isSlave: process.env.LB_SLAVE == "true" || false
  },
  host: process.env.HOST || 'http://localhost',
  log: {
    level: process.env.LOG_LEVEL || 'debug',

    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    options: {
      skip: function(req, res) {
        return res.statusCode < 400;
      }
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      //stream: {
      //  directoryPath: process.cwd(),
      //  fileName: 'access.log',
      //  rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
      //    active: false, // activate to use rotating logs
      //    fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
      //    frequency: 'daily',
      //    verbose: false
      //  }
      //}
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment',
  },
  facebook: {
      clientID: process.env.FACEBOOK_ID || '299548697231251',
      clientSecret: process.env.FACEBOOK_SECRET || 'f4f156d25ec93050376af77967ed500e',
      callbackURL: '/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/auth/twitter/callback'
  },
  kakao: {
      clientID: process.env.KAKAO_KEY || '14d5a3ad7584cf6cf2bee86dc6f34935',
      clientJSID: process.env.KAKAO_JSID || 'ca71056a613942b6ebcf53801a7abb65',
      callbackURL: '/auth/kakao/callback'
  },
  google: {
      clientID: process.env.GOOGLE_ID || '567723322080-pofpo61olppueufq2r57j2cufgb65tg3.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET || 'cM_Rcn6dxCNeipINWI8K2QG7',
      callbackURL: '/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/auth/paypal/callback',
    sandbox: true
  },
  // mailer: {
  //   from: process.env.MAILER_FROM || 'PlayChat',
  //   options: {
  //       host: 'smtp.cafe24.com',
  //       port: 465,
  //       secure: true,
  //       auth: {
  //           user: process.env.MAILER_EMAIL_ID || 'info@moneybrain1.cafe24.com',
  //           pass: process.env.MAILER_PASSWORD || 'Make01mb!'
  //       }
  //   }
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
  livereload: false,
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
  }
};
