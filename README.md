# OpenLayers 3 PanZoom
This repository holds a `ol.control.PanZoom` control, which consists of the
integration of the `OpenLayers.Control.PanZoom` and
`OpenLayers.Control.PanZoomBar` controls from OpenLayers 2 into OpenLayers 3.

The `ol.control.PanZoom` control makes it possible to migrate from OpenLayers
2 while keeping the style definition that was used to customize those type of controls.

## Examples
 * [v3.20.1](https://rawgit.com/ca0v/ol3-panzoom/v3.20.1/rawgit.html)

## Build

* tsd install
* bower install
* tsc -w

## Consume

* `typings install ol3-panzoom=github:ca0v/ol3-panzoom/built/index.d.ts#v3.20.1 --global --save`
* `bower install ol3-panzoom=git://github.com/ca0v/ol3-panzoom.git#v3.20.1 --save`
