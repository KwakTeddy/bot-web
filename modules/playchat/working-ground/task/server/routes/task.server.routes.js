var tasks = require('../controllers/tasks.server.controller');

module.exports = function(app)
{
    // app.get('/api/:botId/tasks/totalpage', tasks.findTotalPage);
    // app.get('/api/:botId/tasks', tasks.find);
    app.get('/api/:botId/taskfiles', tasks.findTaskFiles);
    app.get('/api/:botId/tasks', tasks.findTasks);
    app.get('/api/:botId/types', tasks.findTypes);
    app.get('/api/:botId/tasks/:fileName/:taskName', tasks.readTask);
    app.post('/api/:botId/tasks/:fileName', tasks.saveTaskToFile);
    app.post('/api/:botId/types/:fileName', tasks.saveTaskToFile);

    // app.post('/api/:botId/tasks', tasks.create);
    // app.put('/api/:botId/tasks', tasks.update);
    // app.delete('/api/:botId/tasks/:taskId', tasks.delete);
};
