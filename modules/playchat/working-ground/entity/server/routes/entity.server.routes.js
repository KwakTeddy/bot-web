var entity = require('../controllers/entity.server.controller.js');

module.exports = function(app)
{
    app.get('/api/:botId/entitys/totalpage', entity.findTotalPage);
    app.get('/api/:botId/entitys', entity.find);
    app.post('/api/:botId/entitys', entity.create);
    app.put('/api/:botId/entitys', entity.update);
    app.delete('/api/:botId/entitys/:entityId', entity.delete);

    app.get('/api/:botId/entitys/:entityId/contents', entity.findEntityContents);
};
