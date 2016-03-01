app.controller('dashboardController', function ($scope, $http, $location, authService, localStorageService, roomsService, usersService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.message = 'This is your dashboard ';
    $scope.userName = authService.authentication.userName;
    $scope.data = { visible: false }
    $scope.showRoomForm = function () {
        $scope.data = { visible: true }
    }
    $scope.closeRoomForm = function () {
        $scope.data = { visible: false }
    }
    
    var getRooms = function () {
        debugger;
        usersService.getUserId($scope.userName).then(function(result) {
            $scope.UserId = result.data.id;
            $scope.UserIsAdmin = result.data.isAdmin;
            roomsService.getRooms(result.data.id).then(function (results) {
                debugger;
                $scope.rooms = [];
                $scope.rooms = results.data;
                debugger;
            }, function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
        });
    }

    getRooms();
    $scope.newroom = {};
    
    $scope.createRoom = function() {
        roomsService.createRoom(this.newroom, $scope.userName).then(function (data) {
            $scope.rooms.push(data);
            getRooms();
            $scope.enterRoom(data.data);
        }),function(data) {
            $scope.error = "An Error has occured while Adding Room! " + data;
        };
    };

    $scope.deleteRoom = function (id) {
        roomsService.deleteRoom(id).then(function(data) {
            getRooms();
        }), function(data) {
            alert("An error while deleting the room!");
        };
    };

    $scope.enterRoom = function (id) {
        roomsService.findRoom(id).then(function (result) {
            $location.path('/room/' + id);
        });
    };

    ////signalR
    $scope.addedRoom = {}; // holds the new user  
    var connection = $.hubConnection(); // initializes hub
    var pokerHubProxy = connection.createHubProxy('pokerHub');
    pokerHubProxy.on('showNewRoom', function (userId) {
        if ($scope.UserId == userId) {
            getRooms();
            $scope.$apply();
        }
        
    });

    pokerHubProxy.on('hideDelRoom', function (userId) {
        if ($scope.UserId == userId) {
            getRooms();
            $scope.$apply();
        }

    });
    connection.start();
}); 

