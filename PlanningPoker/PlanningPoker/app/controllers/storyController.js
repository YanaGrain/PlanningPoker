app.controller('storyController', function ($scope, cardsService, authService, $http, localStorageService, choicesService, usersService, roomsService, $location, storiesService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.name = authService.authentication.userName;    
    $scope.cards = [];    
    $scope.stories = [];
    $scope.admin = {};
    $scope.roomUsers = [];
    $scope.currentStory = {};

    $scope.newChoice = {
        UserId: "",
        StoryId: 0,
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
    };

    var getStoryChoices = function () {
        storiesService.getCurrentStory($scope.currentRoom.roomId).then(function (result) {
            $scope.currentStory = result.data;
            choicesService.getChoices($scope.currentStory.id).then(function (results) {
                $scope.choices = results.data;
                debugger;
            });
        });
    }
    getStoryChoices();

    var getRoomUsers = function () {
        usersService.getRoomUsers($scope.currentRoom.roomId).then(function (results) {
            $scope.roomUsers = results.data;
            debugger;
            angular.forEach($scope.roomUsers, function (user, id) {
                angular.forEach($scope.choices, function (choice, id) {
                    if (user.id == choice.userId) {
                        user.ready = true;
                    }
                });
            });
        });        
    }
    getRoomUsers();

    //get all cards
    cardsService.getCards().then(function (results) {
        $scope.cards = results.data;
    }, function (error) {
        alert(error.data.message);
    });

    //cardChosen Action
    $scope.cardChosen = function () {        
        //if ($scope.newChoice.CardId) {
        //    alert("You already chose a card!");
        //} else {
            choicesService.createChoice($scope.newChoice).then(function (result) {
                alert("Done!");
            });
        }
    

    //signalR
    $scope.message = ''; // holds the new message
    $scope.messages = []; // collection of messages coming from server
    //$scope.pokerHub = null; // holds the reference to hub

    var hub = $.connection.pokerHub; // initializes hub
    $.connection.hub.start(); // starts hub

    // register a client method on hub to be invoked by the server
    hub.client.broadcastMessage = function (name, message) {
        var newMessage = name + ' : ' + message;

        // push the newly coming message to the collection of messages
        $scope.messages.push(newMessage);
        $scope.$apply();
    };

    $scope.newMessage = function () {
        // sends a new message to the server
       hub.server.sendMessage($scope.name, $scope.message);
        $scope.message = '';
    }

    
    var getStories = function () {
        storiesService.getStories($scope.currentRoom.roomId).then(function (results) {
            $scope.stories = results.data;
            debugger;
        });
    }
    getStories();
    

    var getAdmin = function () {
        usersService.getAdmin($scope.currentRoom.roomId).then(function (results) {
            $scope.admin = results.data;
            debugger;
        });
    }
    getAdmin();

    var getUserLink = function () {
        usersService.getUserId($scope.name).then(function (result) {
            $scope.UserId = result.data.id;
            usersService.getLink(result.data.id, $scope.currentRoom.roomId).then(function (link) {
                $scope.userLink = link.data;
            })
        });

    }
    getUserLink();

    $scope.toRoom = function () {
        $location.path('room/' + $scope.currentRoom.id)
    }

    $scope.selectCard = function (id) {
        if ($scope.activeClass == id) {
            $scope.activeClass = null;
            $scope.newChoice = {};
        }
        else {
            $scope.activeClass = id;
            $scope.newChoice.StoryId = $scope.currentStory.id;
            $scope.newChoice.UserId = $scope.UserId;
            $scope.newChoice.CardId = id;
        }
             
    };

});