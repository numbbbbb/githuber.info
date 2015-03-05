App.controller('rankCtl', ['$scope', '$location', '$routeParams', 'anchorScroll', '$http', function($scope, $location, $routeParams, anchorScroll, $http) {
    var target = $routeParams.target;
    $('#bar-search').show(0);
    clearBDShare();
    if (!$scope.data) {
        $http.get("http://staticfile00.b0.upaiyun.com/rank.json").success( function(data) {
            console.log("get");
            $scope.data = data;
            $scope.languages = data.languages;
            if (target) {
                $scope.full_rank = $scope.languages[target];
            } else {
                $scope.full_rank = data.full_rank;
            }
            $scope.full_rank_data = $scope.full_rank.data.slice(0,20);
        });
    }
    $scope.full_rank_switch = true;
    $scope.isDetail = true;
    $scope.switchFullRank = function(language) {
        if ($scope.full_rank_switch) {
            $scope.full_rank_data = $scope.full_rank.data;
        } else {
            $scope.full_rank_data = $scope.full_rank.data.slice(0,20);
            $('body,html').animate({
                scrollTop: 800,
            }, 500);
        }
        $scope.full_rank_switch = !$scope.full_rank_switch;
    }
    $scope.getDetail = function(language) {
        $location.path("/rank/" + language);
        $('body,html').animate({
            scrollTop: 0,
        }, 500);
    };
}]);
