define (require, exports, module) ->
    "use strict"

    Utils = require("core/utils")
    
    ###
     *  https://github.com/wh1100717/evemit
    ###
    _isIE = if window.addEventListener? then false else true

    class Evemit

        constructor: (obj) ->
            obj = {} if not obj?
            throw new Error("input type error: Input should be object") if not Utils.isObject(obj)
            @events = {}
            obj[i] = j for i,j of Evemit.prototype
            return obj

        on: (eve, fn) ->
            @events[eve] = @events[eve] or []
            @events[eve].push(fn)

        once: (eve, fn) ->
            self = @
            @on eve, ->
                self.off(eve)
                fn.apply @, arguments

        off: (eve) -> delete @events[eve]

        emit: (eve, args...) ->
            if @events[eve]?
                e.apply(@, args) for e in @events[eve]

        events: -> e for e of @events

        listeners: (eve) -> l for l in @events[eve]

    Evemit.bind = (el, eve, fn, priority) ->
        el[if _isIE then "attachEvent" else "addEventListener"]("#{if _isIE then "on" else ""}#{eve}", fn, priority or false)

    Evemit.unbind = (el, eve, fn, priority) ->
        el[if _isIE then "detachEvent" else "removeEventListener"]("#{if _isIE then "on" else ""}#{eve}", fn, priority or false)

    module.exports = Evemit