define (require, exports, module) ->
    "use strict"

    Server = require("core/server")

    describe "Server", ->

        server1 = new Server {
            allow: ["*.baidu.com", "www.taobao.com"]
            deny: "map.baidu.com"
        }

        server2 = new Server {
            allow: "*"
            deny: ["*.baidu.com", "www.sina.com.cn"]
        }

        it "checkOrigin", ->
            expect(server1.checkOrigin("http://www.baidu.com")).toEqual(true)
            expect(server1.checkOrigin("www.baidu.com")).toEqual(true)
            expect(server1.checkOrigin("http://www.baidu.com/")).toEqual(true)
            expect(server1.checkOrigin("http://map.baidu.com")).toEqual(false)
            expect(server1.checkOrigin("www.taobao.com")).toEqual(true)
            expect(server1.checkOrigin("www.sina.com")).toEqual(false)
            expect(server2.checkOrigin("http://www.taobao.com")).toEqual(true)
            expect(server2.checkOrigin("http://www.baidu.com")).toEqual(false)
            expect(server2.checkOrigin("http://www.sina.com.cn")).toEqual(false)
            expect(server2.checkOrigin("tv.sina.com.cn")).toEqual(true)
            expect(server2.checkOrigin("map.baidu.com")).toEqual(false)
            expect(server2.checkOrigin("www.taobao.com")).toEqual(true)