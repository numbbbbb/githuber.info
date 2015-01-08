define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")

    describe "sort", ->
        it "quickSort simple asc", ->
            array = [{count:1},{count:3},{},{count:2}]
            sortArray = [
                {}
                {count:1}
                {count:2}
                {count:3}
            ]
            result = Utils.quickSort(array,"count",1)
            expect(sortArray).toEqual(result)
        it "quickSort simple desc", ->
            array = [{count:1},{count:3},{},{count:2}]
            sortArray = [
                {count:3}
                {count:2}
                {count:1}
                {}
            ]
            result = Utils.quickSort(array,"count",-1)
            expect(result).toEqual(sortArray)
        it "quickSort complex asc", ->
            array = [
                {obj:{obj:{count:3}}}
                {obj:{obj:{}}}
                {obj:{obj:{count:1}}}
                {obj:{obj:{count:2}}}
                {obj:{}}
            ]
            sortArray = [
                {obj:{}}
                {obj:{obj:{}}}
                {obj:{obj:{count:1}}}
                {obj:{obj:{count:2}}}
                {obj:{obj:{count:3}}}
            ]
            result = Utils.quickSort(array,"obj.obj.count",1)
            expect(sortArray).toEqual(result)
        it "quickSort complex desc", ->
            array = [
                {obj:{obj:{count:3}}}
                {obj:{obj:{}}}
                {obj:{obj:{count:1}}}
                {obj:{obj:{count:2}}}
                {obj:{}}
            ]
            sortArray = [
                {obj:{obj:{count:3}}}
                {obj:{obj:{count:2}}}
                {obj:{obj:{count:1}}}
                {obj:{obj:{}}}
                {obj:{}}
            ]
            result = Utils.quickSort(array,"obj.obj.count",-1)
            expect(sortArray).toEqual(result)
        it "sort complex", ->
            data = [
                {obj:{obj:{count:3,age:3}}}
                {obj:{obj:{}}}
                {obj:{obj:{count:1,age:2}}}
                {obj:{obj:{count:2,age:1}}}
                {obj:{obj:{count:2,age:3}}}
                {obj:{obj:{count:2,age:2}}}
            ]
            sortData = [
                {obj:{obj:{}}}
                {obj:{obj:{count:1,age:2}}}
                {obj:{obj:{count:2,age:3}}}
                {obj:{obj:{count:2,age:2}}}
                {obj:{obj:{count:2,age:1}}}
                {obj:{obj:{count:3,age:3}}}
            ]
            sort = {"obj.obj.count":1,"obj.obj.age":-1}
            result = Utils.sortObj(data, sort)
            expect(result).toEqual(sortData)
        it "sort simple", ->
            data = [
                {count:3,age:3}
                {}
                {count:1,age:2}
                {count:2,age:1}
                {count:2,age:3}
                {count:2,age:2}
            ]
            sortData = [
                {}
                {count:1,age:2}
                {count:2,age:3}
                {count:2,age:2}
                {count:2,age:1}
                {count:3,age:3}
            ]
            sort = {"count":1,"age":-1}
            result = Utils.sortObj(data, sort)
            expect(sortData).toEqual(result)


