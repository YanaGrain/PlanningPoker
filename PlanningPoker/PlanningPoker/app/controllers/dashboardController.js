'use strict';
app.controller('dashboardController', function ($scope, $http) {
    $scope.message = 'This is your dashboard';
    $scope.data = { visible: false }
    $scope.showRoomForm = function () {
        $scope.data = { visible: true }
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
            alert("Created Successfully!");
            $scope.addMode = false;
            $scope.rooms.push(data);
            $scope.loading = false;
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Customer! " + data;
            $scope.loading = false;
        });
    };
});
