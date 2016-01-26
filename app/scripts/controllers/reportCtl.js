App.controller('reportCtl', ['$scope', '$location', 'anchorScroll', function($scope, $location, anchorScroll) {
    $('#bar-search').show(0);
    var chartDomList = ["#chart-map", "#chart-china"];
    var DeviceWidth = $(window).width();
    var ChartRaito = 9 / 16;
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
    var chartData2 = generateMapChartData();
    setTimeout(function() {
        for (var i in chartDomList) {
            var dom = chartDomList[i];
            console.log(dom);
            $(dom).width(DeviceWidth / 6 * 4);
            $(dom).height(DeviceWidth / 6 * 4 * ChartRaito);
        }
        drawChart("chart-china", chartData, "default");
        window.chart = drawChart("chart-map", chartData2, "default");
        chart.on('click', function(type, name, selected) {
            console.log(type);
        });
    });
}]);
