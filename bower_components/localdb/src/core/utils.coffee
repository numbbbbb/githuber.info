define (require, exports, module) ->
    "use strict"

    ObjectID = require("lib/bson")

    Utils = {}

    toString = Object.prototype.toString

    ###
     *  isEqual function is implemented by underscore and I just rewrite in coffee.
     *  https://github.com/jashkenas/underscore/blob/master/underscore.js
    ###
    eq = (a, b, aStack, bStack) ->
        return a isnt 0 or 1 / a is 1 / b if a is b
        return false if a is null and b is undefined
        return false if a is undefined and b is null
        className = toString.call(a)
        return false if className isnt toString.call(b)
        switch className
            when "[object RegExp]" then return "" + a is "" + b
            when "[object String]" then return "" + a is "" + b
            when "[object Number]"
                return +b isnt +b if +a isnt +a
                return if +a is 0 then 1 / +a is 1 / b else +a is +b
            when "[object Date]" then return +a is +b
            when "[object Boolean]" then return +a is +b
        areArrays = className is "[object Array]"
        if not areArrays
            return false if typeof a isnt "object" or typeof b isnt "object"
            aCtor = a.constructor
            bCtor = b.constructor
            return false if (aCtor isnt bCtor) and not (Utils.isFunction(aCtor) and aCtor instanceof aCtor and Utils.isFunction(bCtor) and bCtor instanceof bCtor) and ("constructor" of a and "constructor" of b)
        length = aStack.length
        while length--
            return bStack[length] is b if aStack[length] is a
        aStack.push(a)
        bStack.push(b)
        if areArrays
            size = a.length
            result = size is b.length
            if result
                while size--
                    break if not (result = eq(a[size], b[size], aStack, bStack))
        else
            keys = Utils.keys(a)
            size = keys.length
            result = Utils.keys(b).length is size
            if result
                while size--
                    key = keys[size]
                    break if not (result = Utils.has(b, key) and eq(a[key], b[key], aStack, bStack))
        aStack.pop()
        bStack.pop()
        return result

    _isType = (type) -> (obj) -> toString.call(obj).toLowerCase() is "[object #{type}]".toLowerCase()

    Utils.isType = (ele, type) -> _isType(type)(ele)

    Utils.isObject = _isType "object"

    Utils.isString = _isType "string"

    Utils.isNumber = _isType "number"

    Utils.isArray = _isType "array"

    Utils.isFunction = _isType "function"

    Utils.isRegex = _isType "regexp"

    Utils.keys = (obj) ->
        return [] if not Utils.isObject(obj)
        return Object.keys(obj) if Object.keys
        # return (key for key of obj when Utils.has(obj, key))

    Utils.has = (obj, key) -> obj? and Object.prototype.hasOwnProperty.call(obj, key)

    Utils.isEqual = (a, b) -> eq(a, b, [], [])

    Utils.createObjectId = -> (new ObjectID()).inspect()

    Utils.stringify = (arr) ->
        return "[]" if not arr? or not Utils.isArray(arr)
        JSON.stringify arr, (key, value) ->
            return value.toString() if Utils.isRegex(value) or Utils.isFunction(value)
            return value

    Utils.parse = (str) ->
        return [] if not str? or not Utils.isString(str)
        JSON.parse str, (key, value) ->
            try v = eval(value)
            return v if v? and Utils.isRegex(v)
            try v = eval("(" + value  + ")")
            return v if v? and Utils.isFunction(v)
            return value

    Utils.parseParas = (paras) ->
        options = {}
        callback = null
        if paras.length is 1
            if Utils.isObject(paras[0])
                options = paras[0]
            else if Utils.isFunction(paras[0])
                callback = paras[0]
        else if paras.length is 2
            options = paras[0] if Utils.isObject(paras[0])
            callback = paras[1] if Utils.isFunction(paras[1])
        return [options, callback]

    Utils.getTimestamp = (objectId) -> (new ObjectID(objectId)).getTimestamp()
        
    Utils.getTime = (objectId) -> (new ObjectID(objectId)).getTime()

    Utils.toUnicode = (string) ->
        result = [""]
        index = 1
        while index <= string.length
            char = string.charCodeAt(index - 1)
            uniChar = "00" + char.toString(16)
            uniChar = uniChar.slice(-4)
            result.push(uniChar)
            index += 1
        result.join("\\u")

    Utils.fromUnicode = (string) -> unescape(string.replace(/\\/g,"%"))

    Utils.getSubValue = (value, key) ->
        return value if not value?
        keyArr = key.split(".")
        for k in keyArr
            value = value[k]
            return value if not value?
        return value

    ###
      * 快速排序
      * @param array 待排序数组
      * @param key 排序字段
      * @param order 排序方式（1:升序，-1降序）
    ###
    Utils.quickSort = (array, key, order) ->
        throw new Error("type Error: key") if not Utils.isString(key)
        return array if array.length <= 1
        pointValue = array.splice(0, 1)[0]
        pointCompareValue = Utils.getSubValue(pointValue, key)
        leftArr = []
        rightArr = []
        for value in array
            compareValue = Utils.getSubValue(value, key)
            ##属性不存在则算最小值
            (if not compareValue? or compareValue < pointCompareValue then leftArr else rightArr).push value
        Utils.quickSort((if order is 1 then leftArr else rightArr), key, order).concat([pointValue], Utils.quickSort((if order is 1 then rightArr else leftArr), key, order))

    ###
      * 数据排序
    ###
    Utils.sortObj = (data, sortObj) ->
        return data if not sortObj?
        result = data
        sortArr = []
        sortArr.unshift {key: key, order: order} for key, order of sortObj
        for sort in sortArr
            result = Utils.quickSort(result, sort.key, sort.order)
        return result

    ###
     *  根据src获取iframe
    ###
    Utils.getIframe = (src) ->
        allFrames = document.getElementsByTagName("iframe")
        for frame in allFrames when frame.src.indexOf(src) is 0
            return frame
        return null

    ###
     *  创建Iframe
    ###
    Utils.createIframe = (src) ->
        iframe = Utils.getIframe(src)
        return iframe if iframe?
        iframe = document.createElement "iframe"
        iframe.src = src
        iframe.style.width = "1px"
        iframe.style.height = "1px"
        iframe.style.display = "none"
        document.body.appendChild(iframe)
        return iframe

    Utils.getDomain = (url) -> url.match(/(https?:\/\/)?([^\/]+)/)[2].split(":")[0]

    Utils.getOrigin = (url) -> url.match(/(https?:\/\/)?([^\/]+)/)[0]

    module.exports = Utils