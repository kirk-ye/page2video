if(typeof describe != 'undefined'){
	return;
}

var Page = require("../lib/page");

var page = new Page("http://cricy.github.io/page2video/test/page.html", "#capture", {fps: 30});

page.start();

console.log(page.tmpDir)