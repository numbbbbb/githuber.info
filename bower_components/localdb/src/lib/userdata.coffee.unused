define (require, exports, module) ->
    'use strict'

    class UserData
        ### rewrite with coffee from https://github.com/marcuswestin/store.js
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        ###
        constructor: ->
            try
                storageContainer = new ActiveXObject('htmlfile')
                storageContainer.open()
                storageContainer.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>')
                storageContainer.close()
                @storageOwner = storageContainer.w.frames[0].document
                @storage = @storageOwner.createElement('div')
            catch e
                ###
                // somehow ActiveXObject instantiation failed (perhaps some special
                // security settings or otherwse), fall back to per-path storage
                ###
                @storage = document.createElement('div')
                @storageOwner = document.body

        localStorageName: "localStorage"

        forbiddenCharsRegex: new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")

        ieKeyFix: (key) -> key.replace(/^d/, '___$&').replace(@forbiddenCharsRegex, '___')

        setItem: (key, val) ->
            key = @ieKeyFix(key)
            @storageOwner.appendChild(@storage)
            @storage.addBehavior("#default#userData")
            @storage.load(@localStorageName)
            @storage.setAttribute(key, val)
            @storage.save(@localStorageName)
            return true

        getItem: (key) ->
            key = @ieKeyFix(key)
            @storageOwner.appendChild(@storage)
            @storage.addBehavior("#default#userData")
            @storage.load(@localStorageName)
            return @storage.getAttribute(key)

        removeItem: (key) ->
            key = @ieKeyFix(key)
            @storageOwner.appendChild(@storage)
            @storage.addBehavior("#default#userData")
            @storage.load(@localStorageName)
            @storage.removeAttribute(key)
            @storage.save(@localStorageName)

        size: -> @storage.XMLDocument.documentElement.attributes.length

        key: (index) -> @storage.XMLDocument.documentElement.attributes[index]

    module.exports = UserData