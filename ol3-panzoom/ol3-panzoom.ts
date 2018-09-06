import ol = require("openlayers");
import ZoomSlider = require("./zoomslidercontrol");
import { defaults, cssin } from "ol3-fun/index";

function on(element: HTMLElement, event: string, listener: (event?: UIEvent) => any) {
	element.addEventListener(event, listener);
	return () => element.removeEventListener(event, listener);
}

export type Action = "pan-west" | "pan-south" | "pan-east" | "pan-north" | "zoom-in" | "zoom-out" | "zoom-max";

export interface IPanZoomOptions extends ol.olx.control.ControlOptions {
	className?: string;
	imgPath?: string;
	duration?: number;
	maxExtent?: ol.Extent;
	minZoom?: number;
	maxZoom?: number;
	pixelDelta?: number;
	slider?: boolean;
	zoomDelta?: number;
}

const DEFAULT_OPTIONS: IPanZoomOptions = {
	imgPath: "../ol3-panzoom/resources/ol2img",
	className: "ol-panzoom",
	duration: 500,
	maxZoom: 19,
	minZoom: 0,
	pixelDelta: 128,
	slider: false,
	zoomDelta: 1,
};

const css = `
.zoombar.black.north.mini {

}
`;

export class PanZoom extends ol.control.Control {
	private imgPath_: string;
	private listenerKeys_: Array<Function>;
	private maxExtent_: ol.Extent;
	private maxZoom_: number;
	private minZoom_: number;
	private zoomSliderCtrl_: ZoomSlider;
	private panEastEl_: HTMLDivElement;
	private panWestEl_: HTMLDivElement;
	private panNorthEl_: HTMLDivElement;
	private panSouthEl_: HTMLDivElement;
	private zoomInEl_: HTMLDivElement;
	private zoomOutEl_: HTMLDivElement;
	private zoomMaxEl_: HTMLElement;
	private zoomDelta_: number;
	private slider_: boolean;

	private element_: HTMLElement; // masks ancestor?
	element: HTMLDivElement; // masks ancestor?
	private options: IPanZoomOptions;

	constructor(options = DEFAULT_OPTIONS) {
		options = defaults({}, options, DEFAULT_OPTIONS);
		super(options);
		this.options = options;

		cssin("ol3-panzoom", css);

		this.imgPath_ = options.imgPath || "./ol3-panzoom/resources/ol2img";

		var element = (this.element = this.element_ = this.createEl_());
		this.setTarget(options.target);

		this.listenerKeys_ = [];

		this.maxExtent_ = options.maxExtent ? options.maxExtent : null;
		this.maxZoom_ = options.maxZoom ? options.maxZoom : 19;
		this.minZoom_ = options.minZoom ? options.minZoom : 0;
		this.slider_ = options.slider !== undefined ? options.slider : false;
		this.zoomDelta_ = options.zoomDelta !== undefined ? options.zoomDelta : 1;
		this.panEastEl_ = this.createButton("pan-east");
		this.panNorthEl_ = this.createButton("pan-north");
		this.panSouthEl_ = this.createButton("pan-south");
		this.panWestEl_ = this.createButton("pan-west");
		this.zoomInEl_ = this.createButton("zoom-in");
		this.zoomOutEl_ = this.createButton("zoom-out");
		this.zoomMaxEl_ = !this.slider_ && this.maxExtent_ ? this.createButton("zoom-max") : null;
		this.zoomSliderCtrl_ = this.slider_ ? new ZoomSlider() : null;

		element.appendChild(this.panNorthEl_);
		element.appendChild(this.panWestEl_);
		element.appendChild(this.panEastEl_);
		element.appendChild(this.panSouthEl_);
		element.appendChild(this.zoomInEl_);
		element.appendChild(this.zoomOutEl_);

		if (this.zoomMaxEl_) {
			element.appendChild(this.zoomMaxEl_);
		}
	}

