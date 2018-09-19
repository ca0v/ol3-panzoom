import { PanZoom } from "../index";
import { MapMaker } from "./utils/MapMaker";

export function run() {
	let panZoom = PanZoom.create({
		imgPath: "../ol3-panzoom/resources/zoombar_black",
		maxExtent: [813079, 5929220, 848966, 5936863]
	});
	MapMaker(panZoom);
}
