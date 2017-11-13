var user = require('../controllers/operation-users.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/operation/users/totalpage', user.findTotalPage);
    app.get('/api/:botId/operation/users', user.find);
    app.get('/api/:botId/operation/users/:_id', user.findOne);
};
