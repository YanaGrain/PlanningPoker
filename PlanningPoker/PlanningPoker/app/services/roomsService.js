'use strict';
app.factory('roomsService', ['$http', function ($http) {
    var urlBase = 'http://localhost:65020/';
    var roomsService = {};
    var _getRooms = function () {
        return $http.get(urlBase + 'api/Rooms').then(function (results) {
            return results;
        });
    };
    roomsService.getRooms = _getRooms;
    return roomsService;
}]);