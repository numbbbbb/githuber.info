App.controller('aboutCtl', ['$scope', '$location', function($scope, $location) {
    $('#bar-search').show(0)
    clearBDShare()
    $scope.search = function() {
        if ($scope.sw.replace(/\s/g, "") != "") {
            window.bigcache = {}
            $location.path("/search/" + $scope.sw);
        }
    };
    $(".label-info").hover(function() {
        $(this).css("cursor", "pointer")
    }).click(function() {
        window.open($(this).data("url"))
    })
}]);
