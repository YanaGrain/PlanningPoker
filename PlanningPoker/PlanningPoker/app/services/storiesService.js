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

    var _deleteStory = function (roomId, storyId) {
        return $http.get(urlBase + "api/Stories/" + roomId, storyId).then(function (result) {
            return result;
        })
    }

    storiesService.addStory = _addStory;
    storiesService.getStories = _getStories;
    return storiesService;
}]);