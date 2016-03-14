app.controller('roomDetailsController', function($scope, cardsService, authService, $http, localStorageService, choicesService, usersService, roomsService, $location, storiesService, $sce) {
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
        roomId: 0,
        isClosed: false
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

    var getRoomData = function() {
        var roomData = localStorageService.get('roomData');
        if (roomData) {
            $scope.currentRoom.roomName = roomData.roomName;
            $scope.currentRoom.roomDescription = roomData.roomDescription;
            $scope.currentRoom.roomId = roomData.roomId;
            $scope.currentRoom.roomIsClosed = roomData.roomIsClosed;
            if ($scope.currentRoom.roomIsClosed) {
                $scope.roomIsClosed = true;
            }
            else {
                $scope.roomIsClosed = false;
            }
            $scope.newLink.RoomId = roomData.roomId;
            //alert($scope.currentRoom.roomId);
        };
    }

    getRoomData();

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

    var getRoomUsers = function () {
        debugger;
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

    
    

    var getUserLink = function () {
        usersService.getUserId($scope.name).then(function (result) {
            $scope.UserId = result.data.id;
            usersService.getLink(result.data.id, $scope.currentRoom.roomId).then(function(link) {
                $scope.userLink = link.data;
            });
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
    var connection = $.hubConnection(); // initializes hub
    var pokerHubProxy = connection.createHubProxy('pokerHub');

    pokerHubProxy.on('showNewUser', function (userId, userName, roomId) {
        if (roomId == $scope.currentRoom.roomId) {
            //$scope.newUser.Id = userId;
            //$scope.newUser.userName = userName;        
            //$scope.roomUsers.push($scope.newUser);
            getRoomUsers();
            //$scope.newUser = {};
            $scope.$apply();
        }
    });
    
    pokerHubProxy.on('hideDeletedUser', function (userId, roomId, userName) {
        if (roomId == $scope.currentRoom.roomId) {
            //angular.forEach($scope.roomUsers, function (user, id) {
            //    if (user.Id == userId) {                    
            //        $scope.delUser = user; 
            //    };
                if (userName == $scope.name) {
                    $location.path('/dashboard');
                    $scope.$apply();
                }
            //    $scope.roomUsers.splice($scope.roomUsers.indexOf($scope.delUser), 1);
            //    getRoomUsers();
            //    toastr.error($scope.delUser.FullName + " was deleted from the room");
            //    $scope.delUser = {};
                $scope.$apply();
                
            //});            
        }
    });

    pokerHubProxy.on('hideDelRoom', function (userId) {
        if ($scope.UserId == userId) {
            debugger;
            $location.path("/dashboard");
            $scope.$apply();
        }
    });

    pokerHubProxy.on('showNewStory', function (storyId, storyIsEstimated, storyName, storyPoints, roomId) {
        if (roomId == $scope.currentRoom.roomId) {
            //$scope.addedStory = {
            //    Id: storyId,
            //    IsEstimated: storyIsEstimated,
            //    Name: storyName,
            //    Points: storyPoints
            //}
            //$scope.stories.push($scope.addedStory);
            getStories();
            getCurrentStory();
            //$scope.addedStory = {};
            $scope.$apply();
            //toastr.info("New story was added");
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
            $scope.$apply();
        }        
    });

    connection.start().done(function () {
        //adding New User
        $scope.addUser = function (userId) {
            $scope.newLink.UserId = userId;
            if ($scope.data.userSelect.Id != null) {
                usersService.addUser($scope.newLink).then(function (result) {
                    usersService.getUserByLink(result.data.id).then(function (results) {
                        pokerHubProxy.invoke('addRoomUser', results.data, $scope.currentRoom.roomId);
                        debugger;
                        pokerHubProxy.invoke('addDashRoom', $scope.newLink.UserId);
                        //$scope.roomUsers.push(result.data);
                    });
                    getUsers();
                    $scope.data.userSelect = undefined;
                });
            }
        }

        $scope.deleteUser = function (userId, userName) {
            usersService.deleteUser(userId, $scope.currentRoom.roomId).then(function (result) {
                //alert("User deleted.");
                pokerHubProxy.invoke('deleteRoomUser', userId, $scope.currentRoom.roomId, userName);
                debugger;
                pokerHubProxy.invoke('delDashRoom', userId);
                getUsers();
                getRoomUsers();
            });
        }

        $scope.deleteRoom = function () {
            roomsService.deleteRoom($scope.currentRoom.roomId).then(function (data) {
                //$location.path("/dashboard");
                if ($scope.currentStory) {
                    localStorageService.remove($scope.currentStory.id);
                    localStorageService.remove("Card" + $scope.currentStory.id);
                }
                angular.forEach($scope.roomUsers, function (user, id) {
                    pokerHubProxy.invoke('delDashRoom', user.id);
                });
            }), function (data) {
                alert("An error while deleting the room!");
            };
        };

        $scope.addStory = function () {
            $scope.newStory.RoomId = $scope.currentRoom.roomId;
            if ($scope.newStory.Name != "" && $scope.newStory.Name != undefined) {
                storiesService.addStory($scope.newStory).then(function (result) {
                    pokerHubProxy.invoke('addRoomStory', result.data, $scope.currentRoom.roomId);
                    getStories();
                    getCurrentStory();
                    $scope.newStory = {};
                });
            }
        }

        $scope.deleteStory = function (storyId) {
            localStorageService.remove(storyId);
            localStorageService.remove("Card" + storyId);
            storiesService.deleteStory(storyId).then(function (data) {
                pokerHubProxy.invoke('deleteRoomStory', storyId, $scope.currentRoom.roomId);
                getStories();
                getCurrentStory();
            }), function (data) {
                alert("An error while deleting the story!");
            };
        };

        $scope.closeRoom = function () {
            $scope.room = {
                name: $scope.currentRoom.roomName,
                description: $scope.currentRoom.roomDescription,
                id: $scope.currentRoom.roomId,
                isClosed: true
            };
            roomsService.closeRoom($scope.room.id, $scope.room).then(function (data) {

            }), function (data) {
                alert("An error while closing the room!");
            };
            angular.forEach($scope.stories, function (story, id) {
                if (story.isClosed != true) {
                    storiesService.deleteStory(story.id).then(function() {
                        pokerHubProxy.invoke('deleteRoomStory', story.id, $scope.currentRoom.roomId);
                        getStories();
                        getCurrentStory();
                    });
                };
            });
            localStorageService.set('roomData', { roomName: $scope.room.name, roomDescription: $scope.room.description, roomId: $scope.room.id, roomIsClosed: $scope.room.isClosed });
            getRoomData();
            getStories();
            $scope.$apply();
        };

    });

    $scope.trustAsHtml = function (value) {
        return $sce.trustAsHtml(value);
    };

});

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});