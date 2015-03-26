var clearBDShare = function() {
    $(".bdshare-slide-button-box").remove()
    window._bd_share_is_recently_loaded = false
    window._bd_share_main = null
}

function drawChart(id, option, type, theme) {
    require(
        [
            'echarts',
            'echarts/chart/' + type
        ],
        function(ec) {
            var myChart = ec.init(document.getElementById(id));
            if (theme != "default" && theme) {
                require(['echarts/chart/theme/' + theme], function(tarTheme) {
                    myChart.setTheme(tarTheme);
                });
            }
            myChart.setOption(option);
        }
    )
}

function IsRemote() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}


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
    $.digits = function(text) {
        return text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    var offset = 300,
        //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        offset_opacity = 1200,
        //duration of the top scrolling animation (in ms)
        scroll_top_duration = 700,
        //grab the "back to top" link
        $back_to_top = $('.cd-top');

    //hide or show the "back to top" link
    $(window).scroll(function() {
        ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible'): $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if ($(this).scrollTop() > offset_opacity) {
            $back_to_top.addClass('cd-fade-out');
        }
    });

    //smooth scroll to top
    $back_to_top.on('click', function(event) {
        event.preventDefault();
        $('body,html').animate({
            scrollTop: 0,
        }, scroll_top_duration);
    });
});
