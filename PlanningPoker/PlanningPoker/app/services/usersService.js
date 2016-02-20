'use strict';
app.factory('usersService', ['$http', 'localStorageService', 'authService', function ($http, localStorageService, authService) {
    var urlBase = 'http://localhost:65020/';
    var usersService = {};
    //var userName = authService.authentication.userName;

    var _getUserId = function (userName) {
        debugger;
        return $http.get(urlBase + "api/account/" + userName).then(function (result) {
            debugger;
            //$scope.userId = result.data.id;
            return result;
        });
    }

    usersService.getUserId = _getUserId;
    return usersService;
}]);