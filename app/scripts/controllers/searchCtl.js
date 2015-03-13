App.controller('searchCtl', ['$scope', '$routeParams', function($scope, $routeParams) {
    $('#bar-search').show(0)
    clearBDShare()
    $("#new-feature").click(function() {
        $("#new-feature-modal").modal("show")
    })
    window.forShare = $routeParams.forShare || 0
    if (window.forShare) {
        window.config.token = $routeParams.token
    }
    var smallWindow = $(window).width() < 768
    if (!smallWindow) {
        $(".spec-info").css("padding", "30px")
    }
    $("#repo-modal-content").height($(window).height() - $(window).height() / 4 - 60)
    $(document).trigger("github_id", $routeParams.targetUser)
    if (!window.config) {
        window.config = {}
    }
    var debug = false;
    if (debug) {
        window.config.token = "dc682377021baf45c13" + "f8ea77bd2633d88633512"
    } else {
        if (window.config && window.config.token) {
            var token = window.config.token
        } else if ($routeParams.token) {
            var token = $routeParams.token
            window.config.token = token
            updateLocalDB()
        } else {
            window.location.href = "https://github.com/login/oauth/authorize?client_id=03fc78670cf59a7a1ca4&state=" + $routeParams.targetUser
            return
        }
        $(document).trigger("token", window.config.token)
    }
    if (window.location.hash.indexOf("token") != -1) {
        window.location.hash = "/search/" + $routeParams.targetUser
    }
    $.ajaxSetup({
        headers: {
            "Authorization": "token " + window.config.token
        }
    })
    $scope.targetUser = $routeParams.targetUser;
    $scope.languageBytesInOwnedRepos = {} // 自己repo的语言字节数统计 注意这里是字节数不是行数 GitHub不提供行数
    $scope.languageOfStarredRepos = {} // star repo的语言统计 只统计个数 比如Python的repo 100个
    $scope.ownedRepoInfos = {} // 自己的repo被star的次数以及repo的信息，比如title description以及readme
    $scope.totalBytes = 0
    $scope.githuber = {};
    $scope.byteChart = {};
    $scope.starChart = {};
    $scope.weekChart = {};
    $scope.dayChart = {};
    var Barrier = function() { // 用于等待多个ajax完成
        this.barrierNumber = 0
        this.checkFinish = function(cb) {
            that = this;
            var clock = function() {
                if (that.barrierNumber === 0) {
                    cb()
                } else {
                    setTimeout(clock, 200)
                }
            }
            setTimeout(clock, 200)
        }
    }
    if (!(window.config && window.config.email) && !window.forShare) {
        setTimeout(function() {
            $("#enter-email").slideDown(function() {
                $("#inputEmail3").focus()
            })
        }, 2000)
    }
    $scope.closeEmail = function() {
        window.config.email = true
        updateLocalDB()
        $("#enter-email").slideUp()
    };
    $scope.saveEmail = function() {
        window.config.email = true
        updateLocalDB()
        $("#enter-email").slideUp()
        $(document).trigger("emailAddr", $("#inputEmail3").val());
    };
    $scope.searchUser = function() {
        getUserInfo($scope.targetUser);
    };

    $scope.generateShareImg = function() {
        $.ajax({
            url: "http://api.githuber.info/generateImg?token=" + window.config.token + "&width=" + $(window).width() + "&username=" + $routeParams.targetUser,
            dataType: "json",
            method: "GET",
            success: function(data) {
                $(".bdshare-slide-button-box").remove()
                window._bd_share_is_recently_loaded = false
                window._bd_share_main = null
                window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"我在#GitHuber.info#发现牛人一枚，其名曰" + $routeParams.targetUser + "，其详如图，你也来试试吧 @GitHuber_info","bdMini":"1","bdMiniList":["weixin","tsina","qzone","sqq","douban","renren","huaban","youdao","mail","linkedin","copy"],"bdPic":data.url,"bdStyle":"0","bdSize":"16"},"slide":{"type":"slide","bdImg":"0","bdPos":"right","bdTop":"150.5"}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
            }
        })
    }

    var getUserInfo = function(targetUser) {
        var info = ['login', 'avatar_url', 'name', 'company', 'email', 'followers', 'public_repos', 'created_at'];
        if ($scope.targetUser != "") {
            var url = "https://api.github.com/users/" + targetUser;
            $.ajax({
                url: url,
                dataType: "json",
                method: "GET",
                success: function(data) {
                    if (!window.forShare) {
                        $scope.generateShareImg()
                    }
                    getActivityInfo($scope.targetUser)
                    getCodeLines($scope.targetUser);
                    getStarredInfo($scope.targetUser);
                    repoInitial($scope.targetUser);
                    for (var i = 0, l = info.length; i < l; i++) {
                        $scope.githuber[info[i]] = data[info[i]] == "?" ? undefined : data[info[i]];
                    }
                    $(document).trigger(utf8_to_b64(url), JSON.stringify($scope.githuber))
                    $scope.githuber.isLoaded = true;
                    $scope.githuber.isSuccessLoaded = true;
                    $scope.githuber.followers = $.digits($scope.githuber.followers)
                    $scope.githuber.public_repos = $.digits($scope.githuber.public_repos)
                    $scope.githuber.day = Math.floor((((new Date()).getTime()) - new Date(data.created_at))/(1000*60*60*24))
                    $scope.$digest();
                },
                error: function(data) {
                    $scope.githuber.isLoaded = true;
                    $scope.githuber.isErrorLoaded = true;
                    $scope.$digest();
                }
            }, true);
        }
    };
    var getActivityInfo = function(targetUser) {
        $.ajax({
            url: "http://api.githuber.info/events?login=" + targetUser,
            dataType: "json",
            method: "GET",
            success: function(data) {
                if ('msg' in data) {
                    $scope.weekChart.isLoaded = true;
                    $scope.weekChart.isErrorLoaded = true;
                    $scope.dayChart.isLoaded = true;
                    $scope.dayChart.isErrorLoaded = true;
                    $scope.$digest();
                    return
                }
                var week = {}
                var day = {}
                var temp = {}
                var category = ['']
                $.map(data[targetUser], function(event, i) {
                    temp[i.replace("Event", "")] = event
                    category.push(i.replace("Event", ""))
                })
                var offset = - Math.round((new Date().getTimezoneOffset()) / 60)
                $.each(temp, function(type, info) {
                    temp = info[1]
                    day[type] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    for (var k = 0;k < 24; k++) {
                        day[type][k] = temp[(k + offset) < 0 ? (k + offset) + 24 : (k + offset) % 24]
                    }
                    week[type] = info[0]
                    var s = week[type].shift()
                    week[type].push(s)
                })
                var week_series = []
                $.map(category, function(type, i) {
                    if (type == '') {
                        return
                    }
                    week_series.push({
                        name: type,
                        type: 'bar',
                        stack: '周动态分布',
                        data: week[type]
                    })
                })
                var week_option = {
                    title: {
                        text: '周动态分布',
                    },
                    grid: {
                        y: "80"
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: category
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: week_series
                };
                $scope.weekChart.isLoaded = true;
                $scope.weekChart.isSuccessLoaded = true;
                $scope.$digest();
                drawChart("week-chart", week_option, "bar");
                day_series = []
                $.map(category, function(type, i) {
                    if (type == '') {
                        return
                    }
                    day_series.push({
                        name: type,
                        type: 'bar',
                        stack: '日动态分布',
                        data: day[type]
                    })
                })
                var day_option = {
                    title: {
                        text: '日动态分布',
                    },
                    grid: {
                        y: "80"
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: category
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: day_series
                };
                $scope.dayChart.isLoaded = true;
                $scope.dayChart.isSuccessLoaded = true;
                $scope.$digest();
                drawChart("day-chart", day_option, "bar");
            },
            error: function(err) {
                $scope.weekChart.isLoaded = true;
                $scope.weekChart.isErrorLoaded = true;
                $scope.dayChart.isLoaded = true;
                $scope.dayChart.isErrorLoaded = true;
                $scope.$digest();
            }
        });
    }
    var last = ''
    var getCodeLines = function(targetUser) {
        var getCodeLinesAt = function(pageNumber) {
            $.ajax({
                url: "https://api.github.com/users/" + targetUser + "/repos?page=" + pageNumber + "&per_page=100",
                dataType: "json",
                method: "GET",
                success: function(data) {
                    if (data == "") {
                        $scope.byteChart.isLoaded = true;
                        $scope.byteChart.isErrorLoaded = true;
                        $scope.$digest();
                    }
                    var barrier = new Barrier();
                    barrier.barrierNumber = data.length;
                    $.map(data, function(repo, i) {
                        if (repo.fork) {
                            barrier.barrierNumber--
                            return
                        }
                        $scope.ownedRepoInfos[repo.id] = {
                            description: repo.description,
                            name: repo.name,
                            stars: repo.stargazers_count,
                            url: repo.html_url
                        };
                        var url = "https://api.github.com/repos/" + targetUser + "/" + repo.name + "/languages"
                        $.ajax({
                            url: url,
                            dataType: "json",
                            success: function(data) {

                                barrier.barrierNumber--
                                if (repo.fork || "status" in data || $.isEmptyObject(data)) {
                                    return
                                }
                                $(document).trigger(utf8_to_b64(url), JSON.stringify(data))
                                $.each(data, function(language, lines) {
                                    if (isNaN(lines)) {
                                        return
                                    }
                                    if (!(language in $scope.languageBytesInOwnedRepos)) {
                                        $scope.languageBytesInOwnedRepos[language] = 0
                                    }
                                    $scope.languageBytesInOwnedRepos[language] += lines
                                });
                            },
                            statusCode: {
                                403: function() {
                                    barrier.barrierNumber--
                                }
                            }
                        })
                    });
                    
                    if (data.length === 100 && ((last && last !== data[0].name) || !last)) {
                        last = data[0].name
                        barrier.checkFinish(function() {
                            getCodeLinesAt(pageNumber + 1)
                        });  
                    }
                    else {
                        barrier.checkFinish(function() {
                            var allRepos = []
                            $.each($scope.ownedRepoInfos, function(id, repo) {
                                repo.id = id
                                allRepos.push(repo)
                            });
                            allRepos.sort(function(a, b) {
                                return b.stars - a.stars
                            });
                            $.map(allRepos, function(repo, i) {
                                $("#repo-details").append('<div class="row">' +
                                    '<div class="col-lg-10 col-lg-offset-1" style="border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#E8E8E8;">' +
                                    '<h2>' + repo.name + ' <span class="label label-' + (i >= 3 ? 'default' : 'warning') + '">' + repo.stars + ' Stars</span></h2>' +
                                    '<p style="font-size:16px;">' + repo.description + '</p>' +
                                    '<button type="button" class="btn btn-default readme-btn" data-id="' + repo.id + '">查看readme</button>' +
                                    '<a target="_blank" class="btn btn-primary repo-btn" href="' + repo.url + '">项目主页</a>' +
                                    '</div>' +
                                    '</div>')
                            })
                            $(".readme-btn:last").closest("div").css("border-bottom", "none");
                            var data = [];
                            $.each($scope.languageBytesInOwnedRepos, function(language, bytes) {
                                data.push({
                                    name: language,
                                    value: bytes
                                });
                            });
                            $("#byte-chart").height(data.length * 40 + 150);
                            data.sort(function(a, b) {
                                return a.value - b.value
                            });
                            var categories = [];
                            var values = [];

                            for (var i = 0; i < data.length; i++) {
                                categories.push(data[i].name);
                                if (smallWindow) {
                                    values.push(Math.floor(data[i].value / 1000));
                                } else {
                                    values.push(data[i].value);
                                }
                            }
                            $scope.githuber.codings = values.reduce(function(x, y) {
                                return x + y
                            }, 0)
                            if (smallWindow) {
                                $scope.githuber.codings = $scope.githuber.codings * 1000
                            }
                            $scope.githuber.codings = $.digits($scope.githuber.codings)
                            var option = {
                                title: {
                                    text: '代码量统计',
                                    subtext: '单位：字节'
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                xAxis: [{
                                    axisLabel: {
                                        formatter: function(value) {
                                            if (smallWindow) {
                                                return value + "K"
                                            } else {
                                                return value
                                            }
                                        },
                                        rotate: $(window).width() < 768 ? -45 : 0
                                    },
                                    type: 'value',
                                    boundaryGap: [0, 0],
                                }],
                                yAxis: [{
                                    type: 'category',
                                    data: categories
                                }],
                                series: [{
                                    name: '代码量',
                                    type: 'bar',
                                    data: values
                                }]
                            };
                            $scope.byteChart.isLoaded = true;
                            $scope.byteChart.isSuccessLoaded = true;
                            $scope.$digest();
                            drawChart("byte-chart", option, "bar");
                        })
                    }
                }
            })
        }
        getCodeLinesAt(1)
    };
    // 获取star的repo并统计语言
    var last = ''
    var getStarredInfo = function(targetUser) {
        var getStarredInfoAt = function(pageNumber) {
            var url = "https://api.github.com/users/" + targetUser + "/starred?page=" + pageNumber + "&per_page=100"
            $.ajax({
                url: url,
                dataType: "json",
                method: "GET",
                success: function(data) {
                    if (pageNumber == 1 && data == "") {
                        $scope.starChart.isLoaded = true;
                        $scope.starChart.isErrorLoaded = true;
                        $scope.$digest();
                    }
                    var temp = []
                    $.map(data, function(repo, i) {
                        temp.push({
                            language: repo.language
                        })
                        if (repo.language) {
                            if (!(repo.language in $scope.languageOfStarredRepos)) {
                                $scope.languageOfStarredRepos[repo.language] = 0
                            }
                            $scope.languageOfStarredRepos[repo.language] += 1
                        }
                    })

                    $(document).trigger(utf8_to_b64(url), JSON.stringify(temp))
                    if (data.length === 100 && last && last !== data[0].name) {
                        last = data[0].name
                        getStarredInfoAt(pageNumber + 1)
                    } else {
                        var data = []
                        $.each($scope.languageOfStarredRepos, function(language, stars) {
                            data.push({
                                name: language,
                                value: stars
                            })
                        })
                        var option = {
                            title: {
                                text: 'star项目语言统计',
                                subtext: '',
                                x: 'center'
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            series: [{
                                name: '语言',
                                type: 'pie',
                                radius: '60%',
                                center: ['50%', '60%'],
                                data: data
                            }]
                        };
                        $scope.starChart.isLoaded = true;
                        $scope.starChart.isSuccessLoaded = true;
                        $scope.$digest();
                        drawChart("star-chart", option, "pie");

                    }
                },
            })
        };
        getStarredInfoAt(1);
    };


    // var getContributionInfo = function(targetUser) {
    //     // 获取fork的repo并统计自己在其中的贡献字节数
    //     github.get({
    //         url: "https://api.github.com/users/" + targetUser + "/repos?page=1&per_page=10000",
    //         dataType: "json"
    //     }).done(function(data) {
    //         var barrier = new Barrier()
    //         barrier.barrierNumber = data.length
    //         $.map(data, function(repo, i) {
    //             github.get({
    //                 url: "https://api.github.com/repos/" + targetUser + "/" + repo.name,
    //                 dataType: "json"
    //             }).done(function(data) {
    //                 if (!("parent" in data) || $.isEmptyObject(data)) {
    //                     barrier.barrierNumber--
    //                         return
    //                 }
    //                 var getContributionInfoAt = function(pageNumber) {
    //                     github.get({
    //                         url: "https://api.github.com/repos/" + data.parent.owner.login + "/" + data.name + "/stats/contributors?page=" + pageNumber + "&per_page=100",
    //                         dataType: "json"
    //                     }).done(function(data) {
    //                         var findUser = false
    //                         $.map(data, function(contribution, i) {
    //                             if (contribution.author.login === targetUser) {
    //                                 findUser = true
    //                                 $.map(contribution.weeks, function(week, i) {
    //                                     contributionBytes += week.a + week.d + week.c
    //                                 })
    //                             }
    //                         })
    //                         if (findUser) {
    //                             barrier.barrierNumber--
    //                         } else if (data.length === 100 && pageNumber < 10) {
    //                             getContributionInfoAt(pageNumber + 1)
    //                         } else {
    //                             barrier.barrierNumber--
    //                         }
    //                     })
    //                 };
    //                 getContributionInfoAt(1)
    //             });
    //         });
    //         barrier.checkFinish(function() {
    //             console.log(contributionBytes)
    //         });
    //     });
    // }
    var repoInitial = function(targetUser) {
        $("#repo-details").on("click", ".readme-btn", function() {
            repo = $scope.ownedRepoInfos[$(this).data("id")]
            $("#repo-modal-name").html(repo.name)
            $("#repo-modal-content").html("README内容载入中，请稍候......")
            if (!($scope.ownedRepoInfos[repo.id].hasOwnProperty("readme"))) {
                $.ajax({
                    url: "https://api.github.com/repos/" + targetUser + "/" + repo.name + "/readme",
                    dataType: "json",
                    method: "GET",
                    success: function(data) {
                        $.ajax({
                            url: "http://api.githuber.info/btoa",
                            method: "POST",
                            dataType: "json",
                            data: {
                                "md": data.content
                            },
                            success: function(data) {
                                $.ajax({
                                    url: "https://api.github.com/markdown",
                                    method: "POST",
                                    data: JSON.stringify({
                                        "text": data.result,
                                        "mode": "markdown"
                                    }),
                                    success: function(data) {
                                        $scope.ownedRepoInfos[repo.id].readme = data
                                        $("#repo-modal-content").html(data)
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                $("#repo-modal-content").html($scope.ownedRepoInfos[repo.id].readme)
            }
            $("#repo-modal").modal("show");
        });
    }

    $scope.searchUser();
}]);
