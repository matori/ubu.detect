(function() {
  "use strict";

  /*!
   * ubu.detect v1.0.0
   * https://github.com/matori/ubu.detect
   *
   * Copyright (c) 2015 Matori
   * Released under the MIT license
   * http://opensource.org/licenses/mit-license.php
   */
  var GLOBAL_NS, MODULE_NAME, detect;

  GLOBAL_NS = "ubu";

  MODULE_NAME = "detect";

  detect = function() {
    var checkDevice, checkPf, checkPfSpecificBrowser, data, detectBrowser, detectPlatform, getIeDetail, getWebkitVer, hasDocumentMode, hasWindowOpera, isAndroid, isAndroidWebkit, isBlackBerry, isBlackBerryMidp, isBlackBerryWebkit, isChrome, isEdge, isFirefox, isFirefoxOs, isFreeBsd, isIe, isIosDevice, isLinux, isMac, isNintendoBrowser, isNintendoDs, isNintendoOpera, isOpenBsd, isOperaPresto, isPlayStation, isPsBrowser, isSafari, isWii, isWindows, isXbox, platform, platformString, testPf, testUa, testVendor, uaString, vendorString;
    uaString = "userAgent" in navigator && navigator.userAgent.toLowerCase() || "";
    vendorString = "vendor" in navigator && navigator.vendor.toLowerCase() || "";
    platform = "platform" in navigator && navigator.platform;
    platformString = typeof platform === "string" ? platform.toLowerCase() : "";
    hasDocumentMode = "documentMode" in document;
    hasWindowOpera = "opera" in window;
    data = {
      browser: {
        ieVer: 0,
        ieMode: 0,
        ie: false,
        edge: false,
        firefox: false,
        chrome: false,
        safari: false,
        operaPresto: false,
        androidWebkit: false,
        blackberryMidp: false,
        blackberryWebkit: false,
        nintendoOpera: false,
        nintendoBrowser: false,
        psBrowser: false,
        unknownWebkitVer: 0,
        unknownWebkit: false,
        unknown: false
      },
      platform: {
        windows: false,
        mac: false,
        linux: false,
        android: false,
        ios: false,
        blackberry: false,
        firefoxOs: false,
        freebsd: false,
        openbsd: false,
        iphone: false,
        ipad: false,
        ipod: false,
        nintendoDsi: false,
        nintendo3ds: false,
        newNintendo3ds: false,
        nintendoWii: false,
        nintendoWiiU: false,
        xbox: false,
        unknown: false
      },
      uaString: {
        mobile: /mobile/.test(uaString),
        phone: /[^i]phone/.test(uaString),
        tablet: /tablet/.test(uaString)
      }
    };
    testUa = function(regex) {
      return regex.test(uaString);
    };
    testPf = function(regex) {
      return regex.test(platformString);
    };
    testVendor = function(regex) {
      return regex.test(vendorString);
    };
    checkPf = function(checkName, resultName) {
      var result;
      resultName = resultName || checkName;
      result = "";
      if (platformString.indexOf(checkName) === 0) {
        result = resultName;
      }
      return result;
    };
    checkDevice = function(deviceNames, resultNames) {
      var deviceName, i, idx, len, result;
      resultNames = resultNames || deviceNames;
      result = "";
      for (idx = i = 0, len = deviceNames.length; i < len; idx = ++i) {
        deviceName = deviceNames[idx];
        result = checkPf(deviceName, resultNames[idx]);
        if (result) {
          break;
        }
      }
      return result;
    };
    checkPfSpecificBrowser = function(pfNames, browserName) {
      var i, len, pfName, result;
      result = "";
      for (i = 0, len = pfNames.length; i < len; i++) {
        pfName = pfNames[i];
        if (data.platform[pfName] === true) {
          result = browserName;
          break;
        }
      }
      return result;
    };
    getWebkitVer = function() {
      var webkitVer;
      webkitVer = uaString.match(/applewebkit\/(([1-9]{3,})(\.\d+)?)\s/);
      if (webkitVer) {
        return parseFloat(webkitVer[1]);
      } else {
        return 0;
      }
    };
    isAndroid = function() {
      if (testUa(/android/) && testPf(/android|linux/) || platform === null) {
        return "android";
      }
      return "";
    };
    isIosDevice = function() {
      return checkDevice(["iphone", "ipad", "ipod"]);
    };
    isBlackBerry = function() {
      var pfStr;
      pfStr = "blackberry";
      return checkPf(pfStr) || (function() {
        if (testUa(/bb10|blackberry/)) {
          return pfStr;
        }
        return "";
      })();
    };
    isFirefoxOs = function() {
      if (testUa(/gecko\/[\.0-9]+\sfirefox\/[0-9]{2}\.[0-9]+/) && platform === "") {
        return "firefoxOs";
      }
      return "";
    };
    isWindows = function() {
      return checkPf("win", "windows");
    };
    isMac = function() {
      return checkPf("mac");
    };
    isLinux = function() {
      return checkPf("linux");
    };
    isFreeBsd = function() {
      return checkPf("freebsd");
    };
    isOpenBsd = function() {
      return checkPf("openbsd");
    };
    isNintendoDs = function() {
      return checkDevice(["new nintendo 3ds", "nintendo 3ds", "nintendo dsi"], ["newNintendo3ds", "nintendo3ds", "nintendoDsi"]);
    };
    isWii = function() {
      return checkDevice(["nintendo wiiu", "nintendo wii"], ["nintendoWiiU", "nintendoWii"]);
    };
    isPlayStation = function() {
      return checkDevice(["playstation 4", "playstation 3", "psp"], ["ps4", "ps3", "psp"]);
    };
    isXbox = function() {
      if (testUa(/xbox/)) {
        return "xbox";
      }
      return "";
    };
    isIe = function() {
      if ("VBArray" in window && (hasDocumentMode || "attachEvent" in window) && !hasWindowOpera) {
        return "ie";
      }
      return "";
    };
    isEdge = function() {
      if ("msCapsLockWarningOff" in document && !hasDocumentMode) {
        return "edge";
      }
      return "";
    };
    isFirefox = function() {
      if ("mozInnerScreenX" in window) {
        return "firefox";
      } else {
        return "";
      }
    };
    isSafari = function() {
      if (testUa(/safari/) && testVendor(/apple computer/)) {
        return "safari";
      }
      return "";
    };
    isChrome = function() {
      if (testUa(/chrome|chromium/) && testVendor(/google inc/)) {
        return "chrome";
      }
      return "";
    };
    isOperaPresto = function() {
      if (hasWindowOpera && !data.platform.nintendoDsi && !data.platform.nintendoWii) {
        return "operaPresto";
      }
      return "";
    };
    isAndroidWebkit = function() {
      if (data.platform.android && !data.browser.chrome && getWebkitVer() < 537) {
        return "androidWebkit";
      }
      return "";
    };
    isBlackBerryWebkit = function() {
      if (data.platform.blackberry && getWebkitVer() > 534) {
        return "blackberryWebkit";
      }
      return "";
    };
    isBlackBerryMidp = function() {
      if (data.platform.blackberry && testUa(/profile\/midp/)) {
        return "blackberryMidp";
      }
      return "";
    };
    isPsBrowser = function() {
      return checkPfSpecificBrowser(["ps4", "ps3", "psp"], "psBrowser");
    };
    isNintendoOpera = function() {
      return checkPfSpecificBrowser(["nintendoDsi", "nintendoWii"], "nintendoOpera");
    };
    isNintendoBrowser = function() {
      return checkPfSpecificBrowser(["nintendo3ds", "newNintendo3ds", "nintendoWiiU"], "nintendoBrowser");
    };
    getIeDetail = function() {
      var result;
      result = {
        ver: 0,
        mode: 0
      };
      if (hasDocumentMode) {
        result.mode = document.documentMode;
        if ("msPointerEnabled" in navigator) {
          result.ver = "pointerEnabled" in navigator ? 11 : 10;
        } else {
          result.ver = "addEventListener" in window ? 9 : 8;
        }
      } else {
        if ("XMLHttpRequest" in window) {
          result.ver = result.mode = 7;
        } else if ("createAttribute" in document) {
          result.ver = result.mode = 6;
        } else if ("namespaces" in document && "createEventObject" in document) {
          result.ver = result.mode = 5.5;
        } else {
          result.ver = result.mode = 5;
        }
      }
      return result;
    };
    detectPlatform = function() {
      var detection, i, len, ref, result;
      result = "";
      ref = [isAndroid, isIosDevice, isBlackBerry, isFirefoxOs, isWindows, isMac, isLinux, isFreeBsd, isOpenBsd, isPlayStation, isWii, isNintendoDs, isXbox];
      for (i = 0, len = ref.length; i < len; i++) {
        detection = ref[i];
        result = detection();
        if (result) {
          break;
        }
      }
      if (result) {
        data.platform[result] = true;
        if (data.platform.ios === false && /^ip(hone|ad|od)/.test(result)) {
          data.platform.ios = true;
        }
      } else {
        data.platform.unknown = true;
      }
    };
    detectBrowser = function() {
      var detail, detection, i, len, ref, result, webkitVer;
      result = "";
      ref = [isIe, isEdge, isFirefox, isSafari, isChrome, isOperaPresto, isAndroidWebkit, isBlackBerryWebkit, isBlackBerryMidp, isPsBrowser, isNintendoBrowser, isNintendoOpera];
      for (i = 0, len = ref.length; i < len; i++) {
        detection = ref[i];
        result = detection();
        if (result) {
          break;
        }
      }
      if (result) {
        data.browser[result] = true;
        if (result === "ie") {
          detail = getIeDetail();
          data.browser.ieVer = detail.ver;
          data.browser.ieMode = detail.mode;
        }
        if (result === "safari" && data.platform.iphone) {
          if (screen.height === 240 && screen.width === 320) {
            data.platform.ios = false;
            data.platform.iphone = false;
            data.platform.newNintendo3ds = true;
            data.browser.safari = false;
            data.browser.nintendoBrowser = true;
          }
        }
      } else {
        webkitVer = getWebkitVer();
        if (webkitVer) {
          data.browser.unknownWebkit = true;
          data.browser.unknownWebkitVer = webkitVer;
        } else {
          data.browser.unknown = true;
        }
      }
    };
    detectPlatform();
    detectBrowser();
    return data;
  };

  (function(root, factory) {
    if (typeof exports === "object") {
      module.exports = factory();
    } else {
      if (!(GLOBAL_NS in root)) {
        root[GLOBAL_NS] = function() {};
      }
      root[GLOBAL_NS][MODULE_NAME] = factory();
    }
  })(this, detect);

}).call(this);
