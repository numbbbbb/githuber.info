define (require, exports, module) ->
    "use strict"

    LocalDB = require("localdb")
    Collection = require("core/collection")
    Utils = require("core/utils")

    db = new LocalDB "foo"

    describe "Collection Promise", ->

        it "InsertPromise", ->
            InsertPromise_bar = db.collection("InsertPromise")
            InsertPromise_bar.drop()
                .then( -> InsertPromise_bar.find())
                .then( (data) -> console.log "InsertPromise --->", data.length)
                .then( ->
                    InsertPromise_bar.insert {
                        a: 1
                        b: "abc"
                        c: /hell.*ld/
                        d: {e: 4, f: "5"}
                        g: (h) -> return h * 3
                        i: [1,2,3]
                    }
                )
                .then( -> InsertPromise_bar.find())
                .then( (data) ->
                    console.log data.length, data[0]
                    data = data[0]
                    expect(data.a).toEqual(1)
                    expect(data.b).toEqual("abc")
                    expect(data.c.test("hello world")).toEqual(true)
                    expect(data.d).toEqual({e:4, f: "5"})
                    expect(Utils.isFunction(data.g)).toEqual(true)
                    expect(data.g(100)).toEqual(300)
                    expect(data.i).toEqual([1,2,3])
                )

        it "InsertListPromise", ->
            InsertListPromise_bar = db.collection("InsertListPromise")
            InsertListPromise_bar.drop()
                .then( ->
                    InsertListPromise_bar.insert [
                        {
                            a:1
                            b:2
                            c:3
                        },
                        {
                            a:2
                            b:3
                            c:4
                        }
                    ]
                )
                .then( ->
                    InsertListPromise_bar.find()
                )
                .then( (data) ->
                    expect(data.length).toEqual(2)
                    InsertListPromise_bar.insert [
                        {
                            a:1
                            b:2
                            c:3
                        }
                        4 #只能插入对象，该数据将被过滤掉，不会被插入
                        {
                            a:2
                            b:3
                            c:4
                        }
                    ]
                )
                .then( ->
                    InsertListPromise_bar.find()
                )
                .then( (data) ->
                    expect(data.length).toEqual(4)
                )

        it "UpdatePromise", ->
            UpdatePromise_bar = db.collection("UpdatePromise")
            UpdatePromise_bar.drop()
                .then( ->
                    UpdatePromise_bar.insert [
                        {a: 1,b: 2}
                        {a: 1,b: 3}
                        {a: 2,b: 4}
                    ]
                )
                .then( ->
                    UpdatePromise_bar.update {
                        $set: {
                            a:3
                        }
                        $inc: {
                            b: 2
                        }
                    }
                )
                .then( ->
                    UpdatePromise_bar.findOne()
                )
                .then( (data) ->
                    expect(data.a).toEqual(3)
                )

        it "RemovePromise", ->
            RemovePromise_bar = db.collection("RemovePromise")
            RemovePromise_bar.drop()
                .then( ->
                    RemovePromise_bar.insert [
                        {a: 1,b: 2}
                        {a: 1,b: 3}
                        {a: 2,b: 4}
                    ]
                )
                .then( -> RemovePromise_bar.remove())
                .then( -> RemovePromise_bar.find())
                .then( (data) -> expect(data).toEqual([]))

        it "FindOnePromise", ->
            FindOnePromise_bar = db.collection("FindOnePromise")
            FindOnePromise_bar.drop()
                .then( ->
                    FindOnePromise_bar.insert [
                        {
                            a: 1
                            b: 2
                            c: {d: 3, e:4}
                            f: (x) -> x * x
                            g: [1,2,3,4]
                            h: "abc"
                            price: 10.99
                            max1: 100
                            max2: 200
                            min1: 50
                            min2: 30
                        },{
                            a: 1
                            b: 2
                            c: {d: 3, e:4}
                            f: (x) -> x * x
                            g: [1,2,3,4]
                            h: "abc"
                            price: 10.99
                            max1: 100
                            max2: 200
                            min1: 50
                            min2: 30
                        }
                    ]
                )
                .then( -> FindOnePromise_bar.findOne {where: {a:1}})
                .then( (data) -> expect(data.a).toEqual(1))


