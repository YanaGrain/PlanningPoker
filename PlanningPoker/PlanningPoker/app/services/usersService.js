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

    var _getUsers = function (roomId) {
        debugger;
        return $http.get(urlBase + "api/account/Users/" + roomId).then(function (result) {
            return result;
        });
    }

    var _getRoomUsers = function (roomId) {
        debugger;
        return $http.get(urlBase + "api/account/" + roomId + "/Users").then(function (result) {
            return result;
        });
    }

    var _getAdmin = function (roomId) {
        debugger;
        return $http.get(urlBase + "api/account/" + roomId + "/Admin").then(function (result) {
            return result;
        });
    }

    var _addUser = function (link) {
        debugger;
        return $http.post(urlBase + "api/userRoomLinks", link).then(function (result) {
            debugger;
            return result;
        });
    }

    var _deleteUser = function (userId, roomId) {
        debugger;
        return $http.delete(urlBase + "api/userRoomLinks/"+ userId +"/" + roomId).then(function (result) {
            debugger;
            return result;
        });
    }

    var _getLink = function (userId, roomId) {
        debugger;
        return $http.get(urlBase + "api/userRoomLinks/" + userId + "/" + roomId).then(function (result) {
            debugger;
            return result;
        });
    }

    usersService.getUserId = _getUserId;
    usersService.getUsers = _getUsers;
    usersService.getRoomUsers = _getRoomUsers;
    usersService.getAdmin = _getAdmin;
    usersService.addUser = _addUser;
    usersService.deleteUser = _deleteUser;
    usersService.getLink = _getLink;
    return usersService;
}]);