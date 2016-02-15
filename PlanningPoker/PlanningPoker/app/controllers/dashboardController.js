app.controller('dashboardController', function($scope, $http, $location, authService) {
    $scope.message = 'This is your dashboard ';
    $scope.userName = authService.authentication.userName;
    $scope.data = { visible: false }
    $scope.showRoomForm = function () {
        $scope.data = { visible: true }
    }
    $scope.closeRoomForm = function () {
        $scope.data = { visible: false }
    }
   
    //get all rooms information
    $http.get('/api/Rooms').success(function (data) {
        $scope.rooms = data;
        $scope.loading = false;
    })
    .error(function () {
        $scope.error = "An Error has occured while loading posts!";
        $scope.loading = false;
    });

    //Insert Room
    $scope.createRoom = function () {
        $scope.loading = true;
        $http.post('/api/Rooms', this.newroom).success(function (data) {
            $scope.rooms.push(data);
            $scope.loading = false;
            $location.path('/room');
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Room! " + data;
            $scope.loading = false;
        });
    };

    $scope.deleteRoom = function (id) {
        $http.delete('api/Rooms/' + id);
        $location.refresh();
    };


}); 

