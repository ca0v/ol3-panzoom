export function run() {
    let l = window.location;
    let path = `${l.origin}${l.pathname}?run=ol3-panzoom/examples/`;
    let labs = `
    black
    black-slider
    maxextent
    simple
    slider
    index
    `;
    
    document.writeln(`
    <p>
    Watch the console output for failed assertions (blank is good).
    </p>
    `);

    document.writeln(labs
        .split(/ /)
        .map(v => v.trim())
        .filter(v => !!v)
        .sort()
        .map(lab => `<a href="${path}${lab}&debug=1">${lab}</a>`)
        .join("<br/>"));
    
};
