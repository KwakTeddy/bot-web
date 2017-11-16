'use strict';

/**
 * Module dependencies
 */
var facts = require('../controllers/knowledge-graph.server.controller.js');

module.exports = function(app) {
    app.route('/api/facts')//all(factsPolicy.isAllowed)
       .get(facts.list)
       .post(facts.create);

    app.route('/api/facts/:factId')//all(factsPolicy.isAllowed)
       .get(facts.read)
       .put(facts.update)
       .delete(facts.delete);

    app.param('factId', facts.factByID);

    app.route('/api/factAtoms')//all(factsPolicy.isAllowed)
       .get(facts.list)
       .post(facts.create);

    app.route('/api/factAtoms/:factAtomId')//all(factsPolicy.isAllowed)
       .get(facts.read)
       .put(facts.update)
       .delete(facts.delete);

    app.param('factAtomId', facts.factAtomByID);


    app.route('/api/factLinks')//all(factsPolicy.isAllowed)
       .get(facts.list)
       .post(facts.create);

    app.route('/api/factLinks/find/:factBotUserId')//all(factsPolicy.isAllowed)
       .get(facts.find);

    app.route('/api/factLinks/findByBotId/:bot_id')//all(factsPolicy.isAllowed)
       .get(facts.findByBotId);

    app.route('/api/factLinks/:factLinkId')//all(factsPolicy.isAllowed)
       .get(facts.read)
       .put(facts.update)
       .delete(facts.delete);

    app.param('factLinkId', facts.factLinkByID);
};
