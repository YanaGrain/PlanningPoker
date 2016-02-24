'use strict';
app.factory('storiesService', ['$http', 'localStorageService', 'authService', function ($http, localStorageService, authService) {
    var urlBase = 'http://localhost:65020/';
    var storiesService = {};

    var _addStory = function (story) {
        debugger;
        return $http.post(urlBase + "api/Stories", story).then(function (result) {
            debugger;
            return result;
        });
    }

    var _getStories = function (roomId) {
        return $http.get(urlBase + "api/Stories/" +  roomId).then(function (result) {
            return result;
        })
    }

    var _getCurrentStory = function (roomId) {
        return $http.get(urlBase + "api/Stories/" + roomId + "/current").then(function (result) {
            return result;
        })
    }

    var _deleteStory = function (id) {
        return $http.delete(urlBase + "api/Stories/" + id).then(function (result) {
            return result;
        })
    }

    storiesService.addStory = _addStory;
    storiesService.getStories = _getStories;
    storiesService.deleteStory = _deleteStory;
    storiesService.getCurrentStory = _getCurrentStory;
    return storiesService;
}]);