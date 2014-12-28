// init
var db = new LocalDB("githuber.info");
var collection = db.collection("userInfo");

function updateLocalDB() {
    collection.drop();
    collection.insert(window.config);
}
collection.find().then(function(data) {
    if (data.length) {
        window.config = data[0];
    } else {
        window.config = {};
    }
})

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
    $("#feedback-title").click(function() {
        $target = $(this).parent()
        $target.stop()
        if ($target.css("bottom") != "0px") {
            $target.animate({
                "bottom": "0px"
            })
        } else {
            $target.animate({
                "bottom": "-340px"
            }, function() {
                $("#feedback-gangnam-style").hide(0);
                $("#feedback-email, #feedback-content").val("")
                $("#feedback-main").show(0);
                setTimeout(function() {
                    $("#feedback-btn").one("click", triggerFeedback)
                }, 5000)
            })
        }
    })
    var triggerFeedback = function() {
        $(document).trigger("feedback", [$("#feedback-email").val(), $("#feedback-content").val()])
        $("#feedback-main").hide(0);
        $("#feedback-gangnam-style").show(0);
        setTimeout(function() {
            $("#feedback-title").trigger("click")
        }, 2000)
    }
    $("#feedback-btn").one("click", triggerFeedback)
})


// Angular app
var App = angular.module('App', ['ngRoute']);
App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/index', {
        controller: 'indexCtl',
        templateUrl: '/static/tpl/index.html'
    }).
    when('/about', {
        controller: 'aboutCtl',
        templateUrl: '/static/tpl/about.html'
    }).
    when('/donate', {
        templateUrl: '/static/tpl/donate.html'
    }).
    when('/search/:targetUser', {
        controller: 'searchCtl',
        templateUrl: 'static/tpl/search.html'
    }).
    otherwise({
        redirectTo: '/index'
    });
}]);
