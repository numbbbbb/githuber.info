define (require, exports, module) ->
    xdescribe "Jasmine expect", ->
        ##每个测试点开始前执行
        beforeEach(->
            console.log("-------beforeEach-------")
            
            )
        ##每个测试点结束后执行
        afterEach(->
            console.log("-------endEach---------"))

        it "toEqual", ->
            ##是否值相等,使用‘===’，对象需要遍历每个属性值是否相等
            var1 = "1"
            var2 = 1
            obj1 = {
                name:1
                age:2
            }
            obj2 = {
                name:1
                age:2
            }
            ##是否bug？
            expect(undefined).toEqual(null)
            expect(obj1).toEqual(obj2)
            expect(false).not.toEqual(true)
            expect(var1).not.toEqual(var2)
        it "toBe", ->
            ##是否同一个对象，使用‘===’严格比较
            var1 = 'hello'
            var2 = 'hello'
            obj1 = {
                name:1
                age:2
            }
            obj2 = {
                name:1
                age:2
            }
            expect(true).toBe(true)
            expect(var1).toBe(var2)
            expect(obj1).not.toBe(obj2)
            expect(undefined).not.toBe(null)
        it "toMatch", ->
            ##正则是否匹配
            str = "kobe wade rose"
            expect(str).toMatch("kobe")
            expect(str).toMatch(/wade/)
            expect(str).not.toMatch('paul')
        it "toBeDefined", ->
            ##是否不是undefined,即有赋值
            obj = {
                name:'name'
                age:15
            }
            obj2 = null
            expect(obj).toBeDefined()
            expect(obj.name).toBeDefined()
            expect(obj.sex).not.toBeDefined()
            expect(obj2).toBeDefined()
        it "toBeUndefined", ->
            ##是否undefined，即没有赋值
            obj = {
                name:"name"
                age:26
            }
            obj2 = null
            expect(obj.sex).toBeUndefined()
            expect(obj.name).not.toBeUndefined()
            expect(obj2).not.toBeUndefined()
        it "toBeNull", ->
            ##是否为空
            obj = {}
            obj2 = null
            obj3 = []
            expect(obj).not.toBeNull()
            expect(obj2).toBeNull()
            expect(obj3).not.toBeNull()
        it "toBeTruthy", ->
            ##是否可能转化为true
            obj = 1
            obj2 = "false"
            obj3 = {}

            obj4 = 0
            obj5 = ""
            obj6 = null
            
            expect(obj).toBeTruthy()
            expect(obj2).toBeTruthy()
            expect(obj3).toBeTruthy()
            expect(obj4).not.toBeTruthy()
            expect(obj5).not.toBeTruthy()
            expect(obj6).not.toBeTruthy()
        it "toBeFalsy", ->
            ##是否可能转化为false,0,"",null
            obj = 1
            obj2 = "false"
            obj3 = {}

            obj4 = 0
            obj5 = ""
            obj6 = null
            
            expect(obj).not.toBeFalsy()
            expect(obj2).not.toBeFalsy()
            expect(obj3).not.toBeFalsy()
            expect(obj4).toBeFalsy()
            expect(obj5).toBeFalsy()
            expect(obj6).toBeFalsy()
        it "toContain", ->
            ##数组是否包含指定数值
            arr = [
                    "wade", "kobe", "rose"
                    1, 2,3
            ]

            expect(arr).toContain('kobe')
            expect(arr).not.toContain('jeck')
            expect(arr).toContain(1)
            expect(arr).not.toContain("1")
        it "toBeLessThan", ->
            ##是否小于
            int1 = 2.789
            int2 = 2.987

            expect(int1).toBeLessThan(int2)
            expect(int2).not.toBeLessThan(int1)
        it "toBeGreaterThan", ->
            ##是否大于
            int1 = 2.789
            int2 = 2.987

            expect(int1).not.toBeGreaterThan(int2)
            expect(int2).toBeGreaterThan(int1)
        it "toBeCloseTo", ->
            ##是否大约相等
            int1 = 2.781
            int2 = 2.788
            expect(int1).toBeCloseTo(int2,1)
            expect(int1).not.toBeCloseTo(int2,2)

    xdescribe "Jasmine xdescribe", ->
        xit "xit", ->
            ##xit的测试点不会执行
            expect(true).toEqual(false)
        it "it", ->
            ##xdescribe下的所有测试点都不会执行
            expect(true).toEqual(false)

    xdescribe "Jasmine spy", ->
        foo = null
        bar = null
        beforeEach(->
            foo = {
                setBar: (value) ->
                    bar = value
            }
            ##函数并不真执行
            spyOn(foo, 'setBar')
            foo.setBar(123)
            foo.setBar(456, 'hehe')
            )

        it "toHaveBeenCalled", ->
            ##函数是否被调用过
            expect(foo.setBar).toHaveBeenCalled()
        it "calls", ->
            ##函数调用次数
            expect(foo.setBar.calls.length).toEqual(2)
            expect(foo.setBar.calls[0].args[0]).toEqual(123);
        it "toHaveBeenCalledWith", ->
            ##以什么参数调用
            expect(foo.setBar).toHaveBeenCalledWith(123)
            expect(foo.setBar).toHaveBeenCalledWith(456, "hehe")
        it "mostRecentCall", ->
            ##最近一次调用
            expect(foo.setBar.mostRecentCall.args[0]).toEqual(456)
        it "end", ->
            ##函数并不真执行，所以bar没有值
            expect(bar).toBeNull()

    xdescribe "Jasmine spy andCallThrough", ->
        foo = null
        bar = null
        beforeEach(->
            foo = {
                setBar: (value) ->
                    bar = value
            }
            ##函数并不真执行
            spyOn(foo, 'setBar').andCallThrough()
            foo.setBar(123)
            foo.setBar(456, 'hehe')
            )

        it "toHaveBeenCalled", ->
            ##函数是否被调用过
            expect(foo.setBar).toHaveBeenCalled()
        it "end", ->
            ##函数执行过，所以bar有值
            expect(bar).toEqual(456)
    
    xdescribe "Jasmine spy andReturn", ->
        foo = null
        bar = null
        fetchBar = null
        beforeEach(->
            foo = {
                setBar: (value) ->
                    bar = value
                getBar: ->
                    bar
            }
            ##函数并不真执行
            spyOn(foo, 'getBar').andReturn(789)
            foo.setBar(123)
            fetchBar = foo.getBar()
            )

        it "toHaveBeenCalled", ->
            ##函数是否被调用过
            expect(foo.getBar).toHaveBeenCalled()
        it "end", ->
            ##函数执行过，所以bar有值
            expect(bar).toEqual(123)
            expect(fetchBar).toEqual(789)
    
    xdescribe "Jasmine spy andCallFake", ->
        foo = null
        bar = null
        fetchBar = null
        beforeEach(->
            foo = {
                setBar: (value) ->
                    bar = value
                getBar: ->
                    bar
            }
            ##函数并不真执行
            spyOn(foo, 'getBar').andCallFake(->
                return 789)
            foo.setBar(123)
            fetchBar = foo.getBar()
            )

        it "toHaveBeenCalled", ->
            ##函数是否被调用过
            expect(foo.getBar).toHaveBeenCalled()
        it "end", ->
            ##函数执行过，所以bar有值
            expect(bar).toEqual(123)
            expect(fetchBar).toEqual(789)

    xdescribe "Jasmine spy createSpy", ->
        ##创建一个监控
        mySpy = jasmine.createSpy('mySpy')
        mySpy(1, 2, 3)

        it "identity", ->
            expect(mySpy.identity).toEqual('mySpy')
        it "toHaveBeenCalled", ->
            expect(mySpy).toHaveBeenCalled()

    xdescribe "Jasmine spy createSpyObj", ->
        ##创建复杂监控对象
        mySpyObj = jasmine.createSpyObj('mySpyObj', ['play', 'pause', 'stop'])
        mySpyObj.play()
        mySpyObj.pause()
        mySpyObj.stop()

        it "toBeDefined", ->
            expect(mySpyObj.play).toBeDefined()
            expect(mySpyObj.pause).toBeDefined()
            expect(mySpyObj.stop).toBeDefined()
        it "toHaveBeenCalled", ->
            expect(mySpyObj.play).toHaveBeenCalled()
            expect(mySpyObj.pause).toHaveBeenCalled()
            expect(mySpyObj.stop).toHaveBeenCalled()

    xdescribe "Jasmine jasmine.any", ->
        myFn = jasmine.createSpy('myFn')
        myFn(123,'name')

        it "normal value", ->
            expect({}).toEqual(jasmine.any(Object))
            expect(1).toEqual(jasmine.any(Number))
            expect("").toEqual(jasmine.any(String))
            expect(myFn).toHaveBeenCalledWith(jasmine.any(Number), jasmine.any(String))

    xdescribe "Jasmine jasmine.Clock", ->
        timerCallback = null
        beforeEach ->
            timerCallback = jasmine.createSpy('timerCallback')
            jasmine.Clock.useMock()
        
          it "causes a timeout to be called synchronously", ->
                setTimeout(->
                    timerCallback()
                 , 100)

                expect(timerCallback).not.toHaveBeenCalled()
                jasmine.Clock.tick(101)
                expect(timerCallback).toHaveBeenCalled()

    xdescribe "Jasmine runs&waitsFor", ->
        value = null
        flag = null

        it "runs&waitsFor", ->
            runs(->
                flag = false
                value = 0

                setTimeout(->
                    flag = true
                , 500))

            waitsFor(->
                value += 1
                return flag
            , "The value should be incremented.", 750)

            runs(->
                expect(value).toBeGreaterThan(0))
  


