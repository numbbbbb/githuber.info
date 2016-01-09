App.controller('reportCtl', ['$scope', '$location', 'anchorScroll', function($scope, $location, anchorScroll) {
    $('#bar-search').show(0);
    clearBDShare();
    $scope.hideSideBar = function() {
        $scope.sideBarClass = ($scope.sideBarClass == "slide-left" ? "" : "slide-left");
    };


    var xAxis = {
        type: "category",
        name: "测试数",
        data: [1,2,3,4,5]
    };
    var yAxis = {
        type: 'value',
        name: '百分比'
    };
    var saries = [
    {
        type: "bar",
        name: "test1",
        data: [1, 2, 3, 4, 5]
    }, 
    {
        type: "bar",
        name: "test2",
        data: [1, 2, 3, 4, 5]
    }];
    var legend = ["test1", "test2"];
    var chartData = generateChartData("测试", xAxis, yAxis, saries, legend);
    console.log(chartData);
    drawChart("chart-china", chartData, "bar", "default");
}]);
