define (require, exports, module) ->
    "use strict"
 
    BinaryParser = require("lib/binary-parser")
 
    hexTable = ((if i <= 15 then "0" else "") + i.toString(16) for i in [0...256])

    class ObjectID

        constructor: (id, _hex) ->
            @_bsontype = "ObjectID"
            @MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10)
            if id? and id.length isnt 12 and id.length isnt 24
                throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters")
            if not id?
                @id = @generate()
            else if id? and id.length is 12
                @id = id
            else if /^[0-9a-fA-F]{24}$/.test(id)
                return @createFromHexString(id)
            else
                throw new Error("Value passed in is not a valid 24 character hex string")

        generate: ->
            unixTime = parseInt(Date.now() / 1000, 10)
            time4Bytes = BinaryParser.encodeInt(unixTime, 32, true, true)
            machine3Bytes = BinaryParser.encodeInt(@MACHINE_ID, 24, false)
            pid2Bytes = BinaryParser.fromShort(if typeof process is "undefined" then Math.floor(Math.random() * 100000) else process.pid)
            index3Bytes = BinaryParser.encodeInt(@get_inc(), 24, false, true)
            time4Bytes + machine3Bytes + pid2Bytes + index3Bytes

        toHexString: ->
            hexString = ""
            for i in [0...@id.length]
                hexString += hexTable[@id.charCodeAt(i)]
            hexString

        toString: -> @toHexString()

        inspect: -> @toHexString()

        getTime: -> Math.floor(BinaryParser.decodeInt(@id.substring(0, 4), 32, true, true)) * 1000

        getTimestamp: ->
            timestamp = new Date()
            timestamp.setTime(@getTime())
            timestamp

        get_inc: -> ObjectID.index = (ObjectID.index + 1) % 0xFFFFFF

        createFromHexString: (hexString) ->
            result = ''
            for i in [0...24] when i % 2 is 0
                result += BinaryParser.fromByte(parseInt(hexString.substr(i, 2), 16))
            new ObjectID(result, hexString)
 
    ObjectID.index = parseInt(Math.random() * 0xFFFFFF, 10)
 
    module.exports = ObjectID