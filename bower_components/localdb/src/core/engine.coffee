define (require, exports, module) ->
    "use strict"

    Support = require("lib/support")
    Storage = require("core/storage")
    Proxy = require("core/proxy")

    class Engine

        constructor: (options) ->
            ### TODO
             *  增加 @expire 类型判断，目前应该只有"none"和"window"，后续会增加"browser"和Date()类型
            ###
            proxy = options.proxy
            @name = options.name
            if proxy?
                proxy = proxy.trim()
                proxy = "http://" + proxy if proxy.indexOf("http") is -1
                @proxy = new Proxy(options)
            else
                @storage = new Storage(options)
            return

        key: (index, callback) -> (if @proxy? then @proxy else @storage).key(index, callback)

        size: (callback) -> (if @proxy? then @proxy else @storage).size(callback)

        setItem: (key, val, callback) -> (if @proxy? then @proxy else @storage).setItem(key, val, callback)

        getItem: (key, callback) -> (if @proxy? then @proxy else @storage).getItem(key, callback)

        removeItem: (key, callback) -> (if @proxy? then @proxy else @storage).removeItem(key, callback)

        usage: (callback) -> (if @proxy? then @proxy else @storage).usage(callback)

    module.exports = Engine