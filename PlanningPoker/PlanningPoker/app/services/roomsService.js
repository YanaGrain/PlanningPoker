'use strict';
app.factory('roomsService', ['$http', 'localStorageService', function($http, localStorageService) {
    var urlBase = 'http://localhost:65020/';
    var roomsService = {};

    var _currentRoom = {
        roomName: "",
        roomDescription: "",
        roomId: 0
};
    
    var _getRooms = function () {
        return $http.get(urlBase + 'api/Rooms').then(function (data) {
            return data;
        });
    };

    var _createRoom = function(room) {
        return $http.post(urlBase + 'api/Rooms', room).success(function(result) {
            localStorageService.set('roomData', { roomName: room.Name, roomDescription: room.Description, roomId: result});
            
            _currentRoom.roomName = room.Name;
            _currentRoom.roomDescription = room.Description;
            _currentRoom.roomId= result;
            return result;
        });
    };

    var _deleteRoom = function(id) {
        return $http.delete(urlBase + 'api/Rooms/' + id).then(function(data) {
            return data;
        });
    }

    roomsService.getRooms = _getRooms;
    roomsService.createRoom = _createRoom;
    roomsService.deleteRoom = _deleteRoom;
    roomsService.currentRoom = _currentRoom;
    return roomsService;
}]);