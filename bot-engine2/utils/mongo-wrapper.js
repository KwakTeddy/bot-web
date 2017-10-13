var mongoose = require('mongoose');

module.exports.model = function(name, schema)
{
    if(mongoose.models[name])
        return mongoose.model(name);
    else
        return mongoose.model(name, schema);
};
