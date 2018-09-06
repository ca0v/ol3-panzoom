import ol = require("openlayers");
import { PanZoom } from "../index";
import { html } from "ol3-fun/ol3-fun/common";

export function run() {
	// Define a `maxExtent` to include the "zoom to max extent" button
	let panZoom = new PanZoom({
		maxExtent: [813079, 5929220, 848966, 5936863],
	});

	let target = document.getElementById("map");

	let map = new ol.Map({
		controls: ol.control
			.defaults({
				zoom: false,
			})
			.extend([panZoom]),
		layers: [],
		target: target,
		view: new ol.View({
			center: ol.proj.fromLonLat([-85, 15]),
			zoom: 20,
		}),
	});

	map.once("postrender", () => {
		markit(map.getView().getCenter(), "click map to create overlays");
	});

	map.on("click", (e: ol.MapBrowserPointerEvent) => {
		markit(e.coordinate);
	});

	function markit(position: ol.Coordinate, text = "X") {
		map.addOverlay(
			new ol.Overlay({
				position: position,
				element: html(`<div className="X">${text}</div>`),
			}),
		);
	}
}
