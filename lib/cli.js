var Page = require("./page");

var casper = require("casper").create();


var url = casper.cli.get('url');
var selector = casper.cli.raw.get("selector");
var options = {
	casper: casper,
	fps: casper.cli.get("fps") || 20,
	timeout: casper.cli.get("fps") || 100000,
	viewportSize: casper.cli.get("viewportSize") || "1200x800"
}
var viewport = options.viewportSize.split("x");


var page = new Page(url, selector, options);

page.on("captureEnd", function(argument) {
	console.log("dir=" + page.tmpDir);
})
page.start();

casper.viewport(parseInt(viewport[0], 10) || 800, parseInt(viewport[1], 10) || 600);