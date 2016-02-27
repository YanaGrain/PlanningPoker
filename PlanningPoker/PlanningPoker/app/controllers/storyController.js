app.controller('storyController', function ($scope, cardsService, authService, $http, localStorageService, choicesService, usersService, roomsService, $location, storiesService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.name = authService.authentication.userName;    
    $scope.cards = [];    
    $scope.stories = [];
    $scope.admin = {};
    $scope.roomUsers = [];
    $scope.currentStory = {};
    $scope.done = false;

    $scope.newChoice = {
        UserId: "",
        StoryId: 0,
        CardId: 0,        
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

   var getRoomUsers = function () {
        usersService.getRoomUsers($scope.currentRoom.roomId).then(function (results) {
            $scope.roomUsers = results.data;            
            debugger;
            angular.forEach($scope.roomUsers, function (user, id) {
                angular.forEach($scope.choices, function (choice, id) {
                    if (user.id == choice.userId) {
                        user.ready = true;                        
                    }
                    if (user.id == choice.userId && user.userName == $scope.name) {
                        $scope.done = true;
                    }
                });
            });
        });        
   }

   var getStoryChoices = function () {
       storiesService.getCurrentStory($scope.currentRoom.roomId).then(function (result) {
           $scope.currentStory = result.data;
           choicesService.getChoices($scope.currentStory.id).then(function (results) {
               debugger;
               $scope.choices = results.data;
               debugger;
               getRoomUsers();
           });
       });
   }
    getStoryChoices();
    

    //get all cards
    cardsService.getCards().then(function (results) {
        $scope.cards = results.data;
    }, function (error) {
        alert(error.data.message);
    });

    //cardChosen Action
    

    //signalR
    $scope.addedChoice = {}; // holds the new user  
    var connection = $.hubConnection(); // initializes hub
    var pokerHubProxy = connection.createHubProxy('pokerHub');
    
    pokerHubProxy.on('showNewChoice', function (choiceId, userId, cardId, storyId) {
        debugger;
        $scope.addedChoice.Id = choiceId;
        $scope.addedChoice.UserId = userId;
        $scope.addedChoice.CardId = cardId;
        $scope.addedChoice.StoryId = storyId;
        debugger;
        $scope.choices.push($scope.addedChoice);
        getStoryChoices();
        $scope.addedChoice = {};
        debugger;
        $scope.$apply();
    });

    connection.start().done(function () {
        $scope.cardChosen = function () {
            if ($scope.done) {
                alert("You already chose a card!");
            } else {
                choicesService.createChoice($scope.newChoice).then(function (result) {
                    pokerHubProxy.invoke('addStoryChoice', result.data);
                    debugger;
                    $scope.done = true;
                    alert("Done!");
                    getStoryChoices();
                });
            }
        }
    })
    
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