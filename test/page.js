if(typeof describe != 'undefined'){
	return;
}

var Page = require("../lib/page");

var page = new Page("http://cricy.github.io/page2video/test/page.html", "#capture");

page.start();

console.log(page.tmpDir)