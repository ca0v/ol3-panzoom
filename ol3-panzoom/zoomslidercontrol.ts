import ol = require("openlayers");

class ZoomSlider extends ol.control.ZoomSlider {
	public element: HTMLElement | undefined;

	constructor(opt_options?: ol.olx.control.ZoomSliderOptions) {
		super(opt_options);
	}

	// getElement() {
	// 	return this.element;
	// }
}

export = ZoomSlider;
