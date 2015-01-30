App.controller('rankCtl', ['$scope', '$location', function($scope, $location) {
    $('#bar-search').show(0);
    clearBDShare();
    $scope.rank_data = [];
    $scope.getRankClass = function(index) {
        if (index == 0) {
            return "rank1";
        } else if (index == 1) {
            return "rank2";
        } else if (index == 2) {
            return "rank3"
        } else {
            return "";
        }
    };
    var fake_user = {
        username: 'username',
        name: 'XXX',
        gravater: "https://avatars.githubusercontent.com/u/2572987?v=3",
        follows: 322,
        stars: 3222,
        repos: 222,
        location: "China",
        language: "Javascript"
    }
    for (var i=0, l=10; i<l; i++) {
        $scope.rank_data.push(fake_user);
    }
}]);
