define (require, exports, module) ->
    "use strict"

    Support = require("lib/support")

    describe "Support", ->
        it "feature", ->
            userAgent = navigator.userAgent
            if /PhantomJS/.test userAgent
                console.log "PhantomJS Support Test"
                expect(Support.localstorage()).toEqual(true)
                expect(Support.sessionstorage()).toEqual(true)
                expect(Support.postmessage()).toEqual(true)
                expect(Support.websqldatabase()).toEqual(true)
                expect(Support.indexedDB()).toEqual(false)
                expect(Support.applicationcache()).toEqual(true)
                expect(Support.userdata()).toEqual(false)
            else if /Chrome/.test userAgent
                console.log "Chrome Support Test"
                expect(Support.localstorage()).toEqual(true)
                expect(Support.sessionstorage()).toEqual(true)
                expect(Support.postmessage()).toEqual(true)
                expect(Support.websqldatabase()).toEqual(true)
                expect(Support.indexedDB()).toEqual(true)
                expect(Support.applicationcache()).toEqual(true)
                expect(Support.userdata()).toEqual(false)
            else if /Firefox/.test userAgent
                console.log "Firefox Support Test"
                expect(Support.localstorage()).toEqual(true)
                expect(Support.sessionstorage()).toEqual(true)
                expect(Support.postmessage()).toEqual(true)
                expect(Support.websqldatabase()).toEqual(false)
                expect(Support.indexedDB()).toEqual(true)
                expect(Support.applicationcache()).toEqual(true)
                expect(Support.userdata()).toEqual(false)
