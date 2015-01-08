define (require, exports, module) ->
    "use strict"

    Encrypt = require("lib/encrypt")

    describe "Encrypt", ->
        it "encode", ->
            value = "刘强东喝奶茶1234567890+=——_·！@#￥%……&*（）——+￥{}[].,;"
            key = "奶茶妹"
            str = Encrypt.encode(value, key)
            console.log(value + "加密后：" + str)
            str2 = Encrypt.decode(str, key)
            console.log(str + "解密后：" + str2)
            expect(str2).toEqual(value)
            str3 = Encrypt.encode(undefined, key)
            expect(str3).toEqual(null)