'use strict';
app.factory('choicesService', ['$http', 'localStorageService', function ($http, localStorageService) {
    var urlBase = 'http://localhost:65020/';
    var choicesService = {};

    var _createChoice = function(choice) {
        return $http.post(urlBase + "api/Choices", choice).success(function(result) {
            return result;
        });
    };

    var _getChoices = function(storyId) {
        return $http.get(urlBase + "api/Choices/" + storyId).success(function (result) {
            debugger;
            return result;
        });
    };

    choicesService.createChoice = _createChoice;
    choicesService.getChoices = _getChoices;
    return choicesService;
}]);