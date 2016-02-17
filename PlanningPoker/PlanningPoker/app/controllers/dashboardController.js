app.controller('dashboardController', function($scope, $http, $location, authService, localStorageService, roomsService ) {
    $scope.message = 'This is your dashboard ';
    $scope.userName = authService.authentication.userName;
    $scope.data = { visible: false }
    $scope.showRoomForm = function () {
        $scope.data = { visible: true }
    }
    $scope.closeRoomForm = function () {
        $scope.data = { visible: false }
    }
    
    var getRooms = function (){
        roomsService.getRooms().then(function (results) {
            $scope.rooms = [];
                $scope.rooms = results.data;
            },function(error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }
    getRooms();
    $scope.newroom = {};
    
    $scope.createRoom = function() {
        roomsService.createRoom(this.newroom).then(function(data) {
            $scope.rooms.push(data);
            getRooms();
            $location.path('/room');
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


}); 

