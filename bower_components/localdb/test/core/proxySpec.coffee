define (require, exports, module) ->

    'use strict'
    Proxy = require('core/proxy')

    describe 'Proxy', ->
        options = {
            expire: "none"
            encrypt: true
            name: "test"
            proxy: "http://localdb.emptystack.net/server.html"
        }
        proxy = new Proxy(options)
        it 'setItem', ->
            proxy.setItem "name", "Arron", (data) ->
                console.log("proxy=======>setItem==" + data)
        it 'key', ->
            proxy.key 0, (data) ->
                console.log("proxy=======>key==" + data)
        it 'size', ->
            proxy.size (data) ->
                console.log("proxy=======>size==" + data)
        it 'getItem', ->
            proxy.getItem "name", (data) ->
                console.log("proxy=======>getItem==" + data)
        it 'removeItem', ->
            proxy.removeItem "name", (data) ->
                console.log("proxy=======>removeItem==" + data)
        it 'usage', ->
            proxy.usage (data) ->
                console.log("proxy=======>usage==" + data)