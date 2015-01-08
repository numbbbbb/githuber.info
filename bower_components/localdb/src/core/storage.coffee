define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")
    Support = require("lib/support")
    Encrypt = require("lib/encrypt")

    class Storage

        constructor: (options) ->
            @expire = options.expire
            @encrypt = options.encrypt
            @token = options.name
            @insert_guarantee = options.insert_guarantee
            if @expire is "window"
                throw new Error("sessionStorage is not supported!") if not Support.sessionstorage()
                @storage = sessionStorage
            else if @expire is "none"
                throw new Error("localStorage is not supported!") if not Support.localstorage()
                @storage = localStorage

        key: (index, callback) ->
            try
                key = @storage.key(index)
            catch e
                callback(-1, e)
            callback(key)
            return

        size: (callback) ->
            try
                size = @storage.length
            catch e
                callback(-1, e)
            callback(size)
            return

        setItem: (key, val, callback) ->
            self = @
            cnt = 0
            try
                val = Encrypt.encode(val, @token) if @encrypt
                @storage.setItem(key, val)
            catch e
                ### TODO
                 *  增加过期时间配置项
                ###
                if not @insert_guarantee
                    callback(e)
                    return
                val = Encrypt.decode(val, @token) if @encrypt
                data = Utils.parse val
                while cnt > 10
                    try
                        data.splice(0, 1)
                        val = Utils.stringify(data)
                        val = Encrypt.encode(val, self.token) if self.encrypt
                        self.storage.setItem(key, val)
                        cnt = 11
                    catch e
                        cnt += 1
            callback (new Error("exceed maximum times trying setItem into Storage") if cnt > 10)
            return

        getItem: (key, callback) ->
            try
                item = @storage.getItem(key)
                item = Encrypt.decode(item, @token) if @encrypt
            catch e
                callback(null, e)
            callback(item)
            return

        removeItem: (key, callback) ->
            try
                @storage.removeItem(key)
            catch e
                callback(e)
            callback()
            return

        usage: (callback) ->
            ###
             *  check it out: http://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
            ###
            try
                allStrings = ""
                for key, val of @storage
                    allStrings += val
            catch e
                callback(-1, e)
            callback(allStrings.length / 512)

    module.exports = Storage