define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")

    Projection = {}

    Projection.generate = (data, projection) ->
        return data if JSON.stringify(projection) is "{}"
        result = []
        for d in data
            item = generateItem(d, projection)
            result.push(item) if not Utils.isEqual(item, {})
        return result

    generateItem = (item, projection) ->
        result = {}
        idFlag = true
        for key, value of projection
            if key is "_id" and value is -1
                idFlag = false
                continue
            if key.indexOf(".$") isnt -1
                key = key.split(".")[0]
                continue if not Utils.isArray(item[key]) or item[key].length is 0
                result[key] = [item[key][0]]
            else if key.indexOf("$elemMatch") is 0
                return [] if not Utils.isArray(item) or item.length is 0
                r = []
                for i in item
                    flag = true
                    for v_key, v_value of value
                        if Utils.isObject(v_value)
                            # console.log "TODO"
                        else
                            flag = false if i[v_key] isnt v_value
                    if flag
                        r.push i
                        break
                return [] if Utils.isEqual(r, [])
                return r
            else if Utils.isObject(value)
                gItem = generateItem(item[key], value)
                result[key] = gItem if not Utils.isEqual(gItem, [])
            else
                result[key] = item[key] if value is 1
        result._id = item._id if idFlag and not Utils.isEqual(result, {})
        return result

    module.exports = Projection