var app = angular.module('PokerApp', ['ngRoute', 'LocalStorageModule']);

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
    .when("/about", {
        controller: "aboutController",
        templateUrl: "/app/views/about.html"
    })
    .when("/contact", {
        controller: "contactController",
        templateUrl: "/app/views/contact.html"
    })

    .when("/cards", {
        controller: "cardsController",
        templateUrl: "/app/views/cards.html"
    })

    .when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "/app/views/dashboard.html"
    })

    .when("/room", {
        controller: "roomController",
        templateUrl: "/app/views/room.html"
    })

   .when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
   })

    .otherwise({ redirectTo: "/home" });
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

