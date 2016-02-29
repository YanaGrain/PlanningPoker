'use strict';
app.controller('indexController', ['$scope', '$location', 'authService', '$rootScope', function ($scope, $location, authService, $rootScope) {

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }
    $scope.authentication = authService.authentication;

    $scope.$on('$routeChangeStart', function (e, next, current) {
        if (next.access != undefined && !next.access.allowAnonymous && !$scope.authentication.isAuth) {
            $location.path("/login");
        }
    });
    
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        for (var i in window.routes) {
            if (next.indexOf(i) != -1) {
                if (!window.routes[i].access.allowAnonymous && !authService.authentication.isAuth) {
                    //toaster.pop("error", 'You are not logged in!', '');
                    $location.path("/login");
                }
            }
        }
    });

}]);