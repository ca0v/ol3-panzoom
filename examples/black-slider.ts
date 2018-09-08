import { PanZoom } from "../index";
import { MapMaker } from "./utils/MapMaker";

export function run() {
	MapMaker(
		new PanZoom({
			imgPath: "../ol3-panzoom/resources/zoombar_black",
			minZoom: 6,
			maxZoom: 15,
			slider: true
		})
	);
}
