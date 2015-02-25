App.controller('rankCtl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {
    var target = $routeParams.target;
    $('#bar-search').show(0);
    clearBDShare();
    $scope.full_rank = {
        name: "sss",
        data: []
    };
    $scope.isDetail = true;
    $scope.languages = {};
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
    $scope.getDetail = function(language) {
        $location.path("/rank/" + language);
    };
    var fake_user = {
        name: 'XXX',
        followers: 322,
        stars: 3222,
        repos: 222,
        location: "China",
        language: "Javascript",
        score: 233,
        days: 233
    }
    for (var i=0, l=10; i<l; i++) {
        $scope.full_rank.data.push(fake_user);
    }
    for (var i=0, l=6; i<l; i++) {
        var temp = {};
        temp.name = "name" + i;
        temp.data = [];
        for (var j=0, l=10;j<l;j++) {
            temp.data.push(fake_user);
        }
        $scope.languages['name' +i] = temp;
    }
    if (target) {
        $scope.full_rank = $scope.languages.name1;
    }
}]);
