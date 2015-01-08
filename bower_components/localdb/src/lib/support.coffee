define (require, exports, module) ->
    "use strict"

    mod = "lST$*@?"

    Support = {}

    Support.localstorage = ->
        try
            localStorage.setItem(mod, mod)
            localStorage.removeItem(mod)
            return true
        catch e
            return false
        
    Support.sessionstorage = ->
        try
            sessionStorage.setItem(mod, mod)
            sessionStorage.removeItem(mod)
            return true
        catch e
            return false

    Support.postmessage = -> postMessage?

    Support.websqldatabase = -> openDatabase?

    Support.indexedDB = -> (indexedDB? or webkitIndexedDB? or mozIndexedDB? or OIndexedDB? or msIndexedDB?)

    Support.applicationcache = -> applicationCache?

    Support.userdata = -> document.documentElement.addBehavior?

    module.exports = Support