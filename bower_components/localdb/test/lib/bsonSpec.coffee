define (require, exports, module) ->
    "use strict"

    ObjectID = require("lib/bson")

    describe "ObjectID", ->

        it "Init", ->
            a = new ObjectID()
            console.log a.toHexString()
            console.log a.toString()
            console.log a.id
            console.log a.inspect()
            console.log a.getTimestamp()
            console.log a.getTime()
            console.log a.get_inc()
            b = new ObjectID(a.inspect())
            console.log b.inspect()
            expect(a.inspect()).toEqual(b.inspect())
            try
                c = new ObjectID("asdfa")
                throw new Error("should not be here")
            catch e
                expect(e.message).toEqual("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters")
            try
                c = new ObjectID("aaaaaaaaaaaaaaaaaaaaaaa*")
                throw new Error("should not be here")
            catch e
                expect(e.message).toEqual("Value passed in is not a valid 24 character hex string")
        
