import { PanZoom } from "../index";
import { MapMaker } from "./utils/MapMaker";

export function run() {
	MapMaker(
		new PanZoom({
			slider: true // enables the slider
		})
	);
}
