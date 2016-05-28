define(["require", "exports", "openlayers", "../src/ol3panzoom"], function (require, exports, ol, PanZoom) {
    "use strict";
    var panZoom = new PanZoom({
        imgPath: './resources/zoombar_black',
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
});
