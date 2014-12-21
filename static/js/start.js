require(['app'], function(app) {
	app.config(['$routeProvider',function($routeProvider) {
		$routeProvider.
		when('index', {controller: indexCtl, templateUrl: 'static/tpl/index.html'});
	}]);
});
