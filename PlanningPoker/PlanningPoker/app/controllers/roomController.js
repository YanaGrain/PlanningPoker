app.controller('roomController',  function ($scope, cardsService, authService) {
    $scope.userName = authService.authentication.userName;
    $scope.data = { visible: false }
    $scope.cards = [];
    cardsService.getCards().then(function (results) {
        $scope.cards = results.data;
    }, function (error) {
        alert(error.data.message);
    });
   $scope.cardChosen = function() {
       $scope.data = { visible: true }
   }

});