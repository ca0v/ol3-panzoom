import "./black";
import "./black-slider";
import "./maxextent";
import "./simple";
import "./slider";

export function run() {
	let l = window.location;
	let path = `${l.origin}${l.pathname}?run=examples/`;
	let labs = `
    black
    black-slider
    maxextent
    simple
    slider
    `;

	document.writeln(`
    <p>
    Watch the console output for failed assertions (blank is good).
    </p>
    `);

	document.writeln(
		labs
			.split(/ /)
			.map(v => v.trim())
			.filter(v => !!v)
			.sort()
			.map(lab => `<a href="${path}${lab}&debug=0">${lab}</a>`)
			.join("<br/>"),
	);
}
