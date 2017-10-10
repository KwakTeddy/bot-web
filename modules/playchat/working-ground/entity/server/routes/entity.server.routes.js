var entity = require('../controllers/entity.server.controller.js');

module.exports = function(app)
{
    app.get('/api/entitys/:botId/totalpage', entity.findTotalPage);
    app.get('/api/entitys/:botId', entity.find);
    app.get('/api/entitys/:botId/:_id', entity.findOne);
    app.post('/api/entitys/:botId', entity.create);
    app.put('/api/entitys/:botId', entity.update);
    app.delete('/api/entitys/:botId', entity.delete);
};
