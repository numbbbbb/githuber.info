define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")

    reservedKeys = [
        "$gt", "$gte", "$lt", "$lte", "$ne", "$in", "$nin"  #Comparison
        "$and", "$nor", "$or", "$not"                       #Logical
        "$exists", "$type"                                  #Element
        "$mod", "$regex"                                    #Evaluation
        "$all", "$elemMatch", "$size"                       #Array
    ]

    isKeyReserved = (key) -> key in reservedKeys

    Where = (data, conditions) ->
        ###
         *  如果key中包含dot的话，则执行dotCheck
         *  执行valueCheck
         *  如果返回值为true的话，执行keywordCheck
        ###
        for key, condition of conditions
            if not data?
                continue if key is "$exists" and condition is false
                return false
            #dot check
            (if dotCheck(data, key, condition) then continue else return false) if key.indexOf(".") isnt -1
            #value check
            return false if not valueCheck(data, key, condition)
            #keywordCheck
            return false if not keywordCheck(data, key, condition)
        return true

    dotCheck = (data, key, condition) ->
        firstKey = key.split(".")[0]
        Where data[if /\d/.test(firstKey) then Number(firstKey) else firstKey], (new -> @[key.substr(key.indexOf(".") + 1)] = condition;return)

    valueCheck = (data, key, condition) ->
        ###
         *  如果key是关键字，则返回true
         *  如果condition是数字，则执行numberCheck
         *  如果condition是字符串，则执行stringCheck
         *  如果condition是正则表达式，则执行regexCheck
         *  如果condition是数组，则执行arrayCheck
         *  如果condition是对象，则执行objectCheck
        ###
        return true if isKeyReserved(key)
        d = data[key]
        return false if Utils.isNumber(condition) and not numberCheck(d, condition)
        return false if Utils.isString(condition) and not stringCheck(d, condition)
        return false if Utils.isRegex(condition) and not regexCheck(d, condition)
        return false if Utils.isArray(condition) and not arrayCheck(d, condition)
        return false if Utils.isObject(condition) and not objectCheck(d, condition)
        return true

    keywordCheck = (data, key, condition) ->
        switch key
            when "$gt" then return false if data <= condition
            when "$gte" then return false if data < condition
            when "$lt" then return false if data >= condition
            when "$lte" then return false if data > condition
            when "$ne" then return false if data is condition
            when "$in"
                if Utils.isArray(data)
                    flag = true
                    for d in data when flag
                        flag = false if (-> return true for c in condition when (Utils.isRegex(c) and c.test(d) or (Utils.isEqual(c, d)));false)()
                    return false if flag
                else
                    return false if not (-> return true for c in condition when (Utils.isRegex(c) and c.test(data) or (Utils.isEqual(c, data)));false)()
            when "$nin" then return false if data in condition
            when "$exists" then return false if condition isnt data?
            when "$type" then return false if not Utils.isType(data, condition)
            when "$mod" then return false if data % condition[0] isnt condition[1]
            when "$regex" then return false if not (new RegExp(condition)).test(data)
            when "$and" then return false for c in condition when not Where(data, c)
            when "$nor" then return false for c in condition when Where(data, c)
            when "$or" then return false if not (-> return true for c in condition when Where(data, c);false)()
            when "$not" then return false if Where(data, condition)
            when "$all"
                return false if not Utils.isArray(data)
                return false for c in condition when not (-> return true for d in data when if Utils.isArray(c) then keywordCheck(d, key, c) else d is c)()
            when "$elemMatch"
                return false if not Utils.isArray(data)
                return false if not (-> return true for d in data when Where(d, condition))()
            when "$size"
                return false if not Utils.isArray(data)
                return false if data.length isnt condition
        return true


    numberCheck = (data, cmpData) ->
        ### Number Check
         *  cmpData: 1
         *  data: 1 or [1,2,3]
        ###
        return true if Utils.isNumber(data) and cmpData is data
        return true if Utils.isArray(data) and (cmpData in data)
        return false

    stringCheck = (data, cmpData) ->
        ### String Check
         *  cmpData: "abc"
         *  data: "abc" or ["abc","aaa","bbbb"]
        ###
        return true if Utils.isString(data) and cmpData is data
        return true if Utils.isArray(data) and (cmpData in data)
        return false

    regexCheck = (data, cmpData) ->
        ### Regex Check
         *  cmpData: /abc/
         *  data: "abcd" or ["abcdf","aaaa","basc","abce"] or /abc/ or [/abc/,/bce/,/hello.*ld/]
        ###
        if Utils.isArray(data)
            for d in data
                if Utils.isRegex(d)
                    return true if Utils.isEqual(d, cmpData)
                else
                    return true if cmpData.test(d)
        else
            if Utils.isRegex(data)
                return true if Utils.isEqual(data, cmpData)
            else
                return true if cmpData.test(data)
        return false

    arrayCheck = (data, cmpData) -> Utils.isEqual(data, cmpData)

    objectCheck = (data, conditions) ->
        flag = true
        for key, c of conditions when isKeyReserved(key)
            flag = false
            return false if not Where(data, (new -> @[key] = c;return))
        return if flag then Utils.isEqual(data, conditions) else true

    module.exports = Where