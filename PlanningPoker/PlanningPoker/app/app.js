var app = angular.module('PokerApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar','ngAnimate', 'angucomplete-alt', 'ngSanitize', 'ui.select']);

app.config(function ($routeProvider) {
$routeProvider
    .when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html",
        access: { allowAnonymous: true }
    })

    .when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html",
        access: { allowAnonymous: true }
    })
    .when("/about", {
        controller: "aboutController",
        templateUrl: "/app/views/about.html",
        access: { allowAnonymous: true }
    })
    .when("/contact", {
        controller: "contactController",
        templateUrl: "/app/views/contact.html",
        access: { allowAnonymous: true }
    })

    .when("/cards", {
        controller: "cardsController",
        templateUrl: "/app/views/cards.html",
        access: { allowAnonymous: false }
    })

    .when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "/app/views/dashboard.html",
        access: { allowAnonymous: false }        
    })

    .when("/room/:id", {
        controller: "roomDetailsController",
        templateUrl: "/app/views/roomDetails.html",
        access: { allowAnonymous: false }
    })

    .when("/room/:id/:id", {
        controller: "storyController",
        templateUrl: "/app/views/story.html",
        access: { allowAnonymous: false }
    })

   .when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html",
        access: { allowAnonymous: true }
   })

    .otherwise({ redirectTo: "/home" });
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);



app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});
//function ($rootScope, $location, authService) {
//    $rootScope.$on('$routeChangeStart', function (event, next ) {
//        var isAuth = authService.authentication.isAuth; /* Check if the user is logged in */

//        if (!isAuth) {        
//            $location.path('/login');
//        }
//    });
//}

