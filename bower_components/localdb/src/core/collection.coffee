define (require, exports, module) ->
    "use strict"

    ###*
     *  该callback只接受err参数
     *  @callback CallbackStatus
     *  @param  {Error} err - 返回错误信息，null则表示success
    ###

    ###*
     *  该callback接受两个参数，第一个参数为具体数据信息，第二个参数为err
     *  @callback CallbackData
     *  @param  {*} data - 返回的数据
     *  @param  {Error} err - 返回错误信息，null则表示success
    ###

    Promise = require("lib/promise")
    Utils = require("core/utils")
    Operation = require("core/operation")

    ###*
     *  @class Collection
     *  @classdesc Collection类用来操作collection集合，Collection不直接进行初始化，而是通过db来获取，具体方式参考Example
     *  @author [wh1100717]{@link https://github.com/wh1100717}
     *  @param  {String}    collectionName - 集合名
     *  @param  {Engine}    engine - 使用的引擎
     *  @return {Collection}   Instance of Collection Class
     *
     *  @todo Update Actions 文档需要撰写
     *  @todo Where 支持的操作文档需要撰写
     *  @todo Promise 相关使用方式文档撰写
     *  @todo Projection 相关使用方式文档撰写
     *  @todo Sort 相关使用方式文档撰写
     *
     *  @example
     db = new LocalDB("foo")
     var collection = db.collection("bar")
    ###
    class Collection

        constructor: (collectionName, @engine) -> @name = "#{engine.name}_#{collectionName}"

        ###*
         *  @function Collection#deserialize
         *  @desc 从engine中获取数据并将其转化为对象
         *  @instance
         *  @private
         *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
        ###
        deserialize: (callback) -> @engine.getItem @name, (data, err) ->
            callback(Utils.parse(data), err)

        ###*
         *  @function Collection#serialize
         *  @desc 将数据存储到engine中
         *  @instance
         *  @private
         *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
        ###
        serialize: (data, callback) -> @engine.setItem @name, Utils.stringify(data), callback

        ###*
         *  @function Collection#drop
         *  @desc 执行删除集合操作
         *  @instance
         *  @param {CallbackStatus} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
        ###
        drop: (callback) ->
            self = @
            promiseFn = (resolve, reject) ->
                self.engine.removeItem self.name, (err) ->
                    callback(err) if callback?
                    if err?
                        reject(err)
                    else
                        resolve()
            new Promise(promiseFn)

        ###*
         *  @function Collection#insert
         *  @desc 集合执行插入数据操作
         *  @instance
         *  @param {Object|Array<Object>} rowData 要插入的源数据
         *  @param {Object} [options]   配置参数，预留配置参数接口，目前没有用到
         *  @param {CallbackStatus} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
         *
         *  @todo 对rowData数组类型进行判断
         *  @todo 对options参数进行判断，如果判断为false的，则调用callback(err)及rejct(err)
        ###
        insert: (rowData, paras...) ->
            [options, callback] = Utils.parseParas(paras)
            self = @
            promiseFn = (resolve, reject) ->
                self.deserialize (data, err) ->
                    if err?
                        callback(err) if callback?
                        reject(err)
                    else
                        data = Operation.insert data, rowData, options
                        self.serialize data, (err) ->
                            callback(err) if callback?
                            if err?
                                reject(err)
                            else
                                resolve()
            new Promise(promiseFn)

        ###*
         *  @function Collection#update
         *  @desc 集合执行更新数据操作
         *  @instance
         *  @param {Object} actions 更新操作，目前支持$inc, $set, $mul, $rename, $unset, $min, $max操作
         *  @param {Object} [options]   配置参数
         *  @param {Object} [options.where] 更新条件匹配参数
         *  @param {Boolean} [options.multi] false表示只更新匹配上的第一条数据，true表示更新全部匹配数据，默认为true
         *  @param {Boolean} [options.upsert] true表示如果更新的数据的key不存在则插入该数据，false则丢弃，默认为true
         *  @param {CallbackStatus} [callback] 需要异步执行的回调函数，支持Promise异步编程方式
        ###
        update: (actions, paras...) ->
            [options, callback] = Utils.parseParas(paras)
            self = @
            promiseFn = (resolve, reject) ->
                self.deserialize (data, err) ->
                    if err
                        callback(err) if callback?
                        reject(err)
                    else
                        data = Operation.update data, actions, options
                        self.serialize data, (err) ->
                            callback(err) if callback?
                            if err?
                                reject(err)
                            else
                                resolve()
            new Promise(promiseFn)

        ###*
         *  @function Collection#remove
         *  @desc 集合执行删除数据操作
         *  @instance
         *  @param {Object} [options]   配置参数
         *  @param {Object} [options.where] 删除条件匹配参数
         *  @param {Boolean} [options.multi] false表示只删除匹配上的第一条数据，true表示删除全部匹配数据，默认为true
         *  @param {CallbackStatus} [callback] 需要异步执行的回调函数，支持Promise异步编程方式
        ###
        remove: (paras...) ->
            [options, callback] = Utils.parseParas(paras)
            self = @
            promiseFn = (resolve, reject) ->
                self.deserialize (data, err) ->
                    if err?
                        callback(err) if callback?
                        reject(err)
                    else
                        data = Operation.remove data, options
                        self.serialize data, (err) ->
                            callback(err) if callback?
                            if err?
                                reject(err)
                            else
                                resolve()
            new Promise(promiseFn)

        ###*
         *  @function Collection#find
         *  @desc 集合执行查询数据操作
         *  @instance
         *  @param {Object} [options]   配置参数
         *  @param {Object} [options.where] 查询条件匹配参数
         *  @param {Object} [options.projection] 返回数据格式配置参数
         *  @param {Number} [options.limit] 返回数据数量配置参数
         *  @param {Object} [options.sort] 返回数据排序方式配置参数
         *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
        ###
        find: (paras...) ->
            [options, callback] = Utils.parseParas(paras)
            self = @
            promiseFn = (resolve, reject) ->
                self.deserialize (data, err) ->
                    if err?
                        callback([], err) if callback?
                        reject(err)
                    else
                        data = Operation.find data, options
                        callback(data, err) if callback?
                        if err?
                            reject(err)
                        else
                            resolve(data)
            new Promise(promiseFn)

        ###*
         *  @function Collection#findOne
         *  @desc 集合执行查询一条数据操作
         *  @instance
         *  @param {Object} [options]   配置参数
         *  @param {Object} [options.where] 查询条件匹配参数
         *  @param {Object} [options.projection] 返回数据格式配置参数
         *  @param {Object} [options.sort] 返回数据排序方式配置参数
         *  @param {CallbackData} [callback]    需要异步执行的回调函数，支持Promise异步编程方式
        ###
        findOne: (paras...) ->
            [options, callback] = Utils.parseParas(paras)
            options.limit = 1
            self = @
            promiseFn = (resolve, reject) ->
                self.deserialize (data, err) ->
                    if err?
                        callback(undefined, err) if callback?
                        reject(err)
                    else
                        data = Operation.find data, options
                        callback(data[0], err) if callback?
                        if err?
                            reject(err)
                        else
                            resolve(data[0])
            new Promise(promiseFn)

    module.exports = Collection
