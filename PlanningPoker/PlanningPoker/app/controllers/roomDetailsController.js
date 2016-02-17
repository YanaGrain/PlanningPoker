app.controller('roomDetailsController', function ($scope, cardsService, authService, $http, localStorageService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.name = authService.authentication.userName;
    $scope.data = { visible: false }
    $scope.cards = [];
    $scope.newChoice = {
        UserId: "",
        RoomId: "",
        CardId: 0
    };

    $scope.currentRoom = {
        roomName: "",
        roomDescription: "",
        roomId: 0
    };

    var roomData = localStorageService.get('roomData');
    if (roomData) {
        $scope.currentRoom.roomName = roomData.roomName;
        $scope.currentRoom.roomDescription = roomData.roomDescription;
        $scope.currentRoom.roomId = roomData.roomId;
        //alert($scope.currentRoom.roomId);
    };

    //get all cards
    cardsService.getCards().then(function (results) {
        $scope.cards = results.data;
    }, function (error) {
        alert(error.data.message);
    });

    //cardChosen Action
    $scope.cardChosen = function (id) {
        $http.get(serviceBase + "api/account/" + this.name).success(function (result) {
            $scope.newChoice.UserId = result;
        });
        $scope.newChoice.CardId = id;
        $scope.newChoice.RoomId = $scope.currentRoom.roomId;
        //alert("UserId: " + $scope.newChoice.UserId + " CardId: " + $scope.newChoice.CardId + " RoomId: " + $scope.newChoice.RoomId);
        $scope.pokerHub.server.sendMessage($scope.name, "chose a card");
        $scope.message = '';
    }

    //signalR
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

});