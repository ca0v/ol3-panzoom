/// <reference types="jquery" />
declare module "ol3-panzoom/zoomslidercontrol" {
    import ol = require("openlayers");
    class ZoomSlider extends ol.control.ZoomSlider {
        element: HTMLElement;
        constructor(opt_options?: ol.olx.control.ZoomSliderOptions);
    }
    export = ZoomSlider;
}
declare module "node_modules/ol3-fun/ol3-fun/common" {
    /**
     * Generate a UUID
     * @returns UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    /***
     * ie11 compatible version of e.classList.toggle
     * if class exists then remove it and return false, if not, then add it and return true.
     * @param force true to add specified class value, false to remove it.
     * @returns true if className exists.
     */
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
    export function parse<T>(v: string, type: T): T;
    /**
     * @param options Attributes on this object with be assigned the value of the matching parameter in the query string
     * @param url The url to scan
     */
    export function getQueryParameters(options: any, url?: string): void;
    /**
     * @param name Extract parameter of this name from the query string
     * @param url Search this url
     */
    export function getParameterByName(name: string, url?: string): string;
    /**
     * @param v passing a non-trivial value will invoke the callback with this as the sole argument
     * @param cb callback to execute when the value is non-trivial (not null, not undefined)
     */
    export function doif<T>(v: T, cb: (v: T) => void): void;
    /**
     * @param a target
     * @param b values to shallow copy into target
     */
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    /**
     * @param a target
     * @param b values to copy into target if they are not already present
     */
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
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
    export function cssin(name: string, css: string): () => void;
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    /**
     * poor $(html) substitute due to being
     * unable to create <td>, <tr> elements
     */
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): number[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    /**
     * A less disorienting way of changing the maps extent (maybe!)
     * Zoom out until new feature is visible
     * Zoom to that feature
     */
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): {
        lon: number;
        lat: number;
    } | number;
}
declare module "node_modules/ol3-fun/ol3-fun/slowloop" {
    export function slowloop(functions: Array<Function>, interval?: number, cycles?: number): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/index" {
    /**
     * decouples API from implementation
     */
    import { asArray, cssin, debounce, defaults, doif, getParameterByName, getQueryParameters, html, mixin, pair, parse, range, shuffle, toggle, uuid } from "node_modules/ol3-fun/ol3-fun/common";
    import { zoomToFeature } from "node_modules/ol3-fun/ol3-fun/navigation";
    import { parse as dmsParse } from "node_modules/ol3-fun/ol3-fun/parse-dms";
    import { slowloop } from "node_modules/ol3-fun/ol3-fun/slowloop";
    let index: {
        asArray: typeof asArray;
        cssin: typeof cssin;
        debounce: typeof debounce;
        defaults: typeof defaults;
        doif: typeof doif;
        getParameterByName: typeof getParameterByName;
        getQueryParameters: typeof getQueryParameters;
        html: typeof html;
        mixin: typeof mixin;
        pair: typeof pair;
        parse: typeof parse;
        range: typeof range;
        shuffle: typeof shuffle;
        toggle: typeof toggle;
        uuid: typeof uuid;
        slowloop: typeof slowloop;
        dms: {
            parse: typeof dmsParse;
        };
        navigation: {
            zoomToFeature: typeof zoomToFeature;
        };
    };
    export = index;
}
declare module "ol3-panzoom/ol3-panzoom" {
    import ol = require("openlayers");
    export type Action = "pan-west" | "pan-south" | "pan-east" | "pan-north" | "zoom-in" | "zoom-out" | "zoom-max";
    export interface IPanZoomOptions extends ol.olx.control.ControlOptions {
        className?: string;
        imgPath?: string;
        theme?: "ol2img" | "zoombar_black";
        duration?: number;
        maxExtent?: ol.Extent;
        minZoom?: number;
        maxZoom?: number;
        pixelDelta?: number;
        slider?: boolean;
        zoomDelta?: number;
    }
    export class PanZoom extends ol.control.Control {
        redraw(): void;
        private listenerKeys_;
        private zoomSliderCtrl_;
        private panEastEl_;
        private panWestEl_;
        private panNorthEl_;
        private panSouthEl_;
        private zoomInEl_;
        private zoomOutEl_;
        private zoomMaxEl_;
        private zoomDelta_;
        private element_;
        private element;
        options: IPanZoomOptions;
        constructor(options?: IPanZoomOptions);
        private createUx;
        private destroyUx;
        setMap(map: ol.Map): void;
        private createDiv;
        private imgPath;
        private createButton;
        pan(direction: "south" | "west" | "east" | "north", evt?: Event): boolean;
        zoom(direction: "in" | "out" | "max", evt?: Event): void;
        private zoomByDelta;
        private adjustZoomSlider;
        private getSliderSize;
    }
}
declare module "index" {
    import Panzoom = require("ol3-panzoom/ol3-panzoom");
    export = Panzoom;
}
