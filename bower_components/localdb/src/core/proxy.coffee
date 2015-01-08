define (require, exports, module) ->
    "use strict"

    Evemit = require("lib/evemit")
    Utils = require("core/utils")

    class Proxy

        constructor: (options) ->
            self = @
            @expire = options.expire
            @encrypt = options.encrypt
            @name = options.name
            @proxy = options.proxy
            @insert_guarantee = options.insert_guarantee
            @evemit = new Evemit()
            @iframe = Utils.createIframe @proxy
            Evemit.bind window, "message", (e) ->
                result = JSON.parse e.data
                return if self.proxy.indexOf(e.origin) is -1
                if result.data?
                    self.evemit.emit result.eve, result.data, result.err
                else
                    self.evemit.emit result.eve, result.err

        sendMessage: (type, data, callback) ->
            self = @
            eve = type + "|" + new Date().getTime()
            data.eve = eve
            data.expire = @expire
            data.encrypt = @encrypt
            data.name = @name
            data.insert_guarantee = @insert_guarantee
            @evemit.once eve, callback
            data = JSON.stringify data
            ifrWin = @iframe.contentWindow
            ###
             *  当加载非同源iframe时，不能简单的通过 iframe.contentWindow.document.readystate来判断页面是否为complete
             *  第一: readystate为complete不代表server端的localDB初始化完成
             *  第二: 一旦非同源iframe加载完成，则无法访问到readystate
             *  因此通过能否访问到iframe.contentWindow.document来判断其是否完成加载
                *   如果能访问到，则给iframe的load事件增加函数
                *   如果不能访问到，则直接iframe.contentWindow.postMessage发送请求
            ###
            try
                ifrWin.document
                Evemit.bind @iframe, "load", ->
                    ifrWin.postMessage data, Utils.getOrigin(self.proxy)
            catch e
                ifrWin.postMessage data, Utils.getOrigin(@proxy)

        key: (index, callback) -> @sendMessage "key", {index: index}, callback

        size: (callback) -> @sendMessage "size", {}, callback

        setItem: (key, val, callback) -> @sendMessage "setItem", {key: key, val: val}, callback

        getItem: (key, callback) -> @sendMessage "getItem", {key: key}, callback

        removeItem: (key, callback) -> @sendMessage "removeItem", {key: key}, callback

        usage: (callback) -> @sendMessage "usage", {}, callback


    module.exports = Proxy