var app = angular.module('PokerApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {
    $routeProvider

    .when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    })

    .when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    })

    .when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    })

    .when("/cards", {
        controller: "cardsController",
        templateUrl: "/app/views/cards.html"
    })

    .otherwise({ redirectTo: "/home" });
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});