define (require, exports, module) ->
    "use strict"

    Evemit = require("lib/evemit")
    Utils = require("core/utils")
    Storage = require("core/storage")

    class Server

        constructor: (@config) ->
            @allow = @config.allow or "*"
            @deny = @config.deny or []
            @storages = {}

        postParent: (mes, origin) ->
            top.postMessage(JSON.stringify(mes), origin)

        ###
         *  支持正则表达式
         *  支持*.xxx.com/www.*.com/www.xxx.*等格式
        ###
        checkOrigin: (origin) ->
            origin = Utils.getDomain(origin)
            if Utils.isString(@allow)
                return false if not @checkRule(origin, @allow)
            else
                flag = true
                for rule in @allow when @checkRule(origin, rule)
                    flag = false
                    break
                return false if flag
            if Utils.isString(@deny)
                return false if @checkRule(origin, @deny)
            else
                for rule in @deny when @checkRule(origin, rule)
                    return false
            return true

        checkRule: (url, rule) ->
            return rule.test(url) if Utils.isRegex(rule)
            if rule.indexOf("*") isnt -1
                segList = rule.split("*")
                for seg in segList
                    return false if url.indexOf(seg) is -1
            else
                return url is rule
            return true

        init: ->
            self = @
            Evemit.bind window, "message", (e) ->
                origin = e.origin
                return false if not self.checkOrigin(origin)
                result = JSON.parse e.data
                if not self.storages[result.name]?
                    self.storages[result.name] = new Storage(result)
                storage = self.storages[result.name]
                switch result.eve.split("|")[0]
                    when "key"
                        storage.key result.index, (data, err) ->
                            result.data = data
                            result.err = err
                            self.postParent(result, origin)
                    when "size"
                        storage.size (data, err) ->
                            result.data = data
                            result.err = err
                            self.postParent(result, origin)
                    when "setItem"
                        storage.setItem result.key, result.val, (err) ->
                            result.err = err
                            self.postParent(result, origin)
                    when "getItem"
                        storage.getItem result.key, (data, err) ->
                            result.data = data
                            result.err = err
                            self.postParent(result, origin)
                    when "removeItem"
                        storage.removeItem result.key, (err) ->
                            result.err = err
                            self.postParent(result, origin)
                    when "usage"
                        storage.usage (data, err) ->
                            result.data = data
                            result.err = err
                            self.postParent(result, origin)
    module.exports = Server