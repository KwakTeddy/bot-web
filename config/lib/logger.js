var chalk = require('chalk');

var logger =
{
    verbose: function(text) {console.log(text);},
    info: function(text) {console.log(text);},
    debug: function(text) {console.log(text);},
    error: function(text) {console.error(text);},
    systemInfo: function()
    {
        if(process.env.NODE_ENV == 'development')
        {
            console.log(chalk.blue.apply(null, arguments));
        }
    },
    systemLog: function()
    {
        if(process.env.NODE_ENV == 'development')
        {
            console.log(chalk.magenta.apply(null, arguments));
        }
    },
    systemError: function()
    {
        if(process.env.NODE_ENV == 'development')
        {
            console.log(chalk.red.apply(null, arguments));
        }
    }
};

module.exports = logger;

