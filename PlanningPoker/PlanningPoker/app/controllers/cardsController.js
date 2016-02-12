'use strict';
app.controller('cardsController', ['$scope', 'cardsService', function ($scope, cardsService) {
    $scope.message = 'All cards are here';
    $scope.cards = [];

    cardsService.getCards().then(function (results) {
        $scope.cards = results.data;
    }, function (error) {
        alert(error.data.message);
    });

}]);