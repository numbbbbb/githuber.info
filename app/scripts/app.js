// Basic Init
require.config({
  paths: {
    echarts: '/scripts'
  }
})

function drawChart(id, option, type) {
  require(
    [
      'echarts',
      'echarts/chart/' + type
    ],
    function(ec) {
      var myChart = ec.init(document.getElementById(id))
      myChart.setOption(option)
    }
  )
}

var db = new LocalDB("githuber.info", {
    expire: "none",
    encrypt: true
});
var collection = db.collection("userInfo");

collection.find({
    where: {
        _id: "info"
    }
}).then(function(data, err){
    if (data.length > 0) {
        window.config = data[0].config
    } else {
        window.config = {}
        collection.insert({
            _id: "info",
            config: window.config
        })
    }
})

function updateLocalDB() {
    collection.update({
        $set: {
            config: window.config
        }
    },{
        where: {
            _id: "info"
        }
    })
}

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(function() {
    $(".navbar a").click(function() {
        $(".navbar-toggle").not(".collapsed").click()
    })
    var triggerFeedback = function() {
        $(document).trigger("feedback", [$("#feedback-email").val(), $("#feedback-content").val()])
        $("#feedback-main").hide(0);
        $("#feedback-gangnam-style").show(0);
        setTimeout(function() {
            $("#feedback-btn").trigger("click")
            $("#feedback-gangnam-style").hide(0);
            $("#feedback-email, #feedback-content").val("")
            $("#feedback-main").show(0);
            setTimeout(function() {
                $("#feedback-btn").one("click", triggerFeedback)
            }, 5000)
        }, 2000)
        return false
    }
    $("#feedback-btn").one("click", triggerFeedback)
    $("#feedback-main").click(function() {
        return false;
    })
    $.digits = function(text){
        return text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
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
    when('/search/:targetUser', {
        controller: 'searchCtl',
        templateUrl: 'views/search.html',
        reloadOnSearch: false
    }).
    otherwise({
        redirectTo: '/index'
    });
    // $locationProvider.html5Mode(true);
}]);


