angular.module('chatbot').factory('BotsService', ['$resource', function ($resource)
{
    return $resource('api/bots/:botId', { botId: '@_id' }, { update: { method: 'PUT' } });
}]);
