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
    $scope.minValue = 100;
    $scope.maxValue = 0;    
    $scope.showChat = false;

    $scope.showChatForm = function () {
        if ($scope.showChat == false) {
            $scope.showChat = true;
        }
        else {
            $scope.showChat = false;
        }
    }

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

    toastr.options = {
        "closeButton": true,        
        "newestOnTop": true,        
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
       
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
           $scope.messages = localStorageService.get($scope.currentStory.id) || []; // collection of messages coming from server
           $scope.chosenCard = localStorageService.get("Card" + $scope.currentStory.id) || "";
           debugger;
           choicesService.getChoices($scope.currentStory.id).then(function (results) {
               debugger;
               $scope.choices = results.data;
               angular.forEach($scope.choices, function (choice, id) {
                   cardsService.getValue(choice.cardId).then(function (result) {
                       choice.value = result.data.value;
                       if (choice.value <= $scope.minValue) {
                           $scope.minValue = choice.value;
                       }
                       if (choice.value >= $scope.maxValue) {
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
            });
        });

    }
    getUserLink();

    $scope.toRoom = function () {
        $location.path('room/' + $scope.currentRoom.roomId);
    }


    $scope.goToStory = function () {
        $location.path('/room/' + $scope.currentRoom.roomId + '/' + $scope.currentStory.id);
    };

    $scope.selectCard = function (id, path) {
        if ($scope.activeClass == id) {
            $scope.activeClass = null;
            $scope.newChoice = {};
        }
        else {
            $scope.activeClass = id;
            $scope.newChoice.StoryId = $scope.currentStory.id;
            $scope.newChoice.UserId = $scope.UserId;
            $scope.newChoice.CardId = id;
            localStorageService.set("Card" + $scope.currentStory.id, path);
            $scope.chosenCard = localStorageService.get("Card" + $scope.currentStory.id);
        }

    };
     
    //signalR
    $scope.addedChoice = {}; // holds the new user  
    $scope.message = ''; // holds the new message
    $scope.points = 0;
    
    debugger;
    var connection = $.hubConnection(); // initializes hub
    var pokerHubProxy = connection.createHubProxy('pokerHub');
    
    pokerHubProxy.on('showNewChoice', function (choiceId, userId, cardId, storyId, name) {
        if (storyId == $scope.currentStory.id) {
            debugger;
            $scope.addedChoice.Id = choiceId;
            $scope.addedChoice.UserId = userId;
            $scope.addedChoice.CardId = cardId;
            $scope.addedChoice.StoryId = storyId;
            $scope.choices.push($scope.addedChoice);
            getStoryChoices();
            $scope.addedChoice = {};
            if (name != $scope.name) {
                debugger;
                toastr.success(name + " made a choice");
            }            
            $scope.$apply();
        }        
    });

    pokerHubProxy.on('broadcastMessage', function (name, message, storyId) {
        debugger;
        if (storyId == $scope.currentStory.id) {
            var newMessage = name + ' : ' + message;
            // push the newly coming message to the collection of messages
            $scope.messages.push(newMessage);
            localStorageService.set($scope.currentStory.id, $scope.messages);
            if (name != $scope.name) {
                debugger;
                toastr.info(newMessage, "New message");
            }                      
            $scope.$apply();
            $('#chat').scrollTop($('#chat')[0].scrollHeight - $('#chat')[0].clientHeight);
        }
        
    });

    pokerHubProxy.on('closeTheStory', function (storyId) {
        if (storyId == $scope.currentStory.id) {
            debugger;
            $location.path('room/' + $scope.currentRoom.roomId);
            localStorageService.remove($scope.currentStory.id);
            localStorageService.remove("Card"+$scope.currentStory.id);
            $scope.$apply();
        }

    });

    pokerHubProxy.on('showCards', function (storyId) {
        //$scope.showCard = false;
        if (storyId == $scope.currentStory.id) {
            $scope.currentStory.isEstimated = true;
            $scope.$apply();
        }
    });

    pokerHubProxy.on('hideDelRoom', function (userId) {
        if ($scope.UserId == userId) {
            debugger;
            $location.path("/dashboard");
        }
    });

    connection.start().done(function() {

        $scope.cardChosen = function() {
            choicesService.createChoice($scope.newChoice).then(function(result) {
                pokerHubProxy.invoke('addStoryChoice', result.data, $scope.name);
                debugger;
                $scope.done = true;
                //alert("Done!");
                getStoryChoices();
            });
        }

        $scope.showCards = function() {
            $scope.showCard = false;
            //$scope.cardsShown = true;
            $scope.currentStory.isEstimated = true;
            storiesService.estimateStory($scope.currentStory.id, $scope.currentStory).then(function(result) {
                //alert("Room is Estimated!");
            });
            pokerHubProxy.invoke('showStoryCards', $scope.currentStory.id);

        }

        $scope.newMessage = function() {
            if ($scope.message != '') {
                // sends a new message to the server
                pokerHubProxy.invoke('sendMessage', $scope.name, $scope.message, $scope.currentStory.id);
                $scope.message = '';
            }
        }

        $scope.enterPoints = function() {
            $scope.currentStory.points = $scope.points;
            $scope.currentStory.isClosed = true;
            storiesService.estimateStory($scope.currentStory.id, $scope.currentStory).then(function(result) {
                //alert("Points are written!");
                $scope.currentStory.points = 0;
                pokerHubProxy.invoke('closeStory', $scope.currentStory.id);
                //storiesService.getCurrentStory($scope.currentRoom.roomId).then(function (result) {
                //    $scope.currentStory = result.data;
                //});
            });
        }

    });

});