define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")
    Where = require("core/where")
    Projection = require("core/projection")

    Operation = {}

    Operation.insert = (data, rowData, options) ->
        if Utils.isArray(rowData)
            for d in rowData when Utils.isObject(d)
                d._id = Utils.createObjectId() if not d._id?
                data.push d
        else if Utils.isObject(rowData)
            rowData._id = Utils.createObjectId() if not rowData._id?
            data.push rowData
        return data

    Operation.update = (data, actions, options) ->
        where = options.where or {}
        multi = if options.multi? then options.multi else true
        upsert = if options.upsert? then options.upsert else true
        for action, value of actions
            data = Update.generate data, action, value, where, multi, upsert
        return data

    Operation.remove = (data, options) ->
        where = options.where or {}
        multi = if options.multi? then options.multi else true
        result = []
        flag = false
        for d in data
            if flag
                result.push d
                continue
            if Where(d, where)
                flag = true if not multi
                continue
            result.push d
        return result

    Operation.find = (data, options) ->
        where = options.where or {}
        projection = options.projection or {}
        limit = options.limit or -1
        result = []
        for d in data when Where(d, where)
            break if limit is 0
            limit -= 1
            result.push d
        result = Utils.sortObj(result, options.sort)
        return Projection.generate(result, projection)

    Update = {
        isKeyReserved: (key) -> key in ["$inc", "$set", "$mul", "$rename", "$unset", "$max", "$min"]
        generate: (data, action, value, where, multi, upsert) ->
            return data if not Update.isKeyReserved(action)
            for k, v of value
                for d in data when Where(d, where)
                    flag = false
                    while k.indexOf(".") > 0
                        firstKey = k.split(".")[0]
                        d = d[firstKey]
                        if not d? and not upsert
                            flag = true
                            break
                        d = d or {} if upsert
                        k = k.substr(k.indexOf(".") + 1)
                    continue if flag
                    switch action
                        when "$inc" then d[k] += v if d[k]? or upsert
                        when "$set" then d[k] = v if d[k]? or upsert
                        when "$mul" then d[k] *= v if d[k]? or upsert
                        when "$rename"
                            d[v] = d[k]
                            delete d[k]
                        when "$unset"
                            delete d[k]
                        when "$min" then d[k] = Math.min(d[k], v) if d[k]? or upsert
                        when "$max" then d[k] = Math.max(d[k], v) if d[k]? or upsert
                    break if not multi
            return data
    }

    module.exports = Operation