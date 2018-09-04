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
    /**
     * @constructor
     * @param {olx.control.ZoomSliderOptions=} opt_options Options.
     * @extends {ol.control.ZoomSlider}
     * @api
     */
    var ZoomSlider = /** @class */ (function (_super) {
        __extends(ZoomSlider, _super);
        function ZoomSlider(opt_options) {
            return _super.call(this, opt_options) || this;
        }
        /**
         * @return {Element}
         * @api
         */
        ZoomSlider.prototype.getElement = function () {
            return this.element;
        };
        return ZoomSlider;
    }(ol.control.ZoomSlider));
    return ZoomSlider;
});
define("ol3-panzoom/ol3-panzoom", ["require", "exports", "openlayers", "ol3-panzoom/zoomslidercontrol"], function (require, exports, ol, ZoomSlider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * extends the base object without replacing defined attributes
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
    function on(element, event, listener) {
        element.addEventListener(event, listener);
        return function () { return element.removeEventListener(event, listener); };
    }
    var DEFAULT_OPTIONS = {};
    var PanZoom = /** @class */ (function (_super) {
        __extends(PanZoom, _super);
        function PanZoom(options) {
            if (options === void 0) { options = DEFAULT_OPTIONS; }
            var _this = this;
            options = defaults({}, options, DEFAULT_OPTIONS);
            _this = _super.call(this, options) || this;
            _this.className_ = options.className ? options.className : 'ol-panzoom';
            _this.imgPath_ = options.imgPath || './ol3-panzoom/resources/ol2img';
            var element = _this.element = _this.element_ = _this.createEl_();
            _this.setTarget(options.target);
            _this.listenerKeys_ = [];
            _this.duration_ = options.duration !== undefined ? options.duration : 100;
            _this.maxExtent_ = options.maxExtent ? options.maxExtent : null;
            _this.maxZoom_ = options.maxZoom ? options.maxZoom : 19;
            _this.minZoom_ = options.minZoom ? options.minZoom : 0;
            _this.pixelDelta_ = options.pixelDelta !== undefined ? options.pixelDelta : 128;
            _this.slider_ = options.slider !== undefined ? options.slider : false;
            _this.zoomDelta_ = options.zoomDelta !== undefined ? options.zoomDelta : 1;
            _this.panEastEl_ = _this.createButtonEl_('pan-east');
            _this.panNorthEl_ = _this.createButtonEl_('pan-north');
            _this.panSouthEl_ = _this.createButtonEl_('pan-south');
            _this.panWestEl_ = _this.createButtonEl_('pan-west');
            _this.zoomInEl_ = _this.createButtonEl_('zoom-in');
            _this.zoomOutEl_ = _this.createButtonEl_('zoom-out');
            _this.zoomMaxEl_ = (!_this.slider_ && _this.maxExtent_) ? _this.createButtonEl_('zoom-max') : null;
            _this.zoomSliderCtrl_ = (_this.slider_) ? new ZoomSlider() : null;
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
        /**
         * @param {ol.Map} map
         * @api
         */
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
                keys.push(on(this.panEastEl_, "click", function (evt) { return _this.pan_('east', evt); }));
                keys.push(on(this.panNorthEl_, "click", function (evt) { return _this.pan_('north', evt); }));
                keys.push(on(this.panSouthEl_, "click", function (evt) { return _this.pan_('south', evt); }));
                keys.push(on(this.panWestEl_, "click", function (evt) { return _this.pan_('west', evt); }));
                keys.push(on(this.zoomInEl_, "click", function (evt) { return _this.zoom_('in', evt); }));
                keys.push(on(this.zoomOutEl_, "click", function (evt) { return _this.zoom_('out', evt); }));
                if (this.maxExtent_ && !this.slider_) {
                    keys.push(on(this.zoomMaxEl_, "click", function (evt) { return _this.zoom_('max', evt); }));
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
            var className = this.className_;
            var cssClasses = [
                className,
                'ol-unselectable'
            ];
            if (!path) {
                cssClasses.push('ol-control');
            }
            var element = document.createElement('div');
            element.className = cssClasses.join(' ');
            if (path) {
                element.style.left = '4px';
                element.style.position = 'absolute';
                element.style.top = '4px';
            }
            return element;
        };
        PanZoom.prototype.createButtonEl_ = function (action) {
            var divEl = document.createElement('div');
            var path = this.imgPath_;
            var maxExtent = this.maxExtent_;
            var slider = this.slider_;
            if (path) {
                divEl.style.width = '18px';
                divEl.style.height = '18px';
                divEl.style.position = 'absolute';
                divEl.style.cursor = 'pointer';
                var imgEl = document.createElement('img');
                imgEl.style.width = '18px';
                imgEl.style.height = '18px';
                imgEl.style['vertical-align'] = 'top';
                switch (action) {
                    case 'pan-east':
                        imgEl.id = 'OpenLayers_Control_PanZoom_panright_innerImage';
                        imgEl.src = [path, 'east-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_panright';
                        divEl.style.top = '22px';
                        divEl.style.left = '22px';
                        break;
                    case 'pan-north':
                        imgEl.id = 'OpenLayers_Control_PanZoom_panup_innerImage';
                        imgEl.src = [path, 'north-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_panup';
                        divEl.style.top = '4px';
                        divEl.style.left = '13px';
                        break;
                    case 'pan-south':
                        imgEl.id = 'OpenLayers_Control_PanZoom_pandown_innerImage';
                        imgEl.src = [path, 'south-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_pandown';
                        divEl.style.top = '40px';
                        divEl.style.left = '13px';
                        break;
                    case 'pan-west':
                        imgEl.id = 'OpenLayers_Control_PanZoom_panleft_innerImage';
                        imgEl.src = [path, 'west-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_panleft';
                        divEl.style.top = '22px';
                        divEl.style.left = '4px';
                        break;
                    case 'zoom-in':
                        imgEl.id = 'OpenLayers_Control_PanZoom_zoomin_innerImage';
                        imgEl.src = [path, 'zoom-plus-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_zoomin';
                        divEl.style.top = '63px';
                        divEl.style.left = '13px';
                        break;
                    case 'zoom-out':
                        imgEl.id = 'OpenLayers_Control_PanZoom_zoomout_innerImage';
                        imgEl.src = [path, 'zoom-minus-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_zoomout';
                        if (slider) {
                            divEl.style.top = [this.getSliderSize_() + 81, 'px'].join('');
                        }
                        else if (maxExtent) {
                            divEl.style.top = '99px';
                        }
                        else {
                            divEl.style.top = '81px';
                        }
                        divEl.style.left = '13px';
                        break;
                    case 'zoom-max':
                        imgEl.id = 'OpenLayers_Control_PanZoom_zoomworld_innerImage';
                        imgEl.src = [path, 'zoom-world-mini.png'].join('/');
                        divEl.id = 'OpenLayers_Control_PanZoom_zoomworld';
                        divEl.style.top = '81px';
                        divEl.style.left = '13px';
                        break;
                }
                divEl.appendChild(imgEl);
            }
            return divEl;
        };
        PanZoom.prototype.pan_ = function (direction, evt) {
            var stopEvent = false;
            var map = this.getMap();
            console.assert(!!map, 'map must be set');
            var view = map.getView();
            console.assert(!!view, 'map must have view');
            var mapUnitsDelta = view.getResolution() * this.pixelDelta_;
            var deltaX = 0, deltaY = 0;
            if (direction == 'south') {
                deltaY = -mapUnitsDelta;
            }
            else if (direction == 'west') {
                deltaX = -mapUnitsDelta;
            }
            else if (direction == 'east') {
                deltaX = mapUnitsDelta;
            }
            else {
                deltaY = mapUnitsDelta;
            }
            var delta = [deltaX, deltaY];
            ol.coordinate.rotate(delta, view.getRotation());
            // pan
            var currentCenter = view.getCenter();
            if (currentCenter) {
                if (this.duration_ && this.duration_ > 0) {
                    map.beforeRender(ol.animation.pan({
                        source: currentCenter,
                        duration: this.duration_,
                        easing: ol.easing.linear
                    }));
                }
                var center = view.constrainCenter([currentCenter[0] + delta[0], currentCenter[1] + delta[1]]);
                view.setCenter(center);
            }
            evt.preventDefault();
            stopEvent = true;
            return !stopEvent;
        };
        PanZoom.prototype.zoom_ = function (direction, evt) {
            if (direction === 'in') {
                this.zoomByDelta_(this.zoomDelta_);
            }
            else if (direction === 'out') {
                this.zoomByDelta_(-this.zoomDelta_);
            }
            else if (direction === 'max') {
                var map = this.getMap();
                var view = map.getView();
                var extent = !this.maxExtent_ ?
                    view.getProjection().getExtent() : this.maxExtent_;
                var size = map.getSize();
                console.assert(!!size, 'size should be defined');
                view.fit(extent, size);
            }
        };
        PanZoom.prototype.zoomByDelta_ = function (delta) {
            var map = this.getMap();
            var view = map.getView();
            if (!view) {
                // the map does not have a view, so we can't act
                // upon it
                return;
            }
            var currentResolution = view.getResolution();
            if (currentResolution) {
                if (this.duration_ > 0) {
                    map.beforeRender(ol.animation.zoom({
                        resolution: currentResolution,
                        duration: this.duration_,
                        easing: ol.easing.easeOut
                    }));
                }
                var newResolution = view.constrainResolution(currentResolution, delta);
                view.setResolution(newResolution);
            }
        };
        /**
         * @private
         */
        PanZoom.prototype.adjustZoomSlider_ = function () {
            var zoomSlider = this.zoomSliderCtrl_;
            var path = this.imgPath_;
            if (!zoomSlider || !path) {
                return;
            }
            var height = [this.getSliderSize_(), 'px'].join('');
            // bar
            var zoomSliderEl = zoomSlider.getElement();
            zoomSliderEl.style.background =
                ['url(', path, '/', 'zoombar.png', ')'].join('');
            zoomSliderEl.style.border = '0';
            zoomSliderEl.style['border-radius'] = '0';
            zoomSliderEl.style.height = height;
            zoomSliderEl.style.left = '13px';
            zoomSliderEl.style.padding = '0';
            zoomSliderEl.style.top = '81px';
            zoomSliderEl.style.width = '18px';
            // slider
            var sliderEl = zoomSliderEl.children[0];
            console.assert(sliderEl instanceof Element);
            sliderEl.style.background = ['url(', path, '/', 'slider.png', ')'].join('');
            sliderEl.style.border = "none";
            sliderEl.style.height = '9px';
            sliderEl.style.margin = '0 -1px';
            sliderEl.style.width = '20px';
        };
        /**
         * @private
         * @return {number}
         */
        PanZoom.prototype.getSliderSize_ = function () {
            return (this.maxZoom_ - this.minZoom_ + 1) * 11;
        };
        return PanZoom;
    }(ol.control.Control));
    exports.PanZoom = PanZoom;
});
define("index", ["require", "exports", "ol3-panzoom/ol3-panzoom"], function (require, exports, Panzoom) {
    "use strict";
    return Panzoom;
});
define("examples/black-slider", ["require", "exports", "openlayers", "../ol3-panzoom"], function (require, exports, ol, ol3_panzoom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        // Note that the view and control must share the same min/max zoom
        var minZoom = 6;
        var maxZoom = 15;
        var panZoom = new ol3_panzoom_1.PanZoom({
            imgPath: './ol3-panzoom/resources/zoombar_black',
            minZoom: minZoom,
            maxZoom: maxZoom,
            slider: true
        });
        var map = new ol.Map({
            controls: ol.control.defaults({
                zoom: false
            }).extend([
                panZoom
            ]),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: [-7910321, 6179398],
                minZoom: minZoom,
                maxZoom: maxZoom,
                zoom: 12
            })
        });
    }
    exports.run = run;
});
define("examples/black", ["require", "exports", "openlayers", "../ol3-panzoom"], function (require, exports, ol, ol3_panzoom_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var panZoom = new ol3_panzoom_2.PanZoom({
            imgPath: './ol3-panzoom/resources/zoombar_black',
            maxExtent: [813079, 5929220, 848966, 5936863]
        });
        var map = new ol.Map({
            controls: ol.control.defaults({
                zoom: false
            }).extend([
                panZoom
            ]),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: ol.proj.transform([-70, 50], 'EPSG:4326', 'EPSG:3857'),
                zoom: 5
            })
        });
    }
    exports.run = run;
});
define("examples/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=ol3-panzoom/examples/";
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
    ;
});
define("examples/maxextent", ["require", "exports", "openlayers", "../ol3-panzoom"], function (require, exports, ol, ol3_panzoom_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        // Define a `maxExtent` to include the "zoom to max extent" button
        var panZoom = new ol3_panzoom_3.PanZoom({
            maxExtent: [813079, 5929220, 848966, 5936863]
        });
        var map = new ol.Map({
            controls: ol.control.defaults({
                zoom: false
            }).extend([
                panZoom
            ]),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: ol.proj.transform([-70, 50], 'EPSG:4326', 'EPSG:3857'),
                zoom: 5
            })
        });
    }
    exports.run = run;
});
define("examples/simple", ["require", "exports", "openlayers", "../ol3-panzoom"], function (require, exports, ol, ol3_panzoom_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var panZoom = new ol3_panzoom_4.PanZoom();
        var map = new ol.Map({
            // replace the default `ol.control.Zoom` control by the `olpz.control.PanZoom`
            controls: ol.control.defaults({
                zoom: false
            }).extend([
                panZoom
            ]),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: ol.proj.transform([-70, 50], 'EPSG:4326', 'EPSG:3857'),
                zoom: 5
            })
        });
    }
    exports.run = run;
});
define("examples/slider", ["require", "exports", "openlayers", "../ol3-panzoom"], function (require, exports, ol, ol3_panzoom_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var panZoom = new ol3_panzoom_5.PanZoom({
            slider: true // enables the slider
        });
        var map = new ol.Map({
            controls: ol.control.defaults({
                zoom: false
            }).extend([
                panZoom
            ]),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: [-7910321, 6179398],
                // the control default min/max zoom are 0/19. It's important to match
                // those in the view as well
                minZoom: 0,
                maxZoom: 19,
                zoom: 12
            })
        });
    }
    exports.run = run;
});
(function () {
    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
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
    var localhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    loadCss("../node_modules/ol3-fun/static/ol/v5.1.3/ol.css");
    requirejs.config({
        shim: {
            // no need to wrap ol in a define method when using a shim
            // build this using the "npm run build-legacy" (see ol package.json)
            "openlayers": {
                deps: [],
                exports: "ol",
            }
        },
        paths: {
            "openlayers": localhost ? "../../node_modules/ol3-fun/static/ol/v5.1.3/ol" : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/build/ol"
        },
        packages: [
            {
                name: 'jquery',
                location: localhost ? "../../node_modules/jquery/dist" : 'https://cdn.rawgit.com/jquery/jquery-dist/3.1.1/dist',
                main: 'jquery.min'
            }
        ],
        deps: ["../examples.max"],
        callback: function () {
            requirejs([getParameterByName("run") || "examples/index"], function (test) { test.run(); });
        }
    });
})();
function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
function getParameterByName(name, url) {
    url = url || window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var debug = getParameterByName("debug") === "1";
var localhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
loadCss(localhost ? "../node_modules/mocha/mocha.css" : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0/mocha.css");
loadCss("../node_modules/ol3-fun/static/ol/v5.1.3/ol.css");
// setup require js packaging system and load the "spec" before running mocha
requirejs.config({
    shim: {
        // no need to wrap ol in a define method when using a shim
        // build this using the "npm run build-legacy" (see ol package.json)
        "openlayers": {
            deps: [],
            exports: "ol",
        }
    },
    paths: {
        "openlayers": localhost ? "../../node_modules/ol3-fun/static/ol/v5.1.3/ol" : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/build/ol"
    },
    packages: [
        {
            name: 'jquery',
            location: localhost ? '../../node_modules/jquery' : "https://code.jquery.com",
            main: localhost ? 'dist/jquery.min' : "jquery-3.3.1.min"
        },
        {
            name: 'mocha',
            location: localhost ? '../../node_modules/mocha' : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0",
            main: localhost ? 'mocha' : "mocha.min"
        }
    ],
    deps: ["../spec/index"],
    callback: function () {
        requirejs(["mocha"], function () {
            var Mocha = window["mocha"];
            var mocha = Mocha.setup({
                timeout: 6000,
                ui: 'bdd',
                bail: false
            });
            // execute "describe" and "it" methods before running mocha
            requirejs(["tests/index"], function () { return mocha.run(); });
        });
    }
});
//# sourceMappingURL=index.js.map