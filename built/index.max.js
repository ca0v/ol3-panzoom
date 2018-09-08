var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("ol3-panzoom/zoomslidercontrol", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    var ZoomSlider = /** @class */ (function (_super) {
        __extends(ZoomSlider, _super);
        function ZoomSlider(opt_options) {
            return _super.call(this, opt_options) || this;
        }
        return ZoomSlider;
    }(ol.control.ZoomSlider));
    return ZoomSlider;
});
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        ;
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return (v.split(",").map(function (v) { return parse(v, type[0]); }));
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    /**
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    /**
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     */
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    /**
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    /**
     * @param a target
     * @param b values to shallow copy into target
     */
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    /**
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    exports.defaults = defaults;
    /**
     * Adds exactly one instance of the CSS to the app with a mechanism
     * for disposing by invoking the destructor returned by this method.
     * Note the css will not be removed until the dependency count reaches
     * 0 meaning the number of calls to cssin('id') must match the number
     * of times the destructor is invoked.
     * let d1 = cssin('foo', '.foo { background: white }');
     * let d2 = cssin('foo', '.foo { background: white }');
     * d1(); // reduce dependency count
     * d2(); // really remove the css
     * @param name unique id for this style tag
     * @param css css content
     * @returns destructor
     */
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function debounce(func, wait, immediate) {
        if (wait === void 0) { wait = 50; }
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply({}, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow)
                func.apply({}, args);
        });
    }
    exports.debounce = debounce;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return result[i++] = [v1, v2]; }); });
        return result;
    }
    exports.pair = pair;
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    function zoomToFeature(map, feature, options) {
        var promise = $.Deferred();
        options = common_1.defaults(options || {}, {
            duration: 1000,
            padding: 256,
            minResolution: 2 * map.getView().getMinResolution()
        });
        var view = map.getView();
        var currentExtent = view.calculateExtent(map.getSize());
        var targetExtent = feature.getGeometry().getExtent();
        var doit = function (duration) {
            view.fit(targetExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration,
                callback: function () { return promise.resolve(); },
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            // new extent is contained within current extent, pan and zoom in
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            // new extent is contained within current extent, pan and zoom out
            doit(options.duration);
        }
        else {
            // zoom out until target extent is in view
            var fullExtent = ol.extent.createEmpty();
            ol.extent.extend(fullExtent, currentExtent);
            ol.extent.extend(fullExtent, targetExtent);
            var dscale = ol.extent.getWidth(fullExtent) / ol.extent.getWidth(currentExtent);
            var duration = 0.5 * options.duration;
            view.fit(fullExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
            setTimeout(function () { return doit(0.5 * options.duration); }, duration);
        }
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
// ported from https://github.com/gmaclennan/parse-dms/blob/master/index.js
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            "N": 1,
            "S": -1,
            "E": 1,
            "W": -1
        };
        var latLonIndex = {
            "-": "",
            "N": "lat",
            "S": "lat",
            "E": "lon",
            "W": "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw 'Degrees out of range';
        if (!inRange(minutes, 0, 60))
            throw 'Minutes out of range';
        if (!inRange(seconds, 0, 60))
            throw 'Seconds out of range';
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function parse(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        // Inspired by https://gist.github.com/JeffJacobson/2955437
        // See https://regex101.com/r/kS2zR1/3
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
        // If dmsString starts with a hemisphere letter, then the regex can also capture the 
        // hemisphere letter for the second coordinate pair if also in the string
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        }
        else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }
        var decDeg1 = decDegFromMatch(m1);
        var m2 = dmsString2.match(dmsRe);
        var decDeg2 = m2 && decDegFromMatch(m2);
        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                // If we only have one coordinate but we have no hemisphere value,
                // just return the decDeg number
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                // If no hemisphere letter but we have two coordinates,
                // infer that the first is lat, the second lon
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
        // If we parsed the first coordinate as lat or lon, then assume the second is the other
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function slowloop(functions, interval, cycles) {
        if (interval === void 0) { interval = 1000; }
        if (cycles === void 0) { cycles = 1; }
        var d = $.Deferred();
        var index = 0;
        if (!functions || 0 >= cycles) {
            d.resolve();
            return d;
        }
        var h = setInterval(function () {
            if (index === functions.length) {
                index = 0;
                cycles--;
                if (cycles <= 0) {
                    d.resolve();
                    return;
                }
            }
            functions[index++]();
        }, interval);
        d.done(function () { return clearInterval(h); });
        return d;
    }
    exports.slowloop = slowloop;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop"], function (require, exports, common_2, navigation_1, parse_dms_1, slowloop_1) {
    "use strict";
    var index = {
        asArray: common_2.asArray,
        cssin: common_2.cssin,
        debounce: common_2.debounce,
        defaults: common_2.defaults,
        doif: common_2.doif,
        getParameterByName: common_2.getParameterByName,
        getQueryParameters: common_2.getQueryParameters,
        html: common_2.html,
        mixin: common_2.mixin,
        pair: common_2.pair,
        parse: common_2.parse,
        range: common_2.range,
        shuffle: common_2.shuffle,
        toggle: common_2.toggle,
        uuid: common_2.uuid,
        slowloop: slowloop_1.slowloop,
        dms: {
            parse: parse_dms_1.parse,
        },
        navigation: {
            zoomToFeature: navigation_1.zoomToFeature,
        },
    };
    return index;
});
define("ol3-panzoom/ol3-panzoom", ["require", "exports", "openlayers", "ol3-panzoom/zoomslidercontrol", "node_modules/ol3-fun/index"], function (require, exports, ol, ZoomSlider, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function on(element, event, listener) {
        element.addEventListener(event, listener);
        return function () { return element.removeEventListener(event, listener); };
    }
    var DEFAULT_OPTIONS = {
        imgPath: "../ol3-panzoom/resources",
        theme: "ol2img",
        className: "ol-panzoom",
        duration: 500,
        maxZoom: 19,
        minZoom: 0,
        pixelDelta: 128,
        slider: false,
        zoomDelta: 1
    };
    var PanZoom = /** @class */ (function (_super) {
        __extends(PanZoom, _super);
        function PanZoom(options) {
            if (options === void 0) { options = DEFAULT_OPTIONS; }
            var _this = this;
            options = index_1.defaults({}, options, DEFAULT_OPTIONS);
            _this = _super.call(this, options) || this;
            _this.options = options;
            // imgPath locked in after constructor
            index_1.cssin("ol3-panzoom", ".ol-panzoom {\n\t\t\t\ttop: 0.5em;\n\t\t\t\tleft: 0.5em;\n\t\t\t\tbackground-color: transparent;\n\t\t\t}\n\t\t\t.ol-panzoom:hover {\n\t\t\t\tbackground-color: transparent;\n\t\t\t}\n\t\t\t.ol-panzoom .action {\n\t\t\t\tposition:absolute;\n\t\t\t\twidth:18px;\n\t\t\t\theight:18px;\n\t\t\t\tcursor:pointer;\t\n\t\t\t\tbackground-position: center;\n\t\t\t\tbackground-repeat: no-repeat;\n\t\t\t}\n\t\t\t.ol-panzoom .action.pan.west {\n\t\t\t\ttop: 22px;\n\t\t\t\tleft: 4px;\n\t\t\t}\n\t\t\t.ol-panzoom .action.pan.east {\n\t\t\t\ttop: 22px;\n\t\t\t\tleft: 22px;\n\t\t\t}\n\t\t\t.ol-panzoom .action.pan.north {\n\t\t\t\ttop: 4px;\n\t\t\t\tleft: 13px;\n\t\t\t}\n\t\t\t.ol-panzoom .action.pan.south {\n\t\t\t\ttop: 40px;\n\t\t\t\tleft: 13px;\n\t\t\t}\n\t\t\t.ol-panzoom .action.zoom.in {\n\t\t\t\ttop: 63px;\n\t\t\t\tleft: 13px;\n\t\t\t}\n\t\t\t.ol-panzoom .action img {\n\t\t\t\twidth:18px;\n\t\t\t\theight:18px;\n\t\t\t\tvertical-align:top;\n\t\t\t}\n\t\t\t.ol-panzoom .ol-zoomslider {\n\t\t\t\tborder:0;\n\t\t\t\tborderRadius:0;\n\t\t\t\tleft :13px;\n\t\t\t\tpadding:0;\n\t\t\t\ttop:81px;\n\t\t\t\twidth:18px\";\n\t\t\t}\n\t\t\t.ol-panzoom .ol-zoomslider .ol-zoomslider-thumb {\n\t\t\t\tborder:none;\n\t\t\t\theight:9px;\n\t\t\t\tmargin:0 -1px;\n\t\t\t\twidth:20px;\n\t\t\t}\n\t\t\t.ol-panzoom .action.zoom.out {\n\t\t\t\ttop: " + (_this.options.slider ? _this.getSliderSize() + 81 : _this.options.maxExtent ? 99 : 81) + "px;\n\t\t\t\tleft: 13px;\n\t\t\t}\n\t\t\t.ol-panzoom .action.zoom.max {\n\t\t\t\ttop:81px;\n\t\t\t\tleft:13px;\n\t\t\t}\n\t\t\t");
            ["ol2img", "zoombar_black"].forEach(function (theme) {
                return index_1.cssin("ol2-popup-" + theme, ".ol-panzoom." + theme + " .action.pan.north {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/north-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .action.pan.south {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/south-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .action.pan.west {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/west-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .action.pan.east {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/east-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .action.zoom.in {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/zoom-plus-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .action.zoom.out {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/zoom-minus-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .action.zoom.max {\n\t\t\tbackground-image:url(" + _this.options.imgPath + "/" + theme + "/zoom-world-mini.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .ol-zoomslider {\n\t\t\tbackground: url(" + _this.options.imgPath + "/" + theme + "/zoombar.png);\n\t\t}\n\t\t.ol-panzoom." + theme + " .ol-zoomslider .ol-zoomslider-thumb {\n\t\t\tbackground:url(" + _this.options.imgPath + "/" + theme + "/slider.png);\n\t\t}\n");
            });
            _this.createUx();
            return _this;
        }
        PanZoom.prototype.redraw = function () {
            var map = this.getMap();
            this.setMap(null);
            this.setMap(map);
        };
        PanZoom.prototype.createUx = function () {
            var options = this.options;
            var element = (this.element = this.element_ = this.createDiv());
            this.setTarget(options.target);
            this.listenerKeys_ = [];
            this.zoomDelta_ = options.zoomDelta !== undefined ? options.zoomDelta : 1;
            this.panEastEl_ = this.createButton("pan-east");
            this.panNorthEl_ = this.createButton("pan-north");
            this.panSouthEl_ = this.createButton("pan-south");
            this.panWestEl_ = this.createButton("pan-west");
            this.zoomInEl_ = this.createButton("zoom-in");
            this.zoomOutEl_ = this.createButton("zoom-out");
            this.zoomMaxEl_ = !this.options.slider && this.options.maxExtent ? this.createButton("zoom-max") : null;
            this.zoomSliderCtrl_ = this.options.slider ? new ZoomSlider() : null;
            element.appendChild(this.panNorthEl_);
            element.appendChild(this.panWestEl_);
            element.appendChild(this.panEastEl_);
            element.appendChild(this.panSouthEl_);
            element.appendChild(this.zoomInEl_);
            element.appendChild(this.zoomOutEl_);
            if (this.zoomMaxEl_) {
                element.appendChild(this.zoomMaxEl_);
            }
        };
        PanZoom.prototype.destroyUx = function () {
            var keys = this.listenerKeys_;
            var zoomSlider = this.zoomSliderCtrl_;
            var currentMap = this.getMap();
            this.element.remove();
            if (currentMap && currentMap instanceof ol.Map) {
                keys.forEach(function (k) { return k(); });
                keys.length = 0;
                if (zoomSlider) {
                    zoomSlider.element.remove();
                    zoomSlider.setTarget(null);
                    currentMap.removeControl(zoomSlider);
                }
            }
        };
        PanZoom.prototype.setMap = function (map) {
            var _this = this;
            this.destroyUx();
            this.createUx();
            _super.prototype.setMap.call(this, map);
            if (map) {
                var keys = this.listenerKeys_;
                keys.push(on(this.panEastEl_, "click", function (evt) { return _this.pan("east", evt); }));
                keys.push(on(this.panNorthEl_, "click", function (evt) { return _this.pan("north", evt); }));
                keys.push(on(this.panSouthEl_, "click", function (evt) { return _this.pan("south", evt); }));
                keys.push(on(this.panWestEl_, "click", function (evt) { return _this.pan("west", evt); }));
                keys.push(on(this.zoomInEl_, "click", function (evt) { return _this.zoom("in", evt); }));
                keys.push(on(this.zoomOutEl_, "click", function (evt) { return _this.zoom("out", evt); }));
                if (this.options.maxExtent && !this.options.slider) {
                    keys.push(on(this.zoomMaxEl_, "click", function (evt) { return _this.zoom("max", evt); }));
                }
                if (this.options.slider) {
                    map.once("postrender", function () {
                        var zoomSlider = _this.zoomSliderCtrl_;
                        zoomSlider.setTarget(_this.element_);
                        map.addControl(zoomSlider);
                        _this.adjustZoomSlider();
                    });
                }
            }
        };
        PanZoom.prototype.createDiv = function () {
            var cssClasses = [this.options.className, "ol-unselectable", "ol-control", this.options.theme];
            var element = document.createElement("div");
            element.className = cssClasses.join(" ");
            return element;
        };
        PanZoom.prototype.imgPath = function () {
            return this.options.imgPath + "/" + this.options.theme;
        };
        PanZoom.prototype.createButton = function (action) {
            var divEl = document.createElement("div");
            divEl.className = "action " + action.split("-").join(" ");
            switch (action) {
                case "zoom-out":
                    divEl.style.top =
                        (this.options.slider ? this.getSliderSize() + 81 : this.options.maxExtent ? 99 : 81) + "px";
                    break;
            }
            return divEl;
        };
        PanZoom.prototype.pan = function (direction, evt) {
            var map = this.getMap();
            console.assert(!!map, "map must be set");
            var view = map.getView();
            console.assert(!!view, "map must have view");
            var mapUnitsDelta = view.getResolution() * this.options.pixelDelta;
            var delta = [0, 0];
            switch (direction) {
                case "north":
                    delta[1] = mapUnitsDelta;
                    break;
                case "south":
                    delta[1] = -mapUnitsDelta;
                    break;
                case "east":
                    delta[0] = mapUnitsDelta;
                    break;
                case "west":
                    delta[0] = -mapUnitsDelta;
                    break;
                default:
                    throw "unexpected direction: " + direction;
            }
            delta = ol.coordinate.rotate(delta, view.getRotation());
            // pan
            var center = view.getCenter();
            center = view.constrainCenter([center[0] + delta[0], center[1] + delta[1]]);
            view.animate({
                center: center,
                duration: this.options.duration
            });
            evt && evt.preventDefault();
            return !evt;
        };
        PanZoom.prototype.zoom = function (direction, evt) {
            switch (direction) {
                case "in":
                    this.zoomByDelta(this.zoomDelta_);
                    break;
                case "out":
                    this.zoomByDelta(-this.zoomDelta_);
                    break;
                case "max":
                    {
                        var view = this.getMap().getView();
                        var extent = this.options.maxExtent || view.getProjection().getExtent();
                        view.fit(extent, {
                            duration: this.options.duration
                        });
                    }
                    break;
                default:
                    throw "unknown direction: " + direction;
            }
            evt && evt.preventDefault();
        };
        PanZoom.prototype.zoomByDelta = function (delta) {
            var map = this.getMap();
            var view = map.getView();
            if (!view) {
                // the map does not have a view, so we can't act
                // upon it
                return;
            }
            var currentResolution = view.getResolution();
            if (currentResolution) {
                var newResolution = view.constrainResolution(currentResolution, delta);
                view.animate({
                    resolution: newResolution,
                    duration: this.options.duration
                });
            }
        };
        PanZoom.prototype.adjustZoomSlider = function () {
            var zoomSlider = this.zoomSliderCtrl_;
            var path = this.imgPath();
            if (!zoomSlider || !path) {
                return;
            }
            // bar
            var zoomSliderEl = zoomSlider.element;
            zoomSliderEl.classList.add(this.options.theme);
            zoomSliderEl.style.height = this.getSliderSize() + "px";
        };
        PanZoom.prototype.getSliderSize = function () {
            return (this.options.maxZoom - this.options.minZoom + 1) * 11;
        };
        return PanZoom;
    }(ol.control.Control));
    exports.PanZoom = PanZoom;
});
define("index", ["require", "exports", "ol3-panzoom/ol3-panzoom"], function (require, exports, Panzoom) {
    "use strict";
    return Panzoom;
});
//# sourceMappingURL=index.max.js.map