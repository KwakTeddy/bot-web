var tasks = require('../controllers/tasks.server.controller');

module.exports = function(app)
{
    app.get('/api/:botId/tasks/totalpage', tasks.findTotalPage);
    app.get('/api/:botId/tasks', tasks.find);
    // app.post('/api/:botId/tasks', tasks.create);
    // app.put('/api/:botId/tasks', tasks.update);
    // app.delete('/api/:botId/tasks/:taskId', tasks.delete);
};
