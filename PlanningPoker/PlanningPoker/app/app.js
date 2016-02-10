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
    .when("/about", {
        controller: "aboutController",
        templateUrl: "/app/views/about.html"
    })
    .when("/contact", {
        controller: "contactController",
        templateUrl: "/app/views/contact.html"
    })
    .when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "/app/views/dashboard.html"
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