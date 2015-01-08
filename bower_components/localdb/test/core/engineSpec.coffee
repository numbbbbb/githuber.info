define (require, exports, module) ->
    "use strict"

    Engine = require("core/engine")

    describe "Engine", ->
        options = {
            expire: "window"
            encrypt: true
            name: "test"
        }
        optionsProxy = {
            expire: "none"
            encrypt: true
            name: "test2"
            proxy: "http://localdb.emptystack.net/server.html"
        }

        engine = new Engine(options)
        # engineProxy = new Engine("none", true, "test")
        engineProxy = new Engine(optionsProxy)

        it "Init", ->
            expect(engine instanceof Engine).toEqual(true)
            expect(engineProxy instanceof Engine).toEqual(true)
        
        it "setItem", ->
            engine.setItem "key123", "value123", (err) ->
                console.log "Engine setItem err: ", err
            engineProxy.setItem "proxy_key123", "proxy_value123", (err) ->
                console.log "proxy Engine setItem err: ", err

        it "key", ->
            engine.key 0, (key, err) ->
                console.log "Engine key err: ", key, err
            engineProxy.key 0, (key, err) ->
                console.log "proxy Engine key err: ", key, err
        
        it "size", ->
            engine.size (size, err) ->
                console.log "Engine size err: ", size, err
            engineProxy.size (size, err) ->
                console.log "proxy Engine size err: ", size, err

        it "getItem", ->
            engine.getItem "key123", (data, err) ->
                console.log "Engine getItem err: ", data, err
            engineProxy.getItem "proxy_key123", (data, err) ->
                console.log "proxy Engine getItem err: ", data, err

        it "usage", ->
            engine.usage (usage, err) ->
                console.log "Engine usage err: ", usage, err
            engineProxy.usage (usage, err) ->
                console.log "proxy Engine usage err: ", usage, err

        it "removeItem", ->
            engine.removeItem "key123", (err) ->
                console.log "Engine removeItem err: ", err
            engineProxy.removeItem "proxy_key123", (err) ->
                console.log "proxy Engine removeItem err: ", err

