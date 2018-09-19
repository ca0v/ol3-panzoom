import ol = require("openlayers");
import ZoomSlider = require("./zoomslidercontrol");
import { defaults, cssin } from "ol3-fun/index";

function on(element: HTMLElement, event: string, listener: EventListenerOrEventListenerObject) {
	element.addEventListener(event, listener);
	return () => element.removeEventListener(event, listener);
}

export type Action = "pan-west" | "pan-south" | "pan-east" | "pan-north" | "zoom-in" | "zoom-out" | "zoom-max";

export interface IPanZoomOptions extends ol.olx.control.ControlOptions {
	className?: string;
	imgPath?: string;
	theme?: "ol2img" | "zoombar_black";
	duration?: number;
	maxExtent?: ol.Extent;
	minZoom?: number;
	maxZoom?: number;
	// pixel buffer size
	pixelDelta?: number;
	slider?: boolean;
	zoomDelta?: number;
}

const DEFAULT_OPTIONS: IPanZoomOptions = {
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

export class PanZoom extends ol.control.Control {
	redraw() {
		let map = this.getMap();
		this.setMap(null);
		this.setMap(map);
	}
	private listenerKeys_: Array<Function>;
	private zoomSliderCtrl_: ZoomSlider | null;
	private panEastEl_: HTMLDivElement;
	private panWestEl_: HTMLDivElement;
	private panNorthEl_: HTMLDivElement;
	private panSouthEl_: HTMLDivElement;
	private zoomInEl_: HTMLDivElement;
	private zoomOutEl_: HTMLDivElement;
	private zoomMaxEl_: HTMLElement | null;
	private zoomDelta_: number;

	private element_: HTMLElement | null = null; // masks ancestor?
	private element: HTMLDivElement | null = null; // masks ancestor?
	public options: IPanZoomOptions;

	static create(options = DEFAULT_OPTIONS) {
		options = defaults({}, options, DEFAULT_OPTIONS);
		return new PanZoom(options);
	}

	private constructor(options = DEFAULT_OPTIONS) {
		super(options);
		this.options = options;
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

		// imgPath locked in after constructor
		cssin(
			`ol3-panzoom`,
			`.ol-panzoom {
				top: 0.5em;
				left: 0.5em;
				background-color: transparent;
			}
			.ol-panzoom:hover {
				background-color: transparent;
			}
			.ol-panzoom .action {
				position:absolute;
				width:18px;
				height:18px;
				cursor:pointer;	
				background-position: center;
				background-repeat: no-repeat;
			}
			.ol-panzoom .action.pan.west {
				top: 22px;
				left: 4px;
			}
			.ol-panzoom .action.pan.east {
				top: 22px;
				left: 22px;
			}
			.ol-panzoom .action.pan.north {
				top: 4px;
				left: 13px;
			}
			.ol-panzoom .action.pan.south {
				top: 40px;
				left: 13px;
			}
			.ol-panzoom .action.zoom.in {
				top: 63px;
				left: 13px;
			}
			.ol-panzoom .action img {
				width:18px;
				height:18px;
				vertical-align:top;
			}
			.ol-panzoom .ol-zoomslider {
				border:0;
				borderRadius:0;
				left :13px;
				padding:0;
				top:81px;
				width:18px";
			}
			.ol-panzoom .ol-zoomslider .ol-zoomslider-thumb {
				border:none;
				height:9px;
				margin:0 -1px;
				width:20px;
			}
			.ol-panzoom .action.zoom.out {
				top: ${this.options.slider ? this.getSliderSize() + 81 : this.options.maxExtent ? 99 : 81}px;
				left: 13px;
			}
			.ol-panzoom .action.zoom.max {
				top:81px;
				left:13px;
			}
			`
		);

		["ol2img", "zoombar_black"].forEach(theme =>
			cssin(
				`ol2-popup-${theme}`,
				`.ol-panzoom.${theme} .action.pan.north {
			background-image:url(${this.options.imgPath}/${theme}/north-mini.png);
		}
		.ol-panzoom.${theme} .action.pan.south {
			background-image:url(${this.options.imgPath}/${theme}/south-mini.png);
		}
		.ol-panzoom.${theme} .action.pan.west {
			background-image:url(${this.options.imgPath}/${theme}/west-mini.png);
		}
		.ol-panzoom.${theme} .action.pan.east {
			background-image:url(${this.options.imgPath}/${theme}/east-mini.png);
		}
		.ol-panzoom.${theme} .action.zoom.in {
			background-image:url(${this.options.imgPath}/${theme}/zoom-plus-mini.png);
		}
		.ol-panzoom.${theme} .action.zoom.out {
			background-image:url(${this.options.imgPath}/${theme}/zoom-minus-mini.png);
		}
		.ol-panzoom.${theme} .action.zoom.max {
			background-image:url(${this.options.imgPath}/${theme}/zoom-world-mini.png);
		}
		.ol-panzoom.${theme} .ol-zoomslider {
			background: url(${this.options.imgPath}/${theme}/zoombar.png);
		}
		.ol-panzoom.${theme} .ol-zoomslider .ol-zoomslider-thumb {
			background:url(${this.options.imgPath}/${theme}/slider.png);
		}
`
			)
		);
		this.createUx();
	}

	private createUx() {
		let options = this.options;
		let element = (this.element = this.element_ = this.createDiv());
		options.target && this.setTarget(options.target);
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

	private destroyUx() {
		let keys = this.listenerKeys_;
		let zoomSlider = this.zoomSliderCtrl_;
		let currentMap = this.getMap();
		this.element && this.element.remove();

		if (currentMap && currentMap instanceof ol.Map) {
			if (keys) {
				keys.forEach(k => k());
				keys.length = 0;
			}
			if (zoomSlider) {
				zoomSlider.element && zoomSlider.element.remove();
				zoomSlider.setTarget(<any>null);
				currentMap.removeControl(zoomSlider);
			}
		}
	}

	setMap(map: ol.Map | null) {
		this.destroyUx();
		this.createUx();
		super.setMap(<any>map);

		if (map) {
			let keys = this.listenerKeys_;

			keys.push(on(this.panEastEl_, "click", evt => this.pan("east", evt)));
			keys.push(on(this.panNorthEl_, "click", evt => this.pan("north", evt)));
			keys.push(on(this.panSouthEl_, "click", evt => this.pan("south", evt)));
			keys.push(on(this.panWestEl_, "click", evt => this.pan("west", evt)));

			keys.push(on(this.zoomInEl_, "click", evt => this.zoom("in", evt)));
			keys.push(on(this.zoomOutEl_, "click", evt => this.zoom("out", evt)));

			if (this.options.maxExtent && !this.options.slider && this.zoomMaxEl_) {
				keys.push(on(this.zoomMaxEl_, "click", evt => this.zoom("max", evt)));
			}

			if (this.options.slider) {
				map.once("postrender", () => {
					let zoomSlider = this.zoomSliderCtrl_;
					if (!zoomSlider) throw "zoom slider control not found";
					if (!this.element_) throw "target element not found";
					zoomSlider.setTarget(this.element_);
					map.addControl(zoomSlider);
					this.adjustZoomSlider();
				});
			}
		}
	}

	private createDiv() {
		var cssClasses = [this.options.className, "ol-unselectable", "ol-control", this.options.theme];
		let element = document.createElement("div");
		element.className = cssClasses.join(" ");

		return element;
	}
	private imgPath(): string {
		return `${this.options.imgPath}/${this.options.theme}`;
	}

	private createButton(action: Action) {
		var divEl = document.createElement("div");
		divEl.className = `action ${action.split("-").join(" ")}`;

		switch (action) {
			case "zoom-out":
				divEl.style.top =
					(this.options.slider ? this.getSliderSize() + 81 : this.options.maxExtent ? 99 : 81) + "px";
				break;
		}

		return divEl;
	}

	public pan(direction: "south" | "west" | "east" | "north", evt?: Event) {
		let map = this.getMap();
		console.assert(!!map, "map must be set");
		let view = map.getView();
		console.assert(!!view, "map must have view");
		let mapUnitsDelta = view.getResolution() * (this.options.pixelDelta || 128);
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
			duration: this.options.duration
		});

		evt && evt.preventDefault();
		return !evt;
	}

	public zoom(direction: "in" | "out" | "max", evt?: Event) {
		switch (direction) {
			case "in":
				this.zoomByDelta(this.zoomDelta_);
				break;
			case "out":
				this.zoomByDelta(-this.zoomDelta_);
				break;
			case "max":
				{
					let view = this.getMap().getView();
					var extent = this.options.maxExtent || view.getProjection().getExtent();
					view.fit(extent, {
						duration: this.options.duration
					});
				}
				break;
			default:
				throw `unknown direction: ${direction}`;
		}
		evt && evt.preventDefault();
	}

	private zoomByDelta(delta: number) {
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
	}

	private adjustZoomSlider() {
		var zoomSlider = this.zoomSliderCtrl_;
		var path = this.imgPath();

		if (!zoomSlider || !path) {
			return;
		}

		// bar
		let zoomSliderEl = zoomSlider.element;
		if (zoomSliderEl) {
			zoomSliderEl.classList.add(this.options.theme || "ol2img");
			zoomSliderEl.style.height = `${this.getSliderSize()}px`;
		}
	}

	private getSliderSize() {
		return ((this.options.maxZoom || 20) - (this.options.minZoom || 0) + 1) * 11;
	}
}
