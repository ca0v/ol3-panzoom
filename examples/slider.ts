import { PanZoom } from "../index";
import { MapMaker } from "./utils/MapMaker";

export function run() {
	MapMaker(
		PanZoom.create({
			slider: true // enables the slider
		})
	);
}
