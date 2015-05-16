// Basic Init
require.config({
  paths: {
    echarts: '/scripts'
  }
})

// Angular app
var App = angular.module('App', ['ngRoute']);
App.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $routeProvider.
    when('/index', {
        controller: 'indexCtl',
        templateUrl: 'views/index.html'
    }).
    when('/about', {
        controller: 'aboutCtl',
        templateUrl: 'views/about.html'
    }).
    when('/donate', {
        templateUrl: 'views/donate.html'
    }).
    when('/rank/:target', {
        controller: 'rankCtl',
        templateUrl: 'views/rank.html'
    }).
    when('/rank', {
        controller: 'rankCtl',
        templateUrl: 'views/rank.html'
    }).
    when('/report', {
        controller: 'reportCtl',
        templateUrl: 'views/report.html'
    }).
    when('/search/:targetUser', {
        controller: 'searchCtl',
        templateUrl: 'views/search.html',
        reloadOnSearch: false
    }).
    otherwise({
        redirectTo: '/index'
    });
    $locationProvider.html5Mode(true);
}]);


// $.getJSON("http://staticfile00.b0.upaiyun.com/test2.json", {}, function(response){
//     console.dir(response);
// });
