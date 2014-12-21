var App = angular.module('App',['ngRoute']);
App.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/index', {templateUrl: '/static/tpl/index.html'}).
	when('/about', {templateUrl: '/static/tpl/about.html'}).
	when('/donate', {templateUrl: '/static/tpl/donate.html'}).
	when('/search/:targetUser', {controller: 'searchCtl',templateUrl: 'static/tpl/search.html'}).
	otherwise({redirectTo:'/index'});
}]);

