app.controller('roomDetailsController', function ($scope, cardsService, authService, $http, localStorageService, choicesService, usersService, roomsService, $location, storiesService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.name = authService.authentication.userName;
    $scope.data = { visible: false }    
    $scope.users = [];
    $scope.stories = [];
    $scope.admin = {};
    $scope.currentStory = {};
    $scope.roomUsers = [];
    $scope.data.userSelect = null;
    $scope.showAddForm = function () {
        if ($scope.data.visible) {
            $scope.data.visible = false;
        } else
        {
            $scope.data = {
                visible: true
            }        
        }
    }
    $scope.showDeleteForm = function () {
        if ($scope.data.delVisible) {
            $scope.data.delVisible = false;
        } else {
            $scope.data = {
                delVisible: true
            }        
        }
    }
    $scope.showStoriesForm = function () {
        if ($scope.data.storiesVisible) {
            $scope.data.storiesVisible = false;
        } else {
            $scope.data = {
                storiesVisible: true
            }
        }
    }

   
    
    $scope.currentRoom = {
        roomName: "",
        roomDescription: "",
        roomId: 0
    };

    $scope.newLink = {
        UserId: "",
        RoomId: 0,
        IsAdmin: false
    };

    $scope.newStory = {
        Name: "",
        Points: 0,
        IsEstimated: false,
        RoomId: 0
    };

    var roomData = localStorageService.get('roomData');
    if (roomData) {
        $scope.currentRoom.roomName = roomData.roomName;
        $scope.currentRoom.roomDescription = roomData.roomDescription;
        $scope.currentRoom.roomId = roomData.roomId;
        $scope.newLink.RoomId = roomData.roomId;
        //alert($scope.currentRoom.roomId);
    };

    
    var getUsers = function() {
        usersService.getUsers($scope.currentRoom.roomId).then(function (results) {
            $scope.users = results.data;            
        });
    }
    getUsers();

    var getStories = function () {
        storiesService.getStories($scope.currentRoom.roomId).then(function (results) {
            $scope.stories = results.data;            
        });
    }
    getStories();

    var getRoomUsers = function() {
        usersService.getRoomUsers($scope.currentRoom.roomId).then(function (results) {
            $scope.roomUsers = results.data;            
        });
    }
    getRoomUsers();

    var getAdmin = function () {
        usersService.getAdmin($scope.currentRoom.roomId).then(function (results) {
            $scope.admin = results.data;            
        });
    }
    getAdmin();

    
    $scope.deleteRoom = function () {
        roomsService.deleteRoom($scope.currentRoom.roomId).then(function (data) {
            $location.path("/dashboard");
        }), function (data) {
            alert("An error while deleting the room!");
        };
    };

    

    var getUserLink = function () {
        usersService.getUserId($scope.name).then(function (result) {
            $scope.UserId = result.data.id;
            usersService.getLink(result.data.id, $scope.currentRoom.roomId).then(function (link) {
                $scope.userLink = link.data;
            })
        });
        
    }
    getUserLink();

    
    $scope.goToStory = function () {
        $location.path('/room/' + $scope.currentRoom.roomId + '/' +$scope.currentStory.id);       
    };

    var getCurrentStory = function () {
        storiesService.getCurrentStory($scope.currentRoom.roomId).then(function (result) {
            $scope.currentStory = result.data;            
        });        
}
    getCurrentStory();


    //signalR
    $scope.newUser = {}; // holds the new user
    $scope.delUser = {};
    //$scope.usersFromServer = []; // collection of users coming from server    
    var connection = $.hubConnection(); // initializes hub
    var pokerHubProxy = connection.createHubProxy('pokerHub');
    //connection.start(); // starts hub

    pokerHubProxy.on('showNewUser', function (userId, userName, roomId) {
        if (roomId == $scope.currentRoom.roomId) {
            $scope.newUser.Id = userId;
            $scope.newUser.userName = userName;        
            $scope.roomUsers.push($scope.newUser);
            getRoomUsers();
            $scope.newUser = {};
            $scope.$apply();
        }
        
    });
    
    pokerHubProxy.on('hideDeletedUser', function (userId, roomId, userName) {
        if (roomId == $scope.currentRoom.roomId) {
            angular.forEach($scope.roomUsers, function (user, id) {
                if (user.Id == userId) {                    
                    $scope.delUser = user;                    
                    debugger;
                };
                if (userName == $scope.name) {
                    debugger;
                    $location.path('/dashboard');
                    $scope.$apply();
                }
                $scope.roomUsers.splice($scope.roomUsers.indexOf($scope.delUser), 1);
                getRoomUsers();
                $scope.delUser = {};
                $scope.$apply();
                
            });            
        }
    });

    pokerHubProxy.on('showNewStory', function (storyId, storyIsEstimated, storyName, storyPoints, roomId) {
        if (roomId == $scope.currentRoom.roomId) {
            $scope.addedStory = {
                Id: storyId,
                IsEstimated: storyIsEstimated,
                Name: storyName,
                Points: storyPoints
            }
            $scope.stories.push($scope.addedStory);
            getStories();
            getCurrentStory();
            $scope.addedStory = {};
            debugger;
            $scope.$apply();
        }        
    });

    pokerHubProxy.on('hideDeletedStory', function (storyId, roomId) {
        if ($scope.currentRoom.roomId == roomId) {
            angular.forEach($scope.stories, function (story, id) {
                if (story.Id == storyId) {
                    $scope.delStory = story;
                };
            });
            $scope.stories.splice($scope.stories.indexOf($scope.delStory), 1);
            getStories();
            getCurrentStory();
            $scope.delStory = {};
            debugger;
            $scope.$apply();
        }        
    });
   
    pokerHubProxy.on('showNewRoom', function () {            
            //getRooms();            
            $scope.$apply();
        });

    connection.start().done(function () {
        //adding New User
        $scope.addUser = function (userId) {
            $scope.newLink.UserId = userId;
            usersService.addUser($scope.newLink).then(function (result) {                
                usersService.getUserByLink(result.data.id).then(function (results) {
                    pokerHubProxy.invoke('addRoomUser', results.data, $scope.currentRoom.roomId);
                    pokerHubProxy.invoke('addDashRoom', $scope.newLink.UserId);
                    //$scope.roomUsers.push(result.data);
                })
                getUsers();
            })
        }

        $scope.deleteUser = function (userId, userName) {
            debugger;
            usersService.deleteUser(userId, $scope.currentRoom.roomId).then(function (result) {
                //alert("User deleted.");
                pokerHubProxy.invoke('deleteRoomUser', userId, $scope.currentRoom.roomId, userName);
                pokerHubProxy.invoke('delDashRoom', userId);
                getUsers();
                getRoomUsers();
            })
        }

        $scope.addStory = function () {
            $scope.newStory.RoomId = $scope.currentRoom.roomId;
            storiesService.addStory($scope.newStory).then(function (result) {
                pokerHubProxy.invoke('addRoomStory', result.data, $scope.currentRoom.roomId);
                getStories();
                getCurrentStory();
                $scope.newStory = {};
            })
        }

        $scope.deleteStory = function (storyId) {
            storiesService.deleteStory(storyId).then(function (data) {
                pokerHubProxy.invoke('deleteRoomStory', storyId, $scope.currentRoom.roomId);
                getStories();
                getCurrentStory();
            }), function (data) {
                alert("An error while deleting the story!");
            };
        };
    });   

});