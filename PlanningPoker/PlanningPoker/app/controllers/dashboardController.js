app.controller('dashboardController', function ($scope, $http, $location, authService, localStorageService, roomsService, usersService) {
    var serviceBase = 'http://localhost:65020/';
    $scope.message = 'This is your dashboard ';
    $scope.userName = authService.authentication.userName;
    $scope.warning = false;
    
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
    
    var getRooms = function () {
        usersService.getUserId($scope.userName).then(function (result) {
            $scope.UserId = result.data.id;
            $scope.UserIsAdmin = result.data.isAdmin;
            roomsService.getRooms(result.data.id).then(function (results) {
                $scope.rooms = [];
                $scope.rooms = results.data;
            }, function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
        });
    }

    getRooms();
    $scope.newroom = {};
    
    $scope.createRoom = function () {
        if ($scope.newroom.Name != null) {
            roomsService.createRoom(this.newroom, $scope.userName).then(function(data) {
                $scope.rooms.push(data);
                getRooms();
                $scope.warning = false;
                $scope.enterRoom(data.data);
            }), function(data) {
                $scope.error = "An Error has occured while Adding Room! " + data;
            };
        } else {
            $scope.warning = true;
        }
    };
    
    $scope.enterRoom = function (id) {
        roomsService.findRoom(id).then(function (result) {
            $location.path('/room/' + id);
        });
    };

    //signalR
    $scope.addedRoom = {}; // holds the new user  
    var connection = $.hubConnection(); // initializes hub
    var pokerHubProxy = connection.createHubProxy('pokerHub');
    connection.start();
    pokerHubProxy.on('showNewRoom', function (userId) {
        if ($scope.UserId == userId) {
            getRooms();
            $scope.$apply();
            toastr.info("You were added to the room.");
        }
        
    });

    pokerHubProxy.on('hideDelRoom', function () {
        //if ($scope.UserId == userId) {
            getRooms();
            $scope.$apply();
            toastr.error("You were deleted from the room Or the room was deleted.");
        //}
    });
    
}); 

