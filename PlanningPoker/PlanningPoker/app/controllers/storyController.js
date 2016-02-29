app.controller('storyController', function ($scope, cardsService, authService, $http, localStorageService, choicesService, usersService, roomsService, $location, storiesService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.name = authService.authentication.userName;    
    $scope.cards = [];    
    $scope.stories = [];
    $scope.admin = {};
    $scope.roomUsers = [];
    $scope.currentStory = {};
    $scope.done = false;
    $scope.showCard = false;
    $scope.cardsShown = false;
    $scope.minValue = 100;
    $scope.maxValue = 0;

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
            if ($scope.roomUsers.length == $scope.choices.length) {
                debugger;
                //$scope.currentStory.isEstimated = true;
                $scope.showCard = true;
                debugger;
                
            }
            debugger;
            angular.forEach($scope.roomUsers, function (user, id) {
                angular.forEach($scope.choices, function (choice, id) {
                    if (user.id == choice.userId) {
                        user.ready = true;
                        user.value = choice.value;
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
           debugger;
           choicesService.getChoices($scope.currentStory.id).then(function (results) {
               debugger;
               $scope.choices = results.data;
               angular.forEach($scope.choices, function (choice, id) {
                   cardsService.getValue(choice.cardId).then(function (result) {
                       choice.value = result.data.value;
                       if (choice.value < $scope.minValue) {
                           $scope.minValue = choice.value;
                       }
                       if (choice.value > $scope.maxValue) {
                           $scope.maxValue = choice.value;
                       }
                   });

               });
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

        

    //signalR
    $scope.addedChoice = {}; // holds the new user  
    $scope.message = ''; // holds the new message
    $scope.points = 0;
    $scope.messages = []; // collection of messages coming from server
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

    pokerHubProxy.on('broadcastMessage', function (name, message) {
        var newMessage = name + ' : ' + message;
        // push the newly coming message to the collection of messages
        $scope.messages.push(newMessage);
        $scope.$apply();
    });

    pokerHubProxy.on('showCards', function () {
        //$scope.showCard = false;
        $scope.currentStory.isEstimated = true;
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
                    //alert("Done!");
                    getStoryChoices();
                });
            }
        }

        $scope.showCards = function () {
            $scope.showCard = false;
            //$scope.cardsShown = true;
            $scope.currentStory.isEstimated = true;
            storiesService.estimateStory($scope.currentStory.id, $scope.currentStory).then(function (result) {
                //alert("Room is Estimated!");
            });
            pokerHubProxy.invoke('showStoryCards');
            
        }

        $scope.newMessage = function () {
            // sends a new message to the server
            pokerHubProxy.invoke('sendMessage', $scope.name, $scope.message);            
            $scope.message = '';
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

    $scope.enterPoints = function () {
        $scope.currentStory.points = $scope.points;
        $scope.currentStory.isClosed = true;
        storiesService.estimateStory($scope.currentStory.id, $scope.currentStory).then(function (result) {
            //alert("Points are written!");
            $scope.currentStory.points = 0;
            storiesService.getCurrentStory($scope.currentRoom.roomId).then(function (result) {
                $scope.currentStory = result.data;
            });
        });
    }

    $scope.goToStory = function () {
        $location.path('/room/' + $scope.currentRoom.roomId + '/' + $scope.currentStory.id);
    };

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