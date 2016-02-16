app.controller('roomController', function ($scope, cardsService, authService, $http, $location) {
    var serviceBase = 'http://localhost:65020/';
    $scope.name = authService.authentication.userName;
    $scope.data = { visible: false }
    $scope.cards = [];
    $scope.newChoice = {
        UserId: "",
        RoomId: 0,
        CardId: 0
    };
    cardsService.getCards().then(function (results) {
        $scope.cards = results.data;
    }, function (error) {
        alert(error.data.message);
    });
   $scope.cardChosen = function() {
       $http.get(serviceBase + "api/account/" + this.name).success(function(result) {
           $scope.newChoice.UserId = result;
       });
       alert($scope.newChoice.UserId);
   }

   $scope.message = ''; // holds the new message
   $scope.messages = []; // collection of messages coming from server
   $scope.pokerHub = null; // holds the reference to hub

   $scope.pokerHub = $.connection.pokerHub; // initializes hub
   $.connection.hub.start(); // starts hub

    // register a client method on hub to be invoked by the server
   $scope.pokerHub.client.broadcastMessage = function (name, message) {
       var newMessage = name + ' : ' + message;

       // push the newly coming message to the collection of messages
       $scope.messages.push(newMessage);
       $scope.$apply();
   };

   $scope.newMessage = function () {
       // sends a new message to the server
       $scope.pokerHub.server.sendMessage($scope.name, $scope.message);

       $scope.message = '';
   }

   /*$scope.cardMsg = function () {
       // sends a new message to the server
       $scope.pokerHub.server.sendMessage($scope.name, "chose a card");
       $scope.message = '';
   }*/


});