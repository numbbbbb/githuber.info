define (require, exports, module) ->
    "use strict"

    Support = require("lib/support")
    Utils = require("core/utils")
    Collection = require("core/collection")
    Engine = require("core/engine")
    Server = require("core/server")

    dbPrefix = "ldb_"
    version = ""

    ###*
     *  @class LocalDB
     *  @classdesc LocalDB用来生成数据库对象
     *  @author [wh1100717]{@link https://github.com/wh1100717}
     *  @param  {String}    dbName - 数据库名
     *  @param  {Object}    [options] 配置参数
     *  @param  {String}    [options.expire="window"] - "window"：数据随着当前页面标签关闭而消失, "none"：数据会一直存在对应的域内，不随着页面或者浏览器关闭而消失。
     *  @param  {Boolean}   [options.encrypt=true] - true：对存储的数据进行加密操作
     *  @param  {String}    [options.proxy=null] - 指定proxy url来进行跨域数据存取，具体请参考@todo Proxy文档
     *  @return {LocalDB}
     *  @example
    ```javascript
    var db = new LocalDB("foo")
    var db = new LocaoDB("foo", {
       expire: "window",
       encrypt: true,
       proxy: "http://www.foo.com/getProxy.html"
    })
    ```
     *  @todo 增加 options.expire 对"browser"的支持，数据可以在可以在同一个域的多个页面之间共享，但随着浏览器关闭而消失。
     *  @todo 增加 options.expire 对"Date()"的支持，数据可以在指定日期内一直存在。
    ###
    class LocalDB

        constructor: (dbName, options = {}) ->
            throw new Error("dbName should be specified.") if not dbName?
            @name = dbPrefix + dbName
            @expire = if options.expire? then options.expire else "window"
            @encrypt = if options.encrypt? then options.encrypt else true
            @proxy = if options.proxy? then options.proxy else null
            @insert_guarantee = if options.guarantee then options.guarantee else false
            @engine = new Engine {
                expire: @expire
                encrypt: @encrypt
                name: @name
                proxy: @proxy
                insert_guarantee: @insert_guarantee
            }

        ###*
         *  @function LocalDB#options
         *  @desc get options
         *  @instance
         *  @return {Object}
         *  @example
         var db = new LocalDB("foo")
         var options = db.options()
         console.log(options)
        ###
        options: -> {
            name: @name.substr(dbPrefix.length)
            expire: @expire
            encrypt: @encrypt
            proxy: @proxy
        }

        # ###
        #  *  Get Collection Names
        #  *  db.collections()    //["foo","foo1","foo2","foo3",....]
        # ###
        # collections: -> (@ls.key(i).substr("#{@name}_".length) for i in [0...@ls.size()] when @ls.key(i).indexOf("#{@name}_") is 0)

        ###*
         *  @function LocalDB#collection
         *  @desc get collection
         *  @instance
         *  @param {String} collectionName - collection Name
         *  @return {Collection}    Instance of Collection Class
         *  @example
         var db = new LocalDB("foo")
         var collection = db.collection("bar")
         console.log(typeof collection)
        ###
        collection: (collectionName) ->
            throw new Error("collectionName should be specified.") if not collectionName?
            new Collection(collectionName, @engine)

        ###
         *  Delete Collection: db.drop(collectionName)
         *  Delete DB: db.drop()
        ###
        # drop: (collectionName, callback) ->
        #     collectionName = if collectionName? then "_#{collectionName}" else ""
        #     keys = (@ls.key(i) for i in [0...@ls.size()] when @ls.key(i).indexOf(@name + collectionName) is 0)
        #     @ls.removeItem(j) for j in keys
        #     return true

    ###*
     *  @function LocalDB.getSupport
     *  @desc Check Browser Feature Compatibility
     *  @return {Support}
     *  @example
     if(LocalDB.getSupport().localstorage()){
        alert("Your Browser support LocalStorage!")
     }
    ###
    LocalDB.getSupport = -> Support

    ###*
     *  @function LocalDB.getVersion
     *  @desc Get LocalDB version
     *  @return {String}
     *  @example
     console.log("The version of LocalDB is:", LocalDB.getVersion())
    ###
    LocalDB.getVersion = -> version

    ###*
     *  @function LocalDB.getTimestamp
     *  @desc Convert ObjectId to timestamp
     *  @param {String} objectId
     *  @return {Number}
    ###
    LocalDB.getTimestamp = (objectId) -> Utils.getTimestamp(objectId)

    ###*
     *  @function LocalDB.getTime
     *  @desc Convert ObjectId to time
     *  @param {String} objectId
     *  @return {String}
    ###
    LocalDB.getTime = (objectId) -> Utils.getTime(objectId)

    ###*
     *  @function LocalDB.init
     *  @desc Proxy Server Init
     *  @param {Object} config
    ###
    LocalDB.init = (config) -> (new Server(config)).init()


    module.exports = LocalDB