pokerApp.controller('dashboardController', authService, function ($scope, authService) {
    $scope.message = 'This is your dashboard';
    $scope.data = { visible: false }
    $scope.showRoom = function () {
        $scope.data = { visible: true }
    }
});