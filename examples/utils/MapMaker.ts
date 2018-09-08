import ol = require("openlayers");
import { IPanZoomOptions } from "../../ol3-panzoom/ol3-panzoom";

export function MapMaker(panZoom: ol.control.Control & { options: IPanZoomOptions }) {
	let center = [-7910321, 6179398] as ol.Coordinate;
	if (panZoom.options.maxExtent) {
		center = ol.extent.getCenter(panZoom.options.maxExtent);
	}
	let vectorLayer = new ol.layer.Vector();
	let vectors = new ol.source.Vector();
	vectors.addFeature(
		new ol.Feature(
			new ol.geom.Polygon([
				[
					[center[0] - 100, center[1] - 100],
					[center[0] - 100, center[1] + 100],
					[center[0] + 100, center[1] + 100],
					[center[0] + 100, center[1] - 100],
					[center[0] - 100, center[1] - 100]
				]
			])
		)
	);
	vectorLayer.setSource(vectors);

	return new ol.Map({
		controls: ol.control
			.defaults({
				zoom: false
			})
			.extend([panZoom]),
		layers: [vectorLayer],
		target: "map",
		view: new ol.View({
			center: center,
			minZoom: panZoom.options.minZoom,
			maxZoom: panZoom.options.maxZoom,
			zoom: Math.floor((panZoom.options.minZoom + panZoom.options.maxZoom) / 2)
		})
	});
}
