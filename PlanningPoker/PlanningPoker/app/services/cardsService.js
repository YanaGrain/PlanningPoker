'use strict';
app.factory('cardsService', ['$http', function ($http) {

    var serviceBase = 'http://localhost:65020/';
    var cardsServiceFactory = {};

    var _getCards = function () {

        return $http.get(serviceBase + 'api/cards').then(function (results) {
            return results;
        });
    };

    cardsServiceFactory.getCards = _getCards;

    return cardsServiceFactory;

}]);