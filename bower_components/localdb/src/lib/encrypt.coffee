define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")
    Sha1 = require("lib/sha1")
    Encrypt = {}
   
    ###
      * 加密
    ###
    Encrypt.encode = (value, key) ->
        return null if not value?
        resultArr = [""]
        key = Sha1.hex_sha1(key)
        unicodeValue = Utils.toUnicode(value)
        unicodeKey = Utils.toUnicode(key)
        uniValueArr = unicodeValue.split('\\u').slice(1)
        uniKeyArr = unicodeKey.split('\\u').slice(1)
        len = uniKeyArr.length
        for uniValue,index in uniValueArr
            mod = index % len
            uniKey = uniKeyArr[mod]
            encodeVal = parseInt(uniValue, 16) + parseInt(uniKey, 16)
            encodeVal = encodeVal - 65536 if encodeVal > 65536
            comEncodeVal = ('00' + encodeVal.toString(16)).slice(-4)
            resultArr.push(comEncodeVal)
        resultStr = resultArr.join('\\u')
        Utils.fromUnicode(resultStr)
    
    ###
      * 解密
    ###
    Encrypt.decode = (value, key) ->
        return null if value is null
        resultArr = [""]
        key = Sha1.hex_sha1(key)
        unicodeValue = Utils.toUnicode(value)
        unicodeKey = Utils.toUnicode(key)
        uniValueArr = unicodeValue.split("\\u").slice(1)
        uniKeyArr = unicodeKey.split("\\u").slice(1)
        len = uniKeyArr.length
        for uniValue,index in uniValueArr
            mod = index % len
            uniKey = uniKeyArr[mod]
            encodeVal = parseInt(uniValue, 16) - parseInt(uniKey, 16)
            encodeVal = 65536 + encodeVal if encodeVal < 0
            comEncodeVal = ("00" + encodeVal.toString(16)).slice(-4)
            resultArr.push(comEncodeVal)
        resultStr = resultArr.join("\\u")
        Utils.fromUnicode(resultStr)
    
     module.exports = Encrypt