	setMap(map: ol.Map) {
		var keys = this.listenerKeys_;
		var zoomSlider = this.zoomSliderCtrl_;

		var currentMap = this.getMap();
		if (currentMap && currentMap instanceof ol.Map) {
			keys.forEach(k => k());
			keys.length = 0;
			if (this.zoomSliderCtrl_) {
				this.zoomSliderCtrl_.setTarget(null);
				window.setTimeout(function() {
					currentMap.removeControl(zoomSlider);
				}, 0);
			}
		}

		super.setMap(map);

		if (map) {
			keys.push(on(this.panEastEl_, "click", evt => this.pan_("east", evt)));
			keys.push(on(this.panNorthEl_, "click", evt => this.pan_("north", evt)));
			keys.push(on(this.panSouthEl_, "click", evt => this.pan_("south", evt)));
			keys.push(on(this.panWestEl_, "click", evt => this.pan_("west", evt)));

			keys.push(on(this.zoomInEl_, "click", evt => this.zoom_("in", evt)));
			keys.push(on(this.zoomOutEl_, "click", evt => this.zoom_("out", evt)));

			if (this.maxExtent_ && !this.slider_) {
				keys.push(on(this.zoomMaxEl_, "click", evt => this.zoom_("max", evt)));
			}

			if (this.slider_) {
				zoomSlider.setTarget(this.element_);
				window.setTimeout(function() {
					map.addControl(zoomSlider);
				}, 0);
				this.adjustZoomSlider_();
			}
		}
	}

	private createEl_() {
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
	}

	private createButton(action: Action) {
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
					} else if (maxExtent) {
						divEl.style.top = "99px";
					} else {
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
	}

	private pan_(direction: "south" | "west" | "east" | "north", evt: Event) {
		var stopEvent = false;

		var map = this.getMap();
		console.assert(!!map, "map must be set");
		var view = map.getView();
		console.assert(!!view, "map must have view");
		let mapUnitsDelta = view.getResolution() * this.options.pixelDelta;
		let delta: ol.Coordinate = [0, 0];
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
				throw `unexpected direction: ${direction}`;
		}
		delta = ol.coordinate.rotate(delta, view.getRotation());

		// pan
		let center = view.getCenter();
		center = view.constrainCenter([center[0] + delta[0], center[1] + delta[1]]);

		view.animate({
			center: center,
			duration: this.options.duration,
		});

		evt.preventDefault();
		stopEvent = true;

		return !stopEvent;
	}

	private zoom_(direction: "in" | "out" | "max", evt: Event) {
		if (direction === "in") {
			this.zoomByDelta_(this.zoomDelta_);
		} else if (direction === "out") {
			this.zoomByDelta_(-this.zoomDelta_);
		} else if (direction === "max") {
			var map = this.getMap();
			var view = map.getView();
			var extent = !this.maxExtent_ ? view.getProjection().getExtent() : this.maxExtent_;
			view.fit(extent, {
				duration: this.options.duration,
			});
		}
		evt.preventDefault();
	}

	private zoomByDelta_(delta: number) {
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
				duration: this.options.duration,
			});
		}
	}

	/**
	 * @private
	 */
	adjustZoomSlider_() {
		var zoomSlider = this.zoomSliderCtrl_;
		var path = this.imgPath_;

		if (!zoomSlider || !path) {
			return;
		}

		var height = [this.getSliderSize_(), "px"].join("");

		// bar
		var zoomSliderEl = zoomSlider.getElement();
		zoomSliderEl.style.background = ["url(", path, "/", "zoombar.png", ")"].join("");
		zoomSliderEl.style.border = "0";
		zoomSliderEl.style.borderRadius = "0";
		zoomSliderEl.style.height = height;
		zoomSliderEl.style.left = "13px";
		zoomSliderEl.style.padding = "0";
		zoomSliderEl.style.top = "81px";
		zoomSliderEl.style.width = "18px";

		// slider
		var sliderEl = <HTMLElement>zoomSliderEl.children[0];
		console.assert(sliderEl instanceof Element);
		sliderEl.style.background = ["url(", path, "/", "slider.png", ")"].join("");
		sliderEl.style.border = "none";
		sliderEl.style.height = "9px";
		sliderEl.style.margin = "0 -1px";
		sliderEl.style.width = "20px";
	}

	/**
	 * @private
	 * @return {number}
	 */
	getSliderSize_() {
		return (this.maxZoom_ - this.minZoom_ + 1) * 11;
	}
}
