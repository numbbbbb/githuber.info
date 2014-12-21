var App = angular.module('App');
App.controller('searchCtl',['$scope','$routeParams',function($scope, $routeParams) {
	$scope.targetUser = $routeParams.targetUser;
    $scope.languageBytesInOwnedRepos = {} // 自己repo的语言字节数统计 注意这里是字节数不是行数 GitHub不提供行数
    $scope.languageOfStarredRepos = {} // star repo的语言统计 只统计个数 比如Python的repo 100个
    $scope.ownedRepoInfos = {} // TODO：自己的repo被star的次数以及repo的信息，比如title description以及readme 之后鼠标移动到repo上会显示这些信息
	$scope.githuber = {
		// login: "id",
		// avatar_url : "https://avatars.githubusercontent.com/u/2572987?v=3",
		// name: "test",
		// company: "buaa",
		// email: "xxxx@xxx.com",
		// page: "numbbbbb.com",
		// followers: 5020,
		// public_repos: 20,
		// codings: 50000
	};
    $scope.byteChart = {};
    $scope.starChart = {};
	OAuth.initialize("MS6wvoyoJiptc7dsDm_sYY8l3vI");
    var Barrier = function() { // 用于等待多个ajax完成
        this.barrierNumber = 0
        this.checkFinish = function(cb) {
            that = this;
            var clock = function() {
                if (that.barrierNumber === 1) {
                    cb()
                } else {
                    setTimeout(clock, 200)
                }
            }
            setTimeout(clock, 200)
        }
    }
	$scope.searchUser = function() {
		console.log("start");
		OAuth.popup('github', {
			cache: true
        }).done(function(github) {
			getUserInfo($scope.targetUser, github);
			getCodeLines($scope.targetUser, github);
			getStarredInfo($scope.targetUser, github);
            repoInitial($scope.targetUser, github);
		}).fail(function(err) {
			alert("连接API失败" + err);
		});
	};

	var getUserInfo = function(targetUser, github) {
		var info = ['login', 'avatar_url', 'name', 'company', 'email', 'followers', 'public_repos'];
		if ($scope.targetUser != "") {
			var url = "https://api.github.com/users/" + targetUser;
		        $.ajax({
		         url: url,
		         dataType: "json"
		        }).always(function(data) {
		        	for (var i = 0, l = info.length; i < l; i++) {
		        		$scope.githuber[info[i]] = data[info[i]] || "?";
		        	}
                    $scope.githuber.isLoaded = true;
		        	$scope.$digest();
		         	console.log($scope.githuber);
		        });
		}
	};
	var getCodeLines = function(targetUser, github) {
        github.get(
            "https://api.github.com/users/" + targetUser + "/repos?page=1&per_page=10000"
        ).done(function(data){
            var barrier = new Barrier();
            barrier.barrierNumber = data.length;
            $.map(data, function(repo, i) {
                $scope.ownedRepoInfos[repo.id] = {
                    description: repo.description,
                    name: repo.name,
                    stars: repo.stargazers_count,
                };
                github.get(
                    "https://api.github.com/repos/" + targetUser + "/" + repo.name + "/languages"
               	).always(function(data) {
                    barrier.barrierNumber--
                        if ("status" in data || $.isEmptyObject(data)) {
                            return
                        }
                    $.each(data, function(language, lines) {
                        if (isNaN(lines)) {
                            return
                        }
                        if (!(language in $scope.languageBytesInOwnedRepos)) {
                            $scope.languageBytesInOwnedRepos[language] = 0
                        }
                        $scope.languageBytesInOwnedRepos[language] += lines
                    });
                });
            });
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
                        '<h2>' + repo.name + ' <span class="label label-default">' + repo.stars + ' Stars</span></h2>' +
                        '<p style="font-size:16px;">' + repo.description + '</p>' +
                        '<button type="button" class="btn btn-default readme-btn" data-id="' + repo.id + '">查看readme</button>' +
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
                $("#byte-chart").height(data.length * 40);
                data.sort(function(a, b) {
                    return a.value - b.value
                });
                var categories = [];
                var values = [];
                for (var i = 0; i < data.length; i++) {
                    categories.push(data[i].name);
                    values.push(data[i].value);
                }
                var option = {
                    title: {
                        text: '代码量统计',
                        subtext: '单位：字节'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [{
                        type: 'value',
                        boundaryGap: [0, 0.01]
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
                $scope.$digest();
                drawChart("byte-chart", option, "bar");
            });
        });
	};
    // 获取star的repo并统计语言
    var getStarredInfo = function(targetUser, github) {
    	var getStarredInfoAt = function(pageNumber) {
 			github.get(
                "https://api.github.com/users/" + targetUser + "/starred?page=" + pageNumber + "&per_page=100"
            ).done(function(data) {
                $.map(data, function(repo, i) {
                    if (repo.language) {
                        if (!(repo.language in $scope.languageOfStarredRepos)) {
                            $scope.languageOfStarredRepos[repo.language] = 0
                        }
                        $scope.languageOfStarredRepos[repo.language] += 1
                    }
                })
                if (data.length === 100) {
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
                    $scope.$digest();
	                drawChart("star-chart", option, "pie");

	            }
            });
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
    var repoInitial = function(targetUser, github) {
    	$("#repo-details").on("click", ".readme-btn", function() {
            alert("sss");
	        repo = $scope.ownedRepoInfos[$(this).data("id")]
	        $("#repo-modal-name").html(repo.name)
	        $("#repo-modal-content").html("README内容载入中，请稍候......")
	        if (!($scope.ownedRepoInfos[repo.id].hasOwnProperty("readme"))) {
	            github.get(
	                "/repos/" + targetUser + "/" + repo.name + "/readme"
	            ).always(function(data) {
	                var readme = decodeURIComponent(escape(window.atob(data.content || "")))
	                github.post("/markdown", {
	                    data: JSON.stringify({
	                        "text": readme,
	                        "mode": "markdown"
	                    })
	                }).done(function(data) {
	                    $scope.ownedRepoInfos[repo.id].readme = data
	                    $("#repo-modal-content").html(data)
	                })
	            })
	        } else {
	            $("#repo-modal-content").html($scope.ownedRepoInfos[repo.id].readme)
	        }
	        $("#repo-modal").modal("show");
    	});
	}
	$scope.searchUser();
}]).controller('navCtl',['$scope', function($scope) {

}]);
