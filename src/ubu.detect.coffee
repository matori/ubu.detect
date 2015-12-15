"use strict"

###!
 * ubu.detect v1.0.0
 * https://github.com/matori/ubu.detect
 *
 * Copyright (c) 2015 Matori
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
###

GLOBAL_NS = "ubu"
MODULE_NAME = "detect"

detect = ->
    uaString = "userAgent" of navigator and navigator.userAgent.toLowerCase() or ""
    vendorString = "vendor" of navigator and navigator.vendor.toLowerCase() or ""
    platform = "platform" of navigator and navigator.platform
    platformString = if typeof platform is "string" then platform.toLowerCase() else ""
    hasDocumentMode = "documentMode" of document
    hasWindowOpera = "opera" of window

    data =
        browser:
            ieVer: 0
            ieMode: 0
            ie: false
            edge: false
            firefox: false
            chrome: false
            safari: false
            operaPresto: false
            androidChromeWebView: false
            androidWebkit: false
            blackberryMidp: false
            blackberryWebkit: false
            nintendoOpera: false
            nintendoBrowser: false
            psBrowser: false
            chromeVer: 0
            webkitVer: 0
            unknownWebkit: false
            unknown: false
        platform:
            windows: false
            mac: false
            linux: false
            android: false
            ios: false
            blackberry: false
            firefoxOs: false
            iphone: false
            ipad: false
            ipod: false
            nintendoDsi: false
            nintendo3ds: false
            newNintendo3ds: false
            nintendoWii: false
            nintendoWiiU: false
            ps4: false
            ps3: false
            psp: false
            xbox: false
            unknown: false
        uaString:
            mobile: /mobile/.test uaString
            phone: /[^i]phone/.test uaString
            tablet: /tablet/.test uaString

    testUa = (regex) ->
        regex.test uaString

    testPf = (regex) ->
        regex.test platformString

    testVendor = (regex) ->
        regex.test vendorString

    checkPf = (checkName, resultName) ->
        resultName = resultName or checkName
        result = ""
        if platformString.indexOf(checkName) is 0
            result = resultName
        result

    checkDevice = (deviceNames, resultNames) ->
        resultNames = resultNames or deviceNames
        result = ""
        for deviceName, idx in deviceNames
            result = checkPf deviceName, resultNames[idx]
            if result
                break
        result

    checkPfSpecificBrowser = (pfNames, browserName) ->
        result = ""
        for pfName in pfNames
            if data.platform[pfName] is true
                result = browserName
                break
        result

    getChromeVer = ->
        chromeVer = uaString.match /chrome\/(([0-9]{1,3})[\.\d]+?)\s/
        return if chromeVer then parseFloat chromeVer[1] else 0

    getWebkitVer = ->
        webkitVer = uaString.match /applewebkit\/(([0-9]{3,})(\.\d+)?)\s/
        return if webkitVer then parseFloat webkitVer[1] else 0

    isAndroid = ->
        if testUa(/android/) and testPf(/android|linux/) or platform is null
            return "android"
        ""

    isIosDevice = -> checkDevice ["iphone", "ipad", "ipod"]

    isBlackBerry = ->
        pfStr = "blackberry"
        checkPf(pfStr) or do ->
            if testUa(/bb10|blackberry/)
                return pfStr
            ""

    isFirefoxOs = ->
        if testUa(/gecko\/[\.0-9]+\sfirefox\/[0-9]{2}\.[0-9]+/) and platform is ""
            return "firefoxOs"
        ""

    isWindows = -> checkPf "win", "windows"

    isMac = -> checkPf "mac"

    isLinux = -> checkPf "linux"

    isFreeBsd = -> checkPf "freebsd"

    isOpenBsd = -> checkPf "openbsd"

    isNintendoDs = ->
        checkDevice ["new nintendo 3ds", "nintendo 3ds", "nintendo dsi"],
            ["newNintendo3ds", "nintendo3ds", "nintendoDsi"]

    isWii = -> checkDevice ["nintendo wiiu", "nintendo wii"], ["nintendoWiiU", "nintendoWii"]

    isPlayStation = -> checkDevice ["playstation 4", "playstation 3", "psp"], ["ps4", "ps3", "psp"]

    isXbox = ->
        if testUa(/xbox/)
            return "xbox"
        ""

    isIe = ->
        if "VBArray" of window and (hasDocumentMode or "attachEvent" of window) and not hasWindowOpera
            return "ie"
        ""

    isEdge = ->
        if "msCapsLockWarningOff" of document and not hasDocumentMode
            return "edge"
        ""

    isFirefox = ->
        if "mozInnerScreenX" of window then "firefox" else ""

    isSafari = ->
        if testUa(/safari/) and testVendor(/apple computer/)
            return "safari"
        ""

    isChrome = ->
        if testUa(/chrome|chromium/) and testVendor(/google inc/)
            return "chrome"
        ""

    isOperaPresto = ->
        if hasWindowOpera and not data.platform.nintendoDsi and not data.platform.nintendoWii
            return "operaPresto"
        ""

    isAndroidChromeWebView = ->
        data.platform.android and data.browser.chrome and testUa(/(version\/[\d\.]{3,})\s/)

    isAndroidWebkit = ->
        if data.platform.android and not data.browser.chrome and data.browser.webkitVer < 537
            return "androidWebkit"
        ""

    isBlackBerryWebkit = ->
        if data.platform.blackberry and data.browser.webkitVer > 534
            return "blackberryWebkit"
        ""

    isBlackBerryMidp = ->
        if data.platform.blackberry and testUa(/profile\/midp/)
            return "blackberryMidp"
        ""

    isPsBrowser = -> checkPfSpecificBrowser ["ps4", "ps3", "psp"], "psBrowser"

    isNintendoOpera = -> checkPfSpecificBrowser ["nintendoDsi", "nintendoWii"], "nintendoOpera"

    isNintendoBrowser = -> checkPfSpecificBrowser ["nintendo3ds", "newNintendo3ds", "nintendoWiiU"], "nintendoBrowser"

    getIeDetail = ->
        result = {
            ver: 0
            mode: 0
        }
        if hasDocumentMode
            result.mode =  document.documentMode
            if "msPointerEnabled" of navigator
                result.ver = if "pointerEnabled" of navigator then 11 else 10
            else
                result.ver = if "addEventListener" of window then 9 else 8
        else
            if "XMLHttpRequest" of window
                result.ver = result.mode = 7
            else if "createAttribute" of document
                result.ver = result.mode = 6
            else if "namespaces" of document and "createEventObject" of document
                result.ver = result.mode = 5.5
            else
                result.ver = result.mode = 5
        result

    detectPlatform = ->
        result = ""
        for detection in [
            isAndroid, isIosDevice, isBlackBerry, isFirefoxOs,
            isWindows, isMac, isLinux, isFreeBsd, isOpenBsd,
            isPlayStation, isWii, isNintendoDs, isXbox
        ]
            result = do detection
            if result
                break
        if result
            data.platform[result] = true
            if data.platform.ios is false and /^ip(hone|ad|od)/.test(result)
                data.platform.ios = true
        else
            data.platform.unknown = true
        return

    detectBrowser = ->
        result = ""
        data.browser.chromeVer = getChromeVer()
        data.browser.webkitVer = getWebkitVer()
        for detection in [
            isIe, isEdge, isFirefox, isSafari, isChrome, isOperaPresto,
            isAndroidWebkit
            isBlackBerryWebkit, isBlackBerryMidp
            isPsBrowser, isNintendoBrowser, isNintendoOpera
        ]
            result = do detection
            if result
                break
        if result
            data.browser[result] = true
            if result is "ie"
                detail = getIeDetail()
                data.browser.ieVer = detail.ver
                data.browser.ieMode = detail.mode
            if result is "chrome"
                data.browser.androidChromeWebView = isAndroidChromeWebView()
            if result is "safari" and data.platform.iphone
                if screen.height is 240 and screen.width is 320
                    data.platform.ios = false
                    data.platform.iphone = false
                    data.platform.newNintendo3ds = true
                    data.browser.safari = false
                    data.browser.nintendoBrowser = true
        else
            if data.browser.webkitVer
                data.browser.unknownWebkit = true
            else
                data.browser.unknown = true
        return

    do detectPlatform
    do detectBrowser

    return data

# UMD (exclude AMD)
do (root = this, factory = detect) ->
    if typeof exports is "object"
        module.exports = factory()
    else
        unless GLOBAL_NS of root
            root[GLOBAL_NS] = ->
        root[GLOBAL_NS][MODULE_NAME] = factory()
    return
