App.controller('indexCtl', ['$scope', '$location', function($scope, $location) {
    $('#bar-search').hide(0)
    $(".support-logo").css({"transform": "scale(" + ($(window).height() / 1200) + ")"});
    clearBDShare()
    $(".support-logo").css({"transform": "scale(" + ($(window).height() / 1200) + ")"})
    $.fn.textWidth = function() {
        var html_org = $(this).html();
        var html_calc = '<span>' + html_org + '</span>';
        $(this).html(html_calc);
        var width = $(this).find('span:first').width();
        $(this).html(html_org);
        return width;
    };
    $("#slogan").parent().height($(window).height() / 5)
    var subHeight = $(window).height() - $("#slogan").parent().height() - 100 - 71 - $(".report-entry").outerHeight() - parseFloat($(".container-fluid.ng-scope").css("margin-top").replace("px", "")) - $(".support-logo").height()
    $("#search-part").height(parseInt(subHeight * 1 / 5));
    $(".report-entry").css('margin-bottom', parseInt(subHeight * 1 / 3))
    $("#slogan").css({
        "paddingLeft": ($("#our-name").textWidth() - $("#slogan").textWidth() - 3) + "px"
    });
    $scope.search = function() {
        if ($('#index-input').typeahead('val').replace(/\s/g, "") != "") {
            window.bigcache = {}
            $location.path("/search/" + $('#index-input').typeahead('val').replace(/\s/g, ""));
        }
    };
    var stid
    var nowFunc
    $('body').keyup(function(e) {
        if (e.keyCode == 32) {
            clearTimeout(stid)
            nowFunc()
        }
    });
    function findMatches(q, cb) {
        clearTimeout(stid)
        var matches
        matches = []
        var strs = []
        var isFullname = false
        try {
            window.btoa(q)
        } catch (err) {
            isFullname = true
        };
        if (isFullname) {
            var searchKeyword = []
            var needBlank = /^[A-Za-z][A-Za-z0-9]*$/
            for (var i = 0; i < q.length; i++) {
                if (!needBlank.test(q[i])) {
                    searchKeyword.push(q[i])
                }
                else {
                    if (searchKeyword.length == 0) {
                        searchKeyword.push(q[i])
                    }
                    else {
                        searchKeyword[searchKeyword.length - 1] = searchKeyword[searchKeyword.length - 1] + q[i]
                    }
                }
            }
            searchKeyword = searchKeyword.join(" ")
            var searchFullname = function() {
                $.ajax({
                    url: "https://api.github.com/search/users?q=" + searchKeyword + "+in:fullname",
                    dataType: "json",
                    method: "GET",
                    success: function(data) {
                        if (data.total_count != 0) {
                            $.each(data.items, function(i, user) {
                                matches.push({
                                    value: user.login,
                                    src: user.avatar_url
                                });
                            });
                            cb(matches);
                        }
                    }
                })
            }
            stid = setTimeout(searchFullname, 200)
            nowFunc = searchFullname
        }
        else {
            var searchUsername = function() {
                $.ajax({
                    url: "https://api.github.com/search/users?q=" + q + "+in:username",
                    dataType: "json",
                    method: "GET",
                    success: function(data) {
                        if (data.total_count == 0) {
                            $.ajax({
                                url: "https://api.github.com/search/users?q=" + q + "+in:fullname",
                                dataType: "json",
                                method: "GET",
                                success: function(data) {
                                    if (data.total_count != 0) {
                                        $.each(data.items, function(i, user) {
                                            matches.push({
                                                value: user.login,
                                                src: user.avatar_url
                                            });
                                        });
                                        cb(matches);
                                    }
                                }
                            })
                        }
                        else {
                            $.each(data.items, function(i, user) {
                                matches.push({
                                    value: user.login,
                                    src: user.avatar_url
                                });
                            });
                            cb(matches);
                        }
                    }
                })
            }
            stid = setTimeout(searchUsername, 300)
            nowFunc = searchUsername
        }
    };

    $('#index-input').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'user',
        displayKey: 'value',
        source: findMatches,
        templates: {
            suggestion: function(item) {
                return "<p><img class='search-avatar' src=" + item.src + " alt='头像加载中' />" + item.value + "</p>"
            }
        }
    });
    $('html').on("typeahead:selected", function() {
        $("#lookup").click()
    })
    setTimeout(function() {
        $("#index-input").trigger("focus")
    }, 300)

}]);
