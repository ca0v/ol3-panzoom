import ol = require("openlayers");
import PanZoom = require("../src/ol3panzoom");

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
