'use strict';
app.factory('cardsService', ['$http', function ($http) {
    var urlBase = 'http://localhost:65020/';
    var cardsService = {};
    var _getCards = function () {
        return $http.get(urlBase + 'api/Cards').then(function (results) {
            return results;
        });
    };
    cardsService.getCards = _getCards;
    return cardsService;
}]);