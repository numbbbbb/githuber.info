App.controller('navCtl', ['$scope', '$location', function($scope, $location) {
    clearBDShare()
    $scope.search = function() {
        if ($scope.sw.replace(/\s/g, "") != "") {
            window.bigcache = {}
            $location.path("/search/" + $scope.sw);
        }
    };
}]);
