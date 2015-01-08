define (require, exports, module) ->

    'use strict'
    LocalDB = require('localdb')
    Collection = require('core/collection')
    Where = require('core/where')

    db = new LocalDB("foo")

    ### Where 测试用例原则:
     *  1. 不需要测试迭代过程的中间环节，因此定义的obj应该都为对象，不应该出现数字、字符串、数组等
     *  2. 测试用例要完全覆盖所有代码分支
     *  3. 尽量少用`toBe.ok()`，如果返回值为`true`/`false`，也需要使用`toBe(true/false)`这种格式。
     *  4. 如果有测试用例报错的话，注释加备注再提交请求，或者发个issue。
    ###

    describe 'Where', ->
        it 'Where Comparison equal', ->
            obj = {
                num_val: 1
                str_val: "hello"
                func_val: -> return 100
                regex_val: /he.*ld/
                arr_val: [1,2,3,4]
                arr_val2: ["a","b","c","d","hello World"]
                arr_val3: [/he.*ld/, /just.*do.*it/g]
                obj_val: {e:"4",f:5}
            }
            #值匹配
            expect(Where(obj, {num_val:1})).toBe(true)
            expect(Where(obj, {num_val:2})).toBe(false)
            expect(Where(obj, {arr_val:3})).toBe(true)
            #值为字符串匹配
            expect(Where(obj, {str_val: "hello"})).toBe(true)
            expect(Where(obj, {str_val: ""})).toBe(false)
            expect(Where(obj, {arr_val2: "d"})).toBe(true)

            # # 注意：不提供值为函数的匹配
            # expect(Where(obj, {func_val: -> return 100})).toBe(false)
            #值为正则匹配
            expect(Where(obj, {regex_val: /he.*ld/})).toBe(true)
            expect(Where(obj, {regex_val: /he1.*ld/})).toBe(false)
            expect(Where(obj, {arr_val3: /he1.*ld/})).toBe(false)
            expect(Where(obj, {arr_val3: /just.*do.*it/g})).toBe(true)
            #正则匹配
            expect(Where(obj, {num_val: /\d/})).toBe(true)
            expect(Where(obj, {arr_val: /\d/})).toBe(true)
            #值为数组匹配
            expect(Where(obj, {arr_val: [1,2,3,4]})).toBe(true)
            expect(Where(obj, {arr_val: ["1","2","3","4"]})).toBe(false)
            #值为对象匹配
            expect(Where(obj, {obj_val: {e:"4",f:5}})).toBe(true)
            #key为dot匹配
            expect(Where(obj, {"obj_val.e":"4"})).toBe(true)
            expect(Where(obj, {"obj_val.f":5})).toBe(true)
        obj = {
            "a":1,
            "b":4,
            "c":[[5],10],
            "d":{
                "e":"4",
                "f":5
                },
            "e":"1",
            "f":5,
            "g":0,
            "h":[1,2,3],
            "i":'hello',
            "j":[ { "book": "abc", "price": 8 }, { "book": "xyz", "price": 7 } ]
        }
        it 'Where Comparison gt', ->
            expect(Where(obj,{"a":{"$gt":1}})).toBe(false)
            expect(Where(obj,{"a":[{"$gt":1},{"$lt":3}]})).toBe(false)
            expect(Where(obj,{"a":{"$gt":0}})).toBe(true)
            expect(Where(obj,{"a":{"$gt":2}})).toBe(false)
        it 'Where Comparison gte', ->
            expect(Where(obj,{"a":{"$gte":1}})).toBe(true)
            expect(Where(obj,{"a":{"$gte":0}})).toBe(true)
            expect(Where(obj,{"a":{"$gte":2}})).toBe(false)
        it 'Where Comparisongte lt', ->
            expect(Where(obj,{"b":{"$lt":4}})).toBe(false)
            expect(Where(obj,{"b":{"$lt":3}})).toBe(false)
            expect(Where(obj,{"b":{"$lt":10}})).toBe(true)
        it 'Where Comparisonlte lte', ->
            expect(Where(obj,{"b":{"$lte":4}})).toBe(true)
            expect(Where(obj,{"b":{"$lte":3}})).toBe(false)
            expect(Where(obj,{"b":{"$lte":5}})).toBe(true)
        it 'Where Comparison ne', ->
            expect(Where(obj,{"a":{"$ne":1}})).toBe(false)
            expect(Where(obj,{"a":{"$ne":2}})).toBe(true)
        it 'Where Comparison in', ->
            expect(Where(obj,{"a":{"$in":[1,9,8]}})).toBe(true)
            expect(Where(obj,{"c":{"$in":[5,9,8]}})).toBe(false)
            expect(Where(obj,{"c":{"$in":[[5],8,9]}})).toBe(true)
            expect(Where(obj,{"a":{"$in":[10,11,12]}})).toBe(false)
            expect(Where(obj,{"c":{"$in":[5,6,7]}})).toBe(false)
        it 'Where Comparison nin', ->
            expect(Where(obj,{"a":{"$nin":[1,2,3]}})).toBe(false)
            expect(Where(obj,{"a":{"$nin":[4,2,3]}})).toBe(true)
            expect(Where(obj,{"e":{"$nin":["1","2","3"]}})).toBe(false)
        it 'Where Logical or', ->
            expect(Where(obj,{"$or":[{"a":{"$gt":0}},{"b":{"$lt":6}}]})).toBe(true)
            expect(Where(obj,{"$or":[{"a":{"$gt":2}},{"b":{"$lt":6}}]})).toBe(true)
            expect(Where(obj,{"$or":[{"a":{"$gt":0}},{"b":{"$lt":2}}]})).toBe(true)
            expect(Where(obj,{"$or":[{"a":{"$gt":2}},{"b":{"$lt":2}}]})).toBe(false)
        it 'Where Logical and', ->
            expect(Where(obj,{"$and":[{"a":{"$gt":0}},{"b":{"$lt":6}}]})).toBe(true)
            expect(Where(obj,{"$and":[{"a":{"$gt":2}},{"b":{"$lt":6}}]})).toBe(false)
            expect(Where(obj,{"$and":[{"a":{"$gt":0}},{"b":{"$lt":2}}]})).toBe(false)
            expect(Where(obj,{"$and":[{"a":{"$gt":2}},{"b":{"$lt":2}}]})).toBe(false)
        it 'Where Logical not', ->
            expect(Where(obj,{"f":{"$not":{"$lt":0}}})).toBe(true)
            expect(Where(obj,{"f":{"$not":{"$gt":0}}})).toBe(false)
        it 'Where Logical nor', ->
            expect(Where(obj,{"$nor":[{"f":5},{"b":4}]})).toBe(false)
            expect(Where(obj,{"$nor":[{"f":1},{"b":5}]})).toBe(true)
        it 'Where Element exists', ->
            expect(Where(obj,{"a":{"$exists":true}})).toBe(true)
            expect(Where(obj,{"z":{"$exists":true}})).toBe(false)
            expect(Where(obj,{"z":{"$exists":false}})).toBe(true)
            expect(Where(obj,{"a":{"$exists":false}})).toBe(false)
        it 'Where Element type', ->
            expect(Where(obj,{"a":{"$type":"number"}})).toBe(true)
            expect(Where(obj,{"a":{"$type":"string"}})).toBe(false)
            expect(Where(obj,{"e":{"$type":"string"}})).toBe(true)
            expect(Where(obj,{"a":{"$type":"eric"}})).toBe(false)
            expect(Where(obj,{"d.e":{"$type":-1}})).toBe(false)
        it 'Where Evaluation mod', ->
            expect(Where(obj,{"g":{"$mod":[2,0]}})).toBe(true)
            expect(Where(obj,{"b":{"$mod":[2,0]}})).toBe(true)
            expect(Where(obj,{"f":{"$mod":[3,2]}})).toBe(true)
            expect(Where(obj,{"f":{"$mod":[2,0]}})).toBe(false)
        it 'Where Evaluation regex', ->
            expect(Where(obj, {"h":/\d/})).toBe(true)
            expect(Where(obj,{"c":/\d/})).toBe(true)
            expect(Where(obj,{"e":/\d/})).toBe(true)
            expect(Where(obj,{"i":{ "$regex": 'ello'}})).toBe(true)
            expect(Where(obj,{"i":{ "$regex": 'what'}})).toBe(false)
            expect(Where(obj,{"a":/\d/})).toBe(true)
            expect(Where(obj,{"e":/\b/})).toBe(true)
        it 'Where Array all', ->
            expect(Where(obj,{"h":{"$all": [1,2]}})).toBe(true)
            expect(Where(obj,{"h":{"$all": [4,2]}})).toBe(false)
            expect(Where(obj,{"a":{"$all": [3,2]}})).toBe(false)
        it 'Where Array eleMatch', ->
            expect(Where(obj,{"j": { "$elemMatch": { "book": "xyz", "price": { "$gte": 8 } } }})).toBe(false)
            expect(Where(obj,{"a": { "$elemMatch": { "book": "xyz", "price": { "$gte": 8 } } }})).toBe(false)
            expect(Where(obj,{"j": { "$elemMatch": { "book": "xyz", "price": { "$gte": 6 } } }})).toBe(true)
        it 'Where Array size', ->
            expect(Where(obj,{"h":{"$size": 3}})).toBe(true)
            expect(Where(obj,{"h":{"$size": 6}})).toBe(false)
            expect(Where(obj,{"a":{"$size": 1}})).toBe(false)




