'use strict';
app.factory('choicesService', ['$http', 'localStorageService', function ($http, localStorageService) {
    var urlBase = 'http://localhost:65020/';
    var choicesService = {};

    var _createChoice = function(choice) {
        return $http.post(urlBase + "api/Choices", choice).success(function(result) {
            return result;
        });
    };

    var _getChoices = function() {
        return $http.get(urlBase + "api/Choices").success(function(result) {
            return result;
        });
    };

}]);