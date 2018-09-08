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
    var ZoomSlider = (function (_super) {
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
    var PanZoom = (function (_super) {
        __extends(PanZoom, _super);
        function PanZoom(options) {
            if (options === void 0) { options = DEFAULT_OPTIONS; }
            var _this = this;
            options = index_1.defaults({}, options, DEFAULT_OPTIONS);
            _this = _super.call(this, options) || this;
            _this.options = options;
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
define("examples/utils/MapMaker", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    exports.__esModule = true;
    function MapMaker(panZoom) {
        var center = [-7910321, 6179398];
        if (panZoom.options.maxExtent) {
            center = ol.extent.getCenter(panZoom.options.maxExtent);
        }
        var vectorLayer = new ol.layer.Vector();
        var vectors = new ol.source.Vector();
        vectors.addFeature(new ol.Feature(new ol.geom.Polygon([
            [
                [center[0] - 100, center[1] - 100],
                [center[0] - 100, center[1] + 100],
                [center[0] + 100, center[1] + 100],
                [center[0] + 100, center[1] - 100],
                [center[0] - 100, center[1] - 100]
            ]
        ])));
        vectorLayer.setSource(vectors);
        return new ol.Map({
            controls: ol.control
                .defaults({
                zoom: false
            })
                .extend([panZoom]),
            layers: [vectorLayer],
            target: "map",
            view: new ol.View({
                center: center,
                minZoom: panZoom.options.minZoom,
                maxZoom: panZoom.options.maxZoom,
                zoom: Math.floor((panZoom.options.minZoom + panZoom.options.maxZoom) / 2)
            })
        });
    }
    exports.MapMaker = MapMaker;
});
define("examples/black", ["require", "exports", "index", "examples/utils/MapMaker"], function (require, exports, index_2, MapMaker_1) {
    "use strict";
    exports.__esModule = true;
    function run() {
        var panZoom = new index_2.PanZoom({
            imgPath: "../ol3-panzoom/resources/zoombar_black",
            maxExtent: [813079, 5929220, 848966, 5936863]
        });
        MapMaker_1.MapMaker(panZoom);
    }
    exports.run = run;
});
define("examples/black-slider", ["require", "exports", "index", "examples/utils/MapMaker"], function (require, exports, index_3, MapMaker_2) {
    "use strict";
    exports.__esModule = true;
    function run() {
        MapMaker_2.MapMaker(new index_3.PanZoom({
            imgPath: "../ol3-panzoom/resources/zoombar_black",
            minZoom: 6,
            maxZoom: 15,
            slider: true
        }));
    }
    exports.run = run;
});
define("examples/maxextent", ["require", "exports", "openlayers", "index", "examples/utils/MapMaker"], function (require, exports, ol, index_4, MapMaker_3) {
    "use strict";
    exports.__esModule = true;
    function run() {
        var panZoom = new index_4.PanZoom({
            maxExtent: [813079, 5929220, 848966, 5936863]
        });
        MapMaker_3.MapMaker(panZoom).addControl(new ol.control.MousePosition());
    }
    exports.run = run;
});
define("examples/simple", ["require", "exports", "index", "examples/utils/MapMaker"], function (require, exports, index_5, MapMaker_4) {
    "use strict";
    exports.__esModule = true;
    function run() {
        MapMaker_4.MapMaker(new index_5.PanZoom());
    }
    exports.run = run;
});
define("examples/slider", ["require", "exports", "index", "examples/utils/MapMaker"], function (require, exports, index_6, MapMaker_5) {
    "use strict";
    exports.__esModule = true;
    function run() {
        MapMaker_5.MapMaker(new index_6.PanZoom({
            slider: true
        }));
    }
    exports.run = run;
});
define("examples/index", ["require", "exports", "examples/black", "examples/black-slider", "examples/maxextent", "examples/simple", "examples/slider"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=examples/";
        var labs = "\n    black\n    black-slider\n    maxextent\n    simple\n    slider\n    ";
        document.writeln("\n    <p>\n    Watch the console output for failed assertions (blank is good).\n    </p>\n    ");
        document.writeln(labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .sort()
            .map(function (lab) { return "<a href=\"" + path + lab + "&debug=0\">" + lab + "</a>"; })
            .join("<br/>"));
    }
    exports.run = run;
});
//# sourceMappingURL=examples.max.js.map