'use strict';
app.factory('cardsService', ['$http', function ($http) {
    var urlBase = 'http://localhost:65020/';
    var cardsService = {};
    var _getCards = function () {
        return $http.get(urlBase + 'api/Cards').then(function (results) {
            return results;
        });
    };

    var _getValue = function (id) {
        return $http.get(urlBase + 'api/Cards/' + id).then(function (results) {
            return results;
        });
    };
    cardsService.getCards = _getCards;
    cardsService.getValue = _getValue;
    return cardsService;
}]);