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
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
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
define("node_modules/ol3-fun/tests/base", ["require", "exports", "node_modules/ol3-fun/ol3-fun/slowloop"], function (require, exports, slowloop_1) {
    "use strict";
    exports.__esModule = true;
    exports.slowloop = slowloop_1.slowloop;
    function describe(title, fn) {
        console.log(title || "undocumented test group");
        return window.describe(title, fn);
    }
    exports.describe = describe;
    function it(title, fn) {
        console.log(title || "undocumented test");
        return window.it(title, fn);
    }
    exports.it = it;
    function should(result, message) {
        console.log(message || "undocumented assertion");
        if (!result)
            throw message;
    }
    exports.should = should;
    function shouldEqual(a, b, message) {
        if (a != b)
            console.warn("\"" + a + "\" <> \"" + b + "\"");
        should(a == b, message);
    }
    exports.shouldEqual = shouldEqual;
    function stringify(o) {
        return JSON.stringify(o, null, "\t");
    }
    exports.stringify = stringify;
});
define("ol3-panzoom/zoomslidercontrol", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    var ZoomSlider = (function (_super) {
        __extends(ZoomSlider, _super);
        function ZoomSlider(opt_options) {
            return _super.call(this, opt_options) || this;
        }
        ZoomSlider.prototype.getElement = function () {
            return this.element;
        };
        return ZoomSlider;
    }(ol.control.ZoomSlider));
    return ZoomSlider;
});
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
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
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
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
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
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
    exports.__esModule = true;
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
                callback: function () { return promise.resolve(); }
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else {
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
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
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
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
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
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
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
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop"], function (require, exports, common_2, navigation_1, parse_dms_1, slowloop_2) {
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
        slowloop: slowloop_2.slowloop,
        dms: {
            parse: parse_dms_1.parse
        },
        navigation: {
            zoomToFeature: navigation_1.zoomToFeature
        }
    };
    return index;
});
define("ol3-panzoom/ol3-panzoom", ["require", "exports", "openlayers", "ol3-panzoom/zoomslidercontrol", "node_modules/ol3-fun/index"], function (require, exports, ol, ZoomSlider, index_1) {
    "use strict";
    exports.__esModule = true;
    function on(element, event, listener) {
        element.addEventListener(event, listener);
        return function () { return element.removeEventListener(event, listener); };
    }
    var DEFAULT_OPTIONS = {
        imgPath: "../ol3-panzoom/resources/ol2img",
        className: "ol-panzoom",
        duration: 500,
        maxZoom: 19,
        minZoom: 0,
        pixelDelta: 128,
        slider: false,
        zoomDelta: 1
    };
    var css = "\n.zoombar.black.north.mini {\n\n}\n";
    var PanZoom = (function (_super) {
        __extends(PanZoom, _super);
        function PanZoom(options) {
            if (options === void 0) { options = DEFAULT_OPTIONS; }
            var _this = this;
            options = index_1.defaults({}, options, DEFAULT_OPTIONS);
            _this = _super.call(this, options) || this;
            _this.options = options;
            index_1.cssin("ol3-panzoom", css);
            _this.imgPath_ = options.imgPath || "./ol3-panzoom/resources/ol2img";
            var element = (_this.element = _this.element_ = _this.createEl_());
            _this.setTarget(options.target);
            _this.listenerKeys_ = [];
            _this.maxExtent_ = options.maxExtent ? options.maxExtent : null;
            _this.maxZoom_ = options.maxZoom ? options.maxZoom : 19;
            _this.minZoom_ = options.minZoom ? options.minZoom : 0;
            _this.slider_ = options.slider !== undefined ? options.slider : false;
            _this.zoomDelta_ = options.zoomDelta !== undefined ? options.zoomDelta : 1;
            _this.panEastEl_ = _this.createButton("pan-east");
            _this.panNorthEl_ = _this.createButton("pan-north");
            _this.panSouthEl_ = _this.createButton("pan-south");
            _this.panWestEl_ = _this.createButton("pan-west");
            _this.zoomInEl_ = _this.createButton("zoom-in");
            _this.zoomOutEl_ = _this.createButton("zoom-out");
            _this.zoomMaxEl_ = !_this.slider_ && _this.maxExtent_ ? _this.createButton("zoom-max") : null;
            _this.zoomSliderCtrl_ = _this.slider_ ? new ZoomSlider() : null;
            element.appendChild(_this.panNorthEl_);
            element.appendChild(_this.panWestEl_);
            element.appendChild(_this.panEastEl_);
            element.appendChild(_this.panSouthEl_);
            element.appendChild(_this.zoomInEl_);
            element.appendChild(_this.zoomOutEl_);
            if (_this.zoomMaxEl_) {
                element.appendChild(_this.zoomMaxEl_);
            }
            return _this;
        }
        PanZoom.prototype.setMap = function (map) {
            var _this = this;
            var keys = this.listenerKeys_;
            var zoomSlider = this.zoomSliderCtrl_;
            var currentMap = this.getMap();
            if (currentMap && currentMap instanceof ol.Map) {
                keys.forEach(function (k) { return k(); });
                keys.length = 0;
                if (this.zoomSliderCtrl_) {
                    this.zoomSliderCtrl_.setTarget(null);
                    window.setTimeout(function () {
                        currentMap.removeControl(zoomSlider);
                    }, 0);
                }
            }
            _super.prototype.setMap.call(this, map);
            if (map) {
                keys.push(on(this.panEastEl_, "click", function (evt) { return _this.pan_("east", evt); }));
                keys.push(on(this.panNorthEl_, "click", function (evt) { return _this.pan_("north", evt); }));
                keys.push(on(this.panSouthEl_, "click", function (evt) { return _this.pan_("south", evt); }));
                keys.push(on(this.panWestEl_, "click", function (evt) { return _this.pan_("west", evt); }));
                keys.push(on(this.zoomInEl_, "click", function (evt) { return _this.zoom_("in", evt); }));
                keys.push(on(this.zoomOutEl_, "click", function (evt) { return _this.zoom_("out", evt); }));
                if (this.maxExtent_ && !this.slider_) {
                    keys.push(on(this.zoomMaxEl_, "click", function (evt) { return _this.zoom_("max", evt); }));
                }
                if (this.slider_) {
                    zoomSlider.setTarget(this.element_);
                    window.setTimeout(function () {
                        map.addControl(zoomSlider);
                    }, 0);
                    this.adjustZoomSlider_();
                }
            }
        };
        PanZoom.prototype.createEl_ = function () {
            var path = this.imgPath_;
            var cssClasses = [this.options.className, "ol-unselectable"];
            if (!path) {
                cssClasses.push("ol-control");
            }
            var element = document.createElement("div");
            element.className = cssClasses.join(" ");
            if (path) {
                element.style.left = "4px";
                element.style.position = "absolute";
                element.style.top = "4px";
            }
            return element;
        };
        PanZoom.prototype.createButton = function (action) {
            var divEl = document.createElement("div");
            divEl.className = action;
            var path = this.imgPath_;
            var maxExtent = this.maxExtent_;
            var slider = this.slider_;
            if (path) {
                divEl.style.width = "18px";
                divEl.style.height = "18px";
                divEl.style.position = "absolute";
                divEl.style.cursor = "pointer";
                var imgEl = document.createElement("img");
                imgEl.style.width = "18px";
                imgEl.style.height = "18px";
                imgEl.style.verticalAlign = "top";
                switch (action) {
                    case "pan-east":
                        imgEl.id = "OpenLayers_Control_PanZoom_panright_innerImage";
                        imgEl.src = [path, "east-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_panright";
                        divEl.style.top = "22px";
                        divEl.style.left = "22px";
                        break;
                    case "pan-north":
                        imgEl.id = "OpenLayers_Control_PanZoom_panup_innerImage";
                        imgEl.src = [path, "north-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_panup";
                        divEl.style.top = "4px";
                        divEl.style.left = "13px";
                        break;
                    case "pan-south":
                        imgEl.id = "OpenLayers_Control_PanZoom_pandown_innerImage";
                        imgEl.src = [path, "south-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_pandown";
                        divEl.style.top = "40px";
                        divEl.style.left = "13px";
                        break;
                    case "pan-west":
                        imgEl.id = "OpenLayers_Control_PanZoom_panleft_innerImage";
                        imgEl.src = [path, "west-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_panleft";
                        divEl.style.top = "22px";
                        divEl.style.left = "4px";
                        break;
                    case "zoom-in":
                        imgEl.id = "OpenLayers_Control_PanZoom_zoomin_innerImage";
                        imgEl.src = [path, "zoom-plus-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_zoomin";
                        divEl.style.top = "63px";
                        divEl.style.left = "13px";
                        break;
                    case "zoom-out":
                        imgEl.id = "OpenLayers_Control_PanZoom_zoomout_innerImage";
                        imgEl.src = [path, "zoom-minus-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_zoomout";
                        if (slider) {
                            divEl.style.top = [this.getSliderSize_() + 81, "px"].join("");
                        }
                        else if (maxExtent) {
                            divEl.style.top = "99px";
                        }
                        else {
                            divEl.style.top = "81px";
                        }
                        divEl.style.left = "13px";
                        break;
                    case "zoom-max":
                        imgEl.id = "OpenLayers_Control_PanZoom_zoomworld_innerImage";
                        imgEl.src = [path, "zoom-world-mini.png"].join("/");
                        divEl.id = "OpenLayers_Control_PanZoom_zoomworld";
                        divEl.style.top = "81px";
                        divEl.style.left = "13px";
                        break;
                }
                divEl.appendChild(imgEl);
            }
            return divEl;
        };
        PanZoom.prototype.pan_ = function (direction, evt) {
            var stopEvent = false;
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
            var center = view.getCenter();
            center = view.constrainCenter([center[0] + delta[0], center[1] + delta[1]]);
            view.animate({
                center: center,
                duration: this.options.duration
            });
            evt.preventDefault();
            stopEvent = true;
            return !stopEvent;
        };
        PanZoom.prototype.zoom_ = function (direction, evt) {
            if (direction === "in") {
                this.zoomByDelta_(this.zoomDelta_);
            }
            else if (direction === "out") {
                this.zoomByDelta_(-this.zoomDelta_);
            }
            else if (direction === "max") {
                var map = this.getMap();
                var view = map.getView();
                var extent = !this.maxExtent_ ? view.getProjection().getExtent() : this.maxExtent_;
                view.fit(extent, {
                    duration: this.options.duration
                });
            }
            evt.preventDefault();
        };
        PanZoom.prototype.zoomByDelta_ = function (delta) {
            var map = this.getMap();
            var view = map.getView();
            if (!view) {
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
        PanZoom.prototype.adjustZoomSlider_ = function () {
            var zoomSlider = this.zoomSliderCtrl_;
            var path = this.imgPath_;
            if (!zoomSlider || !path) {
                return;
            }
            var height = [this.getSliderSize_(), "px"].join("");
            var zoomSliderEl = zoomSlider.getElement();
            zoomSliderEl.style.background = ["url(", path, "/", "zoombar.png", ")"].join("");
            zoomSliderEl.style.border = "0";
            zoomSliderEl.style.borderRadius = "0";
            zoomSliderEl.style.height = height;
            zoomSliderEl.style.left = "13px";
            zoomSliderEl.style.padding = "0";
            zoomSliderEl.style.top = "81px";
            zoomSliderEl.style.width = "18px";
            var sliderEl = zoomSliderEl.children[0];
            console.assert(sliderEl instanceof Element);
            sliderEl.style.background = ["url(", path, "/", "slider.png", ")"].join("");
            sliderEl.style.border = "none";
            sliderEl.style.height = "9px";
            sliderEl.style.margin = "0 -1px";
            sliderEl.style.width = "20px";
        };
        PanZoom.prototype.getSliderSize_ = function () {
            return (this.maxZoom_ - this.minZoom_ + 1) * 11;
        };
        return PanZoom;
    }(ol.control.Control));
    exports.PanZoom = PanZoom;
});
define("tests/index", ["require", "exports", "node_modules/ol3-fun/tests/base", "ol3-panzoom/ol3-panzoom"], function (require, exports, base_1, PanZoom) {
    "use strict";
    exports.__esModule = true;
    base_1.describe("ol3-panzoom", function () {
        base_1.it("ol3-panzoom", function () {
            base_1.should(!!PanZoom, "PanZoom exists");
        });
    });
});
//# sourceMappingURL=tests.max.js.map