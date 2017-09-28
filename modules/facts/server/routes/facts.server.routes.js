'use strict';

/**
 * Module dependencies
 */
var factsPolicy = require('../policies/facts.server.policy'),
  facts = require('../controllers/facts.server.controller'),
  factAtoms = require('../controllers/fact-atoms.server.controller'),
  factLinks = require('../controllers/fact-links.server.controller');

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
    .get(factAtoms.list)
    .post(factAtoms.create);

  app.route('/api/factAtoms/:factAtomId')//all(factsPolicy.isAllowed)
    .get(factAtoms.read)
    .put(factAtoms.update)
    .delete(factAtoms.delete);

  app.param('factAtomId', factAtoms.factAtomByID);


  app.route('/api/factLinks')//all(factsPolicy.isAllowed)
    .get(factLinks.list)
    .post(factLinks.create);

  app.route('/api/factLinks/find/:factBotUserId')//all(factsPolicy.isAllowed)
    .get(factLinks.find);

  app.route('/api/factLinks/findByBotId/:bot_id')//all(factsPolicy.isAllowed)
    .get(factLinks.findByBotId);

  app.route('/api/factLinks/:factLinkId')//all(factsPolicy.isAllowed)
    .get(factLinks.read)
    .put(factLinks.update)
    .delete(factLinks.delete);

  app.param('factLinkId', factLinks.factLinkByID);
};
