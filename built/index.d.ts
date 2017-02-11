declare module "ol3-panzoom/zoomslidercontrol" {
    import ol = require("openlayers");
    /**
     * @constructor
     * @param {olx.control.ZoomSliderOptions=} opt_options Options.
     * @extends {ol.control.ZoomSlider}
     * @api
     */
    class ZoomSlider extends ol.control.ZoomSlider {
        private element;
        constructor(opt_options?: any);
        /**
         * @return {Element}
         * @api
         */
        getElement(): HTMLElement;
    }
    export = ZoomSlider;
}
declare module "ol3-panzoom/ol3-panzoom" {
    import ol = require("openlayers");
    export interface IPanZoomOptions extends olx.control.ControlOptions {
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
    export class PanZoom extends ol.control.Control {
        private className_;
        private imgPath_;
        private listenerKeys_;
        private duration_;
        private maxExtent_;
        private maxZoom_;
        private minZoom_;
        private zoomSliderCtrl_;
        private panEastEl_;
        private panWestEl_;
        private panNorthEl_;
        private panSouthEl_;
        private zoomInEl_;
        private zoomOutEl_;
        private zoomMaxEl_;
        private zoomDelta_;
        private slider_;
        private element_;
        private pixelDelta_;
        constructor(options?: IPanZoomOptions);
        /**
         * @param {ol.Map} map
         * @api
         */
        setMap(map: any): void;
        private createEl_();
        private createButtonEl_(action);
        private pan_(direction, evt);
        private zoom_(direction, evt);
        private zoomByDelta_(delta);
        /**
         * @private
         */
        adjustZoomSlider_(): void;
        /**
         * @private
         * @return {number}
         */
        getSliderSize_(): number;
    }
}
declare module "index" {
    import Panzoom = require("ol3-panzoom/ol3-panzoom");
    export = Panzoom;
}
declare module "ol3-panzoom/examples/black-slider" {
    export function run(): void;
}
declare module "ol3-panzoom/examples/black" {
    export function run(): void;
}
declare module "ol3-panzoom/examples/index" {
    export function run(): void;
}
declare module "ol3-panzoom/examples/maxextent" {
    export function run(): void;
}
declare module "ol3-panzoom/examples/simple" {
    export function run(): void;
}
declare module "ol3-panzoom/examples/slider" {
    export function run(): void;
}
