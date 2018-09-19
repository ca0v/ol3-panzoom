import ol = require("openlayers");
import { PanZoom } from "../index";
import { MapMaker } from "./utils/MapMaker";

export function run() {
	// Define a `maxExtent` to include the "zoom to max extent" button
	let panZoom = PanZoom.create({
		maxExtent: [813079, 5929220, 848966, 5936863]
	});
	MapMaker(panZoom).addControl(new ol.control.MousePosition());
}
