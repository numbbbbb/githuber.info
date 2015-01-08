$(function() {
    AV.initialize("5nm1ly7bnbqrc4lzkfbrm33kb6hrrfbd5ojopd8sq0imq3j6", "j65povz7i4o3h4r27pu76yo0utdlw7pz184jl97d6nakjw16")
    window.bigcache = {}
    var syncData
    var cacheExpired
    $(document).on("emailAddr", function(e, email) {
        var SubscribedEmail = AV.Object.extend("SubscribedEmail")
        var queryEmail = new AV.Query(SubscribedEmail)
        queryEmail.equalTo("email", email)
        queryEmail.find({
            success: function(results) {
                if (!results.length) {
                    var subscribedEmail = new SubscribedEmail()
                    subscribedEmail.set("email", email)
                    subscribedEmail.save(null)
                }
            },
            error: function(results) {
                var subscribedEmail = new SubscribedEmail()
                subscribedEmail.set("email", email)
                subscribedEmail.save(null)
            }
        })
    })
    var Feedback = AV.Object.extend("Feedback")
    $(document).on("feedback", function(e, email, content) {
        if (content) {
            var feedback = new Feedback()
            feedback.set("email", email)
            feedback.set("content", content)
            feedback.save(null)
        }
    })
    var Token = AV.Object.extend("Token")
    $(document).on("token", function(e, data) {
        if (data) {
            var query = new AV.Query(Token)
            query.equalTo("token", data)
            query.find({
                success: function(results) {
                    if (!results.length) {
                        var token = new Token()
                        token.set("token", data)
                        token.save(null)
                    }
                }
            })
        }
    })
    var getRamdomToken = function() {
        var query = new AV.Query(Token)
        query.find({
            success: function(results) {
                if (results.length) {
                    $.ajaxSetup({
                        headers: {
                            "Authorization": "token " + results[Math.floor((Math.random() * results.length))].get("token")
                        }
                    })
                }
            }
        })
    }
    var nowId
    getRamdomToken()
    $(document).on("github_id", function(e, n) {
        if (n) {
            nowId = n
            var refreshInterval
            var updatedSeconds
            var nowSeconds = new Date().getTime() / 1000
            var InformationObject = AV.Object.extend("InformationObject")
            var query = new AV.Query(InformationObject)
            var SearchCount = AV.Object.extend("SearchCount")
            var queryCount = new AV.Query(SearchCount)
            query.equalTo("userInfo", n)
            query.find({
                success: function(results) {
                    if (results.length) {
                        syncData = function() {
                            window.bigcache.cache.save()
                        }
                        window.bigcache.cache = results[0]
                        updatedSeconds = window.bigcache.cache.updatedAt.getTime() / 1000
                        refreshInterval = 24 * 3600
                        cacheExpired = nowSeconds - updatedSeconds >= refreshInterval
                    } else {
                        syncData = function() {
                            window.bigcache.cache.save(null)
                        }
                        window.bigcache.cache = new InformationObject()
                        window.bigcache.cache.set("userInfo", n)
                        updatedSeconds = new Date().getTime() / 1000
                        refreshInterval = 24 * 3600
                        cacheExpired = nowSeconds - updatedSeconds >= refreshInterval
                    }
                },
                error: function(error) {
                    syncData = function() {
                        window.bigcache.cache.save(null)
                    }
                    window.bigcache.cache = new InformationObject()
                    window.bigcache.cache.set("userInfo", n)
                    updatedSeconds = new Date().getTime() / 1000
                    refreshInterval = 24 * 3600
                    cacheExpired = nowSeconds - updatedSeconds >= refreshInterval

                }
            })
            if (!window.forShare) {
                queryCount.equalTo("username", n)
                queryCount.find({
                    success: function(results) {
                        if (results.length) {
                            results[0].increment("search_count")
                            results[0].save()
                        } else {
                            searchCount = new SearchCount()
                            searchCount.set("username", n)
                            searchCount.set("search_count", 1)
                            searchCount.save(null)
                        }
                    },
                    error: function(error) {
                        searchCount = new SearchCount()
                        searchCount.set("username", n)
                        searchCount.set("search_count", 1)
                        searchCount.save(null)
                    }
                })
            }
        }
    })
    var oldAjax = $.ajax
    var timeoutId = -1
    var ajaxMap = {
        userInfos: /^https:\/\/api\.github\.com\/users\/\w*$/,
        // userRepoInfo: /^https:\/\/api\.github\.com\/users\/\S*\/repos\?page=1&per_page=10000$/,
        repoLanguage: /^https:\/\/api\.github\.com\/repos\/\w*\/(\S*)\/languages$/m,
        starredRepo: /^https:\/\/api\.github\.com\/users\/\S*\/starred\?page=(\d+)&per_page=100$/m
    }
    $.ajax = function(o) {
        var doAjax = function() {
            if (window.bigcache.cache || o.url.indexOf("api.github.com/search/users") != -1) {
                var needAjax = true
                $.each(ajaxMap, function(name, re) {
                    if (o.url.match(re)) {
                        needAjax = false
                        if (re.exec(o.url).length > 1) {
                            var index = utf8_to_b64(re.exec(o.url)[1])
                            if (Object.prototype.toString.call(window.bigcache.cache.get(name)) !== "[object Object]") {
                                window.bigcache.cache.set(name, {})
                            }
                            if (!$.isEmptyObject(window.bigcache.cache.get(name)[index]) && nowId == window.bigcache.cache.get("userInfo") && !cacheExpired) {
                                o.success(window.bigcache.cache.get(name)[index])
                            } else {
                                $(document).one(utf8_to_b64(o.url), function(e, data) {
                                    console.log(index)
                                    data = JSON.parse(data)
                                    var temp = window.bigcache.cache.get(name)
                                    temp[index] = data
                                    window.bigcache.cache.set(name, temp)
                                    if (timeoutId != -1) {
                                        clearTimeout(timeoutId)
                                    }
                                    timeoutId = setTimeout(syncData, 2000)
                                })
                                oldAjax(o)
                            }
                        } else {
                            if (!$.isEmptyObject(window.bigcache.cache.get(name)) && nowId == window.bigcache.cache.get("userInfo") && !cacheExpired) {
                                o.success(window.bigcache.cache.get(name))
                            } else {
                                $(document).one(utf8_to_b64(o.url), function(e, data) {
                                    data = JSON.parse(data)
                                    window.bigcache.cache.set(name, data)
                                    if (timeoutId != -1) {
                                        clearTimeout(timeoutId)
                                    }
                                    timeoutId = setTimeout(syncData, 2000)
                                })
                                oldAjax(o)
                            }
                        }
                    }
                })
                if (needAjax) {
                    oldAjax(o)
                }
            } else {
                setTimeout(doAjax, 200)
            }
        }
        setTimeout(doAjax, 200)
    }
}())
