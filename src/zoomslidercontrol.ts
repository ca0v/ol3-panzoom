import ol = require("openlayers");

/**
 * @constructor
 * @param {olx.control.ZoomSliderOptions=} opt_options Options.
 * @extends {ol.control.ZoomSlider}
 * @api
 */
class ZoomSlider extends ol.control.ZoomSlider {
  private element: HTMLElement;

  constructor(opt_options?) {
    super(opt_options);
  }


  /**
   * @return {Element}
   * @api
   */
  getElement() {
    return this.element;
  }

}

export = ZoomSlider;