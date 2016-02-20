﻿'use strict';
app.factory('roomsService', ['$http', 'localStorageService', function($http, localStorageService) {
    var urlBase = 'http://localhost:65020/';
    var roomsService = {};

    var _currentRoom = {
        roomName: "",
        roomDescription: "",
        roomId: 0
    };

    
    var _getRooms = function (userId) {
        debugger;
        return $http.get(urlBase + 'api/Rooms/' + userId).then(function (data) {
            debugger;
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
    };

    var _findRoom = function (id) {
        return $http.get(urlBase + 'api/Rooms/' + id + "/room").then(function (result) {
            localStorageService.set('roomData', { roomName: result.data.name, roomDescription: result.data.description, roomId: result.data.id });
            _currentRoom.roomName = result.data.name;
            _currentRoom.roomDescription = result.data.description;
            _currentRoom.roomId = result.data.id;
            return result;
        });
    }


    roomsService.getRooms = _getRooms;
    roomsService.createRoom = _createRoom;
    roomsService.deleteRoom = _deleteRoom;
    roomsService.currentRoom = _currentRoom;
    roomsService.findRoom = _findRoom;
    return roomsService;
}]);