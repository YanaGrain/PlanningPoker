app.controller('dashboardController', function ($scope) {
    $scope.message = 'This is your dashboard';
    $scope.data = { visible: false }
    $scope.showRoom = function () {
        $scope.data = { visible: true }
    }

});
