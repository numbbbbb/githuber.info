define (require, exports, module) ->
    "use strict"
    
    LocalDB = require("localdb")
    Support = require("lib/support")
    Collection = require("core/collection")


    describe "LocalDB", ->

        it "wrong usage", ->
            try
                db = new LocalDB()
            catch e
                expect(e.message).toEqual("dbName should be specified.")

        it "new LocalDB", ->
            db = new LocalDB "foo", {
                expire: "none"
                encrypt: false
            }
            expect(db instanceof LocalDB).toEqual(true)

        it "new LocalDB with proxy", ->
            db = new LocalDB "foo_proxy", {
                expire: "none"
                encrypt: false
                proxy: "http://localdb.emptystack.net/server.html"
            }
            expect(db instanceof LocalDB).toEqual(true)

        it "options", ->
            db = new LocalDB "foo2", {
                expire: "window"
                encrypt: false
            }
            options = db.options()
            expect(options.name).toEqual("foo2")
            expect(options.expire).toEqual("window")
            expect(options.encrypt).toEqual(false)
            expect(options.proxy?).toEqual(false)

        it "collection", ->
            db = new LocalDB "foo3"
            collection = db.collection "bar"
            expect(collection instanceof Collection).toEqual(true)

        it "support", ->
            support = LocalDB.getSupport()
            expect(support).toEqual(Support)

        it "version", ->
            ###
             *  在src/localdb.coffee中version为空
             *  实际上在build的时候会根据package.json中的版本号来进行改写。
            ###
            version = LocalDB.getVersion()
            console.log version
            expect(version).toEqual("")

        it "timestamp", ->
            expect(LocalDB.getTimestamp("543509d5f3692b00001b2b61")).toBeDefined()
            expect(LocalDB.getTime("543509d5f3692b00001b2b61")).toEqual(1412762069000)

        it "server init", ->
            LocalDB.init {
                allow: ["*.baidu.com", "pt.aliexpress.com"]
                deny: "map.baidu.com"
            }


        # it "collections", ->
        #     collections = db.collections()
        #     console.log db.ls.size()
        #     console.log db.collections()
        #     expect(collections).toEqual(["bar"])
        # it "drop collection", ->
        #     db.drop "bar"
        #     collections = db.collections()
        #     expect(collections).toEqual([])
        # it "drop db", ->
        #     bar1 = db.collection("bar1")
        #     bar2 = db.collection("bar2")
        #     bar1.insert({a:1})
        #     bar2.insert({b:2})
        #     db.drop()
        #     collections = db.collections()
        #     expect(collections).toEqual([])
