var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    /**
     * @constructor
     * @param {olx.control.ZoomSliderOptions=} opt_options Options.
     * @extends {ol.control.ZoomSlider}
     * @api
     */
    var ZoomSlider = (function (_super) {
        __extends(ZoomSlider, _super);
        function ZoomSlider(opt_options) {
            _super.call(this, opt_options);
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
