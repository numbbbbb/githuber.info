define (require, exports, module) ->
    "use strict"

    Evemit = require("lib/evemit")

    if not HTMLElement.prototype.click
        HTMLElement.prototype.click = ->
            ev = document.createEvent "MouseEvent"
            ev.initMouseEvent(
                "click",
                true, true,
                window, null,
                0, 0, 0, 0,
                false, false, false, false,
                0, null
            )
            this.dispatchEvent(ev)

    describe "Evemit", ->

        it "bind and unbind", ->

            div = document.createElement("div")
            div.innerHTML = "<a id='clickBtn'> Opps</a>"
            document.body.insertBefore div, document.body.lastChild

            btn = document.getElementById("clickBtn")

            clickFn = ->
                console.log "Button Clicked"

            Evemit.bind btn, "click", clickFn

            btn.click()

            Evemit.unbind btn, "click", clickFn

            btn.click()

        it "Evemit", ->
            obj = {
                a: 1
                b: 2
            }
            obj = new Evemit(obj)
            obj.on "wow", ->
                console.log "This is first listener function!"
            obj.on "wow", ->
                console.log "This is second listener function!"
            expect(obj.listeners("wow").length).toEqual(2)
            obj.emit "wow"

            obj.once "wow_once", ->
                console.log "This could only be called once!"
            expect(obj.events().length).toEqual(2)

            obj.emit "wow_once"
            expect(obj.events().length).toEqual(1)
            obj.emit "wow_once" #不应该console.log出来才对

            obj.off "wow"
            expect(obj.events().length).toEqual(0)
        
        it "Error", ->
            obj = 1
            try
                obj = new Evemit(obj)
            catch e
                expect(e.message).toEqual("input type error: Input should be object")
            
