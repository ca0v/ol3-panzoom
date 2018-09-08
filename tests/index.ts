import { describe, it, should, slowloop, shouldEqual } from "ol3-fun/tests/base";
import { PanZoom } from "../index";
import { MapMaker } from "../examples/utils/MapMaker";

// no tests
describe("ol3-panzoom", () => {
	function mapDiv() {
		let mapDiv = document.getElementById("map");
		if (!mapDiv) {
			mapDiv = document.createElement("div");
			document.body.appendChild(mapDiv);
			mapDiv.id = "map";
		}
		return mapDiv;
	}

	it("ol3-panzoom", () => {
		should(!!PanZoom, "PanZoom exists");
	});

	it("creates", done => {
		mapDiv(); // ensure it exists
		let panzoom = new PanZoom({ duration: 20 });
		let map = MapMaker(panzoom);

		map.once("postrender", () => {
			let c1 = map.getView().getCenter();
			let c = () => map.getView().getCenter();

			slowloop(
				[
					() => panzoom.pan("east"),
					() => should(c()[0] > c1[0], "pan east"),
					() => panzoom.pan("north"),
					() => should(c()[1] > c1[1], "pan north"),
					() => panzoom.pan("west"),
					() => should(c()[0] === c1[0], "pan west"),
					() => panzoom.pan("south"),
					() => should(c()[1] === c1[1], "south north"),
					() => panzoom.zoom("in")
				],
				panzoom.options.duration + 50,
				2
			).then(() => {
				map.setTarget(null);
				done();
			});
		});
	});

	it("cycles through the themes", done => {
		mapDiv(); // ensure it exists
		let panzoom = new PanZoom({
			slider: true,
			duration: 20,
			minZoom: 6,
			maxZoom: 15
		});
		let map = MapMaker(panzoom);

		panzoom.on("change:theme", (args: ol.ObjectEvent) => {
			switch (panzoom.get("theme")) {
				case "dark":
					panzoom.options.theme = "zoombar_black";
					break;
				case "light":
					panzoom.options.theme = "ol2img";
					break;
			}
			panzoom.redraw();
		});

		panzoom.on("change:slider", () => {
			panzoom.options.slider = panzoom.get("slider");
			panzoom.redraw();
		});

		panzoom.on("change:maxextent", () => {
			panzoom.options.maxExtent = panzoom.get("maxextent");
			panzoom.redraw();
		});

		map.once("postrender", () => {
			slowloop(
				[
					() => panzoom.set("theme", panzoom.get("theme") == "dark" ? "light" : "dark"),
					() => panzoom.set("slider", !panzoom.options.slider),
					() => panzoom.set("maxextent", panzoom.get("maxextent") ? null : [-1000, -1000, 1000, 1000])
				],
				1000,
				2
			).then(() => {
				map.setTarget(null);
				done();
			});
		});
	}).timeout(10000);
});
