'use strict';

/*
 * Main module of the application.
 */

 angular.module('dangerousWrenchApp', ['ionic','ngAnimate',
    'ui.bootstrap',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])

 .run(function($ionicPlatform) {
   $ionicPlatform.ready(function() {
     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
     // for form inputs)
     if(window.cordova && window.cordova.plugins.Keyboard) {
       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
     }
     if(window.StatusBar) {
       StatusBar.styleDefault();
     }
   });
 })

  .config(function ($locationProvider, $routeProvider) {
    $locationProvider
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when ('/search/:user', {
        templateUrl: 'views/search.html',
        controller: 'MainCtrl'
      })
      .when ('/search-results/:user', {
        templateUrl: 'views/search-results.html',
        controller: 'SearchResultsCtrl'
      })
      .when('/art/:artId', {
        templateUrl: 'views/art.html',
        controller: 'ArtCtrl'
      })
      .when('/homepage/:user', {
        templateUrl: 'views/userPageView.html',
        controller: 'UserController'
      })
      .when('/recommendation', {
        templateUrl: 'views/recommendation.html',
        controller: 'UserRecommend'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
