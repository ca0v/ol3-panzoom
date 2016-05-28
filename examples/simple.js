define(["require", "exports", "openlayers", "../src/ol3panzoom"], function (require, exports, ol, PanZoom) {
    "use strict";
    // In OpenLayers 2, the OpenLayers.ImgPath was used to define a directory where
    // native controls fetched their images. The same idea is borrowed here in
    // order to reuse the same images.
    var panZoom = new PanZoom({
        imgPath: './resources/ol2img'
    });
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
});
