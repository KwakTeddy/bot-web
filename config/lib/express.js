'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var express = require('express');
var morgan = require('morgan');
var logger = require('./logger2');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
var compress = require('compression');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var flash = require('connect-flash');
var consolidate = require('consolidate');
var fs = require('fs');
var util = require('util');
var path = require('path');
require('./global-path.js')();

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app)
{
    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    if (config.secure && config.secure.ssl === true)
    {
        app.locals.secure = config.secure.ssl;
    }
    app.locals.keywords = config.app.keywords;
    app.locals.enterprise = config.enterprise;
    app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
    app.locals.facebookAppId = config.facebook.clientID;
    app.locals.kakaoJSID = config.kakao.clientJSID;
    app.locals.jsFiles = config.files.client.js;
    app.locals.cssFiles = config.files.client.css;
    app.locals.livereload = config.livereload;
    app.locals.logo = config.logo;
    app.locals.favicon = config.favicon;
    app.locals.env = process.env.NODE_ENV;
    app.locals.app_version = '';

    //if(process.env.NODE_ENV == 'production')
    //{
    //    var stats = fs.statSync("public/dist/application.min.js");
    //    var mtime = new Date(util.inspect(stats.mtime));
    //    app.locals.app_version = mtime.getTime() + "";
    //}
    app.all('*.php',function(req,res,next){
        res.status(500);
    });
    // Passing the request url to environment locals
    app.use(function (req, res, next)
    {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
    });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app)
{
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    // Should be placed before express.static
    app.use(compress({ filter: function (req, res) { return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type')); }, level: 9 }));

    // Initialize favicon middleware
    app.use(favicon(app.locals.favicon));

    // Enable logger (morgan)
    app.use(morgan(logger.getFormat(), logger.getOptions()));

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development')
    {
        // Disable views cache
        app.set('view cache', false);
    }
    else if (process.env.NODE_ENV === 'production')
    {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    app.use(flash());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app)
{
  // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db)
{
    // Express MongoDB session storage
    app.use(session(
    {
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie:
        {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        key: config.sessionKey,
        store: new MongoStore(
        {
            mongooseConnection: db.connection,
            collection: config.sessionCollection
        })
    }));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db)
{
    config.files.server.configs.forEach(function (configPath)
    {
        require(path.resolve(configPath))(app, db);
    });

    console.log();
    logger.systemInfo('============== Load Server Configuration - express.js ==============');
    logger.systemInfo(config.files.server.configs.toString().replace(/,/gi, '\n'));
    logger.systemInfo('=====================================================================');
};

/**
 * Configure Helmet headers configuration
 */

module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app)
{
    // app.use(function forceWWW(req, res, next)
    // {
    //     var host = req.header("host");
    //
    //     if (host == 'playchat.ai')
    //     {
    //         return res.redirect(301, 'https://www.' + host + req.path);
    //     }
    //     else
    //     {
    //         return next();
    //     }
    // });

     // Setting the app router and static folder
    app.use('/front', express.static(path.resolve('./modules/front')));
    app.use('/', express.static(path.resolve('./public')));

    // Globbing static routing

    config.folders.client.forEach(function (staticPath)
    {
        app.use(staticPath, express.static(path.resolve('./' + staticPath)));
    });

    console.log();
    logger.systemInfo('=========== Load Client Routing Configuration - express.js ==========');
    logger.systemInfo(config.folders.client.toString().replace(/,/gi, '\n'));
    logger.systemInfo('=====================================================================');
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app)
{
    // Globbing policy files
    config.files.server.policies.forEach(function (policyPath)
    {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });

    console.log();
    logger.systemInfo('================= Load Server Policies - express.js =================');
    logger.systemInfo(config.files.server.policies.toString().replace(/,/gi, '\n'));
    logger.systemInfo('=====================================================================');
};

/**
 * Configure the modules server routes
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports.initModulesServerRoutes = function (app)
{
    var Bot = mongoose.model('Bot');
    var BotAuth = mongoose.model('BotAuth');
    var Template = mongoose.model('Template');

    app.all('/api*', function(req, res, next)
    {
        if(req.url.startsWith('/api/auth/signin') || req.url.startsWith('/api/auth/signup') || req.url.startsWith('/api/auth/forgot') || req.url.startsWith('/api/auth/emailconfirm'))
        {
            next();
        }
        else
        {
            if(!req.user)
            {
                res.status(401).end();
            }
            else
            {
                var split = req.url.substring(1).split('/');
                if(split.length > 1)
                {
                    var botId = split[1];

                    var query = {};

                    if(/^[0-9a-fA-F]{24}$/gi.test(botId))
                        query._id = botId;
                    else
                        query.id = botId;

                    Template.findOne({ id:botId }).exec(function(err, item)
                    {
                        if(err)
                        {
                            console.error(err);
                            return res.status(400).send({ error: err});
                        }

                        if(item)
                        {
                            //템플릿아이디는 그냥 넘긴다.
                            next();
                        }
                        else
                        {
                            Bot.findOne(query).exec(function(err, item)
                            {
                                if(err)
                                {
                                    console.error(err);
                                    return res.status(400).send({ error: err});
                                }

                                if(item)
                                {
                                    BotAuth.findOne({ bot: item._id, user: req.user }).exec(function(err, botAuth)
                                    {
                                        if(err)
                                        {
                                            console.error(err);
                                            return res.status(400).send({ error: err});
                                        }

                                        if(botAuth)
                                        {
                                            if((req.method == 'GET' && !botAuth.read) || (req.method != 'GET' && !botAuth.edit))
                                            {
                                                res.status(401).end();
                                            }
                                            else
                                            {
                                                next();
                                            }
                                        }
                                        else
                                        {
                                            res.status(401).end();
                                        }
                                    });
                                }
                                else
                                {
                                    next();
                                }
                            });
                        }
                    });
                }
                else
                {
                    next();
                }
            }
        }
    });

    // Globbing routing files
    config.files.server.routes.forEach(function (routePath)
    {
        if(routePath.indexOf('core/server/routes/core.server.routes') == -1)
            require(path.resolve(routePath))(app);
    });

    require(path.resolve('modules/core/server/routes/core.server.routes.js'))(app);

    for(var i=0; i<app._router.stack.length; i++)
    {
        if(app._router.stack[i].route)
            console.log(app._router.stack[i].route.path);
    }

    logger.systemInfo('=============== Server Routes require modules - express.js ==========');
    logger.systemInfo(config.files.server.routes.toString().replace(/,/gi, '\n'));
    logger.systemInfo('=====================================================================');
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes
  this.initModulesClientRoutes(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};
