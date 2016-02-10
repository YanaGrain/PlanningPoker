'use strict';
app.controller('cardsController', ['$scope', 'cardsService', function ($scope, cardsService) {

    $scope.cards = [];

    cardsService.getOrders().then(function (results) {

        $scope.cards = results.data;

    }, function (error) {
        //alert(error.data.message);
    });

}]);